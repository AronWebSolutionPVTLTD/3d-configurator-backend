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
        // Gradient fields
        gradient: { type: Boolean, default: false },
        gradientAngle: { type: Number, default: 0 },
        gradientBalance: { type: Number, default: 0.5 },
        gradientFeather: { type: Number, default: 0 },
        // gradientColors: [
        //   { color: String, position: Number }
        // ]
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

/*
{
  "id": "collar",
  "name": "Collar",
  "children": [
    {
      "id": "collar-front",
      "name": "Front Collar",
      "value": "#FF00FF",
      "gradient": true,
      "gradientConfig": {
        "type": "linear",
        "angle": 0,
        "balance": 0.43,
        "feather": 0.02,
        "colors": [
          { "color": "#FF0000", "position": 0 },
          { "color": "#00FF00", "position": 0.5 },
          { "color": "#0000FF", "position": 1 }
        ]
      }
    },
    {
      "id": "collar-back",
      "name": "Back Collar",
      "value": "#00FFFF",
      "gradient": false,
      "gradientConfig": {
        "type": "linear",
        "angle": 0,
        "balance": 0.5,
        "feather": 0,
        "colors": []
      }
    }
  ]
}*/

// color swatch explain
/* {
  "id": "collar",
  "name": "Collar",
  "children": [
    {
      "id": "collar-front",
      "name": "Front Collar",
      "value": "#FF6B6B",  // Uses ColorSwatch color
      "gradient": true,    // Gradient enabled
      "gradientConfig": {
        "type": "linear",
        "angle": 0,
        "balance": 0.43,
        "feather": 0.02,
        "colors": [
          { "color": "#FF6B6B", "position": 0 },  // From ColorSwatch
          { "color": "#FF0000", "position": 1 }    // From ColorSwatch
        ]
      }
    },
    {
      "id": "collar-back",
      "name": "Back Collar", 
      "value": "#0066CC",  // Uses ColorSwatch color
      "gradient": false,   // Solid color
      "gradientConfig": {}
    }
  ]
}*/
