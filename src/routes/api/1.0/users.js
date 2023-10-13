const express = require("express");
const userController = require("../../../controller/userController");
const router = express.Router();

const { check, validationResult } = require("express-validator");

router.post(
  "/",
  check("username").notEmpty().withMessage("Username cannot be null"),
  check("email").notEmpty().withMessage("E-mail cannot be null"),
  check("password").notEmpty().withMessage("Password cannot be null"),
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

module.exports = router;
