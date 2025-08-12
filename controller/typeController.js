const { sendResponse } = require("../helper/status");
const TypeConfiguration = require("../model/configuration/typeConfiguration");


//------TYPE CONFIGURATION------
const createTypeConfiguration = async (req, res) => {
    try {
        const { menuId, title, description, productTypes } = req.body;
        
        // Check if type configuration already exists for this menu
        const existingConfig = await TypeConfiguration.findOne({ menuId });
        if (existingConfig) {
            return sendResponse(res, 400, false, "Type configuration already exists for this menu");
        }

        const typeConfiguration = new TypeConfiguration({
            menuId,
            title,
            description,
            productTypes
        });

        await typeConfiguration.save();
        return sendResponse(res, 200, true, "Type configuration created successfully", typeConfiguration);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, error.message);
    }
}

const getTypeConfiguration = async (req, res) => {
    try {
        const { id } = req.params;
        
        const typeConfiguration = await TypeConfiguration.findOne({ 
            id, 
            isActive: true 
        }).populate('id');

        if (!typeConfiguration) {
            return sendResponse(res, 404, false, "Type configuration not found");
        }

        return sendResponse(res, 200, true, "Type configuration fetched successfully", typeConfiguration);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, error.message);
    }
}

const updateTypeConfiguration = async (req, res) => {
    try {
        const { menuId } = req.params;
        const updateData = req.body;

        const typeConfiguration = await TypeConfiguration.findOneAndUpdate(
            { menuId, isActive: true },
            updateData,
            { new: true, runValidators: true }
        );

        if (!typeConfiguration) {
            return sendResponse(res, 404, false, "Type configuration not found");
        }

        return sendResponse(res, 200, true, "Type configuration updated successfully", typeConfiguration);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, error.message);
    }
}







module.exports = { 
    createTypeConfiguration,
    getTypeConfiguration,
    updateTypeConfiguration
};