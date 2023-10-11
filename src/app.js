const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded());

// app.post("/api/1.0/users", (req, res) => {
//   return res.send();
// });

app.post("/api/1.0/users", (req, res) => {
  return res.send({
    message: "User created",
  });
});

module.exports = app;
