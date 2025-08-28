const mongoose = require("mongoose");
const { Schema, model } = mongoose;

require("./Product");

const sportSchema = new Schema(
  {
    name: { type: String, required: true }, // Hockey, Soccer, etc.
    merchant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model("Sport", sportSchema);
