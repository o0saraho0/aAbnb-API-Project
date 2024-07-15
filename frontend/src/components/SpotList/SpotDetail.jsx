import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadOneSpot } from "../../store/spot";
import './SpotList.css'

const SpotDetail = () => {
    const {spotId} = useParams();
    const dispatch = useDispatch();
    
    const spot = useSelector((state) => state.spots[spotId]);
    console.log("spot in commponent", spot);

    useEffect(() => {
        dispatch(loadOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot) return null;

    return (
        <div className="spotdetail_container">
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}, {spot.country}</p>
            <div className="spotdetail_image_container">
                <div className="large_image image"><img src={spot.previewImage} alt={spot.name} /></div>
                <div className="small_image image"><img src="" alt={spot.name} /></div>
                <div className="small_image image"><img src="" alt={spot.name} /></div>
                <div className="small_image image"><img src="" alt={spot.name} /></div>
                <div className="small_image image"><img src="" alt={spot.name} /></div>
            </div>
            <p>Hosted by {}</p>

        </div>
    )

}

export default SpotDetail;
