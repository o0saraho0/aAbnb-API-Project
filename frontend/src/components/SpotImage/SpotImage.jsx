import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadOneSpot } from "../../store/spot";
import './SpotImage.css'

const SpotImage = ({spotId}) => {
    const dispatch = useDispatch();
    
    const spot = useSelector((state) => state.spots[spotId]);

    useEffect(() => {
        dispatch(loadOneSpot(spotId));
    }, [dispatch, spotId]);

    if (!spot || !spot.SpotImages) return null;

    return (
        <div className="spotdetail_image_container">
            <div className="large_image image">
                <img src={spot.SpotImages[0].url} alt={spot.name} />
            </div>
            {spot.SpotImages.slice(1, 5).map((image) => (
                <div className="small_image image" key={image.id}>
                    <img src={image.url} alt={image.id} />
                </div>
            ))}

        </div>
       
    )

}

export default SpotImage;