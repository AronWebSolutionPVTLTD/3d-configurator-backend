const express = require("express");
const userRouter = express.Router();
const { registerUser, loginUser } = require("../../controller/auth/admin");
const {
  canModifyUser,
  verifyToken,
} = require("../../middleware/authMiddleware");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/create-product-type", createProductType);
module.exports = { userRouter };
