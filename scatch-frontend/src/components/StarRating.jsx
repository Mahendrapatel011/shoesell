import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, numReviews }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <i key={`full-${i}`} className="fa-solid fa-star"></i>
        ))}
        {halfStar && <i className="fa-solid fa-star-half-alt"></i>}
        {[...Array(emptyStars)].map((_, i) => (
          <i key={`empty-${i}`} className="fa-regular fa-star"></i>
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="rating-text">
          {numReviews > 0 ? `(${numReviews})` : 'No reviews'}
        </span>
      )}
    </div>
  );
};

export default StarRating;