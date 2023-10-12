const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.json());

//This is for dynamically loading all the routes in this page
//So this helps us up by cleaning the clutter that might be scattered around
const loadRoutes = (directory) => {
  const routeFiles = fs.readdirSync(directory);
  const baseRoute = directory.includes("routes")
    ? directory.split("routes/")[1]
    : "";
  if (baseRoute === "") {
    console.log("The directory provided is not correct");
    throw new Error(
      "the directory should follow this format : routes/api/version/",
    );
  }
  routeFiles.forEach(async (file) => {
    const filePath = path.join(directory, file);
    const route = await require(filePath);

    //Determining the base route from the filename (e.g., user.js should become api/1.0/user)
    const filePoint = `${path.basename(file, ".js")}`;
    const endPoint = "/" + baseRoute + "/" + filePoint + "/";
    app.use(endPoint, route);
  });
};
// app.use("/api/1.0/users/", users);
loadRoutes(path.join(__dirname, "routes/api/1.0"));

module.exports = app;
