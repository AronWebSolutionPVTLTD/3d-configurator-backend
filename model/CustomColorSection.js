const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const customColorSectionSchema = new Schema(
  {
    id: String,
    name: String,
    children: [
      {
        id: String,
        name: String,
        value: { type: String, default: "#fff" },
      },
    ],
  },
  { timestamps: true }
);

const CustomColorSection = model(
  "CustomColorSection",
  customColorSectionSchema
);
module.exports = CustomColorSection;
