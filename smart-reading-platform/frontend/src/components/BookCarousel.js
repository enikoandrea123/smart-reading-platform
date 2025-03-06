import React from "react";
import Slider from "react-slick";
import "./BookCarousel.css";

const BookCarousel = ({ title, books, loading, isRecommended = false }) => {
  if (loading) return <p>Loading {title}...</p>;
  if (books.length === 0) return <p>No books available.</p>;

  const settings = isRecommended
    ? {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: false,
        arrows: false,
      }
    : {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 8000,
        nextArrow: <CustomNextArrow />,
        prevArrow: <CustomPrevArrow />,
      };

  return (
    <div className="book-carousel">
      <h2>{title}</h2>
      <Slider {...settings}>
        {books.map((book) => (
          <div key={book.id} className="book-item">
            <img src={book.imageUrl} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

const CustomNextArrow = ({ onClick }) => (
  <div className="custom-arrow next" onClick={onClick}>
    &#8594;
  </div>
);

const CustomPrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev" onClick={onClick}>
    &#8592;
  </div>
);

export default BookCarousel;