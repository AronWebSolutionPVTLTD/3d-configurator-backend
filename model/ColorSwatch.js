const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const colorSwatchSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true }, // hex code
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ColorSwatch = model("ColorSwatch", colorSwatchSchema);
module.exports = ColorSwatch;
