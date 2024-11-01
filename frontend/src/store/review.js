import { csrfFetch } from "./csrf";

const LOAD_ALL_REVIEWS = "spot/LOAD_ALL_REVIEWS";
const LOAD_USER_REVIEWS = "spot/LOAD_USER_REVIEWS";
const CREATE_REVIEW = "spot/CREATE_REVIEW";
const DELETE_REVIEW = "spot/DELETE_REVIEW";

const loadSpotReviews = ({ spotId, reviews }) => {
  return {
    type: LOAD_ALL_REVIEWS,
    reviews: { spotId, reviews },
  };
};

const loadUserReviews = ({ userId, reviews }) => {
  return {
    type: LOAD_USER_REVIEWS,
    reviews: { userId, reviews },
  };
};

const addReview = (review) => {
  return {
    type: CREATE_REVIEW,
    review,
  };
};

const removeReview = (reviewId, spotId) => {
  return {
    type: DELETE_REVIEW,
    reviewId,
    spotId,
  };
};

export const getSpotReviews = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadSpotReviews({ spotId, reviews }));
    return reviews;
  } else {
    const error = await response.json();
    return error;
  }
};

export const getUserReviews = (userId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/current`);
  if (response.ok) {
    const reviews = await response.json();
    dispatch(loadUserReviews({ userId, reviews }));
    return reviews;
  } else {
    const error = await response.json();
    return error;
  }
};

export const createReview = (review, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  if (response.ok) {
    const newReview = await response.json();
    dispatch(addReview(newReview));
    return newReview;
  } else {
    const error = await response.json();
    return error;
  }
};

export const deleteReview = (reviewId, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeReview(reviewId, spotId));
    return { message: "Successfully deleted" };
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
    case LOAD_USER_REVIEWS: {
      const { userId, reviews } = action.reviews;
      return {
        ...state,
        [userId]: reviews,
      };
    }
    case CREATE_REVIEW: {
      const review = action.review;
      const spotId = review.spotId;
      const spotReviews = state[spotId] ? state[spotId].Reviews : [];
      return {
        ...state,
        [spotId]: {
          ...state[spotId],
          Reviews: [...spotReviews, review],
        },
      };
    }
    case DELETE_REVIEW: {
      const { reviewId, spotId } = action;
      return {
        ...state,
        [spotId]: {
          ...state[spotId],
          Reviews: state[spotId].Reviews.filter(
            (review) => review.id !== reviewId
          ),
        },
      };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
