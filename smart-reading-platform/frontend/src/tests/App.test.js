import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { createMemoryHistory } from 'history';
import App from '../App';

describe('App Component', () => {
  test('renders HomePage on the root path', () => {
    const history = createMemoryHistory();
    history.push('/');

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(screen.getByText(/Welcome to ShelfMate!/i)).toBeInTheDocument();
  });

  test('renders SignIn page on "/signin" path', () => {
    const history = createMemoryHistory();
    history.push('/signin');

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('renders SignUp page on "/signup" path', () => {
    const history = createMemoryHistory();
    history.push('/signup');

    render(
      <Router history={history}>
        <App />
      </Router>
    );

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

});