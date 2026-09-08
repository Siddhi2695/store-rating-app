import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRatingChange = null, size = 18, readOnly = false }) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const displayRating = hoverRating || rating;

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          className={`star-btn ${star <= displayRating ? 'filled' : ''}`}
          onClick={() => onRatingChange && onRatingChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          <Star 
            size={size} 
            fill={star <= displayRating ? '#fbbf24' : 'none'} 
            color={star <= displayRating ? '#fbbf24' : '#475569'} 
          />
        </button>
      ))}
      <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: '0.25rem', fontWeight: 600 }}>
        {rating > 0 ? rating.toFixed(1) : 'No Ratings'}
      </span>
    </div>
  );
};

export default StarRating;
