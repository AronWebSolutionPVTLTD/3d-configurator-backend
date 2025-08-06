const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Base User Schema
const UserSchema = new Schema(
  {
    name:String,
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [emailRegexPattern, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
    },
    profile: {
      url: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

UserSchema.methods.comparePasswords = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);
module.exports = User;
