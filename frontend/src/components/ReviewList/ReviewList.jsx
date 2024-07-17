import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview, getSpotReviews } from "../../store/review";
import { useModal } from '../../context/Modal';
import ConfirmDeleteModal from "../ConfirmDeletionModal";
import ReviewFormModal from "../ReviewFormModal";
import './ReviewList.css';

const ReviewList = ({ spotId }) => {
    const dispatch = useDispatch();
    const { setModalContent, setOnModalClose, closeModal } = useModal();

    const reviews = useSelector((state) => state.reviews[spotId]);
    const currentSpot = useSelector((state) => state.spots[spotId]);
    const currentUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(getSpotReviews(spotId));
    }, [dispatch, spotId]);

    const hasReviews = reviews && reviews.Reviews.length > 0;
    const totalStars = hasReviews ? reviews.Reviews.reduce((sum, review) => sum + review.stars, 0) : 0;
    const averageRating = hasReviews ? (totalStars / reviews.Reviews.length).toFixed(1) : null;

    const hasReviewed = hasReviews && currentUser && reviews.Reviews.some(review => review.userId === currentUser.id);
    const isOwner = currentUser && currentSpot && currentUser.id === currentSpot.ownerId;

    const openReviewModal = () => {
        setOnModalClose(() => {});
        setModalContent(<ReviewFormModal spotId={spotId} onSubmitSuccess={() => dispatch(getSpotReviews(spotId))}
/>);
    };

    const handleDeleteClick = (reviewId) => {
        console.log("Delete clicked for reviewId:", reviewId); // Log the reviewId
        setModalContent(
            <ConfirmDeleteModal
                onDelete={() => handleDeleteConfirm(reviewId, spotId)}
                onClose={closeModal}
                message="Are you sure you want to delete this review?"
                type="Review"
            />
        );
    };

    const handleDeleteConfirm = async (reviewId, spotId) => {
        console.log("Deleting review with reviewId:", reviewId, "and spotId:", spotId); // Log reviewId and spotId
        await dispatch(deleteReview(reviewId, spotId));
        closeModal();
    };

    return (
        <div className="reviewlist_container">
            {hasReviews ? (
                <>
                    <h3>
                        ⭐️ {averageRating} · {reviews.Reviews.length} {reviews.Reviews.length === 1 ? "Review" : "Reviews"}
                    </h3>
                    {!hasReviewed && !isOwner && currentUser && (
                        <button className="post-review-button" onClick={openReviewModal}>
                            Post Your Review
                        </button>
                    )}
                    {reviews.Reviews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((review) => {
                        const date = new Date(review.updatedAt);
                        const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

                        return (
                            <div key={review.id} className="reviewList_small_container">
                                <h3>{review.User?.firstName || (currentUser && currentUser.firstName)}</h3>
                                <p>{formattedDate}</p>
                                <p>{review.review}</p>
                                {currentUser && currentUser.id === review.userId && !isOwner && (
                                    <button className="delete-review-button" onClick={() => handleDeleteClick(review.id)}>
                                        Delete
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </>
            ) : (
                currentUser && !isOwner? (
                    <>
                        <h2>⭐️ New</h2>
                        <p>Be the first to post a review!</p>
                        <button className="post-review-button" onClick={openReviewModal}>
                            Post Your Review
                        </button>
                    </>
                ) : <h2>⭐️ New</h2>
            )}
        </div>
    );
};

export default ReviewList;
