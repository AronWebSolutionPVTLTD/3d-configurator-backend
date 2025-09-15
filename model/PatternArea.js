const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const patternAreaSchema = new Schema(
  {
    id: String,                    // 'front', 'back', 'rightSleeve', 'leftSleeve', 'collar', 'element1', 'element2'
    name: String,                  // 'Front', 'Back', 'Right Sleeve', 'Left Sleeve', 'Collar', 'Element 1', 'Element 2'
    label: String,                 // 'Front', 'Back', 'Right sleeve', 'Left sleeve', 'Collar', 'Element 1', 'Element 2'
    active: { type: Boolean, default: false },
    // Pattern selection - which pattern is currently applied to this area
    selectedPattern: { 
      type: Schema.Types.ObjectId, 
      ref: "Pattern",
      default: null 
    },
    // Pattern transformation properties
    scale: { type: Number, default: 1, min: 0.1, max: 3 },
    angle: { type: Number, default: 0, min: 0, max: 360 },
    translateX: { type: Number, default: 0, min: -100, max: 100 },
    translateY: { type: Number, default: 0, min: -100, max: 100 },
    background: { type: String, default: "" },
    color: { type: String, default: "" }
  },  
  { timestamps: true }
);

module.exports = model("PatternArea", patternAreaSchema);
