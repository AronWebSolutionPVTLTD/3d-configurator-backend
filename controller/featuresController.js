const mongoose = require('mongoose');
const FeaturesConfiguration = require("../model/configuration/featuresConfiguration");
const { sendResponse } = require("../helper/status");

// Create a new features configuration
const createFeaturesConfiguration = async (req, res) => {
    try {
        const { 
            menuId, 
            title, 
            description, 
            features, 
            isActive 
        } = req.body;
        
        // Check if features configuration with same menuId already exists
        const existingFeatures = await FeaturesConfiguration.findOne({ menuId });
        if (existingFeatures) {
            return sendResponse(res, 400, false, "Features configuration with this menuId already exists");
        }

        const featuresConfiguration = new FeaturesConfiguration({
            menuId,
            title,
            description,
            features,
            isActive
        });

        await featuresConfiguration.save();
        return sendResponse(res, 201, true, "Features configuration created successfully", featuresConfiguration);
    } catch (error) {
        console.error("Error creating features configuration:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Get features configurations with comprehensive filtering and options
const getFeaturesConfigurations = async (req, res) => {
    try {
        const { 
            isActive, 
            menuId, 
            id, 
            featureId, 
            activeOnly ,
            sortBy = 'createdAt', 
            order = 'desc' 
        } = req.query;
        
        let query = {};
        
        // Filter by active status
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }
        
        // Filter by menuId
        if (menuId) {
            query.menuId = menuId;
        }
        
        // Filter by specific ID with proper validation
        if (id) {
            // Validate if the ID is a valid MongoDB ObjectId

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return sendResponse(res, 400, false, "Invalid ID format. Please provide a valid MongoDB ObjectId");
            }
            query._id = id;
        }
        
        // Build sort object
        const sortObject = {};
        sortObject[sortBy] = order === 'desc' ? -1 : 1;
        
        let featuresConfigurations = await FeaturesConfiguration.find(query)
            .sort(sortObject)
            .select('-__v');
        
        // If activeOnly is true, filter to show only active features within each configuration
        if (activeOnly === 'true') {
            featuresConfigurations = featuresConfigurations.map(config => {
                const activeFeatures = config.features.filter(feature => feature.isActive);
                return {
                    ...config.toObject(),
                    features: activeFeatures
                };
            });
        }
        
        // If featureId is provided, return only that specific feature
        if (featureId) {
            const featureResults = [];
            featuresConfigurations.forEach(config => {
                const feature = config.features.find(f => f.id === featureId && f.isActive);
                if (feature) {
                    featureResults.push({
                        configurationId: config._id,
                        menuId: config.menuId,
                        feature: feature
                    });
                }
            });
            
            if (featureResults.length === 0) {
                return sendResponse(res, 404, false, "Feature not found");
            }
            
            return sendResponse(res, 200, true, "Feature fetched successfully", featureResults);
        }
        
        // If specific ID was requested but no results found, return empty response
        if (id && featuresConfigurations.length === 0) {
            return sendResponse(res, 200, true, "No features configuration found with the provided ID", []);
        }
        
        // Return array of results
        return sendResponse(res, 200, true, "Features configurations fetched successfully", featuresConfigurations);
    } catch (error) {
        console.error("Error fetching features configurations:", error);
        return sendResponse(res, 500, false, error.message);
    }
};


// Update features configuration
const updateFeaturesConfiguration = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid ID format. Please provide a valid MongoDB ObjectId");
        }
        
        // Remove fields that shouldn't be updated
        delete updateData._id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        
        const featuresConfiguration = await FeaturesConfiguration.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!featuresConfiguration) {
            return sendResponse(res, 200, true, "No features configuration found with the provided ID", null);
        }
        
        return sendResponse(res, 200, true, "Features configuration updated successfully", featuresConfiguration);
    } catch (error) {
        console.error("Error updating features configuration:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Delete features configuration
const deleteFeaturesConfiguration = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid ID format. Please provide a valid MongoDB ObjectId");
        }
        
        const featuresConfiguration = await FeaturesConfiguration.findByIdAndDelete(id);
        if (!featuresConfiguration) {
            return sendResponse(res, 200, true, "No features configuration found with the provided ID", null);
        }
        
        return sendResponse(res, 200, true, "Features configuration deleted successfully");
    } catch (error) {
        console.error("Error deleting features configuration:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Add a new feature to existing configuration
const addFeature = async (req, res) => {
    try {
        const { id } = req.params;
        const { feature } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid ID format. Please provide a valid MongoDB ObjectId");
        }
        
        if (!feature || !feature.id || !feature.title) {
            return sendResponse(res, 400, false, "Feature data is required with id and title");
        }
        
        const featuresConfiguration = await FeaturesConfiguration.findById(id);
        if (!featuresConfiguration) {
            return sendResponse(res, 400, false, "No features configuration found with the provided ID");
        }
        
        // Check if feature with same id already exists
        const existingFeature = featuresConfiguration.features.find(f => f.id === feature.id);
        if (existingFeature) {
            return sendResponse(res, 400, false, "Feature with this id already exists");
        }
        
        featuresConfiguration.features.push(feature);
        await featuresConfiguration.save();
        
        return sendResponse(res, 200, true, "Feature added successfully", featuresConfiguration);
    } catch (error) {
        console.error("Error adding feature:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Update a specific feature
const updateFeature = async (req, res) => {
    try {
        const { id, featureId } = req.params;
        const updateData = req.body;
        
        // Remove id from updateData to prevent it from being modified
        delete updateData.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid ID format. Please provide a valid MongoDB ObjectId");
        }
        
        const featuresConfiguration = await FeaturesConfiguration.findById(id);
        if (!featuresConfiguration) {
            return sendResponse(res, 200, true, "No features configuration found with the provided ID", null);
        }
        
        const featureIndex = featuresConfiguration.features.findIndex(f => f.id === featureId);
        if (featureIndex === -1) {
            return sendResponse(res, 200, true, "No feature found with the provided featureId", null);
        }
        
        // Update the feature - ensure id is preserved
        const existingFeature = featuresConfiguration.features[featureIndex];
        featuresConfiguration.features[featureIndex] = {
            ...existingFeature,
            ...updateData,
            id: existingFeature.id // Ensure id is never overwritten
        };
        
        await featuresConfiguration.save();
        
        return sendResponse(res, 200, true, "Feature updated successfully", featuresConfiguration);
    } catch (error) {
        console.error("Error updating feature:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Delete a specific feature
const deleteFeature = async (req, res) => {
    try {
        const { id, featureId } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid ID format. Please provide a valid MongoDB ObjectId");
        }
        
        const featuresConfiguration = await FeaturesConfiguration.findById(id);
        if (!featuresConfiguration) {
            return sendResponse(res, 200, true, "No features configuration found with the provided ID", null);
        }
        
        const featureIndex = featuresConfiguration.features.findIndex(f => f.id === featureId);
        if (featureIndex === -1) {
            return sendResponse(res, 200, true, "No feature found with the provided featureId", null);
        }
        
        featuresConfiguration.features.splice(featureIndex, 1);
        await featuresConfiguration.save();
        
        return sendResponse(res, 200, true, "Feature deleted successfully", featuresConfiguration);
    } catch (error) {
        console.error("Error deleting feature:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Get active features only
const getActiveFeatures = async (req, res) => {
    try {
        const { menuId } = req.params;
        
        const featuresConfiguration = await FeaturesConfiguration.getByMenuId(menuId);
        if (!featuresConfiguration) {
            return sendResponse(res, 404, false, "Features configuration not found");
        }
        
        const activeFeatures = featuresConfiguration.getActiveFeatures();
        
        return sendResponse(res, 200, true, "Active features fetched successfully", activeFeatures);
    } catch (error) {
        console.error("Error fetching active features:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Get specific feature by ID
const getFeatureById = async (req, res) => {
    try {
        const { id, featureId } = req.params;
        
        const featuresConfiguration = await FeaturesConfiguration.findById(id);
        if (!featuresConfiguration) {
            return sendResponse(res, 404, false, "Features configuration not found");
        }
        
        const feature = featuresConfiguration.getFeatureById(featureId);
        if (!feature) {
            return sendResponse(res, 404, false, "Feature not found");
        }
        
        return sendResponse(res, 200, true, "Feature fetched successfully", feature);
    } catch (error) {
        console.error("Error fetching feature:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

// Toggle active status of features configuration
const toggleActiveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, false, "Invalid ID format. Please provide a valid MongoDB ObjectId");
        }
        
        const featuresConfiguration = await FeaturesConfiguration.findById(id);
        if (!featuresConfiguration) {
            return sendResponse(res, 200, true, "No features configuration found with the provided ID", null);
        }
        
        featuresConfiguration.isActive = !featuresConfiguration.isActive;
        await featuresConfiguration.save();
        
        return sendResponse(res, 200, true, "Features configuration status toggled successfully", featuresConfiguration);
    } catch (error) {
        console.error("Error toggling features configuration status:", error);
        return sendResponse(res, 500, false, error.message);
    }
};

module.exports = {
    createFeaturesConfiguration,
    getFeaturesConfigurations,
    updateFeaturesConfiguration,
    deleteFeaturesConfiguration,
    addFeature,
    updateFeature,
    deleteFeature,
};
