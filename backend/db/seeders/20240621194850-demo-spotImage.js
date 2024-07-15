"use strict";

const { SpotImage } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spotImageData = [
  {
    spotId: 1,
    url: "/images/treehouse1_1.webp",
    preview: true,
  },
  {
    spotId: 1,
    url: "/images/treehouse1_2.webp",
    preview: false,
  },
  {
    spotId: 1,
    url: "/images/treehouse1_3.webp",
    preview: false,
  },
  {
    spotId: 1,
    url: "/images/treehouse1_4.webp",
    preview: false,
  },
  {
    spotId: 1,
    url: "/images/treehouse1_5.webp",
    preview: false,
  },
  {
    spotId: 2,
    url: "/images/treehouse2_1.webp",
    preview: true,
  },
  {
    spotId: 2,
    url: "/images/treehouse2_2.webp",
    preview: false,
  },
  {
    spotId: 2,
    url: "/images/treehouse2_3.webp",
    preview: false,
  },
  {
    spotId: 2,
    url: "/images/treehouse2_4.webp",
    preview: false,
  },
  {
    spotId: 2,
    url: "/images/treehouse2_5.webp",
    preview: false,
  },
  {
    spotId: 3,
    url: "/images/treehouse1_1.webp",
    preview: true,
  },
  {
    spotId: 3,
    url: "/images/treehouse3_2.webp",
    preview: false,
  },
  {
    spotId: 3,
    url: "/images/treehouse3_3.webp",
    preview: false,
  },
  {
    spotId: 3,
    url: "/images/treehouse3_4.webp",
    preview: false,
  },
  {
    spotId: 3,
    url: "/images/treehouse3_5.webp",
    preview: false,
  },
  {
    spotId: 4,
    url: "/images/treehouse4_1.webp",
    preview: true,
  },
  {
    spotId: 4,
    url: "/images/treehouse4_2.webp",
    preview: false,
  },
  {
    spotId: 4,
    url: "/images/treehouse4_3.webp",
    preview: false,
  },
  {
    spotId: 4,
    url: "/images/treehouse4_4.webp",
    preview: false,
  },
  {
    spotId: 4,
    url: "/images/treehouse4_5.webp",
    preview: false,
  },
  {
    spotId: 5,
    url: "/images/treehouse5_1.webp",
    preview: true,
  },
  {
    spotId: 5,
    url: "/images/treehouse5_2.webp",
    preview: false,
  },
  {
    spotId: 5,
    url: "/images/treehouse5_3.webp",
    preview: false,
  },
  {
    spotId: 5,
    url: "/images/treehouse5_4.webp",
    preview: false,
  },
  {
    spotId: 5,
    url: "/images/treehouse5_5.webp",
    preview: false,
  },
  {
    spotId: 6,
    url: "/images/treehouse6_1.webp",
    preview: true,
  },
  {
    spotId: 6,
    url: "/images/treehouse6_2.webp",
    preview: false,
  },
  {
    spotId: 6,
    url: "/images/treehouse6_3.webp",
    preview: false,
  },
  {
    spotId: 6,
    url: "/images/treehouse6_4.webp",
    preview: false,
  },
  {
    spotId: 6,
    url: "/images/treehouse6_5.webp",
    preview: false,
  },
  {
    spotId: 7,
    url: "/images/treehouse7_1.webp",
    preview: true,
  },
  {
    spotId: 7,
    url: "/images/treehouse7_2.webp",
    preview: false,
  },
  {
    spotId: 7,
    url: "/images/treehouse7_3.webp",
    preview: false,
  },
  {
    spotId: 7,
    url: "/images/treehouse7_4.webp",
    preview: false,
  },
  {
    spotId: 7,
    url: "/images/treehouse7_5.webp",
    preview: false,
  },
  {
    spotId: 8,
    url: "/images/treehouse8_1.webp",
    preview: true,
  },
  {
    spotId: 8,
    url: "/images/treehouse8_2.webp",
    preview: false,
  },
  {
    spotId: 8,
    url: "/images/treehouse8_3.webp",
    preview: false,
  },
  {
    spotId: 8,
    url: "/images/treehouse8_4.webp",
    preview: false,
  },
  {
    spotId: 8,
    url: "/images/treehouse8_5.webp",
    preview: false,
  },
  {
    spotId: 9,
    url: "/images/beach1_1.webp",
    preview: true,
  },
  {
    spotId: 9,
    url: "/images/beach1_2.webp",
    preview: false,
  },
  {
    spotId: 9,
    url: "/images/beach1_3.webp",
    preview: false,
  },
  {
    spotId: 9,
    url: "/images/beach1_4.webp",
    preview: false,
  },
  {
    spotId: 9,
    url: "/images/beach1_5.webp",
    preview: false,
  },
  {
    spotId: 10,
    url: "/images/beach2_1.webp",
    preview: true,
  },
  {
    spotId: 10,
    url: "/images/beach2_2.webp",
    preview: false,
  },
  {
    spotId: 10,
    url: "/images/beach2_3.webp",
    preview: false,
  },
  {
    spotId: 10,
    url: "/images/beach2_4.webp",
    preview: false,
  },
  {
    spotId: 10,
    url: "/images/beach2_5.webp",
    preview: false,
  },
  {
    spotId: 11,
    url: "/images/beach3_1.webp",
    preview: true,
  },
  {
    spotId: 11,
    url: "/images/beach3_2.webp",
    preview: false,
  },
  {
    spotId: 11,
    url: "/images/beach3_3.webp",
    preview: false,
  },
  {
    spotId: 11,
    url: "/images/beach3_4.webp",
    preview: false,
  },
  {
    spotId: 11,
    url: "/images/beach3_5.webp",
    preview: false,
  },
  {
    spotId: 12,
    url: "/images/beach4_1.webp",
    preview: true,
  },
  {
    spotId: 12,
    url: "/images/beach4_2.webp",
    preview: false,
  },
  {
    spotId: 12,
    url: "/images/beach4_3.webp",
    preview: false,
  },
  {
    spotId: 12,
    url: "/images/beach4_4.webp",
    preview: false,
  },
  {
    spotId: 12,
    url: "/images/beach4_5.webp",
    preview: false,
  },
  {
    spotId: 13,
    url: "/images/beach5_1.webp",
    preview: true,
  },
  {
    spotId: 13,
    url: "/images/beach5_2.webp",
    preview: false,
  },
  {
    spotId: 13,
    url: "/images/beach5_3.webp",
    preview: false,
  },
  {
    spotId: 13,
    url: "/images/beach5_4.webp",
    preview: false,
  },
  {
    spotId: 13,
    url: "/images/beach5_5.webp",
    preview: false,
  },
  {
    spotId: 14,
    url: "/images/beach6_1.webp",
    preview: true,
  },
  {
    spotId: 15,
    url: "/images/beach7_1.webp",
    preview: true,
  },
  {
    spotId: 16,
    url: "/images/beach8_1.webp",
    preview: true,
  },
  {
    spotId: 17,
    url: "/images/camp1_1.webp",
    preview: true,
  },
  {
    spotId: 18,
    url: "/images/camp2_1.webp",
    preview: true,
  },
  {
    spotId: 19,
    url: "/images/camp3_1.webp",
    preview: true,
  },
  {
    spotId: 20,
    url: "/images/camp4_1.webp",
    preview: true,
  },
  {
    spotId: 21,
    url: "/images/camp5_1.webp",
    preview: true,
  },
  {
    spotId: 22,
    url: "/images/camp6_1.webp",
    preview: true,
  },
  {
    spotId: 23,
    url: "/images/camp7_1.webp",
    preview: true,
  },
  {
    spotId: 24,
    url: "/images/camp8_1.webp",
    preview: true,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(spotImageData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, spotImageData, {});
  },
};
