"use strict";

const { ReviewImage } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const reviewImageData = [
  { reviewId: 1, url: "images/treehouse1_2.jpg" },
  { reviewId: 2, url: "images/treehouse2_1.jpg" },
  { reviewId: 3, url: "images/treehouse3_1.jpg" },
  { reviewId: 4, url: "images/beachhouse1.jpg" },
  { reviewId: 5, url: "images/beachhouse2.jpg" },
  { reviewId: 5, url: "images/beachhouse3.jpg" },
  { reviewId: 6, url: "images/beachhouse4.jpg" },
  { reviewId: 6, url: "images/beachhouse5.jpg" },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await ReviewImage.bulkCreate(reviewImageData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, reviewImageData, {});
  },
};
