"use strict";

const { Review } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const reviewData = [
  {
    spotId: 1,
    userId: 10,
    review:
      "Staying in this tree house was an amazing experience! The view from the top was breathtaking, and the interior was cozy and well-decorated. Highly recommend for anyone looking for a unique getaway.",
    stars: 5,
  },
  {
    spotId: 1,
    userId: 9,
    review:
      "The tree house was a fantastic adventure! The surroundings were peaceful, and the tree house itself was very comfortable. A perfect place to disconnect and relax.",
    stars: 4,
  },
  {
    spotId: 4,
    userId: 10,
    review:
      "The beach house was absolutely stunning! The location was perfect, right on the beach with beautiful ocean views. The house was clean, spacious, and had all the amenities we needed.",
    stars: 4,
  },
  {
    spotId: 5,
    userId: 9,
    review:
      "We had an amazing time at the beach house. The proximity to the beach was unbeatable, and the sunsets were gorgeous. The house was well-equipped and very comfortable. Can't wait to come back!",
    stars: 5,
  },
  {
    spotId: 4,
    userId: 8,
    review:
      "Our stay at the beach house was wonderful. The sound of the waves was so relaxing, and the beach was just a few steps away. The house was beautifully decorated and had everything we needed for a comfortable stay.",
    stars: 4,
  },
  {
    spotId: 4,
    userId: 7,
    review:
      "We were quite disappointed with our stay at the beach house. The house was not clean, and several amenities were broken or missing. The beach access was convenient, but the overall experience was far from what we expected.",
    stars: 1,
  },
  {
    spotId: 5,
    userId: 1,
    review:
      "We had a mixed experience during our stay at the beach house. The location was fantastic, with easy access to the beach and beautiful ocean views. However, the house itself was just average. While it was clean and had most of the necessary amenities, a few items were either broken or missing, which was a bit inconvenient. The overall experience was decent, but it didn't quite live up to our expectations. With a few improvements, this could be a great place to stay.",
    stars: 3,
  },
  {
    spotId: 4,
    userId: 1,
    review:
      "Despite the great location, the issues with the house significantly impacted our stay. It needs major improvements before we would consider staying here again.",
    stars: 2,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(reviewData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, reviewData, {});
  },
};
