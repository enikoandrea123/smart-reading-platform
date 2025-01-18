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

      <div className="header-right">
        {user && (
          <button onClick={handleLogout} className="logout-button">Log Out</button>
        )}
      </div>
    </header>
  );
};

export default Header;