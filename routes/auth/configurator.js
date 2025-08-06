const express = require("express");
const userRouter = express.Router();
const { registerUser } = require("../../controller/auth/admin");
const {
  canModifyUser,
  verifyToken,
} = require("../../middleware/authMiddleware");

userRouter.post("/test", registerUser);

module.exports = { userRouter };
