const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
  Sequelize,
} = require("../../db/models");
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
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .isFloat({ min: -180, max: 180 })
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
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

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

// Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;

  const spots = await Spot.findAll({
    where: { ownerId: user.id },
    attributes: {
      include: [
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
    ],
    group: ["Spot.id", "SpotImages.id"],
  });

  const spotsWithDetails = spots.map((spot) => {
    const spotJson = spot.toJSON();
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: parseFloat(spotJson.avgRating) || null,
      previewImage:
        spotJson.SpotImages.length > 0 ? spotJson.SpotImages[0].url : null,
    };
  });

  return res.status(200).json({ Spots: spotsWithDetails });
});

// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });
  return res.status(200).json({ Reviews: reviews });
});

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const { user } = req;
  const owner = await spot.getOwner();
  if (user.id !== owner.id) {
    const bookings = await Booking.findAll({
      where: { spotId: spot.id },
      attributes: ["spotId", "startDate", "endDate"],
    });
    return res.status(200).json({ Bookings: bookings });
  } else {
    const bookings = await Booking.findAll({
      where: { spotId: spot.id },
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });
    return res.status(200).json({ Bookings: bookings });
  }
});

// Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
});

// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const { user } = req;
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const previousReview = await Review.findOne({
      where: { userId: user.id, spotId: spot.id },
    });
    if (previousReview) {
      return res.status(500).json({
        message: "User already has a review for this spot",
      });
    }

    const reviewData = { userId: user.id, ...req.body };
    const newReview = await spot.createReview(reviewData);
    return res.status(201).json(newReview);
  }
);

// Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      {
        model: Review,
        attributes: ["stars"],
      },
      { model: SpotImage },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
        as: "Owner",
      },
    ],
  });
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  return res.status(200).json(spot);
});

// Get all Spots
router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
    ],
    group: ["Spot.id", "SpotImages.id"],
  });

  const spotsWithDetails = spots.map((spot) => {
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: spot.dataValues.avgRating
        ? parseFloat(spot.dataValues.avgRating).toFixed(1)
        : null,
      previewImage: spot.SpotImages.length ? spot.SpotImages[0].url : null,
    };
  });

  return res.status(200).json({ Spots: spotsWithDetails });
});

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const newSpot = await user.createSpot({
    ownerId: user.id,
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
  return res.status(201).json(newSpot);

  // {
  //   "address": "123 RV Park Way",
  //   "city": "Phoenix",
  //   "state": "Arizona",
  //   "country": "United States of America",
  //   "lat": 33.4484,
  //   "lng": -112.0740,
  //   "name": "Desert Oasis RV Park",
  //   "description": "Spacious RV park with all amenities and a stunning desert view.",
  //   "price": 75
  // }
});

// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  const newImage = await spot.createSpotImage(req.body);
  const response = {
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  };
  return res.status(200).json(response);
  // {
  //   "url": "images/treehouse5_1.jpg",
  //   "preview": true
  // }
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

  await spot.save({
    fields: [
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "updatedAt",
    ],
  });
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

// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res) => {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const { review, stars } = req.body;

    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const newReview = await Review.create({
      userId,
      spotId,
      review,
      stars,
    });
    return res.status(201).json(newReview);
  }
);

module.exports = router;
