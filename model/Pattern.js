const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const patternSchema = new Schema(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "User", // who owns this pattern (merchant)
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
      enum: ["geometric", "stripes", "abstract", "texture", "custom"],
      default: "geometric",
      required: true,
    },
    image: {
      type: String,
    },
    // Pattern customization properties
    defaultScale: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 10,
    },
    defaultAngle: {
      type: Number,
      default: 0,
      min: 0,
      max: 360,
    },
    defaultColor: {
      type: String,
      default: "#000000",
    },
    defaultBackgroundColor: {
      type: String,
      default: "#FFFFFF",
    },
    // Pattern metadata for additional properties
    // metadata: {
    //   type: Map,
    //   of: String,
    // },
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

module.exports = model("Pattern", patternSchema);
