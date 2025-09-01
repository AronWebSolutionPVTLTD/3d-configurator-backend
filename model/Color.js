const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const colorSchema = new Schema(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "User", // who owns this color configuration (merchant)
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["body", "sleeve", "detail", "accessory", "collar", "hem", "custom"],
      default: "body",
      required: true,
    },
    // Reference to CustomColorSection via Tools
    colorSection: {
      type: Schema.Types.ObjectId,
      ref: "CustomColorSection",
      required: true,
    },

    // Default color settings
    defaultColor: {
      type: String,
      default: "#FFFFFF",
    },
    defaultGradient: {
      type: Boolean,
      default: false,
    },
    // Link to ProductTool
    tools: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductTool",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Color", colorSchema); 
