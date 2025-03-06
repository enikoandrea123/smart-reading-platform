import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import { Router } from "wouter";
import HomePage from "../components/HomePage";
import { createMemoryHistory } from 'history';

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
});