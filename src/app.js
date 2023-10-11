const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded());
const User = require("./model/User");

// app.post("/api/1.0/users", (req, res) => {
//   return res.send();
// });

app.post("/api/1.0/users", (req, res) => {
  User.create(req.body).then(() => {
    return res.send({
      message: "User Created"
    });
  });
});

module.exports = app;
