const express = require("express");
const userController = require("../../../controller/userController");
const router = express.Router();

const { check, validationResult } = require("express-validator");

router.post(
  "/",
  check("username")
    .notEmpty()
    .withMessage("Username cannot be null")
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage("Must have minimum 4 and maximum 32 characters"),
  check("email")
    .notEmpty()
    .withMessage("E-mail cannot be null")
    .bail()
    .isEmail()
    .withMessage("E-mail is not valid")
    .custom(async (email) => {
      const user = await userController.findByEmail(email);
      if (user) {
        throw new Error();
      }
    })
    .withMessage("E-mail in use"),
  check("password")
    .notEmpty()
    .withMessage("Password cannot be null")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must have minimum 9 characters")
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage(
      "Password must have atleast 1 uppercase, 1 lowercase letter and 1 number",
    ),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors
        .array()
        .forEach((error) => (validationErrors[error.path] = error.msg));
      return res.status(400).send({ validationErrors: validationErrors });
    }
    next();
  },
  userController.registerUser,
);


router.post(
  "/token/:token",
  async (req, res, next) => {
    console.log(req);
    next();
  },
  userController.activate,
);

module.exports = router;
