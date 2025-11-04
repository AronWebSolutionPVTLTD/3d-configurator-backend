const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const designSchema = new Schema(
  {
    value: String,
    src: String,
    category: { type: String, enum: ["nhl", "all"] },
  },
  { timestamps: true }
);

const DesignTemplate = model("DesignTemplate", designSchema);
module.exports = DesignTemplate;
