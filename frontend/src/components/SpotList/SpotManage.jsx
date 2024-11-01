import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadCurrentSpots, deleteSpot } from "../../store/spot";
import { getUserReviews } from "../../store/review";
import { useModal } from "../../context/Modal";
import ConfirmDeleteModal from "../ConfirmDeletionModal";
import { FaStar } from "react-icons/fa";
import { FaHouseChimney } from "react-icons/fa6";
import { MdRateReview } from "react-icons/md";

import "./SpotList.css";

const SpotManage = () => {
  const { setModalContent, closeModal } = useModal();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("listings");

  const currentUser = useSelector((state) => state.session.user);
  const spots = useSelector((state) => state.spots);
  const spotsArray = Object.values(spots);
  const filteredSpots = spotsArray.filter(
    (spot) => spot?.ownerId === currentUser?.id
  );
  const reviews = useSelector(
    (state) => (state.reviews[currentUser?.id] || []).Reviews
  );

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(loadCurrentSpots());
      dispatch(getUserReviews(currentUser.id));
    }
  }, [dispatch, currentUser]);

  if (!spots) return null;
  if (!reviews) return null;

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

      <div className="listing-section ">
        <div className="tab-container">
          <div
            className="category-choice"
            onClick={() => setActiveTab("listings")}
          >
            <FaHouseChimney />
            Your listings
          </div>
          <div
            className="category-choice"
            onClick={() => setActiveTab("reviews")}
          >
            <MdRateReview />
            Reviews you posted
          </div>
        </div>

        <div>
          {activeTab === "listings" && (
            <div>
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
                            {spot.avgRating &&
                            spot.avgRating !== "No rating yet."
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
          )}
        </div>

        {activeTab === "reviews" && (
          <div>
            <div className="manage-header"></div>
            <h1>Reviews you posted</h1>
            <div>
              <div className="current_image_container">
                {reviews.map((review) => (
                  <div key={review.id} className="review-manage">
                    <Link to={`/spots/${review.Spot.id}`}>
                      <img src={review.Spot.previewImage} alt="spot-preview" />
                    </Link>
                    <p className="review-manage-name">{review.Spot.name}</p>
                    <p className="review-manage-time">
                      {review.updatedAt.slice(0, 10)}
                    </p>

                    <p>{review.review}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotManage;
