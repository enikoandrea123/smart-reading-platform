import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Profile from '../components/Profile';
import '@testing-library/jest-dom';
import { act } from 'react';


beforeEach(() => {
  localStorage.setItem('token', 'mocked_token');
});

afterEach(() => {
  localStorage.clear();
});

global.fetch = jest.fn();

const mockUser = {
  name: 'John Doe',
  email: 'johndoe@example.com',
};

describe('Profile Component', () => {
  it('fetches and displays user profile data', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ user: mockUser }),
  });

  render(<Profile />);

  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /hello, john doe/i })).toBeInTheDocument();

    expect(screen.getByText(/your email:/i)).toBeInTheDocument();

    expect(screen.getByText((content) => content.includes(mockUser.email))).toBeInTheDocument();
  });
});

  it('shows login error if no token is found', async () => {
    localStorage.removeItem('token');

    render(<Profile />);

    expect(await screen.findByText(/you must be logged in/i)).toBeInTheDocument();
  });

  it('handles profile fetch error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: '❌ Unable to fetch profile.' }),
    });

    render(<Profile />);

    expect(await screen.findByText(/unable to fetch profile/i)).toBeInTheDocument();
  });

  it('handles server error while fetching profile', async () => {
    fetch.mockRejectedValueOnce(new Error('Server error'));

    render(<Profile />);

    expect(await screen.findByText(/server error/i)).toBeInTheDocument();
  });

});