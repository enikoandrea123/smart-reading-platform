import React, { useState, useEffect } from "react";
import "./Recommendations.css";
import { Link } from "wouter";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(null);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
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

  const handleLike = () => {
    setLiked(true);
    setDisliked(false);
  };

  const handleDislike = () => {
    setLiked(false);
    setDisliked(true);
  };

  const recommendMoreBooks = async () => {
    setLoading(true);
    setLiked(null);
    setDisliked(false);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/recommendations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const bookDetails = await Promise.all(
        data.slice(0, 3).map(async (book) => {
          const bookResponse = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${book.book_id}`
          );
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
      console.error("Failed to fetch more recommendations:", error);
      setError("Failed to fetch more recommendations.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="like-question">
        <p>Do you like these recommendations?</p>
        <button
          className="thumbs-up"
          onClick={handleLike}
          disabled={liked !== null}
        >
          <FaThumbsUp />
        </button>
        <button
          className="thumbs-down"
          onClick={handleDislike}
          disabled={liked !== null}
        >
          <FaThumbsDown />
        </button>

        {liked !== null && (
          <div className="response-message">
            {liked ? (
              <p>We're glad you liked the recommendations! 😊</p>
            ) : (
              <>
                <p>Sorry to hear that. We’ll recommend 3 new books for you! 😔</p>
                <button onClick={recommendMoreBooks}>Recommend</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;