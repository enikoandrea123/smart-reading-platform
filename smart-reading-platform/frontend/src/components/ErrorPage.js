import React from 'react';
import { useLocation } from 'wouter';
import './ErrorPage.css';

const ErrorPage = ({ message }) => {
  const [, navigate] = useLocation();

  return (
    <div className="error-container">
      <h2 className="error-title">Oops! Access Denied</h2>
      <p className="error-message">{message || "You don't have permission to view this page."}</p>
      <button className="error-button" onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default ErrorPage;