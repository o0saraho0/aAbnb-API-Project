import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadCurrentSpots, deleteSpot } from "../../store/spot";
import { useModal } from "../../context/Modal";
import ConfirmDeleteModal from "../ConfirmDeletionModal";
import { FaStar } from "react-icons/fa";
import "./SpotList.css";

const SpotManage = () => {
  const { setModalContent, closeModal } = useModal();

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots);
  const spotsArray = Object.values(spots);
  const filteredSpots = spotsArray.filter(
    (spot) => spot?.ownerId === currentUser?.id
  );

  useEffect(() => {
    dispatch(loadCurrentSpots());
  }, [dispatch]);

  if (!spots) return null;

  const handleDeleteClick = (spotId) => {
    setModalContent(
      <ConfirmDeleteModal
        onDelete={() => handleDeleteConfirm(spotId)}
        onClose={closeModal}
        message="Are you sure you want to remove this spot?"
        type="Spot"
      />
    );
  };

  const handleDeleteConfirm = async (spotId) => {
    await dispatch(deleteSpot(spotId));
    closeModal();
  };

  return (
    <div className="current_spotlist_container host-container">
      <div className="host-profile">
        <img src={currentUser.profilePic} alt="user-profile" />
        <h1>Hello, {currentUser.firstName}</h1>
      </div>
      <div className="listing-section">
        <div className="manage-header">
          <h1>Your listings</h1>
          <button>
            <Link to={"/spots/new"}>Create a New Listing</Link>
          </button>
        </div>

        <div className="current_image_container">
          {filteredSpots
            .sort((a, b) => b.id - a.id)
            .map((spot) => (
              <div key={spot.id} className="spotlist_small_container">
                <Link
                  key={spot.id}
                  to={`/spots/${spot.id}`}
                  className="spotlist_small_container_link"
                >
                  <div className="spot_small_container_img">
                    <img src={spot.previewImage} alt={spot.name} />
                  </div>
                </Link>

                <div className="manage_spot_info">
                  <p>{spot.name}</p>
                  <div className="manage_spot_place">
                    <span>
                      {spot.city}, {spot.state}
                    </span>
                    <span>
                      <FaStar />{" "}
                      {spot.avgRating && spot.avgRating !== "No rating yet."
                        ? spot.avgRating
                        : "New"}
                    </span>
                  </div>
                  <div className="manage-spot-price">
                    <span className="spotlist_preview_price">
                      ${spot.price}
                    </span>
                    <span> night</span>
                  </div>
                </div>

                <div className="current_spotlist_buttons">
                  <button>
                    <Link to={`/spots/${spot.id}/edit`}>Update</Link>
                  </button>
                  <button onClick={() => handleDeleteClick(spot.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SpotManage;
