const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { formatTime, formatDate } = require("../../utils/date");

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const router = express.Router();

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const reviews = await Review.findAll({
    where: { userId: user.id },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: Spot,
        attributes: { exclude: ["description", "createdAt", "updatedAt"] },
        include: [
          {
            model: SpotImage,
            attributes: ["url"],
            where: { preview: true },
            required: false,
            limit: 1,
          },
        ],
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });
  const reviewsWithDetails = reviews.map((review) => {
    const reviewJson = review.toJSON();
    const previewImage =
      reviewJson.Spot.SpotImages.length > 0
        ? reviewJson.Spot.SpotImages[0].url
        : "No preview image yet.";
    const reviewImages =
        reviewJson.ReviewImages.length > 0
          ? reviewJson.ReviewImages.map(image => ({ id: image.id, url: image.url }))
          : "No review image yet.";

    return {
      id: reviewJson.id,
      userId: reviewJson.userId,
      spotId: reviewJson.spotId,
      review: reviewJson.review,
      stars: reviewJson.stars,
      createdAt: formatTime(reviewJson.createdAt),
      updatedAt: formatTime(reviewJson.updatedAt),
      User: reviewJson.User,
      Spot: {
        id: reviewJson.Spot.id,
        ownerId: reviewJson.Spot.ownerId,
        address: reviewJson.Spot.address,
        city: reviewJson.Spot.city,
        state: reviewJson.Spot.state,
        country: reviewJson.Spot.country,
        lat: reviewJson.Spot.lat,
        lng: reviewJson.Spot.lng,
        name: reviewJson.Spot.name,
        price: reviewJson.Spot.price,
        previewImage: previewImage,
      },
      ReviewImages: reviewImages,
    };
  });
  return res.status(200).json({ Reviews: reviewsWithDetails });
});

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  const { user } = req;
  if (review.userId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const imageCount = await ReviewImage.count({
    where: { reviewId: req.params.reviewId },
  });
  if (imageCount >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  const image = await review.createReviewImage(req.body);
  const response = {
    id: image.id,
    url: image.url,
  };
  return res.status(200).json(response);
});

// Edit a Review
router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
  const reviewToUpdate = await Review.findByPk(req.params.reviewId);
  if (!reviewToUpdate) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  const { user } = req;
  if (reviewToUpdate.userId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const { review, stars } = req.body;
  if (review !== undefined) reviewToUpdate.review = review;
  if (stars !== undefined) reviewToUpdate.stars = stars;

  await reviewToUpdate.save({
    fields: ["review", "stars", "updatedAt"],
  });
  reviewToUpdate.dataValues.createdAt = formatTime(
    reviewToUpdate.dataValues.createdAt
  );
  reviewToUpdate.dataValues.updatedAt = formatTime(
    reviewToUpdate.dataValues.updatedAt
  );
  return res.status(200).json(reviewToUpdate);
});

// Delete a Review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  const { user } = req;
  if (review.userId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await review.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
