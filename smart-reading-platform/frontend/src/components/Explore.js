import React, { useState, useEffect } from "react";
import "./Explore.css";

// just sample data for books
const sampleBooks = [
  { title: "The Great Adventure", author: "John Doe", genre: "Fiction", rating: 4.5, coverImage: "https://via.placeholder.com/150" },
  { title: "Mystery of the Lost City", author: "Jane Smith", genre: "Mystery", rating: 4.2, coverImage: "https://via.placeholder.com/150" },
  { title: "The Final Frontier", author: "Michael Johnson", genre: "Science Fiction", rating: 4.7, coverImage: "https://via.placeholder.com/150" },
  { title: "A Heartfelt Journey", author: "Alice Walker", genre: "Romance", rating: 4.1, coverImage: "https://via.placeholder.com/150" },
  { title: "The Lost Kingdom", author: "Emily Davis", genre: "Fantasy", rating: 4.6, coverImage: "https://via.placeholder.com/150" },
  { title: "The Dark Forest", author: "Robert Brown", genre: "Horror", rating: 3.9, coverImage: "https://via.placeholder.com/150" },
  { title: "Journey Beyond the Stars", author: "Sarah Green", genre: "Sci-Fi", rating: 4.8, coverImage: "https://via.placeholder.com/150" },
  { title: "Whispers of the Past", author: "David Lee", genre: "Historical", rating: 4.3, coverImage: "https://via.placeholder.com/150" },
  { title: "The Silent Ocean", author: "Anna King", genre: "Thriller", rating: 4.4, coverImage: "https://via.placeholder.com/150" },
  { title: "Echoes of Tomorrow", author: "James White", genre: "Fantasy", rating: 5.0, coverImage: "https://via.placeholder.com/150" },
];

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
  const [genreFilter, setGenreFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  const genres = ["Fiction", "Mystery", "Science Fiction", "Romance", "Fantasy", "Horror", "Historical", "Thriller"]; //need to do a full list

  const filterBooks = () => {
    let results = sampleBooks;

    if (searchTerm) {
      results = results.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (genreFilter) {
      results = results.filter((book) => book.genre === genreFilter);
    }

    if (ratingFilter) {
      results = results.filter((book) => book.rating >= ratingFilter);
    }

    setFilteredBooks(results);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterBooks();
  };

  const handleGenreChange = (e) => {
    setGenreFilter(e.target.value);
    filterBooks();
  };

  const handleRatingChange = (e) => {
    setRatingFilter(e.target.value);
    filterBooks();
  };

  const handleReset = () => {
    setSearchTerm("");
    setGenreFilter("");
    setRatingFilter("");
    setFilteredBooks(sampleBooks);
  };

  useEffect(() => {
    filterBooks();
  }, [searchTerm, genreFilter, ratingFilter]);

  return (
    <div className="search-page-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title, author, or keyword"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filters">
        <div className="filter">
          <label>Genre:</label>
          <select value={genreFilter} onChange={handleGenreChange}>
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Rating:</label>
          <select value={ratingFilter} onChange={handleRatingChange}>
            <option value="">All Ratings</option>
            <option value="4">4 and above</option>
            <option value="4.5">4.5 and above</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      <button className="reset-button" onClick={handleReset}>
        Reset Filters
      </button>

      <div className="search-results">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div key={index} className="book-item">
              <img src={book.coverImage} alt={book.title} className="book-cover" />
              <div className="book-details">
                <h2>{book.title}</h2>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Rating:</strong> {book.rating} / 5</p>
              </div>
            </div>
          ))
        ) : (
          <p>No books found for your search criteria.</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;