const express = require("express");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { Op } = require("sequelize");

const router = express.Router();

const validateSignup = [
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Username is required"),
  // check("username")
  //   .isLength({ min: 4 })
  //   .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Sign up
router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const existingUser = await User.findOne({
    where: {
      [Op.or]: {
        username: username,
        email: email,
      },
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return res.status(500).json({
        message: "User already exists",
        errors: {
          email: "User with that email already exists",
        },
      });
    } else if (existingUser.username === username) {
      return res.status(500).json({
        message: "User already exists",
        errors: {
          username: "User with that username already exists",
        },
      });
    }
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });

  const safeUser = {
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
