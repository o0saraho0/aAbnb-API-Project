import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadCurrentSpots } from "../../store/spot";
import './SpotList.css'

const SpotManage = () => {
    const dispatch = useDispatch();
    
    const spots = useSelector((state) => state.spots);
    const spotsArray = Object.values(spots);

    useEffect(() => {
        dispatch(loadCurrentSpots());
    }, [dispatch]);

    if (!spots) return null;

    const handleUpdate = () => {

    }

    const handleDelete = () => {
        
    }

    return (
        <div className="current_spotlist_container">
            <h1>Manage Your Spots</h1>
            <button><Link to={"/spots/new"}>Create a New Spot</Link></button>

            <div className="current_image_container">
            {spotsArray.map((spot) => (
            <div key={spot.id} className="spotlist_small_container">
            <Link key={spot.id} to={`/spots/${spot.id}`} className="spotlist_small_container_link">
            <img src={spot.previewImage} alt={spot.name} />
                <h4>{spot.name}</h4>

                <div className='spotlist_preview'>
                <span>{spot.city}, {spot.state}</span>
                <span>⭐️ {spot.avgRating && spot.avgRating !== "No rating yet." ? spot.avgRating : "New"}</span>
                </div>
                <span className='spotlist_preview_price'>${spot.price}</span><span> night</span>

                <div className="current_spotlist_buttons">
                    <button onClick={handleUpdate}>Update</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </Link>
            </div>        
            ))}
            </div>
        </div>
)};
    
export default SpotManage;