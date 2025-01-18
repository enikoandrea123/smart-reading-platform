import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="login-form">
      <h2>Discover & Read More</h2>
      <button className="login-button email" onClick={handleSignUp}>
        Sign up with Email
      </button>
      <p className="terms">
        By creating an account, you agree to ShelfMate's{' '}
        <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
      </p>
      <p className="member">
        Already a member? <a href="/signin">Sign In</a>
      </p>
    </div>
  );
};

export default Login;