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
        const response = await fetch("/api/favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const favoriteBookIds = await response.json();

        const bookDetailsPromises = favoriteBookIds.map(async (book) => {
          const googleBooksUrl = `https://www.googleapis.com/books/v1/volumes/${book.id}`;
          const googleResponse = await fetch(googleBooksUrl);
          if (!googleResponse.ok) {
            throw new Error("Failed to fetch book details");
          }
          const bookData = await googleResponse.json();
          return {
            id: book.id,
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

  const removeFavorite = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/favorites/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      setFavorites(favorites.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

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
            <div key={book.id} className="favorite-book">
              <img src={book.coverImage} alt={book.title} className="book-cover" />
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <button onClick={() => removeFavorite(book.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;