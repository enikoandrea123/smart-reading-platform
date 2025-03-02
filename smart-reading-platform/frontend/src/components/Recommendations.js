import React, { useState, useEffect } from "react";
import "./Recommendations.css";

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
        setRecommendations(data);
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
          <div key={book.book_id} className="recommendation-item">
            <img src={book.cover} alt={book.title} className="book-cover" />
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