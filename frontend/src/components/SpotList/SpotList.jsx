import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadAllSpots } from "../../store/spot";
import './SpotList.css'

const SpotList = () => {
    const dispatch = useDispatch();
    
    const spots = useSelector((state) => state.spots);
    const spotsArray = Object.values(spots);

    useEffect(() => {
        dispatch(loadAllSpots());
    }, [dispatch]);

    if (!spots) return null;

    return spotsArray.map((spot) => (
        <div key={spot.id} className="spotlist_small_container">
            <Link key={spot.id} to={`/api/spots/${spot.id}`} className="spotlist_small_container_link">
            <img src={spot.previewImage} alt={spot.name} />
                <h4>{spot.name}</h4>
                <div className='spotlist_preview'>
                <p>{spot.city}, {spot.state}</p>
                <p>⭐️ {spot.avgRating}</p>
                </div>
                <span className='spotlist_preview_price'>${spot.price}</span><span> night</span>
            </Link>
        </div>
        
    ))
}

export default SpotList;

