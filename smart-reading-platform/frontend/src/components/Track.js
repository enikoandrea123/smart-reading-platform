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
        setReadingList(data);
      } catch (error) {
        console.error("Error fetching reading list:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadingList();
  }, []);

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Track;