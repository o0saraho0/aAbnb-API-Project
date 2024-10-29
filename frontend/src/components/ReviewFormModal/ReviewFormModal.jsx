import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/review";
import StarRating from "../StarRating/StarRating";
import "./ReviewFormModal.css";

const ReviewFormModal = ({ spotId, onSubmitSuccess }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
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
      <div className="review-header">
        <h1>How was your stay?</h1>
      </div>
      <textarea
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
        style={{ minWidth: "300px", minHeight: "200px" }}
      />
      <div className="star_div">
        <StarRating rating={stars} setRating={setStars} />
      </div>
      <button type="submit" disabled={review.length < 10 || stars === 0}>
        Submit Your Review
      </button>
    </form>
  );
};

export default ReviewFormModal;
