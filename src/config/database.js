const Sequlize = require("sequelize");
const sequelize = new Sequlize(
  "bloggram",
  "bloggram-username",
  "bloggram-password",
  {
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  },
);

module.exports = sequelize;
