import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadOneSpot } from "../../store/spot";
import { useModal } from "../../context/Modal";
import "./SpotImage.css";

const SpotImage = ({ spotId }) => {
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots[spotId]);
  const { setModalContent } = useModal();

  useEffect(() => {
    dispatch(loadOneSpot(spotId));
  }, [dispatch, spotId]);

  if (!spot || !spot.SpotImages) return null;

  const previewImage = spot.SpotImages.find((image) => image.preview === true);
  const smallImages = spot.SpotImages.filter(
    (image) => image.preview === false
  );

  // Modal content component to show enlarged image
  const ImageModalContent = ({ imageUrl, altText }) => (
    <div className="modal_image_content">
      <img
        src={imageUrl}
        alt={altText}
        style={{ width: "55vw", aspectRatio: "3/2", objectFit: "cover" }}
      />
    </div>
  );

  const openImageInModal = (imageUrl, altText) => {
    setModalContent(
      <ImageModalContent imageUrl={imageUrl} altText={altText} />
    );
  };

  return (
    <div className="spotdetail_image_container">
      <div
        className="large_image image"
        onClick={() => openImageInModal(previewImage.url, spot.name)}
      >
        <img src={previewImage.url} alt={spot.name} />
      </div>
      {smallImages.map((image) => (
        <div
          className="small_image image"
          key={image.id}
          onClick={() => openImageInModal(image.url, `Image ${image.id}`)}
        >
          <img src={image.url} alt={image.id} />
        </div>
      ))}
    </div>
  );
};

export default SpotImage;
