const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, Review, SpotImage } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .isDecimal({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .isDecimal({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isDecimal({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

const router = express.Router();

// Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: { model: SpotImage },
  });
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  return res.status(200).json(spot);
});

// Get all Spots owned by the Current User
router.get("/current", async (req, res) => {
  const { user } = req;
  const spots = await user.getSpots();
  return res.status(200).json(spots);
});

// Get all Spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    include: { model: Review },
  });

  return res.status(200).json(spots);
});

// Create a Spot
router.post("/", validateSpot, async (req, res) => {
  const {
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body;
  const newSpot = Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  //   {
  //     "address": "789 RV Park Way",
  //     "city": "Phoenix",
  //     "state": "Arizona",
  //     "country": "United States of America",
  //     "lat": 33.4484,
  //     "lng": -112.0740,
  //     "name": "Desert Oasis RV Park",
  //     "description": "Spacious RV park with all amenities and a stunning desert view.",
  //     "price": 75
  //   }
  return res.status(201).json(newSpot);
});

// Edit a Spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  if (address !== undefined) spot.address = address;
  if (city !== undefined) spot.city = city;
  if (state !== undefined) spot.state = state;
  if (country !== undefined) spot.country = country;
  if (lat !== undefined) spot.lat = lat;
  if (lng !== undefined) spot.lng = lng;
  if (name !== undefined) spot.name = name;
  if (description !== undefined) spot.description = description;
  if (price !== undefined) spot.price = price;

  await spot.save();
  return res.status(200).json(spot);
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  await spot.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
