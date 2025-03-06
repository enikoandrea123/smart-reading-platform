import React, { useState, useEffect } from 'react';
import BookCarousel from './BookCarousel';
import './HomePage.css';
import Login from './Login';

const HomePage = () => {
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loadingNew, setLoadingNew] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const newBooksResponse = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=10"
        );
        const newBooksData = await newBooksResponse.json();
        setNewBooks(formatBooks(newBooksData));
      } catch (error) {
        console.error("Error fetching new books:", error);
      } finally {
        setLoadingNew(false);
      }

      try {
        const popularBooksResponse = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=best+books&maxResults=10"
        );
        const popularBooksData = await popularBooksResponse.json();
        setPopularBooks(formatBooks(popularBooksData));
      } catch (error) {
        console.error("Error fetching popular books:", error);
      } finally {
        setLoadingPopular(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found, skipping recommendations.");
          setLoadingRecommended(false);
          return;
        }

        const response = await fetch("http://localhost:5000/recommendations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch recommendations.");

        const data = await response.json();
        console.log("Recommendations API Response:", data);

        setRecommendedBooks(data.slice(0, 3)); // Show first 3 books
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchBooks();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchRecommendations();
    } else {
      setLoadingRecommended(false);
    }
  }, []);

  const formatBooks = (data) => {
    return (
      data.items?.map((item) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
        imageUrl: item.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150",
      })) || []
    );
  };

  return (
    <div className="app">
      <div className="welcome-section">
        {user ? (
          <h1>Welcome back, {user.name}!</h1>
        ) : (
          <h1>Welcome to ShelfMate!</h1>
        )}
        <p>"A reader lives a thousand lives before he dies." – George R.R. Martin</p>
      </div>

        <div className="description-container">
        <div className="section-description">
          <h2>Not sure what to read next? 🤔</h2>
          <p>
            You've come to the right place. Let us know what genres or books you've loved in the past,
            and our AI-powered system will give you precise and personalized recommendations that match your reading tastes. 📚✨
          </p>
        </div>

        {!user && <Login />}

        <div className="section-description">
          <h2>Tracking your reading progress? 📊</h2>
          <p>
            With our platform, you can easily track your reading journey and see your progress in real-time. Keep an eye on the books
            you've read, the ones you're currently reading, and those you plan to read. Stay motivated and celebrate your reading milestones! 🎉📖
          </p>
        </div>
      </div>

      {user && (
        <BookCarousel
          title="Recommended for You"
          books={recommendedBooks}
          loading={loadingRecommended}
          isRecommended={true}
        />
      )}
      <BookCarousel title="New Arrivals" books={newBooks} loading={loadingNew} />
      <BookCarousel title="Popular Choices" books={popularBooks} loading={loadingPopular} />
    </div>
  );
};

export default HomePage;