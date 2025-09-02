const Color = require("../../model/Color");
const ProductTool = require("../../model/ProductTool");
const CustomColorSection = require("../../model/CustomColorSection");
const Tool = require("../../model/Tool");
const { asyncHandler } = require("../../middleware/asyncHandler");
const { sendResponse } = require("../../helper/status");

// Create a new color
const createColor = asyncHandler(async (req, res) => {
  const merchant = req.user._id;
  const { 
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
  const  merchant  = req.user._id;
  const { page = 1, limit = 10, status, category } = req.query;

  const query = {};
  
  // Add filters
  if (status) query.status = status;
  if (category) query.category = category;


  const colors = await Color.find({merchant:merchant, ...query})
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
  const { id } = req.params;
  const  merchant  = req.user._id;

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

// Update a color by ID
const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = req.user._id;
  const { 
    name, 
    description, 
    category, 
    defaultColor, 
    defaultGradient,
    productId,
    toolId,
    section,
    sectionOptions,
    colorConfig,
    status
  } = req.body;

  // Check if color exists and belongs to the merchant
  const existingColor = await Color.findOne({ _id: id, merchant });
  if (!existingColor) {
    return res.status(404).json({
      success: false,
      message: "Color not found"
    });
  }

  // Prepare update data
  const updateData = {};
  
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (defaultColor !== undefined) updateData.defaultColor = defaultColor;
  if (defaultGradient !== undefined) updateData.defaultGradient = defaultGradient;
  if (status !== undefined) updateData.status = status;

  // Handle colorSection updates if category or section options change
  if (category || sectionOptions || colorConfig) {
    let colorSection = existingColor.colorSection;
    
    if (category && category !== existingColor.category) {
      // Check if new category section exists, create if not
      let newColorSection = await CustomColorSection.findOne({ id: category });
      
      if (!newColorSection) {
        const defaultChildren = [];
        
        if (sectionOptions && sectionOptions.length > 0) {
          sectionOptions.forEach(option => {
            defaultChildren.push({
              id: option.id,
              name: option.name,
              value: defaultColor || existingColor.defaultColor,
              gradient: defaultGradient !== undefined ? defaultGradient : existingColor.defaultGradient,
              gradientConfig: (defaultGradient !== undefined ? defaultGradient : existingColor.defaultGradient) ? {
                type: "linear",
                angle: 0,
                balance: 0.5,
                feather: 0,
                colors: [
                  { color: defaultColor || existingColor.defaultColor, position: 0 },
                  { color: defaultColor || existingColor.defaultColor, position: 1 }
                ]
              } : {}
            });
          });
        }
        // Note: No default front/back sections - sectionOptions must be provided if needed


        newColorSection = await CustomColorSection.create({
          id: category,
          name: section || `${category.charAt(0).toUpperCase() + category.slice(1)}`,
          children: defaultChildren
        });
      }
      
      updateData.colorSection = newColorSection._id;
      colorSection = newColorSection._id;
    } else if (sectionOptions || colorConfig) {
      // Update existing color section
      const currentColorSection = await CustomColorSection.findById(existingColor.colorSection);
      if (currentColorSection) {
        if (sectionOptions && sectionOptions.length > 0) {
          const updatedChildren = [...currentColorSection.children];
          
          sectionOptions.forEach(option => {
            const existingIndex = updatedChildren.findIndex(child => child.id === option.id);
            if (existingIndex === -1) {
              // Add new section option
              updatedChildren.push({
                id: option.id,
                name: option.name,
                value: colorConfig?.[option.id]?.color || defaultColor || existingColor.defaultColor,
                gradient: colorConfig?.[option.id]?.gradient || defaultGradient !== undefined ? defaultGradient : existingColor.defaultGradient,
                gradientConfig: colorConfig?.[option.id]?.gradientConfig || ((defaultGradient !== undefined ? defaultGradient : existingColor.defaultGradient) ? {
                  type: "linear",
                  angle: 0,
                  balance: 0.5,
                  feather: 0,
                  colors: [
                    { color: defaultColor || existingColor.defaultColor, position: 0 },
                    { color: defaultColor || existingColor.defaultColor, position: 1 }
                  ]
                } : {})
              });
            } else {
              // Update existing section option
              updatedChildren[existingIndex] = {
                ...updatedChildren[existingIndex],
                value: colorConfig?.[option.id]?.color || updatedChildren[existingIndex].value,
                gradient: colorConfig?.[option.id]?.gradient !== undefined ? colorConfig[option.id].gradient : updatedChildren[existingIndex].gradient,
                gradientConfig: colorConfig?.[option.id]?.gradientConfig || updatedChildren[existingIndex].gradientConfig
              };
            }
          });
          
          currentColorSection.children = updatedChildren;
          await currentColorSection.save();
        }
      }
    }
  }

  // Handle tools updates if productId or toolId change
  if (productId || toolId) {
    let tools = [...existingColor.tools];
    
    if (productId && toolId) {
      // Check if ProductTool already exists
      let productTool = await ProductTool.findOne({
        product: productId,
        tool: toolId
      });
      
      if (!productTool) {
        // Create new ProductTool
        productTool = await ProductTool.create({
          product: productId,
          tool: toolId,
          config: {
            defaultColor: defaultColor || existingColor.defaultColor,
            defaultGradient: defaultGradient !== undefined ? defaultGradient : existingColor.defaultGradient,
            category: category || existingColor.category,
            section,
            colorConfig
          }
        });
      } else {
        // Update existing ProductTool config
        productTool.config = {
          ...productTool.config,
          defaultColor: defaultColor || existingColor.defaultColor,
          defaultGradient: defaultGradient !== undefined ? defaultGradient : existingColor.defaultGradient,
          category: category || existingColor.category,
          section,
          colorConfig
        };
        await productTool.save();
      }
      
      // Add to tools array if not already present
      if (!tools.includes(productTool._id)) {
        tools.push(productTool._id);
      }
      
      updateData.tools = tools;
    }
  }

  // Update the color
  const updatedColor = await Color.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate("colorSection", "id name children")
    .populate("tools", "product tool config");

  return sendResponse(res, 200, true, "Color updated successfully", updatedColor);
});

// Delete a color by ID
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const merchant = req.user._id;

  // Check if color exists and belongs to the merchant
  const existingColor = await Color.findOne({ _id: id, merchant });
  if (!existingColor) {
    return res.status(404).json({
      success: false,
      message: "Color not found"
    });
  }

  // Check if color is being used in any active configurations
  const isColorInUse = await ProductTool.findOne({
    _id: { $in: existingColor.tools },
    "config.category": existingColor.category
  });

  if (isColorInUse) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete color as it is currently being used in product configurations. Please remove it from all products first."
    });
  }

  // Delete associated ProductTool records
  if (existingColor.tools && existingColor.tools.length > 0) {
    await ProductTool.deleteMany({ _id: { $in: existingColor.tools } });
  }

  // Check if CustomColorSection is used by other colors
  const otherColorsUsingSection = await Color.findOne({
    _id: { $ne: id },
    colorSection: existingColor.colorSection,
    merchant
  });

  // Delete CustomColorSection if no other colors are using it
  if (!otherColorsUsingSection) {
    await CustomColorSection.findByIdAndDelete(existingColor.colorSection);
  }

  // Delete the color
  await Color.findByIdAndDelete(id);

  return sendResponse(res, 200, true, "Color deleted successfully", {
    deletedColorId: id,
    message: "Color and associated data have been removed"
  });
});

module.exports = {
  createColor,
  getColors,
  getColor,
  updateColor,
  deleteColor
};
