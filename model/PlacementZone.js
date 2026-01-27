const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const placementZoneSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    toolType: {
      type: String,
      enum: ["name", "numbers", "logo", "text"],
      required: true,
    },
    image: { type: String, default: null },
    coordinates: {
      x: { type: Number, default: 0.5 },
      y: { type: Number, default: 0.5 },
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
  },
  { timestamps: true }
);

placementZoneSchema.index({ toolType: 1, order: 1 });

module.exports = model("PlacementZone", placementZoneSchema);
