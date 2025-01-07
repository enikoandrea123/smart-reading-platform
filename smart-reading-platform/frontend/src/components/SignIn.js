import React from 'react';
import './SignIn.css';

const SignIn = () => {
  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <h1 className="shelfmate-title">ShelfMate</h1>
        <h2 className="sign-in-title">Sign In</h2>

        <form className="sign-in-form">

          <label htmlFor="email" className="input-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="sign-in-input"
            required
          />

          <div className="password-row">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <a href="/forgot-password" className="forgot-password-link">
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="sign-in-input"
            required
          />

          <button type="submit" className="sign-in-button">
            Sign In
          </button>
        </form>

        <p className="sign-in-terms">
          By signing in, you agree to ShelfMate's{' '}
          <a href="/terms" className="sign-in-link">Terms of Service</a> and{' '}
          <a href="/privacy" className="sign-in-link">Privacy Policy</a>.
        </p>

        <hr className="divider-line" />

        <div className="sign-up-section">
          <p>New to ShelfMate?</p>
          <button
            onClick={() => (window.location.href = '/signup')}
            className="sign-up-button"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;