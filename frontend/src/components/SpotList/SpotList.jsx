import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadAllSpots } from "../../store/spot";
import './SpotList.css'

const SpotList = () => {
    const dispatch = useDispatch();
    const [toolTip, setToolTip] = useState(null);
    
    const spots = useSelector((state) => state.spots);
    const spotsArray = Object.values(spots);

    useEffect(() => {
        dispatch(loadAllSpots());
    }, [dispatch]);

    if (!spots) return null;

    return spotsArray
    .sort((a, b) => b.id - a.id)
    .map((spot) => (
        <div 
        key={spot.id} 
        value={toolTip}
        onMouseOut={()=>setToolTip(null)}
        onMouseOver={()=>setToolTip(spot.id)}
        className="spotlist_small_container">
            <Link
          key={spot.id}
          to={`/spots/${spot.id}`}
          className="spotlist_small_container_link"
        >
            <img src={spot.previewImage} alt={spot.name} />

                <div className="spotlist_desc">
                <div className='spotlist_preview'>
                <div>{spot.city}, {spot.state}</div>
                <div>⭐️ {spot.avgRating && spot.avgRating !== "No rating yet." ? spot.avgRating : "New"}</div>
                </div>
                <span className='spotlist_preview_price'>${spot.price}</span><span> night</span>
                </div>

                {toolTip === spot.id? <h4>{spot.name}</h4> : <h3 className="no-show">holding place</h3>}
                
            </Link>
        </div>
        
    ))
}

export default SpotList;

