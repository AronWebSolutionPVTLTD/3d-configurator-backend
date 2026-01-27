const express = require("express");
const { getTools, getTool, createTool } = require("../controller/toolsController");
const {
  userSignup,
  userLogin,
  forgotPassword,
  resetPassword,
  userLogout,
} = require("../controller/merchantController/auth");
const {
  validateRequest,
  verifyToken,
} = require("../middleware/authMiddleware");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validation/merchant");
const {
  sportSchema,
  paginationSchema,
} = require("../validation/sportsValidations");
const {
  getSports,
  getSport,
  updateSport,
  deleteSport,
  createSport,
} = require("../controller/merchantController/sportsController");
const { categorySchema } = require("../validation/CategoryValidations");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/merchantController/categoryController");
const {
  productSchema,
  productUpdateSchema,
  productStatusSchema,
  productQuerySchema,
  customizedProductSchema,
} = require("../validation/productValidations");
const { toolSchema } = require("../validation/toolValidations");

// dynamic config controllers
const {
  getFonts,
  getFont,
  createFont,
  updateFont,
  deleteFont,
} = require("../controller/merchantController/fontController");

const {
  getPlacementZones,
  getPlacementZone,
  createPlacementZone,
  updatePlacementZone,
  deletePlacementZone,
} = require("../controller/merchantController/placementZoneController");

const {
  getColorSwatches,
  createColorSwatch,
  updateColorSwatch,
  deleteColorSwatch,
} = require("../controller/merchantController/colorSwatchController");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getProductToolsConfig,
  getProductToolsConfigFe,
  updateProductToolsConfig,
  addConfigoptionToTool,
  deleteProductTool,
  deleteConfigOption,
  createOrUpdateCustomizedProduct,
  getCustomizedProducts,
  uploadFile,
} = require("../controller/merchantController/productController");
const { upload } = require("../middleware/uploadMiddleware");



const routes = express.Router();

//sign up login and authentication routes
routes.post("/signup", validateRequest(signupSchema), userSignup);
routes.post("/signin", validateRequest(loginSchema), userLogin);
routes.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  forgotPassword
);
routes.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  resetPassword
);
routes.post("/logout", userLogout);

//sports crud routes only logged in users verify jwt first
routes.get(
  "/sports",
  verifyToken,
  validateRequest(paginationSchema),
  getSports
);
routes.get("/sports/:id", verifyToken, getSport);
routes.post("/sports", verifyToken, validateRequest(sportSchema), createSport);
routes.put(
  "/sports/:id",
  verifyToken,
  validateRequest(sportSchema),
  updateSport
);
routes.delete("/sports/:id", verifyToken, deleteSport);

//category routes
routes.get("/categories", verifyToken, getCategories);
routes.get("/categories/:id", verifyToken, getCategory);
routes.post(
  "/categories",
  verifyToken,
  validateRequest(categorySchema),
  createCategory
);
routes.put(
  "/categories/:id",
  verifyToken,
  validateRequest(categorySchema),
  updateCategory
);
routes.delete("/categories/:id", verifyToken, deleteCategory);

routes.get("/tools", getTools);
routes.get("/tools/:id", getTool);
routes.post("/tools", verifyToken, validateRequest(toolSchema), createTool);

// fonts
routes.get("/fonts", getFonts);
routes.get("/fonts/:id", getFont);
routes.post("/fonts", verifyToken, createFont);
routes.put("/fonts/:id", verifyToken, updateFont);
routes.delete("/fonts/:id", verifyToken, deleteFont);

// placement zones
routes.get("/placement-zones", getPlacementZones);
routes.get("/placement-zones/:id", getPlacementZone);
routes.post("/placement-zones", verifyToken, createPlacementZone);
routes.put("/placement-zones/:id", verifyToken, updatePlacementZone);
routes.delete("/placement-zones/:id", verifyToken, deletePlacementZone);

// color swatches
routes.get("/color-swatches", getColorSwatches);
routes.post("/color-swatches", verifyToken, createColorSwatch);
routes.put("/color-swatches/:id", verifyToken, updateColorSwatch);
routes.delete("/color-swatches/:id", verifyToken, deleteColorSwatch);

//product routes
routes.get("/products", verifyToken, validateRequest(productQuerySchema), getProducts);
routes.get("/products/:id", verifyToken, getProduct);
routes.post("/products", verifyToken, validateRequest(productSchema), createProduct);
routes.put("/products/:id", verifyToken, validateRequest(productUpdateSchema), updateProduct);
routes.delete("/products/:id", verifyToken, deleteProduct);
routes.patch("/products/:id/status", verifyToken, validateRequest(productStatusSchema), updateProductStatus);
routes.get("/products/:id/tools-config", verifyToken, getProductToolsConfig);
routes.get("/products/:id/tools-config-fe", getProductToolsConfigFe);   //for frontend testing without token
routes.put("/products/:id/tool-update/:toolId/:configOptionId", verifyToken, updateProductToolsConfig);
routes.post("/products/:id/add-config-option/:toolId", verifyToken, addConfigoptionToTool);
routes.delete("/products/:id/delete-config-option/:toolId/:configOptionId", verifyToken, deleteConfigOption);
routes.delete("/products/:id/delete-tool/:toolId", verifyToken, deleteProductTool);

// Customized product routes
routes.post("/products/customized", validateRequest(customizedProductSchema), createOrUpdateCustomizedProduct);
routes.get("/products/customized/:customizedByUser", verifyToken, getCustomizedProducts);

//logo file upload api
routes.post("/upload", upload.single("file"), uploadFile);


module.exports = routes;
