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

const activate = async (req, res) => {
  const token = req.params.token;
  try {
    await UserService.activateAccount(token);
    return res.status(201).send({ message: "User Account is Active" });
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};

module.exports = {
  registerUser,
  findByEmail,
  activate,
};
