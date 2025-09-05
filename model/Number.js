// model/Number.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BackgroundSchema = new Schema({
  enabled: { type: Boolean, default: false },
  color: { type: String, default: "#FFFFFF" }, // default white
  opacity: { type: Number, min: 0, max: 1, default: 1 }, // optional
});

const OutlineSchema = new Schema({
  enabled: { type: Boolean, default: false },
  color: { type: String, default: "#000000" },
  thickness: { type: Number, default: 2 },
});

const NumberSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 4,
    },
    zone: {
      type: String,
      enum: ["frontCenter", "leftFront", "rightFront", "back"],
      required: true,
    },
    font: { type: String, default: "Impact" },
    color: { type: String, default: "#FFFFFF" },

    outline: { type: OutlineSchema, default: () => ({}) },
    background: { type: BackgroundSchema, default: () => ({}) },

    position: {
      x: { type: Number, default: 0.5 },
      y: { type: Number, default: 0.5 },
    },
    size: { type: Number, default: 40 },
    heightCm: { type: Number, default: 0 },
    widthCm: { type: Number, default: 0 },
    align: {
      type: Number,
      default: 0.5,
    },
    mirror: { type: Boolean, default: false },
    validations: {
      maxLength: { type: Number, default: 4 },
      allowLetters: { type: Boolean, default: true },
      allowSymbols: { type: Boolean, default: true },
      noLeadingZero: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = model("Number", NumberSchema);
