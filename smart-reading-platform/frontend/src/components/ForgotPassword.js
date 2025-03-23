import React, { useState, useEffect } from 'react';
import './ForgotPassword.css';
import { Redirect } from 'wouter';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [redirect_message, setRedirectMessage] = useState('');
  const [error, setError] = useState('');
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);
  const [isRequestCompleted, setIsRequestCompleted] = useState(false);
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    let interval;

    if (isRequestCompleted && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setRedirectToSignIn(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRequestCompleted, countdown]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setRedirectMessage(data.redirect_message);
        setError('');
        setIsRequestCompleted(true);
      } else if (response.status === 404) {
        setError('Email not found. Please try again.');
        setMessage('');
      } else {
        setError(data.error || 'Something went wrong.');
        setMessage('');
      }
    } catch (error) {
      setError('Failed to connect to the server.');
      setMessage('');
    }
  };

  if (redirectToSignIn) {
    return <Redirect to="/signin" />;
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">Password Assistance</h1>
        <p className="forgot-password-description">
          Enter the email address associated with your ShelfMate account, then click Continue.
        </p>
        {message && <p className="success-message">{message}</p>}
        {redirect_message && (
          <p className="redirect-message">
            {redirect_message}({countdown}s)...
          </p>
        )}
        {error && <p className="error-message">{error}</p>}
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <label className="input-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="forgot-password-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isRequestCompleted}
          />
          <button
            type="submit"
            className="continue-button"
            disabled={isRequestCompleted}
          >
            Continue
          </button>
        </form>
      <p className="cant-access">
        Can’t access your email address?
      </p>
        <p className="help-text">
        Visit our {' '}
         <a href="/help" className="help-link">
            Help page
         </a>
        {' '}for troubleshooting tips.
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;