const express = require("express");
const userRouter = express.Router();
const { 
    registerUser, 
    loginUser 
} = require("../../controller/auth/admin");
const {
    createMenuConfiguration, 
    getMenuConfiguration,
    updateMenuConfiguration
} = require("../../controller/menuController");
const {
    createTypeConfiguration,
    getTypeConfiguration,
    updateTypeConfiguration
} = require("../../controller/typeController");
const {
  canModifyUser,
  verifyToken,
} = require("../../middleware/authMiddleware");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.post("/create-menu-configuration",verifyToken, createMenuConfiguration);
userRouter.get("/get-menu-configuration",verifyToken, getMenuConfiguration);
userRouter.put("/update-menu-configuration",verifyToken, updateMenuConfiguration);

// Type Configuration routes
userRouter.post("/create-type-configuration", createTypeConfiguration);
userRouter.get("/get-type-configuration/:menuId", getTypeConfiguration);
userRouter.put("/update-type-configuration/:menuId", updateTypeConfiguration);

module.exports = { userRouter };
