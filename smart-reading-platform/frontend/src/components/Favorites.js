import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { FaTrash, FaHeart } from "react-icons/fa";
import "./Favorites.css";

const BOOKS_PER_PAGE = 10;

function Favorites() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingFilter, setRatingFilter] = useState(0);

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
              rating: book.rating || 0,
            };
          })
        );

        setFavoriteBooks(bookDetails);
        setFilteredBooks(bookDetails);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, []);

  useEffect(() => {
    if (ratingFilter === 0) {
      setFilteredBooks(favoriteBooks);
    } else {
      setFilteredBooks(favoriteBooks.filter(book => book.rating === ratingFilter));
    }
    setCurrentPage(1);
  }, [ratingFilter, favoriteBooks]);

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
      setFilteredBooks(filteredBooks.filter((book) => book.bookId !== bookId));
    } catch (error) {
      alert("There was an error removing the book. Please try again.");
    }
  };

  const handleHeartClick = async (bookId, index) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update the rating.");
        return;
      }

      const currentRating = favoriteBooks.find(book => book.bookId === bookId).rating;

      const newRating = currentRating === index + 1 ? 0 : index + 1;

      const response = await fetch(`http://localhost:5000/favorites/rating/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: newRating }),
      });

      if (!response.ok) throw new Error(`Failed to update rating for book with ID: ${bookId}`);

      setFavoriteBooks(favoriteBooks.map((book) =>
        book.bookId === bookId ? { ...book, rating: newRating } : book
      ));
      setFilteredBooks(filteredBooks.map((book) =>
        book.bookId === bookId ? { ...book, rating: newRating } : book
      ));
    } catch (error) {
      alert("There was an error updating the rating. Please try again.");
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

      <div className="filter-container">
        <label htmlFor="rating-filter">Filter by Rating:</label>
        <select
          id="rating-filter"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
        >
          <option value={0}>All</option>
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
        </select>
      </div>

      {paginatedBooks.length === 0 ? (
        <p className="empty-message">Your favorites list is empty.</p>
      ) : (
        <ul className="favorites-list">
  {paginatedBooks.map((book) => (
    <li key={book.bookId} className="favorite-item">
      <Link href={`/book/${book.bookId}`} className="reading-item-link">
        <img src={book.cover} alt={book.title} className="book-cover" />
      </Link>
      <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>

        <div className="heart-icon-container">
          {[0, 1, 2].map((index) => (
            <FaHeart
              key={index}
              className={`heart-icon ${book.rating > index ? 'filled' : ''}`}
              onClick={() => handleHeartClick(book.bookId, index)}
            />
          ))}
        </div>
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
          disabled={filteredBooks.length === 0 || currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          disabled={filteredBooks.length === 0 || currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Favorites;