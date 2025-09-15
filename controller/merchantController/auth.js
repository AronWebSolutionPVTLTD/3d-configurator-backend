const bcryptjs = require("bcryptjs");
const { asyncHandler } = require("../../middleware/asyncHandler");
const User = require("../../model/User");
const { successResponse } = require("../../utils/response");
const jwt = require("jsonwebtoken");

// create signup login and authentication controller
const userSignup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new Error("User already exists");
  }
  const newUser = new User({ name, email, password, role: role });
  await newUser.save();
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return successResponse(
    res,
    { user: newUser, token },
    "Merchant registered successfully",
    201
  );
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("All fields are required");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("User not found");
  }
  console.log("User found:", user, password);
  const isPasswordCorrect = await user.comparePasswords(password);
  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return successResponse(
    res,
    { user, token },
    "Merchant logged in successfully",
    200
  );  
});

const forgotPassword = asyncHandler(async (req, res) => {
  // handle forgot password
});

const resetPassword = asyncHandler(async (req, res) => {
  // handle reset password
});

const userLogout = asyncHandler(async (req, res) => {
  // handle user logout
});

module.exports = {
  userSignup,
  userLogin,
  forgotPassword,
  resetPassword,
  userLogout,
};
