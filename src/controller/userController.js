const UserService = require("../service/UserService");

const registerUser = async (req, res) => {
  try {
    await UserService.save(req.body);
    return res.status(201).send({ message: "User Created" });
  } catch (e) {
    return res.status(502).send({ message: e.message });
  }
};

const findByEmail = async (email) => {
  return await UserService.findByEmail(email);
};

module.exports = {
  registerUser,
  findByEmail,
};
