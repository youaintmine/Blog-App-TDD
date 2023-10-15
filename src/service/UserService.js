const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const EmailService = require("./EmailService");
const sequelize = require("../config/database");
const EmailException = require("../exceptions/EmailException");

const generateToken = (length) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};

const save = async (body) => {
  const { username, email, password } = body;
  const hash = await bcrypt.hash(password, 10);
  const user = {
    username,
    email,
    password: hash,
    activationToken: generateToken(16),
  };
  const transaction = await sequelize.transaction();
  try {
    await User.create(user, { transaction });
  } catch (e) {
    console.log(e);
    throw new Error("User Creation failed");
  }
  try {
    await EmailService.sendAccountActivation(user.email, user.activationToken);
    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    throw new EmailException();
  }
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email: email } });
};

module.exports = { save, findByEmail };
