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
    console.log(spot);

    useEffect(() => {
        dispatch(loadOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.Owner ) return null;

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
                <div>
                <span id="spot_price">${spot.price}</span><span> night</span>
                </div>
                <div>
                <span>⭐️avgRating</span> <span>{spot.numReviews} reviews</span>
                </div>
                <button>Reservation</button>
            </div>
            </div>
            <ReviewList spotId={spotId}/>
        </div>
    )

}

export default SpotDetail;
