const { asyncHandler } = require("../../middleware/asyncHandler");
const Product = require("../../model/Product");
const { successResponse } = require("../../utils/response");

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, basePrice, sport, images, tools, stock, status } = req.body;
  const merchant = req.user._id;

  const product = new Product({
    merchant,
    sport,
    name,
    description,
    category,
    basePrice,
    images: images || [],
    tools: tools || [],
    stock: stock || { quantity: 0, isUnlimited: false },
    status: status || "draft"
  });

  await product.save();
  return successResponse(res, product, "Product created successfully", 201);
});

// Get all products with pagination and filtering
const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search, category, sport, status } = req.query;
  const merchant = req.user._id;

  const query = { merchant };
  
  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  if (sport) {
    query.sport = sport;
  }
  if (status) {
    query.status = status;
  }

  const products = await Product.find(query)
    .populate("sport", "name")
    .populate("tools")
    .sort({ [sortBy]: order === "asc" ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const totalCount = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  const response = {
    products,
    totalCount,
    totalPages,
    currentPage: parseInt(page),
    pageSize: parseInt(limit),
  };

  return successResponse(res, response, "Products retrieved successfully", 200);
});

// Get a single product by ID
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = req.user._id;

  const product = await Product.findOne({ _id: id, merchant })
    .populate("sport", "name")
    .populate("tools")
    .populate({
      path: "tools",
      populate: {
        path: "relatedModels.ref"
      }
    });

  if (!product) {
    throw new Error("Product not found");
  }

  return successResponse(res, product, "Product retrieved successfully", 200);
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = req.user._id;
  const updateData = req.body;

  const product = await Product.findOneAndUpdate(
    { _id: id, merchant },
    updateData,
    { new: true, runValidators: true }
  ).populate("sport", "name").populate("tools");

  if (!product) {
    throw new Error("Product not found");
  }

  return successResponse(res, product, "Product updated successfully", 200);
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = req.user._id;

  const product = await Product.findOneAndDelete({ _id: id, merchant });
  
  if (!product) {
    throw new Error("Product not found");
  }

  return successResponse(res, product, "Product deleted successfully", 200);
});

// Update product status
const updateProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const merchant = req.user._id;

  const validStatuses = ["draft", "active", "inactive", "archived"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status. Must be one of: draft, active, inactive, archived");
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, merchant },
    { status },
    { new: true }
  ).populate("sport", "name");

  if (!product) {
    throw new Error("Product not found");
  }

  return successResponse(res, product, "Product status updated successfully", 200);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
};
