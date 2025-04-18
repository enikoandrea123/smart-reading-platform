import React, { useState, useEffect } from "react";
import { useParams } from 'wouter';
import './BookDetail.css';
import BookCarousel from './BookCarousel';
import './BookCarousel.css';
import Comments from "./Comments";

function BookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInReadingList, setIsInReadingList] = useState(false);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUserId(JSON.parse(storedUser).id);
  }
    if (!bookId) {
      setError("No book ID found in URL.");
      setLoading(false);
      return;
    }

    const fetchBookDetail = async () => {
      try {
        const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
        console.log("Fetching book details from:", apiUrl);

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Book data fetched:", data);

        const volumeInfo = data.volumeInfo || {};

        setBook({
          title: volumeInfo.title,
          subtitle: volumeInfo.subtitle || "",
          author: volumeInfo.authors?.join(", ") || "Unknown",
          coverImage: volumeInfo.imageLinks?.thumbnail || "",
          description: volumeInfo.description || "No description available",
          genre: volumeInfo.categories?.join(", ") || "Unknown",
          language: volumeInfo.language || "Unknown",
          pageCount: volumeInfo.pageCount || "Unknown",
          publisher: volumeInfo.publisher || "Unknown",
          publishedDate: volumeInfo.publishedDate || "Unknown",
          maturityRating: volumeInfo.maturityRating || "Not rated",
          isbn:
            volumeInfo.industryIdentifiers?.find(
              (id) => id.type === "ISBN_10" || id.type === "ISBN_13"
            )?.identifier || "Not available",
          previewLink: `https://books.google.com/books?id=${bookId}&printsec=frontcover&hl=en#v=onepage&q&f=false`,
          averageRating: volumeInfo.averageRating || 0,
          ratingsCount: volumeInfo.ratingsCount || 0,
        });
      } catch (error) {
        setError(`Error fetching book details: ${error.message}`);
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

const fetchRecommendedBooks = async () => {
  try {
    if (book?.genre) {
      const genres = book.genre.split(",").map(genre => genre.trim());
      const genreQuery = genres.join(" OR ");

      const recommendedBooksResponse = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:(${genreQuery})&maxResults=9`
      );
      const recommendedBooksData = await recommendedBooksResponse.json();

      const mappedRecommendedBooks = formatBooks(recommendedBooksData);
      setRecommendedBooks(mappedRecommendedBooks);
    } else {
      const randomBooksResponse = await fetch(
        "https://www.googleapis.com/books/v1/volumes?q=subject:&maxResults=9"
      );
      const randomBooksData = await randomBooksResponse.json();

      const mappedRandomBooks = formatBooks(randomBooksData);
      setRecommendedBooks(mappedRandomBooks);
    }
  } catch (error) {
    console.error("Error fetching recommended books:", error);
  }
};

const formatBooks = (data) => {
  return (
    data.items?.map((item) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
      coverImage: item.volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/150",
    })) || []
  );
};

    const checkIfBookInReadingList = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/reading-list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const isBookInList = data.some((item) => item.book_id === bookId);

          setIsInReadingList(isBookInList);
        }
      } catch (error) {
        console.error("Error checking reading list:", error);
      }
    };

    const checkIfBookInFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3000/favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const isBookFavorite = data.some((item) => item.book_id === bookId);

          setIsFavorite(isBookFavorite);
        }
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    fetchBookDetail();
    checkIfBookInReadingList();
    checkIfBookInFavorites();
    fetchRecommendedBooks();

  }, [bookId, book?.genre]);

  const cleanText = (html) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const renderStarRating = (rating) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {"★".repeat(fullStars)}
        {hasHalfStar && <span className="half-star">★</span>}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  const handleAddToReadingList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be signed in to add books to your reading list.");
      console.error("Token not found in localStorage.");
      return;
    }

    console.log("Sending request to add book to reading list:", bookId);

    try {
      const response = await fetch("http://localhost:3000/reading-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ book_id: bookId, status: "not started" }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error("Failed to add to reading list");
      }

      const data = await response.json();
      console.log("Successfully added to reading list:", data);

      setIsInReadingList(true);
      alert("Book added to your reading list!");

    } catch (error) {
      console.error("Error adding to reading list:", error);
      alert("Error adding book to reading list");
    }
  };

  const handleRemoveFromReadingList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be signed in to remove books from your reading list.");
      console.error("Token not found in localStorage.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/reading-list/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error("Failed to remove from reading list");
      }

      setIsInReadingList(false);
      alert("Book removed from your reading list!");
    } catch (error) {
      console.error("Error removing from reading list:", error);
      alert("Error removing book from reading list");
    }
  };

  const handleAddToFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be signed in to add books to your favorites.");
      console.error("Token not found in localStorage.");
      return;
    }

    console.log("Sending request to add book to favorites:", bookId);

    try {
      const response = await fetch("http://localhost:3000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ book_id: bookId }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error("Failed to add to favorites");
      }

      setIsFavorite(true);
      alert("Book added to your favorites!");
    } catch (error) {
      console.error("Error adding to favorites:", error);
      alert("Error adding book to favorites");
    }
  };

  const handleRemoveFromFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be signed in to remove books from your favorites.");
      console.error("Token not found in localStorage.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/favorites/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText);
        throw new Error("Failed to remove from favorites");
      }

      setIsFavorite(false);
      alert("Book removed from your favorites!");
    } catch (error) {
      console.error("Error removing from favorites:", error);
      alert("Error removing book from favorites");
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p>{error}</p>;

return (
  <>
    <div className="book-detail-container">
      <div className="book-actions">
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={() => {
            if (isFavorite) {
              handleRemoveFromFavorites();
            } else {
              handleAddToFavorites();
            }
          }}
        >
          ❤️ {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>

        <button
          className={`bookmark-btn ${isInReadingList ? "active" : ""}`}
          onClick={() => {
            if (isInReadingList) {
              handleRemoveFromReadingList();
            } else {
              handleAddToReadingList();
            }
          }}
        >
          📖 {isInReadingList ? "Remove from Reading List" : "Add to Reading List"}
        </button>
      </div>

      <h1>{book?.title}</h1>
      {book?.subtitle && <h2 className="book-subtitle">{book.subtitle}</h2>}
      <p><strong>Author:</strong> {book?.author}</p>

      <div className="book-rating">
        {renderStarRating(book?.averageRating)}
        <span>({book?.ratingsCount} reviews)</span>
      </div>

      <img src={book?.coverImage} alt={book?.title} className="book-cover" />

      <p><strong>Genre:</strong> {book?.genre}</p>
      <p><strong>Language:</strong> {book?.language}</p>
      <p><strong>Page Count:</strong> {book?.pageCount}</p>
      <p><strong>Publisher:</strong> {book?.publisher}</p>
      <p><strong>Published Date:</strong> {book?.publishedDate}</p>
      <p><strong>Maturity Rating:</strong> {book?.maturityRating}</p>
      <p><strong>ISBN:</strong> {book?.isbn}</p>

      <div className="book-description">
        {cleanText(book?.description)?.split("\n\n").map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      <a href={book?.previewLink} target="_blank" rel="noopener noreferrer" className="preview-link">
        Preview this book
      </a>
    </div>
    {userId && <Comments bookId={bookId} userId={userId} />}

    {recommendedBooks.length > 0 && (
        <div className="book-carousel-container">
          <BookCarousel books={recommendedBooks} title="Recommended Books" />
        </div>
      )}
  </>
);
}

export default BookDetail;