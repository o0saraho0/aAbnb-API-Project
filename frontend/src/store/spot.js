import { csrfFetch } from "./csrf";

const LOAD_SPOT = "spot/LOAD_SPOT";
const LOAD_ONE_SPOT = "spot/LOAD_ONE_SPOT";
const CREATE_SPOT = "spot/CREATE_SPOT";
const DELETE_SPOT = "spot/DELETE_SPOT";

const CREATE_IMAGE = "image/CREATE_IMAGE";

const loadSpot = (spots) => {
  return {
    type: LOAD_SPOT,
    spots,
  };
};

const loadSingleSpot = (spot) => {
  return {
    type: LOAD_ONE_SPOT,
    spot,
  };
};

const addSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot,
  };
};

const removeSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

const createImage = (spot) => {
  return {
    type: CREATE_IMAGE,
    payload: spot,
  };
};

export const loadAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");
  if (response.ok) {
    const spots = await response.json();
    dispatch(loadSpot(spots.Spots));
    return spots;
  } else {
    const error = await response.json();
    return error;
  }
};

export const loadOneSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(loadSingleSpot(spot));
    return spot;
  } else {
    const error = await response.json();
    return error;
  }
};

export const loadCurrentSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");
  if (response.ok) {
    const spots = await response.json();
    dispatch(loadSpot(spots.Spots));
    return spots.Spots;
  } else {
    const error = await response.json();
    return error;
  }
};

export const createSpot = (spot) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });
  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    dispatch(loadAllSpots());
    return newSpot;
  } else {
    const error = await response.json();
    return error.errors;
  }
};

export const editSpot = (spot) => async (dispatch) => {
  // console.log("spot in store", spot);
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spot),
  });
  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(addSpot(updatedSpot));
    // console.log("updated? -->", updatedSpot);
    return updatedSpot;
  } else {
    const error = await response.json();
    return { errors: error.errors };
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeSpot(spotId));
    return { message: "Successfully deleted" };
  } else {
    const error = await response.json();
    return error;
  }
};

// Add Image Thunk
export const addImage = (image) => async (dispatch) => {
  // console.log("image in store", image);
  const { spotId, url, preview } = image;
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, preview }),
  });
  if (response.ok) {
    const newImage = await response.json();
    // console.log("newImage in store", newImage);
    dispatch(createImage(newImage));
    return newImage;
  } else {
    const error = await response.json();
    // console.log("error--->", error);
    return error;
  }
};

const initialState = {};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOT: {
      const newState = { ...state };
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case LOAD_ONE_SPOT: {
      const newState = { ...state };
      newState[action.spot.id] = action.spot;
      return newState;
    }
    case CREATE_SPOT: {
      const newState = { ...state };
      newState[action.spot.id] = action.spot;
      return newState;
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }
    case CREATE_IMAGE: {
      // console.log("in the reducer", newState);
      return { ...state, [action.payload.id]: action.image };
    }

    //  Shanda's:
    //  ADD_SPOTIMAGES: {
    //   const newState = { ...state };
    //   const { spotId, url, preview } = action.payload;
    //   if (spotId && newState.spots[spotId]) {
    //     newState.spots[spotId].SpotImages = [
    //       ...(newState.spots[spotId].SpotImages || []),
    //       { url, preview },
    //     ];
    //   }
    // return newState;
    // }

    default:
      return state;
  }
};

export default spotsReducer;
