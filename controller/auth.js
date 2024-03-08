const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //cheking if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // securing password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error in hashing password",
      });
    }

    // creating user
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(200).json({
      success: true,
      message: "User created Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Please try again later",
    });
  }
};

// login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // checking fields
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Enter both field",
      });
    }

    // cheking user email address registered or not
    let user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not Registered",
      });
    }

    // verify password and generate tocken
    // user ke andar passwrod hoga, yo hamne email verify kia hua hai
    // creating payload
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };
    if (await bcrypt.compare(password, user.password)) {
      // creating jwt token after password is confirmed
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      // jo user get kia hai, useme ek property add krdenge token ki and removing password
      user = user.toObject();
      user.token = token;
      user.password = undefined;


      //   creating cookie
      const options = {
        expiresIn: new Date(Date.now() * 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User login successfully",
      });
    } else {
      res.status(403).json({
        success: false,
        message: "password incorrect",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Login failed try again",
    });
  }
};

module.exports = { signup, login };
