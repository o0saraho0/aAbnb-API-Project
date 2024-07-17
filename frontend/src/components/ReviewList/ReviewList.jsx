import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotReviews } from "../../store/review";
import './ReviewList.css'

const ReviewList = ({spotId}) => {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => state.reviews[spotId]);

    useEffect(() => {
        dispatch(getSpotReviews(spotId));
    }, [dispatch, spotId]);

    if (!reviews || reviews.Reviews.length === 0) return <h2>⭐️ New</h2>;

    return (
        <div className="reviewlist_container">
        <h3>
            ⭐️ {reviews.avgRating} · {reviews.Reviews.length} {reviews.Reviews.length === 1 ? "Review" : "Reviews"}
        </h3>
        {reviews.Reviews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((review) => {
            const date = new Date(review.updatedAt);
            const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

            return (
                <div key={review.id} className="reviewList_small_container">
                    <h3>{review.User.firstName}</h3>
                    <p>{formattedDate}</p>
                    <p>{review.review}</p>
                </div>
            );
        })}
        </div>
       
    )

}

export default ReviewList;