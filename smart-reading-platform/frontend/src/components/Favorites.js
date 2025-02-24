import React, { useState, useEffect } from "react";
import "./Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to be signed in to view favorites.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const favoriteBookIds = data.favorites;

        const bookDetailsPromises = favoriteBookIds.map(async (book) => {
          const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes/${book.book_id}`;
          const googleResponse = await fetch(googleBooksUrl);
          if (!googleResponse.ok) {
            throw new Error("Failed to fetch book details");
          }
          const bookData = await googleResponse.json();
          return {
            book_id: book.book_id,
            title: bookData.volumeInfo.title,
            author: bookData.volumeInfo.authors?.join(", ") || "Unknown",
            coverImage: bookData.volumeInfo.imageLinks?.thumbnail || "",
          };
        });

        const books = await Promise.all(bookDetailsPromises);
        setFavorites(books);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <p>Loading favorites...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="favorites-container">
      <h1>Your Favorite Books</h1>
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((book) => (
            <div key={book.book_id} className="favorite-book">
              <img src={book.coverImage} alt={book.title} className="book-cover" />
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;