import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="header-title">ShelfMate</Link>
    </header>
  );
};

export default Header;