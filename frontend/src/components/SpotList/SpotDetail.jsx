import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { loadOneSpot } from "../../store/spot";
import { getSpotReviews } from "../../store/review";
import SpotImage from "../SpotImage";
import ReviewList from "../ReviewList/ReviewList";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./SpotDetail.css";

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spot = useSelector((state) => state.spots[spotId]);
  const reviews = useSelector((state) => state.reviews[spotId]);
  const hasReviews = reviews && reviews.Reviews.length > 0;
  const totalStars = hasReviews
    ? reviews.Reviews.reduce((sum, review) => sum + review.stars, 0)
    : 0;
  const averageRating = hasReviews
    ? (totalStars / reviews.Reviews.length).toFixed(1)
    : null;

  useEffect(() => {
    dispatch(loadOneSpot(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  if (!spot || !spot.Owner) return null;

  const handleOwnerClick = () => {
    navigate(`/spots/host/${spot.Owner.id}`);
  };

  const handleReservation = () => {
    alert("Feature coming soon");
  };

  // Fix for missing marker icons in Leaflet (optional if not visible by default)
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });

  return (
    <div className="spotdetail_container">
      <h1>{spot.name}</h1>

      <SpotImage spotId={spotId} />
      <div className="spotdetail_small_container">
        <div className="spotdetail_description">
          <h3>
            {spot.city}, {spot.state}
          </h3>
          <div className="owner_container" onClick={handleOwnerClick}>
            <img src={spot.Owner.profilePic} alt="profile" />
            <p>
              Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
            </p>
          </div>

          <p>{spot.description}</p>
        </div>
        <div className="reservation_container">
          <div className="price_container">
            <span id="spot_price">${spot.price}</span>
            <span>night</span>
          </div>

          <div className="reservation_rating">
            ⭐️{" "}
            {!averageRating ? (
              "New"
            ) : (
              <>
                {averageRating} · {reviews?.Reviews?.length}{" "}
                {reviews?.Reviews?.length === 1 ? "Review" : "Reviews"}
              </>
            )}
          </div>

          <div className="booking">
            <div className="checkin">
              <label>CHECK-IN</label>
              <input type="date" className="booking_input" />
            </div>
            <div className="checkout">
              <label>CHECKOUT</label>
              <input type="date" className="booking_input" />
            </div>
          </div>
          <button onClick={handleReservation}>Reserve</button>
        </div>
      </div>
      <ReviewList spotId={spotId} />

      <div className="map_container">
        <h2>Where you&apos;ll be</h2>
        <p>
          {spot.city}, {spot.state}, {spot.country}
        </p>
        <MapContainer
          className="map"
          center={[spot.lat, spot.lng]}
          zoom={13}
          style={{
            height: "450px",
            width: "100%",
            borderRadius: "10px",
            overflow: "hidden",
            zIndex: "0",
          }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[spot.lat, spot.lng]}>
            <Popup>{spot.name}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default SpotDetail;
