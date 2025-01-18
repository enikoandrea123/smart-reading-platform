import React, { useState, useEffect } from 'react';
import BookCarousel from './BookCarousel';
import './HomePage.css';
import Login from './Login';

const HomePage = () => {
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [user, setUser] = useState(null);

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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setRecommendedBooks(mockBooks);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="app">

      <div className="welcome-section">
        {user ? (
          <h1>Welcome back, {user.name}!</h1>
        ) : (
          <h1>Welcome to ShelfMate!</h1>
        )}
        <p>"A reader lives a thousand lives before he dies." – George R.R. Martin</p>
      </div>

        <div className="description-container">
        <div className="section-description">
          <h2>Not sure what to read next? 🤔</h2>
          <p>
            You've come to the right place. Let us know what genres or books you've loved in the past,
            and our AI-powered system will give you precise and personalized recommendations that match your reading tastes. 📚✨
          </p>
        </div>


        {!user && <Login />}

        <div className="section-description">
          <h2>Tracking your reading progress? 📊</h2>
          <p>
            With our platform, you can easily track your reading journey and see your progress in real-time. Keep an eye on the books
            you've read, the ones you're currently reading, and those you plan to read. Stay motivated and celebrate your reading milestones! 🎉📖
          </p>
        </div>
      </div>

        {user && (
        <BookCarousel title={`Recommended for You`} books={recommendedBooks} />
      )}

      <BookCarousel title="New Arrivals" books={newBooks} />

      <BookCarousel title="Populer Choices" books={popularBooks} />

    </div>
  );
};

export default HomePage;