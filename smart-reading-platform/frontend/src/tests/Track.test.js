import { render, screen, waitFor } from '@testing-library/react';
import Track from '../components/Track'; // Adjust based on your actual component
import '@testing-library/jest-dom'; // For jest matchers

beforeAll(() => {
  // Mock the fetch function before the tests
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        // Mock reading list data
        books: [
          { book_id: '1', status: 'Not Started' },
          { book_id: '2', status: 'In Progress' },
        ],
      }),
    })
  );
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('renders the reading list when logged in', async () => {
  render(<Track />);

  // Adjust based on the actual content you're expecting
  await waitFor(() => screen.getByText('Reading List'));

  // Ensure the reading list is displayed
  expect(screen.getByText('Reading List')).toBeInTheDocument();
});