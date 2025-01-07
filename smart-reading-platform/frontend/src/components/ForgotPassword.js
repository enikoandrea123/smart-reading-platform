import React from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h1 className="forgot-password-title">Password Assistance</h1>
        <p className="forgot-password-description">
          Enter the email address associated with your ShelfMate account, then click Continue.
        </p>
        <form className="forgot-password-form">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="forgot-password-input"
            placeholder="Enter your email"
          />
          <button type="submit" className="continue-button">
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