import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { editSpot, createSpot } from '../../store/spot';
import './SpotForm.css';

const SpotForm = ({ spot, formType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [image5, setImage5] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (spot) {
      setCountry(spot.country || '');
      setAddress(spot.address || '');
      setCity(spot.city || '');
      setState(spot.state || '');
      setLat(spot.lat || '');
      setLng(spot.lng || '');
      setDescription(spot.description || '');
      setName(spot.name || '');
      setPrice(spot.price || '');
      setImage1(spot.image1 || '');
      setImage2(spot.image2 || '');
      setImage3(spot.image3 || '');
      setImage4(spot.image4 || '');
      setImage5(spot.image5 || '');
    }
  }, [spot]);

  const validateForm = () => {
    let error = {};
    if (!country) error.country = "Country is required";
    if (!address) error.streetaddress = "Street address is required";
    if (!city) error.city = "City is required";
    if (!state) error.state = "State is required";
    if (lat > 90 || lat < -90)
      error.lat = "Latitude must be within -90 and 90";
    if (lng > 180 || lng < -180)
      error.lng = "Longitude must be within -180 and 180";
    if (!description || description.length < 30)
      error.description = "Description needs 30 or more characters";
    if (!price) error.price = "Price is required";
    if (!name) error.name = "Name is required";
    if (!image1) error.previewurl = "Preview image is required.";
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.values(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setErrors({});
    const spotData = {
      ...spot,
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      image1,
      image2,
      image3,
      image4,
      image5,
    };

    let newSpot;
    if (formType === 'Update Your Spot') {
      newSpot = await dispatch(editSpot(spotData));
    } else if (formType === 'Create a New Spot') {
      newSpot = await dispatch(createSpot(spotData));
    }

    if (newSpot.errors) {
      setErrors(newSpot.errors);
    } else {
      navigate(`/spots/${newSpot.id}`);
    }
  };

  return (
    <div className='spot_form'>
    <form  onSubmit={handleSubmit}>
      <h1>{formType}</h1>
      <div className="error_message">
          {Object.values(errors).map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      
      <div className='spot_location'>
      <h2>Where&apos;s your place located?</h2>
      <p>Guests will only get your exact address once they booked a reservation.</p>
      <label>
        Country
        <input
          value={country}
          placeholder='Country'
          onChange={(e) => setCountry(e.target.value)}
        />
      </label>
      <label>
        Street Address
        <input
          value={address}
          placeholder='Address'
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>

      <div className='city_state'>
      <label>
        City
        <input
          value={city}
          placeholder='City'
          onChange={(e) => setCity(e.target.value)}
        />
      </label>
      <label>
        State
        <input
          value={state}
          placeholder='State'
          onChange={(e) => setState(e.target.value)}
        />
      </label>
      </div>
      
      <div className='lat_lng'>
      <label>
        Latitude
        <input
          value={lat}
          placeholder='Latitude'
          onChange={(e) => setLat(e.target.value)}
        />
      </label>
      <label>
        Longitude
        <input
          value={lng}
          placeholder='Longitude'
          onChange={(e) => setLng(e.target.value)}
        />
      </label>
      </div>
      
      </div>

      <div className='sopt_detailed_description'>
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
      <label>
        <textarea
          value={description}
          placeholder='Please write at least 30 characters'
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      </div>

      <div className='sopt_name'>
      <h2>Create a title for your spot</h2>
      <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
      <label>
        <input
          value={name}
          placeholder='Name of your spot'
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      </div>

      <div className='spot_price'>
      <h2>Set a base price for your spot</h2>
      <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
      <label>
        <input
          value={price}
          placeholder='Price per night (USD)'
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      </div>

      <div className='spotImage_links'>
      <h2>Liven up your spot with photos</h2>
      <p>Submit a link to at least one photo to publish your spot.</p>
      <label>
        <input
          value={image1}
          placeholder='Preview Image URL'
          onChange={(e) => setImage1(e.target.value)}
        />
         <input
          value={image2}
          placeholder='Image URL'
          onChange={(e) => setImage2(e.target.value)}
        />
         <input
          value={image3}
          placeholder='Image URL'
          onChange={(e) => setImage3(e.target.value)}
        />
         <input
          value={image4}
          placeholder='Image URL'
          onChange={(e) => setImage4(e.target.value)}
        />
         <input
          value={image5}
          placeholder='Image URL'
          onChange={(e) => setImage5(e.target.value)}
        />
      </label>
      </div>
      
      <button 
      type="submit">
        {formType === "Create a New Spot"? "Create Spot": "Update Your Spot"}
      </button>
    </form>
    </div>
    
  );
};

export default SpotForm;