const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const fontSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    fontFamily: { type: String, required: true },
    category: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = model("Font", fontSchema);
