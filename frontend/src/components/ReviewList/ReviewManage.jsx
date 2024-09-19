import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import { getUserReviews, deleteReview } from "../../store/review";
import ConfirmDeleteModal from '../ConfirmDeletionModal';
import './ReviewList.css'

const ReviewManage = () => {
    const { setModalContent, closeModal } = useModal();

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.session.user);
    const reviews = useSelector((state) => state.reviews?.undefined?.Reviews);
    console.log(reviews);

    useEffect(() => {
        dispatch(getUserReviews(currentUser.id));
    }, [dispatch, currentUser.id]);

    if (!reviews) return null;

    const handleDeleteClick = () => {
        setModalContent(
          <ConfirmDeleteModal
            onDelete={() => handleDeleteConfirm()}
            onClose={closeModal}
            message="Are you sure you want to remove this review?"
            type="Review"
          />
        );
    };
    
    const handleDeleteConfirm = async (reviewId) => {
        await dispatch(deleteReview(reviewId));
        closeModal();
    };

    return (
        <div className="current_reviewlist_container">
            <h1>Manage Reviews</h1>

            <div className="current_review_container">
            {reviews
            .sort((a, b) => b.id - a.id)
            .map((review) => (
            <div key={review.id} className="review_small_container">
                <h2>{review.Spot.name}</h2>
                <p>{review.createdAt.slice(0, 7)}</p>
                <p>{review.review}</p>

            <div className="current_review_buttons">
                <button>Update</button>
                <button onClick={() => handleDeleteClick(review.id)}>Delete</button>
            </div>

            
            </div>

            ))}
            </div>
        </div>
)};
    
export default ReviewManage;