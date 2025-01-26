import React, { useState, useEffect } from "react";
import "./Explore.css";

function ExplorePage() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/explore_books?page=${page}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [page]);

  const filteredBooks = books.filter((book) =>
    (searchTerm === "" || book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (genreFilter === "" || book.genre.includes(genreFilter))
  );

  return (
    <div className="explore-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filters">
        <label>Genre:</label>
        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Mystery">Mystery</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Romance">Romance</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Horror">Horror</option>
          <option value="Historical">Historical</option>
          <option value="Thriller">Thriller</option>
        </select>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div className="search-results">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="book-item">
                <img src={book.coverImage} alt={book.title} className="book-cover" />
                <div className="book-details">
                  <h2>{book.title}</h2>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No books found.</p>
          )}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ExplorePage;