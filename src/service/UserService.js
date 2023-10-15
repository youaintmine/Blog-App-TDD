const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const EmailService = require("./EmailService");
const sequelize = require("../config/database");
const EmailException = require("../exceptions/EmailException");
const InvalidTokenException = require("../exceptions/InvalidTokenException");

const generateToken = (length) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};

const save = async (body) => {
  const { username, email, password } = body;
  const hash = await bcrypt.hash(password, 10);
  /**
   * Any issue with the user should be handled by the UserException, but since we've handled
   * Most of the requests to the userRouter, we'll be catering to a particular set of error handling
   * Instead of directly throwing the error we'll collect all the information from the errors
   * If all the preliminary things are done, then we'll be handling the more advaned errors
   * Like email sending and DB transaction DB issue.
   * One case can be handled by using the finally, in the catch we'll be catching all the issue related.
   * And in the finally we'll be sending in those Errors.
   **/
  const user = {
    username,
    email,
    password: hash,
    activationToken: generateToken(16),
  };
  const transaction = await sequelize.transaction();
  await User.create(user, { transaction });
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

const activateAccount = async (token) => {
  const user = await User.findOne({ where: { activationToken: token } });
  if (!user) {
    console.log("Invalid Token is sent");
    throw new InvalidTokenException();
  }
  user.inactive = false;
  user.activationToken = null;
  await user.save();
};

module.exports = { save, findByEmail, activateAccount };
