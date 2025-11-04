const { asyncHandler } = require("../../middleware/asyncHandler");
const Product = require("../../model/Product");
const ProductTool = require("../../model/ProductTool");
const Tool = require("../../model/Tool");
const { successResponse } = require("../../utils/response");
const mongoose = require("mongoose");

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

const getProductToolsConfigFe = asyncHandler(async (req, res) => {
  console.log("getProductToolsConfigTest");
  const { id } = req.params;
  const { uid } = req.query;
  const productInfo = await Product.findOne({ referencedProduct: id, customizedByUser: uid, isCustomizedByUser: true });

  if (productInfo) {
    const productTools = await ProductTool.find({
      product: productInfo._id,
    }).populate("tool");
    return successResponse(
      res,
      productTools,
      "Product tools configuration retrieved successfully",
      200
    );
  }

  const product = await Product.findOne({ _id: id });

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

const updateProductToolsConfig = asyncHandler(async (req, res) => {
  const { id, toolId, configOptionId } = req.params;
  const merchant = req.user._id;
  const { config } = req.body;

  console.log(id, toolId, configOptionId, config);

  const product = await Product.findOne({ _id: id, merchant });

  if (!product) {
    throw new Error("Product not found");
  }
  // console.log(product);

  // First find the existing product tool to get current config
  const existingProductTool = await ProductTool.findOne({
    product: product._id,
    tool: toolId,
  });

  if (!existingProductTool) {
    throw new Error("Product tool not found");
  }

  // Update with the new config using MongoDB's arrayFilters for efficient updates
  // Build update object with prefix "config.$[elem]."
  const updateFields = {};
  for (const [key, value] of Object.entries(config)) {
    updateFields[`config.$[elem].${key}`] = value;
  }

  // Use updateOne with arrayFilters to update specific element in config array
  const updateResult = await ProductTool.updateOne(
    {
      product: product._id,
      tool: toolId,
    },
    {
      $set: updateFields,
    },
    {
      arrayFilters: [
        { "elem._id": new mongoose.Types.ObjectId(configOptionId) },
      ],
    }
  );

  if (updateResult.matchedCount === 0) {
    throw new Error("Product tool not found");
  }

  if (updateResult.modifiedCount === 0) {
    throw new Error("No changes made to configuration");
  }

  // Fetch the updated document to return
  const productTools = await ProductTool.findOne({
    product: product._id,
    tool: toolId,
  }).populate("tool");

  if (!productTools) {
    throw new Error("Product tool not found");
  }

  return successResponse(
    res,
    productTools,
    "Product tools configuration updated successfully",
    200
  );
});

const addConfigoptionToTool = asyncHandler(async (req, res) => {
  const { id, toolId } = req.params;
  const merchant = req.user._id;
  const { config } = req.body;

  console.log("Adding new config option:", id, toolId, config);

  // Verify product exists and belongs to merchant
  const product = await Product.findOne({ _id: id, merchant });

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if product tool exists
  const existingProductTool = await ProductTool.findOne({
    product: product._id,
    tool: toolId,
  });

  if (!existingProductTool) {
    throw new Error("Product tool not found");
  }

  // Add new config option to the config array
  // Ensure the new config has an _id and other required fields
  const newConfigOption = {
    _id: new mongoose.Types.ObjectId(),
    ...config,
    createdAt: new Date(),
    updatedAt: new Date(),
    __v: 0
  };

  const updateResult = await ProductTool.updateOne(
    {
      product: product._id,
      tool: toolId,
    },
    {
      $push: { config: newConfigOption },
    }
  );

  if (updateResult.matchedCount === 0) {
    throw new Error("Product tool not found");
  }

  if (updateResult.modifiedCount === 0) {
    throw new Error("Failed to add new config option");
  }

  // Fetch the updated document to return
  const productTools = await ProductTool.findOne({
    product: product._id,
    tool: toolId,
  }).populate("tool");

  if (!productTools) {
    throw new Error("Product tool not found");
  }

  return successResponse(
    res,
    productTools,
    "New config option added successfully",
    200
  );
});

const deleteConfigOption = asyncHandler(async (req, res) => {
  const { id, toolId, configOptionId } = req.params;
  const merchant = req.user._id;

  // Verify product belongs to merchant
  const product = await Product.findOne({ _id: id, merchant });
  if (!product) {
    throw new Error("Product not found");
  }

  // Remove the specific config option from config array
  const productTool = await ProductTool.findOneAndUpdate(
    {
      product: product._id,
      tool: toolId,
    },
    {
      $pull: { config: { _id: new mongoose.Types.ObjectId(configOptionId) } },
    },
    { new: true } // return updated document
  );

  if (!productTool) {
    throw new Error("Product tool not found");
  }

  return successResponse(
    res,
    productTool,
    "Config option deleted successfully",
    200
  );
});

const deleteProductTool = asyncHandler(async (req, res) => {
  const { id, toolId } = req.params;
  const merchant = req.user._id;
  const product = await Product.findOne({ _id: id, merchant });
  if (!product) {
    throw new Error("Product not found");
  }
  const productTool = await ProductTool.findOneAndDelete({
    product: product._id,
    tool: toolId,
  });
  if (!productTool) {
    throw new Error("Product tool not found");
  }
  return successResponse(
    res,
    productTool,
    "Product tool deleted successfully",
    200
  );
});

// Create or update customized product
const createOrUpdateCustomizedProduct = asyncHandler(async (req, res) => {
  const {
    referencedProduct,
    customizedByUser,
    name,
    description,
    basePrice,
    images,
    tools,
  } = req.body;

  // First, find the referenced product to get its base data
  const originalProduct = await Product.findById(referencedProduct);

  if (!originalProduct) {
    throw new Error("Referenced product not found");
  }

  // Check if a customized product already exists for this user and referenced product
  const existingCustomizedProduct = await Product.findOne({
    referencedProduct: referencedProduct,
    customizedByUser: customizedByUser,
    isCustomizedByUser: true,
  });

  let customizedProduct;

  if (existingCustomizedProduct) {
    // Update existing customized product
    const updateData = {
      updatedAt: new Date(),
    };

    // Add optional fields if provided
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (basePrice !== undefined) updateData.basePrice = basePrice;
    if (images) updateData.images = images;
    if (tools) updateData.tools = tools;

    customizedProduct = await Product.findOneAndUpdate(
      { _id: existingCustomizedProduct._id },
      updateData,
      { new: true, runValidators: true }
    )
      .populate("sport", "name")
      .populate("tools");

    // Handle tools update if tools were provided
    if (tools && tools.length > 0) {
      // 1️⃣ Fetch all existing ProductTool entries for this product
      const existingTools = await ProductTool.find({ product: customizedProduct._id });
      const existingToolIds = existingTools.map((pt) => pt.tool.toString());

      // 2️⃣ Fetch tool configurations for provided tool IDs
      const toolIds = tools.map((t) => t?.tool?._id || t._id);
      const toolConfigurations = await Tool.find({ _id: { $in: toolIds } }).populate({
        path: "relatedModels.ref",
      });

      // 3️⃣ Iterate through each incoming tool
      for (const incomingTool of tools) {
        const toolId = incomingTool?.tool?._id?.toString() || incomingTool?._id?.toString();

        if (!toolId) continue;

        const existingTool = existingTools.find((pt) => pt.tool.toString() === toolId);
        const configTool = toolConfigurations.find((t) => t._id.equals(toolId));

        // ✅ Prepare configuration
        const configuration = Array.isArray(incomingTool.config)
          ? incomingTool.config
          : configTool
            ? configTool.relatedModels.map((rm) => ({
              ...(rm.ref?._doc || rm.ref),
              model: rm.model,
            }))
            : [];

        if (existingTool) {
          // 4️⃣ UPDATE existing ProductTool config
          await ProductTool.findByIdAndUpdate(
            existingTool._id,
            { config: configuration, updatedAt: new Date() },
            { new: true, runValidators: true }
          );
        } else {
          // 5️⃣ CREATE new ProductTool entry
          await ProductTool.create({
            product: customizedProduct._id,
            tool: toolId, // ✅ same structure as in creation block
            config: configuration,
          });
        }
      }

      // 6️⃣ Remove tools no longer present in request
      const incomingToolIds = toolIds.map((id) => id.toString());
      const removedToolIds = existingToolIds.filter((id) => !incomingToolIds.includes(id));

      if (removedToolIds.length > 0) {
        await ProductTool.deleteMany({
          product: customizedProduct._id,
          tool: { $in: removedToolIds },
        });
      }
    }




  } else {
    // Create new customized product
    const toolsToUse = tools || originalProduct.tools;

    // Create the customized product based on the original
    const customizedProductData = {
      merchant: originalProduct.merchant,
      sport: originalProduct.sport,
      category: originalProduct.category,
      name: name || `${originalProduct.name} (Customized)`,
      description: description || originalProduct.description,
      basePrice: basePrice !== undefined ? basePrice : originalProduct.basePrice,
      images: images || originalProduct.images,
      tools: toolsToUse,
      stock: originalProduct.stock,
      status: "draft", // Customized products start as draft
      isCustomizedByUser: true,
      customizedByUser: customizedByUser,
      referencedProduct: referencedProduct,
    };

    customizedProduct = new Product(customizedProductData);
    const isCreated = await customizedProduct.save();

    // Handle tools creation if tools exist
    if (isCreated?._id && toolsToUse && toolsToUse.length > 0) {
      // Only fetch configurations for relevant tools and populate relatedModels.ref
      console.log("Creating ProductTools for tools:", toolsToUse);
      const toolConfigurations = await Tool.find({
        _id: { $in: toolsToUse },
      }).populate({
        path: "relatedModels.ref",
      });

      const productTools = toolsToUse.map((toolId) => {
        const configTool = toolConfigurations.find((tool) =>
          tool._id.equals(toolId)
        );
        // Map to full populated relatedModels objects
        const configuration = configTool
          ? configTool.relatedModels.map((rm) => ({
            ...(rm.ref?._doc || rm.ref), // get full populated data
            model: rm.model,
          }))
          : toolId.config || []; // if no configTool found, use empty array or existing config if any
        return {
          product: isCreated._id,
          tool: toolId?.tool?._id,
          config: configuration,
        };
      });

      await ProductTool.insertMany(productTools);
    }

    // Populate the created product
    await customizedProduct.populate('sport category tools');
  }

  return successResponse(
    res,
    customizedProduct,
    existingCustomizedProduct ? "Customized product updated successfully" : "Customized product created successfully",
    200
  );
});

// Get customized products for a user
const getCustomizedProducts = asyncHandler(async (req, res) => {
  const { customizedByUser } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const skip = (page - 1) * limit;

    const customizedProducts = await Product.find({
      customizedByUser: customizedByUser,
      isCustomizedByUser: true,
    })
      .populate('sport category tools')
      .populate('reffrencedProduct', 'name basePrice images')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments({
      customizedByUser: customizedByUser,
      isCustomizedByUser: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        products: customizedProducts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });

  } catch (error) {
    console.error("Error in getCustomizedProducts:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching customized products",
      error: error.message,
    });
  }
});

const uploadFile = asyncHandler(async (req, res) => {
  const file = req.file;
  if (!file) {
    throw new Error("No file uploaded");
  }

  const fileUrl = `/uploads/${file.filename}`;
  return successResponse(res, { url: fileUrl }, "Product created successfully", 201);
})

module.exports = {
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
  uploadFile
};
