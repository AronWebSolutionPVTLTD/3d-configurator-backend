const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegexPattern, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: 6,
      select: false, // hide by default
    },
    role: {
      type: String,
      enum: ["superadmin", "admin", "merchant", "customer"],
      default: "customer",
      index: true,
    },
    profile: {
      url: {
        type: String,
        default: "",
      },
    },
    merchantData: {
      companyName: { type: String, trim: true },
      sports: [{ type: Schema.Types.ObjectId, ref: "Sport" }], // future use
    },
  },
  { timestamps: true }
);

// 🔒 Hash password if modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// 🎟️ JWT generator (includes role)
UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

// 🔑 Compare passwords
UserSchema.methods.comparePasswords = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);
module.exports = User;
