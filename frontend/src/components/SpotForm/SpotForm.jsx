import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpot } from '../../store/spot';
import './SpotForm.css'

const SpotForm = ({ spot, formType }) => {
  const navigate = useNavigate();
  const [country, setCountry] = useState(spot?.country);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [lat, setLat] = useState(spot?.lat);
  const [lng, setLng] = useState(spot?.lng);
  const [description, setDescription] = useState(spot?.description);
  const [name, setName] = useState(spot?.name);
  const [price, setPrice] = useState(spot?.price);
  const [image1, setImage1] = useState(spot?.image1);
  const [image2, setImage2] = useState(spot?.image2);
  const [image3, setImage3] = useState(spot?.image3);
  const [image4, setImage4] = useState(spot?.image4);
  const [image5, setImage5] = useState(spot?.image5);
  // const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

//   useEffect(() => {
//     const newErrors = {};
//     if (!country) newErrors.country = 'Country is required';
//     if (!address) newErrors.address = 'Street Address is required';
//     if (!city) newErrors.city = 'City is required';
//     if (!state) newErrors.state = 'State is required';
//     if (!description || description.length < 30)
//         newErrors.description = 'Description needs 30 or more characters';
//     if (!name) newErrors.title = 'Title is required';
//     if (!price) newErrors.price = 'Price per night is required';
//     if (!image1) newErrors.image1 = 'Preview Image URL is required';

//     setErrors(newErrors);
//     const isValid = Object.keys(newErrors).length === 0;
//     setFormIsValid(isValid);
//     }, [country, address, city, state, lat, lng, description, name, price, image1]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setErrors({})
    spot = { ...spot, country, address, city, state, lat, lng, description, name, price};

//   if (formType === 'Update your Spot') {
//     const editedSpot = await dispatch(updateSpot(spot));
//     spot = editedSpot;
//   } else 

    if (formType === 'Create a New Spot') {
        const newSpot = await dispatch(createSpot(spot));
        console.log("newSpot in component", newSpot);
        spot = newSpot;

        // if (spot.errors) {
        //     setErrors(spot.errors);
        //     console.log("errors", spot.errors);
        // } else {
            navigate(`/spots/${spot.id}`);
        // }
    }
};

  return (
    <div className='spot_form'>
    <form  onSubmit={handleSubmit}>
      <h1>{formType}</h1>
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
        {formType === "Create a New Spot"? "Create Spot": "Update Spot"}
      </button>
    </form>
    </div>
    
  );
};

export default SpotForm;