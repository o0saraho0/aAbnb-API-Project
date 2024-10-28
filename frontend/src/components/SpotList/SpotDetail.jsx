import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOneSpot } from "../../store/spot";
import { getSpotReviews } from "../../store/review";
import SpotImage from "../SpotImage";
import ReviewList from "../ReviewList/ReviewList";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const spot = useSelector((state) => state.spots[spotId]);
  const reviews = useSelector((state) => state.reviews[spotId]);
  const hasReviews = reviews && reviews.Reviews.length > 0;
  const totalStars = hasReviews
    ? reviews.Reviews.reduce((sum, review) => sum + review.stars, 0)
    : 0;
  const averageRating = hasReviews
    ? (totalStars / reviews.Reviews.length).toFixed(1)
    : null;

  useEffect(() => {
    dispatch(loadOneSpot(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  if (!spot || !spot.Owner) return null;

  const handleReservation = () => {
    alert("Feature coming soon");
  };

  return (
    <div className="spotdetail_container">
      <h2>{spot.name}</h2>
      <p>
        {spot.city}, {spot.state}, {spot.country}
      </p>
      <SpotImage spotId={spotId} />
      <div className="spotdetail_small_container">
        <div className="spotdetail_description">
          <h2>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </h2>
          <p>{spot.description}</p>
        </div>
        <div className="reservation_container">
          <div className="price_container">
            <span id="spot_price">${spot.price}</span>
            <span>night</span>
          </div>

          {/* <div className="reservation_rating">
                    ⭐️ {averageRating} · {reviews?.Reviews?.length} {reviews?.Reviews?.length === 1 ? "Review" : "Reviews"}
                </div> */}

          <div className="reservation_rating">
            ⭐️{" "}
            {!averageRating ? (
              "New"
            ) : (
              <>
                {averageRating} · {reviews?.Reviews?.length}{" "}
                {reviews?.Reviews?.length === 1 ? "Review" : "Reviews"}
              </>
            )}
          </div>

          <div className="booking">
            <div className="checkin">
              <label>CHECK-IN</label>
              <input type="date" className="booking_input" />
            </div>
            <div className="checkout">
              <label>CHECKOUT</label>
              <input type="date" className="booking_input" />
            </div>
          </div>
          <button onClick={handleReservation}>Reserve</button>
        </div>
      </div>
      <ReviewList spotId={spotId} />
    </div>
  );
};

export default SpotDetail;
