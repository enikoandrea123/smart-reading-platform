import React, { useState } from 'react';
import { useLocation } from 'wouter';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, navigate] = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await fetch('https://api.example.com/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Unable to connect to the server');
    }
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="sign-in-container">
      <h1>ShelfMate</h1>
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit} className="sign-in-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign In</button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <p>
        <a href="/forgot-password" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}>
          Forgot password?
        </a>
      </p>

      <p>
        New to ShelfMate?{' '}
        <button onClick={handleSignUp}>Sign Up</button>
      </p>
    </div>
  );
};

export default SignIn;