const { asyncHandler } = require("../middleware/asyncHandler");
const Tool = require("../model/Tool");
const { successResponse } = require("../utils/response");

const getTools = asyncHandler(async (req, res) => {
  const toolsMenu = await Tool.find().populate({
    path: "relatedModels.ref",
  });
  successResponse(res, toolsMenu);
});

// get a specific tool
const getTool = asyncHandler(async (req, res) => {
  const tool = await Tool.findById(req.params.id).populate({
    path: "relatedModels.ref",
  });
  
  successResponse(res, tool);
});

// create a new tool
const createTool = asyncHandler(async (req, res) => {
  const { value, label, description, relatedModels } = req.body;
  
  const tool = new Tool({
    value,
    label,
    description,
    relatedModels: relatedModels || []
  });

  await tool.save();
  return successResponse(res, tool, "Tool created successfully", 201);
});

module.exports = { getTools, getTool, createTool };
