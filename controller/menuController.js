
const { sendResponse } = require("../helper/status");
const MenuConfiguration = require("../model/configuration/menuConfiguration");

//------MENU CONFIGURATION------
const createMenuConfiguration = async (req, res) => {
    try {
        const { id, name, icon, type, isActive, sortOrder, isSelected, hasSubItems, subItems, contentModel, hasTabs, tabs } = req.body;
        // Check if menu item already exists

        const existingMenu = await MenuConfiguration.findOne({ id });
        if (existingMenu) {
            return sendResponse(res, 400, false, "Menu item already exists");
        }

        const menuConfiguration = new MenuConfiguration({ 
            id, 
            name, 
            icon, 
            type, 
            isActive, 
            sortOrder, 
            isSelected, 
            hasSubItems, 
            subItems,
            contentModel,
            hasTabs,
            tabs
        });
        
        await menuConfiguration.save();
        return sendResponse(res, 200, true, "Menu configuration created successfully", menuConfiguration);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, error.message);
    }
}
const getMenuConfiguration = async (req, res) => {
    try {
        const menuConfigurations = await MenuConfiguration.find({ isActive: true }).sort({ sortOrder: 1, type: 1 });
        return sendResponse(res, 200, true, "Menu configuration fetched successfully", menuConfigurations);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, error.message);
    }
}
const updateMenuConfiguration = async (req, res) => {
    try {
        const { id, name, icon, type, isActive, sortOrder, isSelected, hasSubItems, subItems, contentModel, hasTabs, tabs } = req.body;
        const menuConfiguration = await MenuConfiguration.findOneAndUpdate({ id }, { name, icon, type, isActive, sortOrder, isSelected, hasSubItems, subItems, contentModel, hasTabs, tabs }, { new: true });
        return sendResponse(res, 200, true, "Menu configuration updated successfully", menuConfiguration);
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, error.message);
    }
}




module.exports = { 
    createMenuConfiguration, 
    getMenuConfiguration,
    updateMenuConfiguration,
};