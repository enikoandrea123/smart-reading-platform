import React, { useState, useEffect } from "react";
import "./Track.css";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BOOKS_PER_PAGE = 30;

function Track() {
  const [readingList, setReadingList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goal, setGoal] = useState(0);
  const [editingGoal, setEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(0);

  useEffect(() => {
    const fetchReadingListAndGoal = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your reading list.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/reading-list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();

        const bookDetails = await Promise.all(
          data.map(async (book) => {
            const bookResponse = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${book.book_id}`
            );
            if (!bookResponse.ok) throw new Error(`Failed to fetch book ID: ${book.book_id}`);
            const bookData = await bookResponse.json();
            const volumeInfo = bookData.volumeInfo || {};
            return {
              bookId: book.book_id,
              title: volumeInfo.title || "Unknown Title",
              author: volumeInfo.authors?.join(", ") || "Unknown Author",
              cover: volumeInfo.imageLinks?.thumbnail || "",
              status: book.status || "Not Started",
            };
          })
        );

        setReadingList(bookDetails);

        const goalResponse = await fetch("http://localhost:5000/user/goal", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!goalResponse.ok) throw new Error("Failed to fetch reading goal");

        const goalData = await goalResponse.json();
        setGoal(goalData.goal);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingListAndGoal();
  }, []);

  const handleRemoveBook = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to remove a book.");
        return;
      }

      const response = await fetch(`http://localhost:5000/reading-list/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Failed to remove book with ID: ${bookId}`);

      setReadingList(readingList.filter((book) => book.bookId !== bookId));
    } catch (error) {
      alert("There was an error removing the book. Please try again.");
    }
  };

  const handleChangeStatus = async (bookId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to change the status.");
        return;
      }

      const response = await fetch(`http://localhost:5000/reading-list/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error(`Failed to update status for book ID: ${bookId}`);

      setReadingList(
        readingList.map((book) =>
          book.bookId === bookId ? { ...book, status: newStatus } : book
        )
      );
    } catch (error) {
      alert("There was an error updating the book status. Please try again.");
    }
  };

  const handleGoalChange = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to update the goal.");
        return;
      }

      const response = await fetch("http://localhost:5000/user/goal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ goal: newGoal }),
      });

      if (!response.ok) throw new Error("Failed to update the reading goal");

      setGoal(newGoal);
      setEditingGoal(false);
    } catch (error) {
      alert("There was an error updating the goal. Please try again.");
    }
  };

  const filteredBooks =
    statusFilter === "All"
      ? readingList
      : readingList.filter((book) => book.status.toLowerCase() === statusFilter.toLowerCase());

  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  const notStartedCount = filteredBooks.filter((book) => book.status === "Not Started").length;
  const inProgressCount = filteredBooks.filter((book) => book.status === "In Progress").length;
  const completedCount = filteredBooks.filter((book) => book.status === "Completed").length;

  const totalBooks = filteredBooks.length;

  const diagramData = {
    labels: ['Not Started', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [notStartedCount, inProgressCount, completedCount],
        backgroundColor: ['#ffcc80', '#66b3ff', '#99ff99'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const diagramOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const percentage = (tooltipItem.raw / totalBooks) * 100;
            return `${tooltipItem.label}: ${percentage.toFixed(2)}%`;
          },
        },
      },
    },
  };

  const lastInProgressBook = readingList
    .filter((book) => book.status === "In Progress")
    .slice(-1)[0];

  if (loading) return <p>Loading reading list...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="track-container">
      <h1 className="track-title">My Reading List</h1>

      <div className="top-container">
        <div className="card">
          <div className="diagram">
            <h2>Reading Status</h2>
            <Doughnut data={diagramData} options={diagramOptions} />
          </div>
        </div>

        {lastInProgressBook && (
          <div className="card">
            <h2 className="currently-reading-title">
              Currently Reading
              <span className="info-icon" title="Your last book with reading status from your list is automatically added">
                &#9432;
              </span>
            </h2>
            <div className="currently-reading-details">
              <img
                src={lastInProgressBook.cover}
                alt={lastInProgressBook.title}
                className="currently-reading-cover"
              />
              <div className="currently-reading-text">
                <h3>{lastInProgressBook.title}</h3>
                <p>{lastInProgressBook.author}</p>
              </div>
            </div>
          </div>
        )}

        <div className="goal-container card">
          {goal === 0 ? (
            <p>You have not set a reading goal. Please set a goal to track your progress.</p>
          ) : (
            <p>You have set a goal of {goal} books. Keep going!</p>
          )}

          {completedCount >= goal && goal > 0 ? (
            <p>Congratulations! You've reached your reading goal! Set a new goal.</p>
          ) : (
            <div className="goal-edit">
             {editingGoal ? (
  <div>
    <input
      type="number"
      value={newGoal}
      onChange={(e) => setNewGoal(Math.max(0, e.target.value))}
      min="0"
    />
    <button onClick={handleGoalChange}>Save Goal</button>
    <button onClick={() => setEditingGoal(false)}>Cancel</button>
  </div>
) : (
  <FaPencilAlt onClick={() => setEditingGoal(true)} className="edit-goal-icon" />
)}
            </div>
          )}
        </div>
      </div>

      <div className="filter-container">
        <label htmlFor="status-filter">Filter by status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <span className="book-count">
          {Math.min(currentPage * BOOKS_PER_PAGE, filteredBooks.length)} out of {filteredBooks.length}
        </span>
      </div>

      {paginatedBooks.length === 0 ? (
        <p className="empty-message">Your reading list is empty.</p>
      ) : (
        <ul className="reading-list">
          {paginatedBooks.map((book) => (
            <li key={book.bookId} className="reading-item">
              <img src={book.cover} alt={book.title} className="book-cover" />
              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
              </div>
              <select
                className="status-dropdown"
                value={book.status}
                onChange={(e) => handleChangeStatus(book.bookId, e.target.value)}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button className="remove-btn" onClick={() => handleRemoveBook(book.bookId)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Track;