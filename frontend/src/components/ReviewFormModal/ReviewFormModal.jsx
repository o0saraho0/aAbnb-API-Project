import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { createReview } from '../../store/review';

const ReviewFormModal = ({ spotId, onSubmitSuccess }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newReview = { review, stars };
    await dispatch(createReview(newReview, spotId));
    if (onSubmitSuccess) {
      onSubmitSuccess();
  }
    closeModal();
  };


  return (
    <form onSubmit={handleSubmit} className="review_form">
      <h1>How was your stay?</h1>
      <textarea
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <div className="star-rating">
        <label>Stars</label>
        <input
          type="number"
          value={stars}
          onChange={(e) => setStars(e.target.value)}
          min="1"
          max="5"
        />
      </div>
      <button type="submit" disabled={review.length < 10 || stars === 0}>
        Submit Your Review
      </button>
    </form>
  );
};

export default ReviewFormModal;