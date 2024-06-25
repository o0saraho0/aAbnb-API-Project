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
const { Op } = require("sequelize");
const router = express.Router();

// Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const spotImage = await SpotImage.findByPk(req.params.imageId);
  if (!spotImage) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }
  await spotImage.destroy();
  return res.status(404).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
