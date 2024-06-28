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
const { formatTime, formatDate } = require("../../utils/date");

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

const router = express.Router();

// Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Spot,
        attributes: { exclude: ["createdAt", "updatedAt", "description"] },
        include: [
          {
            model: SpotImage,
            attributes: ["url"],
            where: { preview: true },
            required: false,
          },
        ],
      },
    ],
  });

  const bookingsWithDetails = bookings.map((booking) => {
    const bookingJson = booking.toJSON();
    const previewImage =
      bookingJson.Spot.SpotImages.length > 0
        ? bookingJson.Spot.SpotImages[0].url
        : "No preview image yet.";

    return {
      ...bookingJson,
      startDate: formatDate(bookingJson.startDate),
      endDate: formatDate(bookingJson.endDate),
      createdAt: formatTime(bookingJson.createdAt),
      updatedAt: formatTime(bookingJson.updatedAt),
      Spot: {
        id: bookingJson.Spot.id,
        ownerId: bookingJson.Spot.ownerId,
        address: bookingJson.Spot.address,
        city: bookingJson.Spot.city,
        state: bookingJson.Spot.state,
        country: bookingJson.Spot.country,
        lat: bookingJson.Spot.lat,
        lng: bookingJson.Spot.lng,
        name: bookingJson.Spot.name,
        price: bookingJson.Spot.price,
        previewImage: previewImage,
      },
    };
  });
  return res.status(200).json({ Bookings: bookingsWithDetails });
});

// Edit a Booking
router.put("/:bookingId", requireAuth, validateBooking, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  const { user } = req;
  if (booking.userId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const { startDate, endDate } = req.body;
  const spot = await Spot.findByPk(booking.spotId);

  if (new Date(startDate) < new Date()) {
    return res.status(403).json({
      message: "Past bookings can't be modified",
    });
  }

  const conflictingBookings = await Booking.findAll({
    where: {
      spotId: spot.id,
      id: { [Op.ne]: booking.id }, // Exclude current booking
      [Op.or]: [
        {
          startDate: { [Op.lte]: new Date(endDate) },
          endDate: { [Op.gte]: new Date(startDate) },
        },
        {
          startDate: { [Op.eq]: new Date(endDate) },
        },
        {
          endDate: { [Op.eq]: new Date(startDate) },
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

  await booking.update({
    startDate: startDate,
    endDate: endDate,
    updatedAt: new Date(),
  });

  booking.dataValues.startDate = formatDate(booking.dataValues.startDate);
  booking.dataValues.endDate = formatDate(booking.dataValues.endDate);
  booking.dataValues.createdAt = formatTime(booking.dataValues.createdAt);
  booking.dataValues.updatedAt = formatTime(booking.dataValues.updatedAt);

  return res.status(200).json(booking);
});

// Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  if (!booking) {
    return res.status(404).json({
      message: "Booking couldn't be found",
    });
  }

  const { user } = req;
  if (booking.userId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const startDate = booking.startDate;
  if (new Date(startDate) < new Date()) {
    return res.status(403).json({
      message: "Bookings that have been started can't be deleted",
    });
  }

  await booking.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router;
