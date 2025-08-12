const Design = require("../model/configuration/designConfiguration");
const { sendResponse } = require("../helper/status");

// Create a new design
const createDesign = async (req, res) => {
    try {
        const { value, name, src, category, description, tags, metadata, sortOrder } = req.body;
        
        // Check if design with same value already exists
        const existingDesign = await Design.findOne({ value });
        if (existingDesign) {
            return sendResponse(res, 400, false, "Design with this value already exists");
        }

        const design = new Design({
            value,
            name,
            src,
            category,
            description,
            tags,
            metadata,
            sortOrder
        });

        await design.save();
        return sendResponse(res, 201, true, "Design created successfully", design);
    } catch (error) {
        console.error("Error creating design:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Get all designs with optional filtering
const getDesigns = async (req, res) => {
    try {
        console.log("getDesigns-->");
        const { isActive, category, sortBy = 'sortOrder', order = 'asc' } = req.query;
        
        let query = {};
        
        // Filter by active status
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Build sort object
        const sortObject = {};
        sortObject[sortBy] = order === 'desc' ? -1 : 1;
        
        const designs = await Design.find(query)
            .sort(sortObject)
            .select('-__v');
            
        return sendResponse(res, 200, true, "Designs fetched successfully", designs);
    } catch (error) {
        console.error("Error fetching designs:", error);
        return sendResponse(res, 500, false, error.message);
    }
};


// Update design
const updateDesign = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Remove fields that shouldn't be updated
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        
        const design = await Design.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!design) {
            return sendResponse(res, 404, false, "Design not found");
        }
        
        return sendResponse(res, 200, true, "Design updated successfully", design);
    } catch (error) {
        console.error("Error updating design:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Delete design
const deleteDesign = async (req, res) => {
    try {
        const { id } = req.params;
        
        const design = await Design.findByIdAndDelete(id);
        if (!design) {
            return sendResponse(res, 404, false, "Design not found");
        }
        
        return sendResponse(res, 200, true, "Design deleted successfully");
    } catch (error) {
        console.error("Error deleting design:", error);
        return sendResponse(res, 500, false, error.message);
    }
};


module.exports = {
    createDesign,
    getDesigns,
    updateDesign,
    deleteDesign,
};
