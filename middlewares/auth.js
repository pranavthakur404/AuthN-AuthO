// three middle ware we arr going to user
//  - authenticity, isStudent,  isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token = req.body.token || req.cokkies.token;
    if (!token) {
      res.status(400).json({
        success: false,
        message: "token missing",
      });
    }

    //   verified token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET); // payload ka object de deta jo hamne pass kia tha,after login
      console.log(decode);
      req.user = decode;
    } catch (err) {
      res.status(401).json({
        success: fase,
        message: "Token invalid",
      });
    }
    next(); // calling next middleware
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error while verifying authenticity",
    });
  }
};

// isStudnet middle ware
const isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      res.status(500).json({
        message: false,
        message: "This is protected routes for students",
      });
    }

    // student waale route mai scces ki res banai huyi hai that's why yaha need nhi hai
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

// middle ware for admin
const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      res.status(500).json({
        message: false,
        message: "This is protected routes for Admin",
      });
    }

    // student waale route mai scces ki res banai huyi hai that's why yaha need nhi hai
    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

module.exports = { auth, isStudent, isAdmin };
