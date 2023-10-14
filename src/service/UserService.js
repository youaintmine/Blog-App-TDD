const User = require("../model/User");
const bcrypt = require("bcrypt");

const save = async (body) => {
  try {
    const hash = await bcrypt.hash(body.password, 10);
    const user = { ...body, password: hash };
    await User.create(user);
  } catch (e) {
    console.log(e.errors);
    //TODO Get all the error messages.
    throw new Error("User Creation failed");
  }
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email: email } });
};

module.exports = { save, findByEmail };
