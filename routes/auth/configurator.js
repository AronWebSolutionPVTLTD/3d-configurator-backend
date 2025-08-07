const express = require("express");
const userRouter = express.Router();
const { registerUser, loginUser, createProductType, getProductType } = require("../../controller/auth/admin");
const {
  canModifyUser,
  verifyToken,
} = require("../../middleware/authMiddleware");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/create-product-type", createProductType);
userRouter.get("/get-product-type", getProductType);
module.exports = { userRouter };
