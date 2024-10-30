import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { loadHostSpots, clearSpots } from "../../store/spot";
import { FaStar } from "react-icons/fa";
import "./SpotByHost.css";

const SpotByHost = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);
  const spotsArray = Object.values(spots).filter((spot) => spot !== undefined);

  useEffect(() => {
    dispatch(clearSpots());
    if (userId) {
      dispatch(loadHostSpots(userId));
    }
  }, [dispatch, userId]);

  if (!spots) return null;

  return (
    <div className="spotlist-container host-container">
      <div className="host-profile">
        <img src={spotsArray[0]?.owner?.profilePic} alt="profile-pic" />
        <h1>{spotsArray[0]?.owner?.firstName}</h1>
      </div>
      <div>
        <div className="host-listings">
          <h1>{spotsArray[0]?.owner?.firstName}&apos;s listings</h1>
          <div className="grid-container">
            {spotsArray.map((spot) => (
              <div key={spot.id} className="spotlist_small_container">
                <Link to={`/spots/${spot?.id}`}>
                  <img src={spot.previewImage} alt="spot-image" />
                </Link>
                <div className="manage_spot_info">
                  <p>{spot.name}</p>
                  <span>
                    {spot.city}, {spot.state}
                  </span>
                  <span className="spotlist_preview_star">
                    <FaStar />
                    {spot.avgRating && spot.avgRating !== "No rating yet."
                      ? spot.avgRating
                      : "New"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotByHost;
