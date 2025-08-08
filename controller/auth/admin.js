const User = require("../../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../../helper/status");
const ProductType = require("../../model/productType");
const MenuConfiguration = require("../../model/configuration/menuConfiguration");
const TypeConfiguration = require("../../model/configuration/typeConfiguration");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return sendResponse(res, 400, false, "All fields are required");
        }
        const user = await User.findOne({ email });
        if (user) {
            return sendResponse(res, 400, false, "User already exists");
        }
        const newUser = new User({ name, email, password, role: role });
        await newUser.save();
        return sendResponse(res, 200, true, "User registered successfully");
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendResponse(res, 400, false, "All fields are required");
        }
        const user = await User.findOne({ email }).select('+password');;
        if (!user) {
            return sendResponse(res, 400, false, "User not found");
        }
        console.log("user----->", user);
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("isPasswordCorrect----->", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return sendResponse(res, 400, false, "Invalid password");
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return sendResponse(res, 200, true, "Login successful", { token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const createProductType = async (req, res) => {
    try {
        const { id, name, category, description, style, performance,isPremium,customization, gsm, price, priceNote,tag,image,isActive,sortOrder } = req.body;
        const productType = new ProductType({ id, name, category, description, style, performance,isPremium,customization, gsm, price,priceNote,tag,image,isActive,sortOrder });
        await productType.save();
        return sendResponse(res, 200, true, "Product type added successfully");
    } catch (error) {
        console.log(error);
        return sendResponse(res, 500, false, error.message);
    }
}

const getProductType = async (req, res) => {
    try{
        console.log("---->");
        const productTypeRecord = await ProductType.find();
        return sendResponse(res, 200, true, "Product type fetched successfully", productTypeRecord);
    }catch{(error)
    console.log(error);
    return sendResponse(res, 500, false, error.message);
    }
}

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
        const { menuId } = req.params;
        
        const typeConfiguration = await TypeConfiguration.findOne({ 
            menuId, 
            isActive: true 
        }).populate('menuId');

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
    registerUser, 
    loginUser, 
    createProductType, 
    getProductType, 
    createMenuConfiguration, 
    getMenuConfiguration,
    createTypeConfiguration,
    getTypeConfiguration,
    updateTypeConfiguration
};