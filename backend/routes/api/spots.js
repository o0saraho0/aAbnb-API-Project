const express = require("express");
const bcrypt = require("bcryptjs");
const { formatTime, formatDate } = require("../../utils/date");

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
const { Op } = require("sequelize");
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

const validateBooking = [
  check("startDate").custom((value, { req }) => {
    const startDate = new Date(value);
    const now = new Date();
    if (startDate < now) {
      throw new Error("startDate cannot be in the past");
    }
    return true;
  }),
  check("endDate").custom((value, { req }) => {
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(value);
    if (endDate <= startDate) {
      throw new Error("endDate cannot be on or before startDate");
    }
    return true;
  }),
  handleValidationErrors,
];

const validateQuery = [
  check("page")
    .isInt({ min: 1, max: 10 })
    .optional()
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .isInt({ min: 1, max: 20 })
    .optional()
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .isFloat({ min: -90, max: 90 })
    .optional()
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .isFloat({ min: -90, max: 90 })
    .optional()
    .withMessage("Minimum latitude is invalid"),
  check("maxLng")
    .isFloat({ min: -180, max: 180 })
    .optional()
    .withMessage("Maximum longitude is invalid"),
  check("minLng")
    .isFloat({ min: -180, max: 180 })
    .optional()
    .withMessage("Minimum longitude is invalid"),
  check("maxPrice")
    .isFloat({ min: 0 })
    .optional()
    .withMessage("Maximum price must be greater than or equal to 0"),
  check("minPrice")
    .isFloat({ min: 0 })
    .optional()
    .withMessage("Minimum price must be greater than or equal to 0"),
  handleValidationErrors,
];

const router = express.Router();

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
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "profilePic"],
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });
  reviews.forEach((review) => {
    review.dataValues.createdAt = formatTime(review.dataValues.createdAt);
    review.dataValues.updatedAt = formatTime(review.dataValues.updatedAt);
  });
  return res.status(200).json({ Reviews: reviews });
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
    newReview.dataValues.createdAt = formatTime(newReview.dataValues.createdAt);
    newReview.dataValues.updatedAt = formatTime(newReview.dataValues.updatedAt);
    return res.status(201).json(newReview);
  }
);

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
    bookings.forEach((booking) => {
      booking.dataValues.startDate = formatDate(booking.dataValues.startDate);
      booking.dataValues.endDate = formatDate(booking.dataValues.endDate);
    });
    return res.status(200).json({ Bookings: bookings });
  } else {
    const bookings = await Booking.findAll({
      where: { spotId: spot.id },
      include: [{ model: User, attributes: ["id", "firstName", "lastName"] }],
    });
    bookings.forEach((booking) => {
      booking.dataValues.startDate = formatDate(booking.dataValues.startDate);
      booking.dataValues.endDate = formatDate(booking.dataValues.endDate);
      booking.dataValues.createdAt = formatTime(booking.dataValues.createdAt);
      booking.dataValues.updatedAt = formatTime(booking.dataValues.updatedAt);
    });
    return res.status(200).json({ Bookings: bookings });
  }
});

// Create a Booking from a Spot based on the Spot's id
router.post(
  "/:spotId/bookings",
  requireAuth,
  validateBooking,
  async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const { startDate, endDate } = req.body;
    const { user } = req;

    if (spot.ownerId === user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const conflictingBookings = await Booking.findAll({
      where: {
        spotId: spot.id,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } },
            ],
          },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    const newBooking = await Booking.create({
      spotId: spot.id,
      userId: user.id,
      startDate,
      endDate,
    });

    newBooking.dataValues.startDate = formatDate(
      newBooking.dataValues.startDate
    );
    newBooking.dataValues.endDate = formatDate(newBooking.dataValues.endDate);
    newBooking.dataValues.createdAt = formatTime(
      newBooking.dataValues.createdAt
    );
    newBooking.dataValues.updatedAt = formatTime(
      newBooking.dataValues.updatedAt
    );

    return res.status(200).json(newBooking);
  }
);

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
      createdAt: formatTime(spot.createdAt),
      updatedAt: formatTime(spot.updatedAt),
      avgRating: +parseFloat(spotJson.avgRating) || "No rating yet.",
      previewImage:
        spotJson.SpotImages.length > 0
          ? spotJson.SpotImages[0].url
          : "No preview image yet.",
    };
  });

  return res.status(200).json({ Spots: spotsWithDetails });
});

// Get all Spots Owned by Host
router.get("/host/:userId", async (req, res) => {
  const { userId } = req.params;
  const spots = await Spot.findAll({
    where: { ownerId: userId },
    attributes: {
      include: [
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "profilePic"],
        as: "Owner",
      },
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
    subQuery: false,
  });

  const spotsWithDetails = spots.map((spot) => {
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      name: spot.name,
      price: spot.price,
      avgRating: spot.dataValues.avgRating
        ? parseFloat(spot.dataValues.avgRating).toFixed(1)
        : "No rating yet.",
      previewImage: spot.SpotImages.length
        ? spot.SpotImages[0].url
        : "No preview image yet.",
      owner: {
        id: spot.Owner.id,
        firstName: spot.Owner.firstName,
        lastName: spot.Owner.lastName,
        profilePic: spot.Owner.profilePic,
      },
    };
  });

  return res.status(200).json({
    Spots: spotsWithDetails,
  });
});

// Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      { model: SpotImage },
      {
        model: User,
        attributes: ["id", "firstName", "lastName", "profilePic"],
        as: "Owner",
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const reviews = await Review.findAll({
    where: { spotId: req.params.spotId },
  });
  spot.dataValues.numReviews = reviews.length;
  spot.dataValues.createdAt = formatTime(spot.dataValues.createdAt);
  spot.dataValues.updatedAt = formatTime(spot.dataValues.updatedAt);

  return res.status(200).json(spot);
});

// Get all Spots
router.get("/", validateQuery, async (req, res) => {
  const {
    page = 1,
    size = 100,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
  } = req.query;
  const limit = parseInt(size);
  const offset = limit * (page - 1);

  const where = {};
  if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
  if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
  if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
  if (maxPrice)
    where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

  const spots = await Spot.findAll({
    where,
    limit,
    offset,
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
    subQuery: false,
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
      category: spot.category,
      description: spot.description,
      price: spot.price,
      createdAt: formatTime(spot.createdAt),
      updatedAt: formatTime(spot.updatedAt),
      avgRating: spot.dataValues.avgRating
        ? parseFloat(spot.dataValues.avgRating).toFixed(1)
        : "No rating yet.",
      previewImage: spot.SpotImages.length
        ? spot.SpotImages[0].url
        : "No preview image yet.",
    };
  });

  return res.status(200).json({
    Spots: spotsWithDetails,
    page: parseInt(page),
    size: parseInt(size),
  });
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
  newSpot.dataValues.createdAt = formatTime(newSpot.dataValues.createdAt);
  newSpot.dataValues.updatedAt = formatTime(newSpot.dataValues.updatedAt);

  return res.status(201).json(newSpot);
});

// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const { user } = req;
  if (spot.ownerId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
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

  const { user } = req;
  if (spot.ownerId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
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
  spot.dataValues.createdAt = formatTime(spot.dataValues.createdAt);
  spot.dataValues.updatedAt = formatTime(spot.dataValues.updatedAt);

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

  const { user } = req;
  if (spot.ownerId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  await spot.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
