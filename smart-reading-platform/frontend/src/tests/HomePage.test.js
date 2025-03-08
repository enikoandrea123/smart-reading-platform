import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "wouter";
import HomePage from "../components/HomePage";
import { createMemoryHistory } from 'history';
import { act } from "@testing-library/react";

global.fetch = jest.fn();

describe("HomePage Component", () => {
  beforeEach(() => {
    fetch.mockImplementation((url) => {
      if (url.includes("fiction")) {
        return Promise.resolve({
          json: () => Promise.resolve({
            items: [
              {
                id: "1",
                volumeInfo: {
                  title: "New Book 1",
                  authors: ["Author 1"],
                  imageLinks: { thumbnail: "https://via.placeholder.com/150" }
                }
              }
            ]
          })
        });
      } else if (url.includes("best+books")) {
        return Promise.resolve({
          json: () => Promise.resolve({
            items: [
              {
                id: "2",
                volumeInfo: {
                  title: "Popular Book 1",
                  authors: ["Author 2"],
                  imageLinks: { thumbnail: "https://via.placeholder.com/150" }
                }
              }
            ]
          })
        });
      }
      return Promise.reject("Unknown URL");
    });
  });

  afterEach(() => {
    localStorage.removeItem('user');
    fetch.mockClear();
  });

  test("renders HomePage correctly", async () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => expect(screen.getByText("Welcome to ShelfMate!")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/"A reader lives a thousand lives before he dies."/)).toBeInTheDocument());
  });

 test('displays book carousel for new and popular books', async () => {
  const mockUser = { name: 'John Doe' };
  localStorage.setItem('user', JSON.stringify(mockUser));

  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <HomePage />
    </Router>
  );

  await waitFor(() => expect(screen.getByText("New Arrivals")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText("Popular Choices")).toBeInTheDocument());

  const newArrivals = screen.getByText("New Arrivals").closest('div');
  const popularChoices = screen.getByText("Popular Choices").closest('div');
  expect(newArrivals).toBeInTheDocument();
  expect(popularChoices).toBeInTheDocument();

  const newBooks = screen.getAllByText("New Book 1");
  expect(newBooks).toHaveLength(3);

  const popularBooks = screen.getAllByText("Popular Book 1");
  expect(popularBooks).toHaveLength(3);
});

  test("does not show carousels if no user is logged in", async () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => expect(screen.queryByText("New Arrivals")).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText("Popular Choices")).not.toBeInTheDocument());
  });

  test("shows carousels when user is logged in", async () => {
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => expect(screen.getByText("New Arrivals")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Popular Choices")).toBeInTheDocument());

    expect(screen.getAllByText("New Book 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Popular Book 1").length).toBeGreaterThan(0);
  });

  test("displays login form if no user is logged in", async () => {
    await act(async () => {
      render(
        <Router>
          <HomePage />
        </Router>
      );
    });

    expect(screen.getByText("Sign up with Email")).toBeInTheDocument();
  });

test("loads books after user logs in", async () => {
  localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

  render(
    <Router>
      <HomePage />
    </Router>
  );

  await waitFor(() => screen.getByText("New Arrivals"));
  await waitFor(() => screen.getByText("Popular Choices"));

  const newBooks = screen.getAllByTestId("new-arrivals-book-1");
  const popularBooks = screen.getAllByTestId("popular-choices-book-2");

  expect(newBooks.length).toBe(3);
  expect(popularBooks.length).toBe(3);
});

  test("displays personalized greeting when user is logged in", async () => {
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => expect(screen.getByText("Welcome back, Test User!")).toBeInTheDocument());
  });

  test("shows default greeting if no user is logged in", async () => {
    render(
      <Router>
        <HomePage />
      </Router>
    );

    expect(screen.getByText("Welcome to ShelfMate!")).toBeInTheDocument();
  });

  test('shows default state after user logs out', async () => {
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => expect(screen.getByText("Welcome back, Test User!")).toBeInTheDocument());

    localStorage.removeItem("user");

    render(
      <Router>
        <HomePage />
      </Router>
    );

    await waitFor(() => expect(screen.getByText("Welcome to ShelfMate!")).toBeInTheDocument());
  });

  test('displays user greeting when user has name', async () => {
    const mockUser = { name: 'Jane Doe' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    render(
      <Router>
        <HomePage />
      </Router>
    );

    expect(screen.getByText("Welcome back, Jane Doe!")).toBeInTheDocument();
  });

test('displays default greeting when no user is logged in', async () => {
  localStorage.removeItem("user");

  render(
    <Router>
      <HomePage />
    </Router>
  );

  await waitFor(() => expect(screen.getByText("Welcome to ShelfMate!")).toBeInTheDocument());
});
test('displays personalized greeting when user is logged in', async () => {
  const mockUser = { name: 'Test User' };
  localStorage.setItem("user", JSON.stringify(mockUser));

  render(
    <Router>
      <HomePage />
    </Router>
  );

  await waitFor(() => expect(screen.getByText("Welcome back, Test User!")).toBeInTheDocument());
});

test('sets user from localStorage when available', async () => {
  const mockUser = { name: 'Test User' };
  localStorage.setItem("user", JSON.stringify(mockUser));

  render(
    <Router>
      <HomePage />
    </Router>
  );

  await waitFor(() => expect(screen.getByText("Welcome back, Test User!")).toBeInTheDocument());
});

test('keeps user state as null when localStorage is empty', async () => {
  localStorage.removeItem("user");

  render(
    <Router>
      <HomePage />
    </Router>
  );

  await waitFor(() => expect(screen.getByText("Welcome to ShelfMate!")).toBeInTheDocument());
});

test('updates greeting when user logs out', async () => {
  const mockUser = { name: 'Test User' };
  localStorage.setItem("user", JSON.stringify(mockUser));

  render(
    <Router>
      <HomePage />
    </Router>
  );

  await waitFor(() => expect(screen.getByText("Welcome back, Test User!")).toBeInTheDocument());

  localStorage.removeItem("user");

  render(
    <Router>
      <HomePage />
    </Router>
  );

  await waitFor(() => expect(screen.getByText("Welcome to ShelfMate!")).toBeInTheDocument());
});

});