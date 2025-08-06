const jwt = require("jsonwebtoken");
const User = require("../model/User");

const dotenv = require("dotenv");   
dotenv.config();


// 🔐 Verify and load user
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// ✅ New middleware: Allow user to modify own profile OR admin
const canModifyUser = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    const userIdFromParam = req.params.userId;

    // Allow if admin
    if (req.user.role === "admin") {
      return next();
    }

    // Allow if user is modifying own profile
    if (req.user._id.toString() === userIdFromParam) {
      return next();
    }

    // Else, deny access
    return res.status(403).json({ message: "Access denied." });
  });
};

module.exports = {
  verifyToken,
  canModifyUser,
  isUser: async (req, res, next) => {
    await verifyToken(req, res, async () => {
      if (req.user.role !== "user") {
        return res.status(403).json({ message: "Access denied. Users only." });
      }
      next();
    });
  },
  isAdmin: async (req, res, next) => {
    await verifyToken(req, res, async () => {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
      }
      next();
    });
  },
};
