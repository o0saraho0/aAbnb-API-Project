import SpotForm from './SpotForm';

const CreateSpot = () => {
  const spot = {};

  return (
    <SpotForm
      spot={spot}
      formType="Create a New Spot"
    />
  );
};

export default CreateSpot;
