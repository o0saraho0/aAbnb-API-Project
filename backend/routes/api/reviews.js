const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, ReviewImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

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
      { model: Spot, attributes: { exclude: ["createdAt", "updatedAt"] } },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });
  return res.status(200).json({ Reviews: reviews });
});

// Add an Image to a Review based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  const imageCount = await ReviewImage.count({
    where: { reviewId: req.params.reviewId },
  });
  if (imageCount >= 10) {
    return res.status(404).json({
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

  const { review, stars } = req.body;
  if (review !== undefined) reviewToUpdate.review = review;
  if (stars !== undefined) reviewToUpdate.stars = stars;

  await reviewToUpdate.save({
    fields: ["review", "stars", "updatedAt"],
  });
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

  await review.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
