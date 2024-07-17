import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loadOneSpot } from '../../store/spot';
import SpotForm from './SpotForm';


const EditSpot = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots[spotId]);

  useEffect(() => {
    dispatch(loadOneSpot(spotId))
  }, [dispatch, spotId])

  if (!spot) return null;

  return (
    Object.keys(spot).length > 1 && (
      <>
        <SpotForm
          spot={spot}
          formType="Update Your Spot"
        />
      </>
    )
  );
};

export default EditSpot;