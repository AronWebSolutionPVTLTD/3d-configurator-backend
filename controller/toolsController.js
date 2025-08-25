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

module.exports = { getTools, getTool };
