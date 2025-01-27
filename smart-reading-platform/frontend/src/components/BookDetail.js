import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './BookDetail.css';

function BookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) {
      setError("No book ID found in URL.");
      setLoading(false);
      return;
    }

    const fetchBookDetail = async () => {
      try {
        const apiUrl = `http://127.0.0.1:5000/book_detail?id=${bookId}`;
        console.log("Fetching book details from:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Book data fetched:", data);

        setBook(data);
      } catch (error) {
        setError(`Error fetching book details: ${error.message}`);
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [bookId]);

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-detail-container">
      <h1>{book?.title}</h1>
      <p><strong>Author:</strong> {book?.author}</p>
      <img src={book?.coverImage} alt={book?.title} />
      <p><strong>Genre:</strong> {book?.genre}</p>
      <p><strong>Published:</strong> {book?.publishedDate}</p>
      <p>{book?.description}</p>
      <a href={book?.buyLink} target="_blank" rel="noopener noreferrer">
        Buy / More Info
      </a>
    </div>
  );
}

export default BookDetail;