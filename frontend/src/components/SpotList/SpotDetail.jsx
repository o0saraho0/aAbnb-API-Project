import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOneSpot } from "../../store/spot";
import SpotImage from "../SpotImage";
import './SpotList.css'

const SpotDetail = () => {
    const {spotId} = useParams();
    const dispatch = useDispatch();
    
    const spot = useSelector((state) => state.spots[spotId]);

    useEffect(() => {
        dispatch(loadOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.Owner ) return null;

    return (
        <div className="spotdetail_container">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            <SpotImage spotId={spotId}/>
            <p>Hosted by {spot.Owner.firstName} {spot.Owner.firstName}</p>
        </div>
    )

}

export default SpotDetail;
