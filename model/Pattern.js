const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const patternSchema = new Schema(
  {
    id: { type: String },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // URL or file path to the pattern image
    },
  },
  { timestamps: true }
);

module.exports = model("Pattern", patternSchema);
