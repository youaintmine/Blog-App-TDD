const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Model = Sequelize.Model;

class User extends Model {}

User.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Username cannot be empty",
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
  },
);

module.exports = User;
