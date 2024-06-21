"use strict";

const { Booking } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const bookingData = [
  { spotId: 1, userId: 6, startDate: "2024-12-20", endDate: "2024-12-26" },
  { spotId: 2, userId: 7, startDate: "2025-01-20", endDate: "2025-01-26" },
  { spotId: 3, userId: 8, startDate: "2024-12-01", endDate: "2024-12-07" },
  { spotId: 4, userId: 9, startDate: "2024-12-20", endDate: "2024-12-26" },
  { spotId: 4, userId: 10, startDate: "2025-01-20", endDate: "2025-01-26" },
  { spotId: 5, userId: 10, startDate: "2024-10-01", endDate: "2024-10-05" },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(bookingData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, bookingData, {});
  },
};
