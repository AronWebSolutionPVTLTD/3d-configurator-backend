// models/ProductTool.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// 👇 this line is important
require("./Product");  

const productToolSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    tool: { type: Schema.Types.ObjectId, ref: "Tool", required: true },
    config: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = model("ProductTool", productToolSchema);
