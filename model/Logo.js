// model/Name.js
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BackgroundSchema = new Schema({
  enabled: { type: Boolean, default: false },
  color: { type: String, default: "#FFFFFF" },
  opacity: { type: Number, min: 0, max: 1, default: 1 },
});

const LogoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      enum: ["front", "back", "sleeve"],
      required: true,
    },
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
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true }
);

module.exports = model("Logo", LogoSchema);
