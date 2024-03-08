const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

// mount routes
const user = require("./routes/user");
app.use("/api/v1", user);

// db connection
const dbConnect = require("./config/database");
dbConnect();

// default routes
app.get("/", (req, res) => {
  res.send("<h1>Welcome to login and signup page</h1>");
});

// listing port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started");
});
