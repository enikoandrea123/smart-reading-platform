import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="header">
      <Link to="/" className="header-title">ShelfMate</Link>

      {user ? (
        <div className="header-nav-container">
          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/explore" className="nav-link">Explore</Link>
            <Link to="/recommendations" className="nav-link">Personalized Reads</Link>
            <Link to="/track" className="nav-link">Track</Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
          </nav>
          <button onClick={handleLogout} className="logout-button">Log Out</button>
        </div>
      ) : (
      <></>
      )}
    </header>
  );
};

export default Header;