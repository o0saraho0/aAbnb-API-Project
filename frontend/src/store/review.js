// import { csrfFetch } from "./csrf";

const LOAD_ALL_REVIEWS = "spot/LOAD_ALL_REVIEWS";
// const CREATE_REVIEW = "spot/CREATE_REVIEW";
// const DELETE_REVIEW = "spot/DELETE_REVIEW";

const loadSpotReviews = ({ spotId, reviews }) => {
  return {
    type: LOAD_ALL_REVIEWS,
    reviews: { spotId, reviews },
  };
};

// const loadUserReviews = (reviews) => {
//   return {
//     type: LOAD_ALL_REVIEWS,
//     reviews,
//   };
// };

// const addReview = (review) => {
//   return {
//     type: CREATE_REVIEW,
//     review,
//   };
// };

// const removeReview = (reviewId) => {
//   return {
//     type: DELETE_REVIEW,
//     reviewId,
//   };
// };

export const getSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadSpotReviews({ spotId, reviews }));
    // console.log("review in store", { spotId, reviews });
    return reviews;
  } else {
    const error = await response.json();
    return error;
  }
};

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ALL_REVIEWS: {
      const { spotId, reviews } = action.reviews;
      return {
        ...state,
        [spotId]: reviews,
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
