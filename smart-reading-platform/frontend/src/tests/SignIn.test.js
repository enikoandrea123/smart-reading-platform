import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../components/SignIn';
import { useNavigate } from 'wouter';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ token: 'fakeToken', user: { email: 'test@example.com' } }),
  })
);

jest.mock('wouter', () => ({
  ...jest.requireActual('wouter'),
  useNavigate: jest.fn((path) => console.log(`Navigating to ${path}`)),
}));

beforeAll(() => {
  global.Storage.prototype.setItem = jest.fn();
});

describe('SignIn Component', () => {
  beforeEach(() => {
    render(<SignIn />);
  });

  it('renders the Sign In form correctly', () => {
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText("New to ShelfMate?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles form submission and successful login', async () => {
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBeDefined();
      expect(window.location.pathname).toBe('/');
    });
  });

  it('displays an error message when login fails', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      })
    );

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongPassword' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('displays an error message when unable to connect to the server', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('Network error'));

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Unable to connect to the server')).toBeInTheDocument();
    });
  });

  it('displays an error when email or password is empty', async () => {
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email and password are required')).toBeInTheDocument();
    });
  });

});