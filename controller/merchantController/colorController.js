const Color = require("../../model/Color");
const ProductTool = require("../../model/ProductTool");
const CustomColorSection = require("../../model/CustomColorSection");
const Tool = require("../../model/Tool");
const { asyncHandler } = require("../../middleware/asyncHandler");
const { sendResponse } = require("../../helper/status");

// Create a new color
const createColor = asyncHandler(async (req, res) => {
  const { 
    merchant, 
    name, 
    description, 
    category, 
    defaultColor, 
    defaultGradient,
    productId,
    toolId,
    // New fields for section-specific customization
    section,
    sectionOptions,
    colorConfig
  } = req.body;

  // 1. Create or find CustomColorSection for the category
  let colorSection = await CustomColorSection.findOne({ id: category });
  
  if (!colorSection) {
    // Create new color section if it doesn't exist
    const defaultChildren = [];
    
    // Add section-specific children based on the section parameter
    if (sectionOptions && sectionOptions.length > 0) {
      sectionOptions.forEach(option => {
        defaultChildren.push({
          id: option.id,
          name: option.name,
          value: defaultColor,
          gradient: defaultGradient,
          gradientConfig: defaultGradient ? {
            type: "linear",
            angle: 0,
            balance: 0.5,
            feather: 0,
            colors: [
              { color: defaultColor, position: 0 },
              { color: defaultColor, position: 1 }
            ]
          } : {}
        });
      });
    } else {
      // Default front/back if no specific options provided
      defaultChildren.push(
        {
          id: "front",
          name: "Front",
          value: defaultColor,
          gradient: defaultGradient,
          gradientConfig: defaultGradient ? {
            type: "linear",
            angle: 0,
            balance: 0.5,
            feather: 0,
            colors: [
              { color: defaultColor, position: 0 },
              { color: defaultColor, position: 1 }
            ]
          } : {}
        },
        {
          id: "back",
          name: "Back",
          value: defaultColor,
          gradient: defaultGradient,
          gradientConfig: defaultGradient ? {
            type: "linear",
            angle: 0,
            balance: 0.5,
            feather: 0,
            colors: [
              { color: defaultColor, position: 0 },
              { color: defaultColor, position: 1 }
            ]
          } : {}
        }
      );
    }

    colorSection = await CustomColorSection.create({
      id: category,
      name: section || `${category.charAt(0).toUpperCase() + category.slice(1)}`,
      children: defaultChildren
    });
  } else {
    // Update existing color section with new section options if provided
    if (sectionOptions && sectionOptions.length > 0) {
      const updatedChildren = [...colorSection.children];
      
      sectionOptions.forEach(option => {
        const existingIndex = updatedChildren.findIndex(child => child.id === option.id);
        if (existingIndex === -1) {
          // Add new section option
          updatedChildren.push({
            id: option.id,
            name: option.name,
            value: colorConfig?.[option.id]?.color || defaultColor,
            gradient: colorConfig?.[option.id]?.gradient || defaultGradient,
            gradientConfig: colorConfig?.[option.id]?.gradientConfig || (defaultGradient ? {
              type: "linear",
              angle: 0,
              balance: 0.5,
              feather: 0,
              colors: [
                { color: defaultColor, position: 0 },
                { color: defaultColor, position: 1 }
              ]
            } : {})
          });
        } else {
          // Update existing section option
          updatedChildren[existingIndex] = {
            ...updatedChildren[existingIndex],
            value: colorConfig?.[option.id]?.color || updatedChildren[existingIndex].value,
            gradient: colorConfig?.[option.id]?.gradient || updatedChildren[existingIndex].gradient,
            gradientConfig: colorConfig?.[option.id]?.gradientConfig || updatedChildren[existingIndex].gradientConfig
          };
        }
      });
      
      colorSection.children = updatedChildren;
      await colorSection.save();
    }
  }

  // 2. Create ProductTool if productId and toolId are provided
  let tools = [];
  if (productId && toolId) {
    const productTool = await ProductTool.create({
      product: productId,
      tool: toolId,
      config: {
        defaultColor,
        defaultGradient,
        category,
        section,
        colorConfig
      }
    });
    tools = [productTool._id];
  }

  // 3. Create the color
  const color = await Color.create({
    merchant,
    name,
    description,
    category,
    colorSection: colorSection._id,
    defaultColor,
    defaultGradient,
    tools
  });

  // 4. Populate the created color with related data
  const populatedColor = await Color.findById(color._id)
    .populate("colorSection", "id name children")
    .populate("tools", "product tool config");

  return sendResponse(res, 201, true, "Color created successfully", populatedColor);
});

// Get all colors for a merchant
const getColors = asyncHandler(async (req, res) => {
  const { merchant } = req.user;
  const { page = 1, limit = 10, status, category } = req.query;

  const query = { merchant };
  
  // Add filters
  if (status) query.status = status;
  if (category) query.category = category;

  const colors = await Color.find(query)
    .populate("colorSection", "id name")
    .populate("tools", "product tool config")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const total = await Color.countDocuments(query);

  return sendResponse(res, 200, true, "Colors retrieved successfully", {
    colors,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  });
});

// Get a single color by ID
const getColor = asyncHandler(async (req, res) => {
  console.log("----6-----");
  const { id } = req.params;
  const { merchant } = req.user;

  const color = await Color.findOne({ _id: id, merchant })
    .populate("colorSection", "id name children")
    .populate("tools", "product tool config");

  if (!color) {
    return res.status(404).json({
      success: false,
      message: "Color not found"
    });
  }

  return sendResponse(res, 200, true, "Color retrieved successfully", color);
});

module.exports = {
  createColor,
  getColors,
  getColor
};
