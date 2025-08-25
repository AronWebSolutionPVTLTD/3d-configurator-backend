const mongoose = require("mongoose");

const { Schema, model } = mongoose;
require("./JerseyType"); // 👈 registers JerseyType
require("./DesignTemplate"); // 👈 registers DesignTemplate
require("./Pattern"); // 👈 registers Pattern
require("./ColorSwatch"); // 👈 registers ColorSwatch
require("./FeatureMenu"); // 👈 registers Customization
require("./CustomColorSection");

const toolSchema = new Schema(
  {
    value: { type: String, required: true, unique: true }, // ex: 'jersey-type'
    label: String,
    description: String,
    relatedModels: [
      {
        model: String, // e.g. "JerseyType"
        ref: { type: Schema.Types.ObjectId, refPath: "relatedModels.model" },
      },
    ],
  },
  { timestamps: true }
);

const Tool = model("Tool", toolSchema);
module.exports = Tool;
