"use strict";

const { Spot } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const spotData = [
  //spot 1
  {
    ownerId: 1,
    address: "456 Oak Avenue",
    city: "Portland",
    state: "Oregon",
    country: "United States of America",
    lat: 45.5051,
    lng: -122.675,
    name: "Forest Retreat",
    description:
      "A charming and cozy tree house nestled high up in the dense forest canopy. The tree house is constructed from rustic, natural wood, blending seamlessly with its surroundings. Large windows offer breathtaking views of the lush greenery and allow plenty of natural light to flood in.",
    price: 150,
  },
  //spot 2
  {
    ownerId: 2,
    address: "789 Pine Road",
    city: "Asheville",
    state: "North Carolina",
    country: "United States of America",
    lat: 35.5951,
    lng: -82.5515,
    name: "Mountain Tree House",
    description:
      "An elevated tree house with mountain views. Constructed from rustic, natural wood, it blends seamlessly with its surroundings. Large windows offer breathtaking views of the mountains and allow plenty of natural light to flood in.",
    price: 200,
  },
  //spot 3
  {
    ownerId: 3,
    address: "321 Birch Lane",
    city: "Boulder",
    state: "Colorado",
    country: "United States of America",
    lat: 40.015,
    lng: -105.2705,
    name: "Nature's Nest",
    description:
      "A peaceful tree house surrounded by nature. Built with natural wood, it integrates harmoniously with the forest. Large windows provide stunning views of the surrounding greenery and let in ample sunlight.",
    price: 175,
  },
  //spot 4
  {
    ownerId: 4,
    address: "789 Redwood Circle",
    city: "Eureka",
    state: "California",
    country: "United States of America",
    lat: 40.8021,
    lng: -124.1637,
    name: "Redwood Retreat",
    description:
      "A tree house high in the redwoods with stunning views. Crafted from rustic, natural wood, it blends perfectly with the majestic redwoods. Large windows offer breathtaking views and plenty of natural light.",
    price: 225,
  },
  //spot 5
  {
    ownerId: 5,
    address: "123 Willow Way",
    city: "Savannah",
    state: "Georgia",
    country: "United States of America",
    lat: 32.0809,
    lng: -81.0912,
    name: "Willow Tree House",
    description:
      "A charming tree house surrounded by willow trees. Made from natural wood, it harmonizes with the graceful willow trees. Large windows provide beautiful views and let in abundant sunlight.",
    price: 195,
  },
  //spot 6
  {
    ownerId: 6,
    address: "456 Maple Street",
    city: "Burlington",
    state: "Vermont",
    country: "United States of America",
    lat: 44.4759,
    lng: -73.2121,
    name: "Maple Tree Haven",
    description:
      "A peaceful tree house nestled among maple trees. Constructed from rustic wood, it blends seamlessly with the maple grove. Large windows offer picturesque views and allow plenty of natural light.",
    price: 180,
  },
  //spot 7
  {
    ownerId: 7,
    address: "789 Cedar Lane",
    city: "Flagstaff",
    state: "Arizona",
    country: "United States of America",
    lat: 35.1983,
    lng: -111.6513,
    name: "Cedar Tree Escape",
    description:
      "A unique tree house in a cedar forest with mountain views. Built from natural wood, it fits perfectly among the cedar trees. Large windows provide breathtaking views and let in plenty of sunlight.",
    price: 210,
  },
  //spot 8
  {
    ownerId: 8,
    address: "123 Pine Drive",
    city: "Lake Placid",
    state: "New York",
    country: "United States of America",
    lat: 44.2795,
    lng: -73.9799,
    name: "Pine Tree Lodge",
    description:
      "A cozy tree house in the Adirondacks with lake views. Made from rustic wood, it integrates well with the surrounding pines. Large windows offer stunning views of the lake and allow ample natural light.",
    price: 230,
  },
  //spot 9
  {
    ownerId: 1,
    address: "101 Ocean Drive",
    city: "Miami",
    state: "Florida",
    country: "United States of America",
    lat: 25.7617,
    lng: -80.1918,
    name: "Ocean Breeze",
    description:
      "A luxurious beach house with ocean views. Constructed with elegant design, it offers direct views of the ocean from large windows that flood the space with natural light. The perfect getaway for a serene and opulent beach experience.",
    price: 300,
  },
  //spot 10
  {
    ownerId: 2,
    address: "202 Shoreline Blvd",
    city: "Santa Monica",
    state: "California",
    country: "United States of America",
    lat: 34.0195,
    lng: -118.4912,
    name: "Sunset Villa",
    description:
      "A charming beach house perfect for watching sunsets. Built with a cozy and inviting design, it features large windows that offer stunning views of the sunset over the ocean. Ideal for a romantic and tranquil beach stay.",
    price: 250,
  },
  //spot 11
  {
    ownerId: 3,
    address: "303 Seaside Avenue",
    city: "Virginia Beach",
    state: "Virginia",
    country: "United States of America",
    lat: 36.8529,
    lng: -75.978,
    name: "Coastal Escape",
    description:
      "A relaxing beach house with direct access to the beach. Constructed with a soothing design, it provides easy access to the beach and features large windows that let in ample natural light. Perfect for a peaceful beachside retreat.",
    price: 275,
  },
  //spot 12
  {
    ownerId: 4,
    address: "404 Ocean View Drive",
    city: "Malibu",
    state: "California",
    country: "United States of America",
    lat: 34.0259,
    lng: -118.7798,
    name: "Malibu Beach House",
    description:
      "A stunning beach house with panoramic ocean views. Built with a luxurious and modern design, it offers breathtaking views of the ocean from large windows. An exquisite location for a lavish and scenic beach escape.",
    price: 450,
  },
  //spot 13
  {
    ownerId: 5,
    address: "505 Coastal Road",
    city: "Maui",
    state: "Hawaii",
    country: "United States of America",
    lat: 20.7984,
    lng: -156.3319,
    name: "Maui Beach Retreat",
    description:
      "A tropical beach house with private beach access. Constructed with a vibrant and tropical design, it features direct access to a private beach and large windows that provide stunning views of the ocean. Ideal for an exclusive and relaxing tropical getaway.",
    price: 500,
  },
  //spot 14
  {
    ownerId: 6,
    address: "606 Seaside Drive",
    city: "Cape Cod",
    state: "Massachusetts",
    country: "United States of America",
    lat: 41.6688,
    lng: -70.2962,
    name: "Cape Cod Beach House",
    description:
      "A classic beach house with stunning sea views. Built with a traditional and charming design, it offers picturesque views of the sea from large windows that fill the house with natural light. Perfect for a timeless and serene beach experience.",
    price: 350,
  },
  //spot 15
  {
    ownerId: 7,
    address: "707 Beachfront Blvd",
    city: "San Diego",
    state: "California",
    country: "United States of America",
    lat: 32.7157,
    lng: -117.1611,
    name: "San Diego Beach House",
    description:
      "A modern beach house with direct beach access. Constructed with a sleek and contemporary design, it provides direct access to the beach and features large windows that offer breathtaking views of the ocean. Ideal for a stylish and comfortable beach stay.",
    price: 400,
  },
  //spot 16
  {
    ownerId: 8,
    address: "808 Oceanfront Avenue",
    city: "Myrtle Beach",
    state: "South Carolina",
    country: "United States of America",
    lat: 33.6891,
    lng: -78.8867,
    name: "Myrtle Beach Getaway",
    description:
      "A spacious beach house perfect for family vacations. Built with a roomy and comfortable design, it offers ample space for families and large windows that provide beautiful views of the beach. Ideal for a fun and memorable family vacation by the sea.",
    price: 320,
  },
  //spot 17
  {
    ownerId: 1,
    address: "400 Forest Road",
    city: "Bend",
    state: "Oregon",
    country: "United States of America",
    lat: 44.0582,
    lng: -121.3153,
    name: "Woodland Camping",
    description:
      "A serene campsite surrounded by towering trees. This peaceful retreat offers an immersive nature experience with large, open spaces perfect for camping. Enjoy the tranquility of the forest with plenty of opportunities for hiking and wildlife observation.",
    price: 120,
  },
  //spot 18
  {
    ownerId: 2,
    address: "500 Mountain Path",
    city: "Jackson",
    state: "Wyoming",
    country: "United States of America",
    lat: 43.4799,
    lng: -110.7624,
    name: "Mountain Retreat",
    description:
      "A picturesque campsite with stunning mountain views. Nestled in a beautiful mountain setting, this campsite provides breathtaking vistas and ample space for outdoor activities. Perfect for those looking to escape into nature and enjoy the serenity of the mountains.",
    price: 180,
  },
  //spot 19
  {
    ownerId: 3,
    address: "600 Lakeside Drive",
    city: "Lake Tahoe",
    state: "California",
    country: "United States of America",
    lat: 39.0968,
    lng: -120.0324,
    name: "Lakeside Camp",
    description:
      "A beautiful campsite by the lake with water activities. Enjoy the serene lake views and take part in various water activities such as kayaking, fishing, and swimming. This campsite offers a perfect blend of relaxation and adventure in a picturesque lakeside setting.",
    price: 200,
  },
  //spot 20
  {
    ownerId: 4,
    address: "700 Desert Trail",
    city: "Sedona",
    state: "Arizona",
    country: "United States of America",
    lat: 34.8697,
    lng: -111.761,
    name: "Desert Oasis",
    description:
      "A unique campsite in the heart of the desert. Experience the stark beauty of the desert landscape with stunning rock formations and vast open spaces. This campsite provides a one-of-a-kind camping experience with breathtaking desert views.",
    price: 150,
  },
  //spot 21
  {
    ownerId: 5,
    address: "800 Canyon Road",
    city: "Moab",
    state: "Utah",
    country: "United States of America",
    lat: 38.5733,
    lng: -109.5498,
    name: "Canyon Camp",
    description:
      "A rugged campsite with breathtaking canyon views. Situated amidst dramatic canyon landscapes, this campsite offers stunning vistas and opportunities for hiking and exploring the rugged terrain. Perfect for adventurers seeking a memorable camping experience.",
    price: 170,
  },
  //spot 22
  {
    ownerId: 7,
    address: "1000 Forest Path",
    city: "Yosemite National Park",
    state: "California",
    country: "United States of America",
    lat: 37.8651,
    lng: -119.5383,
    name: "Yosemite Camp",
    description:
      "A rustic campsite in Yosemite with hiking trails. This campsite is nestled within the majestic landscapes of Yosemite, offering direct access to numerous hiking trails. Perfect for nature enthusiasts looking to explore the park and enjoy rustic camping amidst breathtaking scenery.",
    price: 190,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(spotData, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, spotData, {});
  },
};
