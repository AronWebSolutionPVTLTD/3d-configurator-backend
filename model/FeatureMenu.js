const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const featureOptionSchema = new Schema({
  label: String,
  value: Schema.Types.Mixed,
});

const featureMenuSchema = new Schema(
  {
    id: { type: String, required: true },
    title: String,
    options: [
      {
        heading: String,
        groupId: String,
        items: [featureOptionSchema],
      },
      [featureOptionSchema], // supports simple options too
    ],
  },
  { timestamps: true }
);

const FeatureMenu = model("FeatureMenu", featureMenuSchema);
module.exports = FeatureMenu;
