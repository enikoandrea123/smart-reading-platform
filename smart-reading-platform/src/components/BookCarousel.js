import React from 'react';
import Slider from 'react-slick';
import './BookCarousel.css';

const BookCarousel = ({ title, books }) => {
  const settings = {
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
            <h3>{book.author}</h3>
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