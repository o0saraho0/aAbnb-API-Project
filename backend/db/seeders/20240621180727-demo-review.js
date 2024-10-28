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
    spotId: 2,
    userId: 1,
    review:
      "The mountain tree house was a delightful retreat. The views were breathtaking, and the house was cozy and well-appointed. It was the perfect place for a peaceful getaway.",
    stars: 5,
  },
  {
    spotId: 2,
    userId: 6,
    review:
      "We loved our stay at the mountain tree house. The surroundings were serene, and the house had everything we needed for a comfortable stay. Highly recommend for nature lovers!",
    stars: 4,
  },
  {
    spotId: 3,
    userId: 10,
    review:
      "Nature's Nest was a dream come true. The tree house was beautifully designed, and the location was perfect for a relaxing escape. Can't wait to return!",
    stars: 5,
  },
  {
    spotId: 3,
    userId: 9,
    review:
      "Our stay at Nature's Nest was wonderful. The tree house was comfortable and well-equipped, and the surrounding nature was breathtaking. A perfect getaway spot.",
    stars: 4,
  },

  {
    spotId: 4,
    userId: 1,
    review:
      "Despite the great location, the issues with the house significantly impacted our stay. It needs major improvements before we would consider staying here again.",
    stars: 2,
  },
  {
    spotId: 4,
    userId: 7,
    review:
      "We were quite disappointed with our stay at the tree house. The house was not clean, and several amenities were broken or missing. The overall experience was far from what we expected.",
    stars: 1,
  },
  {
    spotId: 5,
    userId: 9,
    review:
      "We had an amazing time at the tree house. The proximity to the lake was unbeatable, and the sunsets were gorgeous. The house was well-equipped and very comfortable. Can't wait to come back!",
    stars: 5,
  },
  {
    spotId: 5,
    userId: 2,
    review:
      "Willow Tree House was a fantastic experience. The willow trees provided a serene and calming environment. The house was cozy and well-maintained. Highly recommend for a peaceful retreat.",
    stars: 5,
  },
  {
    spotId: 6,
    userId: 1,
    review:
      "Maple Tree Haven was a peaceful retreat. The tree house was charming, and the maple trees around it added to the serene atmosphere. Highly recommend for a relaxing vacation.",
    stars: 4,
  },
  {
    spotId: 6,
    userId: 2,
    review:
      "We enjoyed our stay at Maple Tree Haven. The tree house was cozy and well-maintained, and the location was perfect for a quiet getaway. Will definitely return.",
    stars: 4,
  },
  {
    spotId: 7,
    userId: 4,
    review:
      "Cedar Tree Escape was a unique experience. The tree house was comfortable and had stunning mountain views. It was a perfect spot for a peaceful retreat.",
    stars: 4,
  },
  {
    spotId: 7,
    userId: 5,
    review:
      "We had a wonderful time at Cedar Tree Escape. The tree house was cozy and well-equipped, and the surroundings were beautiful. Highly recommend for a relaxing vacation.",
    stars: 5,
  },
  {
    spotId: 8,
    userId: 10,
    review:
      "Pine Tree Lodge was a fantastic getaway. The tree house was charming, and the lake views were breathtaking. It was the perfect spot for a relaxing vacation.",
    stars: 5,
  },
  {
    spotId: 8,
    userId: 9,
    review:
      "Our stay at Pine Tree Lodge was amazing. The tree house was comfortable and had stunning views of the Adirondacks. Highly recommend for a peaceful retreat.",
    stars: 5,
  },
  {
    spotId: 9,
    userId: 3,
    review:
      "Ocean Breeze was a luxurious escape. The beach house was beautifully decorated, and the ocean views were stunning. It was the perfect spot for a relaxing vacation.",
    stars: 5,
  },
  {
    spotId: 9,
    userId: 4,
    review:
      "We had a wonderful time at Ocean Breeze. The beach house was spacious and well-equipped, and the location was perfect for a beachside getaway. Highly recommend!",
    stars: 4,
  },
  {
    spotId: 10,
    userId: 1,
    review:
      "Sunset Villa was a beautiful place to stay. The sunsets were stunning, and the house was very cozy. Ideal for a romantic getaway.",
    stars: 4,
  },
  {
    spotId: 11,
    userId: 9,
    review:
      "Coastal Escape was a wonderful beach house. The location was perfect, with direct access to the beach. The house was well-maintained and had everything we needed for a comfortable stay.",
    stars: 4,
  },
  {
    spotId: 12,
    userId: 8,
    review:
      "Malibu Beach House was a luxurious escape. The views were incredible, and the house was beautifully designed. Highly recommend for a lavish beach vacation.",
    stars: 5,
  },
  {
    spotId: 13,
    userId: 4,
    review:
      "Maui Beach Retreat was a fantastic tropical getaway. The private beach access was a highlight, and the house was beautifully decorated. Perfect for a relaxing vacation.",
    stars: 5,
  },
  {
    spotId: 13,
    userId: 8,
    review:
      "Our stay at the beach house was wonderful. The sound of the waves was so relaxing, and the beach was just a few steps away. The house was beautifully decorated and had everything we needed for a comfortable stay.",
    stars: 4,
  },
  {
    spotId: 14,
    userId: 9,
    review:
      "Cape Cod Beach House was a lovely place to stay. The sea views were stunning, and the house was very comfortable. Highly recommend for a serene beach vacation.",
    stars: 4,
  },
  {
    spotId: 15,
    userId: 1,
    review:
      "San Diego Beach House was a fantastic spot. The direct beach access was perfect, and the house was modern and well-equipped. Ideal for a stylish beach stay.",
    stars: 4,
  },
  {
    spotId: 15,
    userId: 2,
    review:
      "San Diego Beach House was an amazing experience. The house was very modern and had all the amenities we needed. The beach was right there, making it super convenient.",
    stars: 5,
  },
  {
    spotId: 15,
    userId: 3,
    review:
      "We had a wonderful stay at the San Diego Beach House. The location was unbeatable, and the house was clean and comfortable. Perfect for a beach holiday.",
    stars: 4,
  },
  {
    spotId: 16,
    userId: 1,
    review:
      "Myrtle Beach Getaway was perfect for our family vacation. The house was spacious and had everything we needed. The beach views were beautiful. Highly recommend for a fun family trip.",
    stars: 4,
  },
  {
    spotId: 16,
    userId: 3,
    review:
      "Myrtle Beach Getaway was excellent. The house was spacious and well-equipped, making it perfect for our family. The kids loved the beach, and the views were stunning.",
    stars: 5,
  },
  {
    spotId: 16,
    userId: 5,
    review:
      "Our stay at Myrtle Beach Getaway was delightful. The house had everything we needed, and the proximity to the beach was fantastic. We will definitely be back.",
    stars: 4,
  },
  {
    spotId: 17,
    userId: 5,
    review:
      "Woodland Camping was an amazing experience. The campsite was serene and surrounded by nature. Perfect for a peaceful camping trip.",
    stars: 5,
  },
  {
    spotId: 18,
    userId: 6,
    review:
      "Mountain Retreat was a beautiful campsite. The mountain views were stunning, and the site was well-maintained. Ideal for a nature escape.",
    stars: 4,
  },
  {
    spotId: 18,
    userId: 1,
    review:
      "Mountain Retreat was an absolute gem. The tranquility and beauty of the mountains made for a perfect escape. The site had everything we needed for a comfortable stay.",
    stars: 5,
  },
  {
    spotId: 20,
    userId: 1,
    review:
      "Desert Oasis was a unique camping experience. The desert views were breathtaking, and the site was well-equipped. Perfect for an adventurous trip.",
    stars: 4,
  },
  {
    spotId: 20,
    userId: 2,
    review:
      "Desert Oasis offered a unique and memorable camping experience. The sunsets were spectacular, and the amenities were top-notch. Great spot for nature lovers.",
    stars: 5,
  },
  {
    spotId: 21,
    userId: 5,
    review:
      "Canyon Camp was an incredible spot. The canyon views were stunning, and the site was well-maintained. Highly recommend for an adventurous camping trip.",
    stars: 5,
  },
  {
    spotId: 22,
    userId: 1,
    review:
      "Yosemite Camp was a great place to stay. The hiking trails were fantastic, and the campsite was well-equipped. Ideal for nature enthusiasts.",
    stars: 5,
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
