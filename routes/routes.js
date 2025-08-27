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
} = require("../validation/productValidations");
const { toolSchema } = require("../validation/toolValidations");
const { patternSchema, patternUpdateSchema, patternQuerySchema } = require("../validation/patternValidations");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getProductToolsConfig,
} = require("../controller/merchantController/productController");
const {
  getPatterns,
  getPattern,
  createPattern,
  updatePattern,
  getPatternsByCategory,
} = require("../controller/merchantController/patternController");

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

//product routes
routes.get("/products", verifyToken, validateRequest(productQuerySchema), getProducts);
routes.get("/products/:id", verifyToken, getProduct);
routes.post("/products", verifyToken, validateRequest(productSchema), createProduct);
routes.put("/products/:id", verifyToken, validateRequest(productUpdateSchema), updateProduct);
routes.delete("/products/:id", verifyToken, deleteProduct);
routes.patch("/products/:id/status", verifyToken, validateRequest(productStatusSchema), updateProductStatus);
routes.get("/products/:id/tools-config", verifyToken, getProductToolsConfig);

//pattern routes
routes.post("/patterns", verifyToken, validateRequest(patternSchema), createPattern);
routes.get("/patterns", verifyToken, validateRequest(patternQuerySchema), getPatterns);
routes.get("/patterns/category/:category", verifyToken, getPatternsByCategory);
routes.get("/patterns/:id", verifyToken, getPattern);
routes.put("/patterns/:id", verifyToken, validateRequest(patternUpdateSchema), updatePattern);




module.exports = routes;
