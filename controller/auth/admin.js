const User = require("../../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../../helper/status");
const ProductType = require("../../model/productType");

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

module.exports = { registerUser, loginUser, createProductType };