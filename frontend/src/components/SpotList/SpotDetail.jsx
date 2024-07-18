import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOneSpot } from "../../store/spot";
import SpotImage from "../SpotImage";
import ReviewList from "../ReviewList/ReviewList";
import './SpotDetail.css'

const SpotDetail = () => {
    const {spotId} = useParams();
    const dispatch = useDispatch();
    
    const spot = useSelector((state) => state.spots[spotId]);


    useEffect(() => {
        dispatch(loadOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.Owner ) return null;

    const handleReservation = () => {
        alert("Feature coming soon");
    }

    return (
        <div className="spotdetail_container">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            <SpotImage spotId={spotId}/>
            <div className="spotdetail_small_container">
            <div className="spotdetail_description">
                <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
                <p>{spot.description}</p>
            </div>
            <div className="reservation_container">
                <div className="price_container">
                <span id="spot_price">${spot.price}</span><span>night</span>
                </div>
                <div className="reservation_rating">⭐️ {!spot.avgRating ? "New" : <>{spot.avgRating} · {spot.numReviews} {spot.numReviews === 1 ? "Review" : "Reviews"}</>}
                </div>
                <div className="booking">
                    <div className="checkin">
                        <label>CHECK-IN</label>
                        <input type="date" className="booking_input"/>
                    </div>
                    <div className="checkout">
                        <label>CHECKOUT</label>
                        <input type="date" className="booking_input"/>
                    </div>

                </div>
                {/* <div>
                <span>⭐️averageRating</span> <span>{spot.numReviews} {spot.numReviews === 1? "Review" : "Reviews"}</span>
                </div> */}
                <button onClick={handleReservation}>Reserve</button>
            </div>
            </div>
            <ReviewList spotId={spotId}/>
        </div>
    )

}

export default SpotDetail;
