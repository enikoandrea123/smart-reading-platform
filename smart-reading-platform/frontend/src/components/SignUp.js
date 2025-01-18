import React, { useState } from 'react';
import './SignUp.css'; // Import the CSS file

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError("Passwords don't match.");
    return;
  }
  if (password.length < 6) {
    setError('Password must be at least 6 characters.');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Account created successfully!');
      window.location.href = '/signin';
    } else {
      setError(data.message || 'An error occurred');
    }
  } catch (err) {
    setError('Unable to connect to the server');
  }
};

  return (
    <div className="sign-in-container">
      <div className="sign-in-box">
        <h1 className="shelfmate-title">ShelfMate</h1>
        <h2 className="sign-in-title">Create Account</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form className="sign-in-form" onSubmit={handleSubmit}>
          <div className="input-field">
            <label htmlFor="name" className="input-label">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="sign-in-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="input-field">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="sign-in-input"
              placeholder="Enter your email address"
            />
          </div>

          <div className="input-field">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="sign-in-input"
              placeholder="Enter a password"
            />
            <small>Password must be at least 6 characters.</small>
          </div>

          <div className="input-field">
            <label htmlFor="confirmPassword" className="input-label">Re-enter Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="sign-in-input"
              placeholder="Re-enter your password"
            />
          </div>

          <button type="submit" className="sign-up-button">
            Create Account
          </button>
        </form>

        <div className="sign-in-terms">
          <p>By creating an account, you agree to the ShelfMates's{' '}
             <a href="/terms" className="sign-in-link">Terms of Service</a> and{' '}
          <a href="/privacy" className="sign-in-link">Privacy Policy</a>.
        </p>
        </div>

        <div className="sign-up-section">
          <p>Already have an account? <a href="/signin" className="sign-in-link">Sign In</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;