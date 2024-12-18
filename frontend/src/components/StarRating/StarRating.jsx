import { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./StarRating.css";

const StarRating = ({ rating, setRating, readOnly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;

        return (
          <label key={index}>
            {!readOnly && (
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating && setRating(ratingValue)}
              />
            )}
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => !readOnly && setHover(ratingValue)}
              onMouseLeave={() => !readOnly && setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
