// model/Name.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const OutlineSchema = new Schema({
  enabled: { type: Boolean, default: false },
  color: { type: String, default: "#000000" },
  thickness: { type: Number, default: 2 },
});

const BackgroundSchema = new Schema({
  enabled: { type: Boolean, default: false },
  color: { type: String, default: "#FFFFFF" },
  opacity: { type: Number, min: 0, max: 1, default: 1 },
});

const TextSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 20,
    },
    zone: {
      type: String,
      enum: ["front", "back", "sleeve"],
      required: true,
    },

    font: { type: String, default: "F1" },
    color: { type: String, default: "#FFFFFF" },

    outline: { type: OutlineSchema, default: () => ({}) },
    background: { type: BackgroundSchema, default: () => ({}) },

    width: { type: Number, default: 20 },
    height: { type: Number, default: 5 },
    angle: { type: Number, default: 0 },

    position: {
      x: { type: Number, default: 0.5 },
      y: { type: Number, default: 0.5 },
    },
    standardPosition: { type: String, default: null },
    center: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },

    zIndex: { type: Number, default: 1 },

    validations: {
      maxLength: { type: Number, default: 20 },
      allowNumbers: { type: Boolean, default: true },
      allowSymbols: { type: Boolean, default: false },
      uppercaseOnly: { type: Boolean, default: true },
    },
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

module.exports = model("Text", TextSchema);
