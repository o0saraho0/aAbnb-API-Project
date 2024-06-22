const express = require("express");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Review, SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSpot = [
  //   check("address")
  //     .exists({ checkFalsy: true })
  //     .withMessage("Street address is required"),
  //   check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  //   check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  //   check("country")
  //     .exists({ checkFalsy: true })
  //     .withMessage("Country is required"),
  //   check("lat")
  //     .isDecimal({ min: -90, max: 90 })
  //     .withMessage("Latitude must be within -90 and 90"),
  //   check("lng")
  //     .isDecimal({ min: -180, max: 180 })
  //     .withMessage("Longitude must be within -180 and 180"),
  //   check("name")
  //     .exists({ checkFalsy: true })
  //     .isLength({ max: 50 })
  //     .withMessage("Name must be less than 50 characters"),
  //   check("description")
  //     .exists({ checkFalsy: true })
  //     .withMessage("Description is required"),
  //   check("price")
  //     .exists({ checkFalsy: true })
  //     .isDecimal({ min: 0 })
  //     .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

const router = express.Router();

module.exports = router;
