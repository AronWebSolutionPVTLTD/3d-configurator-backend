// models/Category.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Merchant who owns this category
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // categories are always merchant-specific
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1, merchant: 1 }, { unique: true });
// Prevents duplicate category names per merchant

module.exports = model("Category", categorySchema);
