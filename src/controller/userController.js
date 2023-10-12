const User = require("../model/User");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = { ...req.body, password: hash };
    await User.create(user);
    return res.status(201).send({ message: "User Created" });
  } catch (e) {
    console.log(e.errors);
    //TODO Get all the error messages.
    return res.status(400).send({ validationErrors: e.errors });
  }
};

module.exports = {
  registerUser,
};
