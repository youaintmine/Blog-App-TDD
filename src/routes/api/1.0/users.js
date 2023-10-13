const express = require("express");
const userController = require("../../../controller/userController");
const router = express.Router();

const validateUsername = (req, res, next) => {
  const user = req.body;
  if (user.username === null) {
    req.validationErrors = {
      username: "Username cannot be null",
    };
  }
  next();
};

const validateEmail = (req, res, next) => {
  const user = req.body;
  if (user.email === null) {
    req.validationErrors = {
      ...req.validationErrors,
      email: "E-mail cannot be null",
    };
  }
  next();
};

router.post(
  "/",
  validateUsername,
  validateEmail,
  (req, res, next) => {
    if (req.validationErrors) {
      const response = { validationErrors: { ...req.validationErrors } };
      return res.status(400).send(response);
    }
    next();
  },
  userController.registerUser,
);

module.exports = router;
