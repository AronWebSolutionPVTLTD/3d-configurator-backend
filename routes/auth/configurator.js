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
    createDesign,
    getDesigns,
    getDesignById,
    updateDesign,
    deleteDesign,
    getDesignsByCategory,
    searchDesigns
} = require("../../controller/designController");

const {
    createFeaturesConfiguration,
    getFeaturesConfigurations,
    updateFeaturesConfiguration,
    deleteFeaturesConfiguration,
    addFeature,
    updateFeature,
    deleteFeature,
    toggleActiveStatus
} = require("../../controller/featuresController");

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
userRouter.post("/create-type-configuration",verifyToken, createTypeConfiguration);
userRouter.get("/get-type-configuration/:menuId",verifyToken, getTypeConfiguration);
userRouter.put("/update-type-configuration/:menuId",verifyToken, updateTypeConfiguration);

// Design Configuration routes
userRouter.post("/create-design-configuration",verifyToken, createDesign);
userRouter.get("/get-design-configuration",verifyToken, getDesigns);
userRouter.put("/update-design-configuration/:id",verifyToken, updateDesign); 
userRouter.delete("/delete-design-configuration/:id",verifyToken, deleteDesign);

// Features Configuration routes
userRouter.post("/create-features-configuration", verifyToken, createFeaturesConfiguration);
userRouter.get("/get-features-configuration", verifyToken, getFeaturesConfigurations);
userRouter.put("/update-features-configuration/:id", verifyToken, updateFeaturesConfiguration);
userRouter.delete("/delete-features-configuration/:id", verifyToken, deleteFeaturesConfiguration);

// Feature-level operations
userRouter.post("/features-configuration/:id/features", verifyToken, addFeature);
userRouter.put("/features-configuration/:id/features/:featureId", verifyToken, updateFeature);
userRouter.delete("/features-configuration/:id/features/:featureId", verifyToken, deleteFeature);



module.exports = { userRouter };
