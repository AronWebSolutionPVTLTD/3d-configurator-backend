const { asyncHandler } = require("../../middleware/asyncHandler");
const Product = require("../../model/Product");
const ProductTool = require("../../model/ProductTool");
const Tool = require("../../model/Tool");
const { successResponse } = require("../../utils/response");

// Create a new product
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    basePrice = 0,
    sport,
    images,
    tools,
    stock,
    status,
  } = req.body;
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
    status: status || "draft",
  });

  const isCreated = await product.save();

  if (isCreated?._id) {
    if (tools && tools.length > 0) {
      // Only fetch configurations for relevant tools and populate relatedModels.ref
      const toolConfigurations = await Tool.find({
        _id: { $in: tools },
      }).populate({
        path: "relatedModels.ref",
      });

      const productTools = tools.map((toolId) => {
        const configTool = toolConfigurations.find((tool) =>
          tool._id.equals(toolId)
        );
        // Map to full populated relatedModels objects
        const configuration = configTool
          ? configTool.relatedModels.map((rm) => ({
              ...(rm.ref?._doc || rm.ref), // get full populated data
              model: rm.model,
            }))
          : [];
        return {
          product: isCreated._id,
          tool: toolId,
          config: configuration,
        };
      });

      await ProductTool.insertMany(productTools);
    }
  }

  return successResponse(res, product, "Product created successfully", 201);
});

// Get all products with pagination and filtering
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    search,
    category,
    sport,
    status,
  } = req.query;
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

  const product = await Product.findOne({ _id: id, merchant });

  if (!product) {
    throw new Error("Product not found");
  }

  return successResponse(res, product, "Product retrieved successfully", 200);
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = req.user._id;
  const { tools = [], ...updateData } = req.body;

  // Update product without touching tools first
  const product = await Product.findOneAndUpdate(
    { _id: id, merchant },
    { ...updateData, tools },
    { new: true, runValidators: true }
  )
    .populate("sport", "name")
    .populate("tools");

  if (!product) {
    throw new Error("Product not found");
  }

  // If tools were sent in the request
  if (tools && tools.length > 0) {
    // Get already linked tools from ProductTool
    const existingTools = await ProductTool.find({
      product: product._id,
    }).select("tool");
    const existingToolIds = existingTools.map((pt) => pt.tool.toString());

    // Find which ones are NEW
    const newToolIds = tools.filter(
      (toolId) => !existingToolIds.includes(toolId.toString())
    );

    // Find which ones need to be REMOVED
    const removedToolIds = existingToolIds.filter(
      (toolId) => !tools.includes(toolId.toString())
    );

    // Insert NEW tools
    if (newToolIds.length > 0) {
      const toolConfigurations = await Tool.find({
        _id: { $in: newToolIds },
      }).populate("relatedModels.ref");

      const productTools = newToolIds.map((toolId) => {
        const configTool = toolConfigurations.find((t) => t._id.equals(toolId));
        const configuration = configTool
          ? configTool.relatedModels.map((rm) => ({
              ...(rm.ref?._doc || rm.ref),
              model: rm.model,
            }))
          : [];

        return {
          product: product._id,
          tool: toolId,
          config: configuration,
        };
      });

      await ProductTool.insertMany(productTools);
    }

    // Delete REMOVED tools
    if (removedToolIds.length > 0) {
      await ProductTool.deleteMany({
        product: product._id,
        tool: { $in: removedToolIds },
      });
    }
  }

  return successResponse(res, product, "Product updated successfully", 200);
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = req.user._id;

  const product = await Product.findOneAndDelete({ _id: id, merchant });

  // delete product tools as well

  if (!product) {
    throw new Error("Product not found");
  }

  await ProductTool.deleteMany({ product: product._id });
  return successResponse(res, product, "Product deleted successfully", 200);
});

// Update product status
const updateProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const merchant = req.user._id;

  const validStatuses = ["draft", "active", "inactive", "archived"];
  if (!validStatuses.includes(status)) {
    throw new Error(
      "Invalid status. Must be one of: draft, active, inactive, archived"
    );
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, merchant },
    { status },
    { new: true }
  ).populate("sport", "name");

  if (!product) {
    throw new Error("Product not found");
  }

  return successResponse(
    res,
    product,
    "Product status updated successfully",
    200
  );
});

//get product tools configuration
const getProductToolsConfig = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = req.user._id;

  const product = await Product.findOne({ _id: id, merchant });

  if (!product) {
    throw new Error("Product not found");
  }

  const productTools = await ProductTool.find({
    product: product._id,
  }).populate("tool");

  return successResponse(
    res,
    productTools,
    "Product tools configuration retrieved successfully",
    200
  );
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getProductToolsConfig,
};
