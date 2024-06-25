const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { ReviewImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

module.exports = router;

// Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const reviewImage = await ReviewImage.findByPk(req.params.imageId);
  if (!reviewImage) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
    });
  }
  await reviewImage.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
