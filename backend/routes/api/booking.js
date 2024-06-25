const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      { model: Spot, attributes: { exclude: ["createdAt", "updatedAt"] } },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });
  return res.status(200).json({ Reviews: reviews });
});

module.exports = router;
