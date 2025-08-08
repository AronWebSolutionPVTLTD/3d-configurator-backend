const express = require("express");
const userRouter = express.Router();
const { 
    registerUser, 
    loginUser, 
    createProductType, 
    getProductType, 
    createMenuConfiguration, 
    getMenuConfiguration,
    createTypeConfiguration,
    getTypeConfiguration,
    updateTypeConfiguration
} = require("../../controller/auth/admin");
const {
  canModifyUser,
  verifyToken,
} = require("../../middleware/authMiddleware");

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/create-product-type", createProductType);
userRouter.get("/get-product-type", getProductType);

userRouter.post("/create-menu-configuration", createMenuConfiguration);
userRouter.get("/get-menu-configuration", getMenuConfiguration);

// Type Configuration routes
userRouter.post("/create-type-configuration", createTypeConfiguration);
userRouter.get("/get-type-configuration/:menuId", getTypeConfiguration);
userRouter.put("/update-type-configuration/:menuId", updateTypeConfiguration);

module.exports = { userRouter };
