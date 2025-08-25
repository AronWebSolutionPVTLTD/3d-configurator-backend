const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const jerseyTypeSchema = new Schema(
  {
    name: String,
    style: String,
    performance: String,
    gsm: String,
    price: Number,
    priceNote: String,
    premium: Boolean,
    tag: String,
    image: String,
  },
  { timestamps: true }
);

const JerseyType = model("JerseyType", jerseyTypeSchema);
module.exports = JerseyType;
