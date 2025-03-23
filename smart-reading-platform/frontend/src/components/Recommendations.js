import React, { useState, useEffect } from "react";
import "./Recommendations.css";
import { Link } from "wouter";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view recommendations.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/recommendations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch recommendations.");

        const data = await response.json();

        const bookDetails = await Promise.all(
          data.map(async (book) => {
            const bookResponse = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${book.book_id}`
            );
            if (!bookResponse.ok) throw new Error("Failed to fetch book details");
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

        setRecommendations(bookDetails);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recommendations-container">
      <h1>Book recommendations for You</h1>
      <div className="recommendations-list">
        {recommendations.map((book) => (
          <div key={book.bookId} className="recommendation-item">
            <Link to={`/book/${book.bookId}`} className="reading-item-link">
              <img
                src={book.cover}
                alt={book.title}
                className="book-cover"
                style={{ cursor: "pointer" }}
              />
            </Link>
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <p>Rating: {book.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;