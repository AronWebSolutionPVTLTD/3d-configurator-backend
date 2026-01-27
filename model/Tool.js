const mongoose = require("mongoose");

const { Schema, model } = mongoose;
require("./JerseyType"); // 👈 registers JerseyType
require("./DesignTemplate"); // 👈 registers DesignTemplate
require("./Pattern"); // 👈 registers Pattern
require("./PatternArea"); // 👈 registers PatternArea
require("./ColorSwatch"); // 👈 registers ColorSwatch
require("./FeatureMenu"); // 👈 registers Customization
require("./CustomColorSection");
require("./Number"); // 👈 registers Number

const toolSchema = new Schema(
  {
    value: { type: String, required: true, unique: true }, // ex: 'jersey-type', 'pattern'
    label: String,
    description: String,
    icon: String,
    // Optional tool-level defaults the UI can consume to render dynamic fields
    defaultConfig: { type: Schema.Types.Mixed, default: null },
    // Optional multiple outline layers support (e.g., Border 1, Border 2)
    outlines: [
      {
        name: { type: String },
        enabled: { type: Boolean, default: true },
        color: { type: String, default: "#000000" },
        thickness: { type: Number, default: 2 },
        order: { type: Number, default: 1 },
      },
    ],
    relatedModels: [
      {
        model: String, // e.g. "JerseyType", "Pattern"
        ref: { type: Schema.Types.ObjectId, refPath: "relatedModels.model" },
      },
    ],
  },
  { timestamps: true }
);

const Tool = model("Tool", toolSchema);
module.exports = Tool;


/*{
  "value": "color",
  "label": "Colors",
  "description": "Advanced color customization with support for solid colors, gradients, and multiple color sections including body, sleeves, collar, and details",
  "relatedModels": [
    {
      "model": "ColorSwatch",
      "ref": "68ad5500bbbdd6188f234da4"
    },
    {
      "model": "CustomColorSection",
      "ref": "68b57f6e29f2b5992b2a3b90"
    }
  ]
}*/

