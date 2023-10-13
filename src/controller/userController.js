const UserService = require("../service/UserService");

const registerUser = async (req, res) => {
  try {
    await UserService.save(req.body);
    return res.status(201).send({ message: "User Created" });
  } catch (e) {
    console.log(e);
    throw new Error("User creation failed");
  }
};

module.exports = {
  registerUser,
};
