const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const patternSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Pattern = model("Pattern", patternSchema);
module.exports = Pattern;
