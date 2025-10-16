const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    merchant: {
      type: Schema.Types.ObjectId,
      ref: "User", // who owns this product (merchant)
      required: true,
    },
    sport: {
      type: Schema.Types.ObjectId,
      ref: "Sport", // each product belongs to a sport
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
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String },
      },
    ],

    // link tools (color, design, pattern, etc.)
    tools: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductTool",
      },
    ],

    // stock / availability
    stock: {
      quantity: { type: Number, default: 0 },
      isUnlimited: { type: Boolean, default: false },
    },

    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "draft",
      index: true,
    },
    isCustomizedByUser: { type: Boolean, default: false },
    customizedByUser: { type: String, default: "" },
    referencedProduct: { type: Schema.Types.ObjectId, ref: "Product" },
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);
