"use strict";

const { SpotImage } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spotImageData = [
  { spotId: 1, url: "images/treehouse1.jpg", preview: true },
  { spotId: 1, url: "images/treehouse2.jpg", preview: true },
  { spotId: 2, url: "images/treehouse3.jpg", preview: true },
  { spotId: 3, url: "images/treehouse4.jpg", preview: false },
  { spotId: 4, url: "images/beachhouse10.jpg", preview: true },
  { spotId: 4, url: "images/beachhouse9.jpg", preview: true },
  { spotId: 5, url: "images/beachhouse8.jpg", preview: true },
  { spotId: 6, url: "images/beachhouse7.jpg", preview: false },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImageData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImage";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, spotImageData, {});
  },
};
