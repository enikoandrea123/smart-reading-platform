import React, { useState, useEffect } from "react";

function Track() {
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadingList = async () => {
      console.log("Fetching reading list...");

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No auth token found.");
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

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Reading list fetched:", data);

        const bookDetails = await Promise.all(
          data.map(async (book) => {
            const bookResponse = await fetch(`https://www.googleapis.com/books/v1/volumes/${book.book_id}`);
            if (!bookResponse.ok) {
              throw new Error(`Failed to fetch details for book ID: ${book.book_id}`);
            }
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
      } catch (error) {
        console.error("Error fetching reading list:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingList();
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

      if (!response.ok) {
        throw new Error(`Failed to remove book with ID: ${bookId}`);
      }

      setReadingList(readingList.filter((book) => book.bookId !== bookId));
      alert("Book removed from your reading list.");
    } catch (error) {
      console.error("Error removing book:", error);
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

      if (!response.ok) {
        throw new Error(`Failed to update status for book with ID: ${bookId}`);
      }

      setReadingList(
        readingList.map((book) =>
          book.bookId === bookId ? { ...book, status: newStatus } : book
        )
      );
      alert("Book status updated.");
    } catch (error) {
      console.error("Error changing status:", error);
      alert("There was an error updating the book status. Please try again.");
    }
  };

  if (loading) return <p>Loading reading list...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Reading List</h1>
      {readingList.length === 0 ? (
        <p>Your reading list is empty.</p>
      ) : (
        <ul>
          {readingList.map((book) => (
            <li key={book.book_id}>
              <img src={book.cover} alt={book.title} style={{ width: "100px" }} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>

              <div>
                <select
                  value={book.status}
                  onChange={(e) => handleChangeStatus(book.bookId, e.target.value)}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button onClick={() => handleRemoveBook(book.bookId)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Track;