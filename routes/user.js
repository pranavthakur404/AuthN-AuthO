const express = require("express");
const router = express.Router();

// controllers
const { signup, login } = require("../controller/auth");

// middlewares
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

// defining routes
router.post("/login", login);
router.post("/signup", signup);

// protected routes
router.get("/student", auth, isStudent, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to protected routes of student",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to protected routes of Admin",
  });
});

// tested protected routes for single middleware
router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "welcome to protected rotutes token",
  });
});

module.exports = router;
