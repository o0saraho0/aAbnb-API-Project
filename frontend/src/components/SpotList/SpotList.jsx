import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadAllSpots } from "../../store/spot";
import { FaTree } from "react-icons/fa6";
import { FaUmbrellaBeach } from "react-icons/fa";
import { GiCampingTent } from "react-icons/gi";
import { FaHouse } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import "./SpotList.css";
import Loading from "../Loading/Loading";

const SpotList = () => {
  const dispatch = useDispatch();
  const [toolTip, setToolTip] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const spots = useSelector((state) => state.spots);
  const spotsArray = Object.values(spots).filter((spot) => spot !== undefined);

  useEffect(() => {
    dispatch(loadAllSpots());
  }, [dispatch]);

  const filteredSpots = selectedCategory
    ? spotsArray.filter((spot) => spot.category === selectedCategory)
    : spotsArray;

  if (!filteredSpots) return <Loading />;

  return (
    <div className="spotlist-container">
      {/* Category Filter Menu */}
      <div className="category-menu">
        <div
          className="category-choice"
          onClick={() => setSelectedCategory("")}
        >
          <FaHouse />
          <p>All Houses</p>
        </div>
        <div
          className="category-choice"
          onClick={() => setSelectedCategory("Tree Houses")}
        >
          <FaTree />
          <p>Treehouses</p>
        </div>
        <div
          className="category-choice"
          onClick={() => setSelectedCategory("Beachfront")}
        >
          <FaUmbrellaBeach />
          <p>Beachfront</p>
        </div>
        <div
          className="category-choice"
          onClick={() => setSelectedCategory("Camping")}
        >
          <GiCampingTent />
          <p>Camping</p>
        </div>
      </div>

      {/* Spots Display */}
      <div className="grid-container">
        {filteredSpots
          .sort((a, b) => b.id - a.id)
          .map((spot) => (
            <div
              key={spot?.id}
              value={toolTip}
              onMouseOut={() => setToolTip(null)}
              onMouseOver={() => setToolTip(spot.id)}
              className="spotlist_small_container"
            >
              <Link
                to={`/spots/${spot?.id}`}
                className="spotlist_small_container_link"
              >
                <div className="spot_small_container_img">
                  <img src={spot.previewImage} alt={spot.name} />
                </div>

                <div className="spotlist_desc">
                  <div className="spotlist_preview">
                    <div>
                      {spot.city}, {spot.state}
                    </div>
                    <div className="spotlist_preview_star">
                      <FaStar />
                      {spot.avgRating && spot.avgRating !== "No rating yet."
                        ? spot.avgRating
                        : "New"}
                    </div>
                  </div>
                  <span className="spotlist_preview_price">${spot.price}</span>
                  <span> night</span>
                </div>

                {toolTip === spot.id ? (
                  <h4>{spot.name}</h4>
                ) : (
                  <h3 className="no-show">holding place</h3>
                )}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SpotList;
