import React, { useState, useEffect } from "react";
import "./Favorites.css";
import { FaTrash } from "react-icons/fa";

const BOOKS_PER_PAGE = 30;

function Favorites() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your favorite books.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        const bookDetails = await Promise.all(
          data.map(async (book) => {
            const bookResponse = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${book.book_id}`
            );
            if (!bookResponse.ok) throw new Error(`Failed to fetch book ID: ${book.book_id}`);
            const bookData = await bookResponse.json();
            const volumeInfo = bookData.volumeInfo || {};
            return {
              bookId: book.book_id,
              title: volumeInfo.title || "Unknown Title",
              author: volumeInfo.authors?.join(", ") || "Unknown Author",
              cover: volumeInfo.imageLinks?.thumbnail || "",
            };
          })
        );

        setFavoriteBooks(bookDetails);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, []);

  const handleRemoveBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to remove a book.");
        return;
      }

      const response = await fetch(`http://localhost:5000/favorites/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to remove book with ID: ${bookId}`);

      setFavoriteBooks(favoriteBooks.filter((book) => book.bookId !== bookId));
    } catch (error) {
      alert("There was an error removing the book. Please try again.");
    }
  };

  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = favoriteBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  const totalPages = Math.ceil(favoriteBooks.length / BOOKS_PER_PAGE);

  if (loading) return <p>Loading favorite books...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">My Favorite Books</h1>

      {paginatedBooks.length === 0 ? (
        <p className="empty-message">Your favorites list is empty.</p>
      ) : (
        <ul className="favorites-list">
          {paginatedBooks.map((book) => (
            <li key={book.bookId} className="favorite-item">
              <img src={book.cover} alt={book.title} className="book-cover" />
              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
              </div>
              <button className="remove-btn" onClick={() => handleRemoveBook(book.bookId)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Favorites;