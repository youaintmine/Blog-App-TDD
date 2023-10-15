const app = require("./src/app");
const sequelize = require("./src/config/database")
const PORT = process.env.PORT || 3000;

sequelize.sync();

app.listen(PORT, () => {
  console.log(`Server is listening to ${PORT}`);
});
