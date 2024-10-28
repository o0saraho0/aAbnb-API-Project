"use strict";

const { Booking } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const bookingData = [];

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
