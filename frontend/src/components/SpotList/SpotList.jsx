import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllSpots } from "../../store/spot";

const SpotList = () => {
    const dispatch = useDispatch();
    
    const spots = useSelector((state) => state.spots);
    const spotsArray = Object.values(spots);

    console.log("spots in component", spotsArray);

    useEffect(() => {
        dispatch(loadAllSpots());
    }, [dispatch]);

    if (!spots) return null;

    return spotsArray.map((spot) => (
        <div key={spot.id} className="spotlist_container">
            <img src={spot.previewImage} alt={spot.name} />
            <div className="spotlist_preview">
                <h4>{spot.name}</h4>
                <p>⭐️ {spot.avgRating}</p>
                <p>{spot.city}, {spot.state}</p>
                <p>${spot.price}</p>
            </div>
           
        </div>
    ))
}

export default SpotList;

