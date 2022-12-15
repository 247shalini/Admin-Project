const { body } = require("express-validator");
const userModel = require("../models/user");

exports.addUserValidation = [
  body("firstName")
    .not()
    .isEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must be characters"),
  body("lastName")
    .not()
    .isEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must be characters"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Please enter valid email address")
    .trim()
    .custom(async (value) => {
      const user = await userModel.findOne({ email: value });
      if (user) {
        throw new Error("Email is already exist");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long.")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
    .withMessage(
      "Please enter a password at least 8 character and contain at least one uppercase, one lower case and one special character."
    )
    .not()
    .matches(/^$|\s+/)
    .withMessage("White space not allowed"),
   body("role")
    .not()
    .notEmpty()
    .withMessage("User role is required")
    .isAlpha()
    .withMessage("User role must be characters"),  
];
