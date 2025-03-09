import React, { useState, useEffect } from "react";
import { Link } from 'wouter';
import { useDebounce } from 'use-debounce';
import "./Explore.css";

function ExplorePage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const fetchBooks = async (query, page) => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = query
        ? `http://127.0.0.1:5000/explore_books?query=${query}&page=${page}`
        : `http://127.0.0.1:5000/explore_books?query=&page=${page}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="explore-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p>{error}</p>
      ) : books.length > 0 ? (
        <div className="search-results">
          {books.map((book) => (
            <Link to={`/book/${book.id}`} key={book.id} className="book-link">
              <div className="book-item">
                <img src={book.coverImage} alt={book.title} className="book-cover" />
                <div className="book-details">
                  <h2>{book.title}</h2>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No books found.</p>
      )}

      {!searchTerm && books.length > 0 && (
        <div className="pagination">
          <button onClick={handleNextPage}>Next</button>
        </div>
      )}
    </div>
  );
}

export default ExplorePage;