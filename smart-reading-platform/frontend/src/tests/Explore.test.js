import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Explore from "../components/Explore";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';

global.fetch = jest.fn();

describe("Explore", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the search bar and input field", () => {
    render(<Explore />);

    expect(screen.getByPlaceholderText(/search for books/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
  });

  test("displays loading text when fetching books", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<Explore />);
    fireEvent.change(screen.getByPlaceholderText(/search for books/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByText(/search/i));

    expect(screen.getByText(/loading books/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading books/i)).not.toBeInTheDocument();
    });
  });

  test("displays books correctly when data is fetched", async () => {
    const mockBooks = [
      { id: 1, title: "Book 1", author: "Author 1", genre: "Fiction", coverImage: "cover1.jpg" },
      { id: 2, title: "Book 2", author: "Author 2", genre: "Non-fiction", coverImage: "cover2.jpg" },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockBooks),
    });

    render(<Explore />);
    fireEvent.change(screen.getByPlaceholderText(/search for books/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(screen.getByText(/book 1/i)).toBeInTheDocument();
      expect(screen.getByText(/book 2/i)).toBeInTheDocument();
      expect(screen.getByAltText(/book 1/i)).toBeInTheDocument();
    });
  });

  test("displays 'No books found' when no books are returned", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<Explore />);
    fireEvent.change(screen.getByPlaceholderText(/search for books/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(screen.getByText(/no books found/i)).toBeInTheDocument();
    });
  });

  test('handles pagination correctly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{
        id: '1',
        title: 'Book 1',
        author: 'Author 1',
        genre: 'Fiction',
        coverImage: 'cover1.jpg',
      }]),
    });

    render(<Explore />);

    const input = screen.getByPlaceholderText(/Search for books/i);
    fireEvent.change(input, { target: { value: '' } });

    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => screen.getByText(/book 1/i));

    expect(screen.getByText(/next/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/next/i));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/explore_books?query=&page=2');
    });
  });

  test('calls fetchBooks on search term change', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ([]),
    });

    render(<Explore />);

    const input = screen.getByPlaceholderText(/Search for books/i);

    fireEvent.change(input, { target: { value: 'test' } });

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/explore_books?query=test&page=1'));
  });

  test('handles fetch error correctly', async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<Explore />);

    const searchInput = screen.getByPlaceholderText("Search for books...");
    fireEvent.change(searchInput, { target: { value: "test" } });

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/explore_books?query=test&page=1'));

    await waitFor(() => screen.getByText(/Error fetching books/i));
  });

});