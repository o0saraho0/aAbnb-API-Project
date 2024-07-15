import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import { loadOneSpot } from "../../store/spot";
import './SpotList.css'

const SpotDetail = (spotId) => {
    const dispatch = useDispatch();
    // const spotId = useParams();
    console.log(spotId);
    
    const spot = useSelector((state) => state.spots);

    console.log("spots in component", spot);

    useEffect(() => {
        dispatch(loadOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot) return null;

    return (
        <div className="spot_detail_container">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            <div className="image_container">
               {spot.SpotImages}
            </div>
            <h2>Hosted by {spot.ownerId}</h2>

        </div>
    )

}

export default SpotDetail;
