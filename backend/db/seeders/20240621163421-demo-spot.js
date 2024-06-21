"use strict";

const { Spot } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "456 Oak Avenue",
          city: "Portland",
          state: "Oregon",
          country: "United States of America",
          lat: 45.5051,
          lng: -122.675,
          name: "Forest Retreat",
          description: "A cozy tree house nestled in the forest",
          price: 150,
        },
        {
          ownerId: 2,
          address: "789 Pine Road",
          city: "Asheville",
          state: "North Carolina",
          country: "United States of America",
          lat: 35.5951,
          lng: -82.5515,
          name: "Mountain Tree House",
          description: "An elevated tree house with mountain views",
          price: 200,
        },
        {
          ownerId: 3,
          address: "321 Birch Lane",
          city: "Boulder",
          state: "Colorado",
          country: "United States of America",
          lat: 40.015,
          lng: -105.2705,
          name: "Nature's Nest",
          description: "A peaceful tree house surrounded by nature",
          price: 175,
        },
        {
          ownerId: 4,
          address: "101 Ocean Drive",
          city: "Miami",
          state: "Florida",
          country: "United States of America",
          lat: 25.7617,
          lng: -80.1918,
          name: "Ocean Breeze",
          description: "A luxurious beach house with ocean views",
          price: 300,
        },
        {
          ownerId: 5,
          address: "202 Shoreline Blvd",
          city: "Santa Monica",
          state: "California",
          country: "United States of America",
          lat: 34.0195,
          lng: -118.4912,
          name: "Sunset Villa",
          description: "A charming beach house perfect for watching sunsets",
          price: 250,
        },
        {
          ownerId: 1,
          address: "303 Seaside Avenue",
          city: "Virginia Beach",
          state: "Virginia",
          country: "United States of America",
          lat: 36.8529,
          lng: -75.978,
          name: "Coastal Escape",
          description: "A relaxing beach house with direct access to the beach",
          price: 275,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: {
          [Op.in]: [
            "456 Oak Avenue",
            "789 Pine Road",
            "321 Birch Lane",
            "101 Ocean Drive",
            "202 Shoreline Blvd",
            "303 Seaside Avenue",
          ],
        },
      },
      {}
    );
  },
};
