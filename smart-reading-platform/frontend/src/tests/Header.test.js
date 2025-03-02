import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { Router } from "wouter";
import Header from "../components/Header";

delete window.location;
window.location = { href: "" };

describe("Header Component", () => {

  test("renders ShelfMate title", () => {
    render(
      <Router>
        <Header />
      </Router>
    );
    expect(screen.getByText("ShelfMate")).toBeInTheDocument();
  });

  test("does not show navigation links when no user is logged in", () => {
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Explore")).not.toBeInTheDocument();
    expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
  });

  test("shows navigation links when user is logged in", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();

    localStorage.removeItem("user");
  });

  test("clicking log out button removes user from localStorage and resets state", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

    render(
      <Router>
        <Header />
      </Router>
    );

    const logoutButton = screen.getByText("Log Out");

    fireEvent.click(logoutButton);

    expect(localStorage.getItem("user")).toBeNull();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Explore")).not.toBeInTheDocument();
    expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
  });

  test("does not show the user info if localStorage does not contain user data", () => {
    localStorage.removeItem("user");
    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("Explore")).not.toBeInTheDocument();
    expect(screen.queryByText("Log Out")).not.toBeInTheDocument();
  });

  test("renders header when user is logged in", () => {
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));

    render(
      <Router>
        <Header />
      </Router>
    );

    expect(screen.getByText("ShelfMate")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();

    localStorage.removeItem("user");
  });
});