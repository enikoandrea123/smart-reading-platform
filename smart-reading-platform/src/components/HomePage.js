import React, { useState, useEffect } from 'react';
import BookCarousel from './BookCarousel';
import './HomePage.css';

const HomePage = () => {
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

  // samle API should be replaced
  useEffect(() => {
    const mockBooks = [
      { id: 1, title: 'Book 1', author: 'Author 1',  imageUrl: 'https://via.placeholder.com/150' },
      { id: 2, title: 'Book 2', author: 'Author 2', imageUrl: 'https://via.placeholder.com/150' },
      { id: 3, title: 'Book 3', author: 'Author 3', imageUrl: 'https://via.placeholder.com/150' },
      { id: 4, title: 'Book 4', author: 'Author 4', imageUrl: 'https://via.placeholder.com/150' },
      { id: 5, title: 'Book 5', author: 'Author 5', imageUrl: 'https://via.placeholder.com/150' },
      { id: 6, title: 'Book 6', author: 'Author 6', imageUrl: 'https://via.placeholder.com/150' },
      { id: 7, title: 'Book 7', author: 'Author 7', imageUrl: 'https://via.placeholder.com/150' },
      { id: 8, title: 'Book 8', author: 'Author 8', imageUrl: 'https://via.placeholder.com/150' },
      { id: 9, title: 'Book 9', author: 'Author 9', imageUrl: 'https://via.placeholder.com/150' },
    ];

    setNewBooks(mockBooks);
    setPopularBooks(mockBooks);
  }, []);

  return (
    <div className="app">

      <div className="welcome-section">
        <h1>Welcome to ShelfMate!</h1>
        <p>"A reader lives a thousand lives before he dies." – George R.R. Martin</p>
      </div>

      <BookCarousel title="New Arrivals" books={newBooks} />

      <BookCarousel title="Populer Choices" books={popularBooks} />

    </div>
  );
};

export default HomePage;