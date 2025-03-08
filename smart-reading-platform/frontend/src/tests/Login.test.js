import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Router } from 'wouter';
import Login from '../components/Login';

jest.mock('wouter', () => ({
  ...jest.requireActual('wouter'),
  useLocation: jest.fn(),
}));

describe('Login Component', () => {
  let mockNavigate;

  beforeEach(() => {
    mockNavigate = jest.fn();

    require('wouter').useLocation.mockReturnValue([null, mockNavigate]);
  });

  test('renders login form correctly', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByText('Discover & Read More')).toBeInTheDocument();
    expect(screen.getByText('Sign up with Email')).toBeInTheDocument();
    expect(screen.getByText(/By creating an account, you agree to ShelfMate's/i)).toBeInTheDocument();
    expect(screen.getByText('Already a member?')).toBeInTheDocument();
  });

  test('navigates to signup page when "Sign up with Email" is clicked', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const signUpButton = screen.getByText('Sign up with Email');
    fireEvent.click(signUpButton);

    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  test('renders links for Terms of Service and Privacy Policy', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByText('Terms of Service').closest('a')).toHaveAttribute('href', '/terms');
    expect(screen.getByText('Privacy Policy').closest('a')).toHaveAttribute('href', '/privacy');
  });

  test('renders "Sign In" link for existing users', () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByText('Sign In').closest('a')).toHaveAttribute('href', '/signin');
  });
});