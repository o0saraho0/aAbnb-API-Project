"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          username: "JohnD",
          profilePic: "/images/profile1.jpg",
          hashedPassword: bcrypt.hashSync("password1"),
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          username: "JaneS",
          profilePic: "/images/profile2.jpg",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Alice",
          lastName: "Johnson",
          email: "alice.johnson@example.com",
          username: "AliceJ",
          profilePic: "/images/profile3.jpg",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "Robert",
          lastName: "Brown",
          email: "robert.brown@example.com",
          profilePic: "/images/profile4.jpg",
          username: "RobertB",
          hashedPassword: bcrypt.hashSync("password4"),
        },
        {
          firstName: "Emily",
          lastName: "Davis",
          email: "emily.davis@example.com",
          profilePic: "/images/profile5.jpg",
          username: "EmilyD",
          hashedPassword: bcrypt.hashSync("password5"),
        },
        {
          firstName: "Michael",
          lastName: "Miller",
          email: "michael.miller@example.com",
          profilePic: "/images/profile6.jpg",
          username: "MichaelM",
          hashedPassword: bcrypt.hashSync("password6"),
        },
        {
          firstName: "Sarah",
          lastName: "Wilson",
          email: "sarah.wilson@example.com",
          profilePic: "/images/profile7.jpg",
          username: "SarahW",
          hashedPassword: bcrypt.hashSync("password7"),
        },
        {
          firstName: "David",
          lastName: "Taylor",
          email: "david.taylor@example.com",
          profilePic: "/images/profile8.jpg",
          username: "DavidT",
          hashedPassword: bcrypt.hashSync("password8"),
        },
        {
          firstName: "Laura",
          lastName: "Anderson",
          email: "laura.anderson@example.com",
          profilePic: "/images/profile9.jpg",
          username: "LauraA",
          hashedPassword: bcrypt.hashSync("password9"),
        },
        {
          firstName: "James",
          lastName: "Thomas",
          email: "james.thomas@example.com",
          profilePic: "/images/profile10.jpg",
          username: "JamesT",
          hashedPassword: bcrypt.hashSync("password10"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "JohnD",
            "JaneS",
            "AliceJ",
            "RobertB",
            "EmilyD",
            "MichaelM",
            "SarahW",
            "DavidT",
            "LauraA",
            "JamesT",
          ],
        },
      },
      {}
    );
  },
};
