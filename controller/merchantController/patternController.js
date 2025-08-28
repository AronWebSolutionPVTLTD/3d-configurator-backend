const { asyncHandler } = require("../../middleware/asyncHandler");
const Pattern = require("../../model/Pattern");
const { sendResponse } = require("../../helper/status");
const Tool = require("../../model/Tool");
const ProductTool = require("../../model/ProductTool");

// Get all patterns with optional filtering
const getPatterns = asyncHandler(async (req, res) => {
    try {
        const { status, category, merchant } = req.query;
        
        let query = {};
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Filter by merchant
        if (merchant) {
            query.merchant = merchant;
        }
        
        const patterns = await Pattern.find(query)
            .populate('merchant', 'name email')
            .sort({ createdAt: -1 })
            .select('-__v');
            
        return sendResponse(res, 200, true, "Patterns fetched successfully", patterns);
    } catch (error) {
        console.error("Error fetching patterns:", error);
        return sendResponse(res, 500, false, error.message);
    }
});

// Get pattern by ID
const getPattern = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        
        const pattern = await Pattern.findById(id)
            .populate('merchant', 'name email')
            .select('-__v');
            
        if (!pattern) {
            return sendResponse(res, 404, false, "Pattern not found");
        }
        
        return sendResponse(res, 200, true, "Pattern fetched successfully", pattern);
    } catch (error) {
        console.error("Error fetching pattern:", error);
        return sendResponse(res, 500, false, error.message);
    }
});

// Create a new pattern
const createPattern = asyncHandler(async (req, res) => {
    try {
        const { name, description, category, image, defaultScale, defaultAngle, defaultColor, defaultBackgroundColor, tools } = req.body;
        
        const pattern = new Pattern({
            merchant: req.user.id, 
            name,
            description,
            category,
            image,
            defaultScale,
            defaultAngle,
            defaultColor,
            defaultBackgroundColor,
            tools
        });

       const isCreated = await pattern.save();

        if (isCreated?._id) {
            if (tools && tools.length > 0) {
              // Only fetch configurations for relevant tools and populate relatedModels.ref
              const toolConfigurations = await Tool.find({
                _id: { $in: tools },
              }).populate({
                path: "relatedModels.ref",
              });
              const productTool = tools.map((toolId) => {
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
              await ProductTool.insertMany(productTool);
            }        
          }
        
        const populatedPattern = await Pattern.findById(pattern._id)
            .populate('merchant', 'name email')
            .select('-__v');
            
        return sendResponse(res, 201, true, "Pattern created successfully", populatedPattern);
    } catch (error) {
        console.error("Error creating pattern:", error);
        return sendResponse(res, 500, false, error.message);
    }
});

// Update pattern
const updatePattern = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { tools = [], ...updateData } = req.body;
        
        const pattern = await Pattern.findOneAndUpdate(
            { _id: id, merchant },
            { ...updateData, tools },
            { new: true, runValidators: true }
          )
            .populate("merchant", "name email")
            .populate("tools");
    
        if (!pattern) {
            return sendResponse(res, 404, false, "Pattern not found");
        }
        
        if (tools && tools.length > 0) {
            // Get already linked tools from ProductTool
            const existingTools = await ProductTool.find({
              product: pattern._id,
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
        return sendResponse(res, 200, true, "Pattern updated successfully", pattern);
    } catch (error) {
        console.error("Error updating pattern:", error);
        return sendResponse(res, 500, false, error.message);
    }
});

// Get patterns by category
const getPatternsByCategory = asyncHandler(async (req, res) => {
    try {
        const { category } = req.params;
        const { status = 'active' } = req.query;
        
        const patterns = await Pattern.find({ 
            category, 
            status 
        })
        .populate('merchant', 'name email')
        .sort({ createdAt: -1 })
        .select('-__v');
        
        return sendResponse(res, 200, true, "Patterns fetched successfully", patterns);
    } catch (error) {
        console.error("Error fetching patterns by category:", error);
        return sendResponse(res, 500, false, error.message);
    }
});

// Delete pattern
const deletePattern = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const merchant = req.user._id;

        const product = await Pattern.findByIdAndDelete({ _id: id, merchant });
          
        if (!product) {
            throw new Error("Product not found");
        }

        await ProductTool.deleteMany({ product: product._id });

        return sendResponse(res, 200, true, "Pattern deleted successfully");
    } catch (error) {
        console.error("Error deleting pattern:", error);
        return sendResponse(res, 500, false, error.message);
    }
});


module.exports = {
    getPatterns,
    getPattern,
    createPattern,
    updatePattern,
    getPatternsByCategory,
    deletePattern
};
