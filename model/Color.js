const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Color configuration schema for individual parts
const colorConfigSchema = new Schema({
  color: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^#[0-9A-Fa-f]{6}$/.test(v);
      },
      message: 'Color must be a valid hex color (e.g., #FF0000)'
    }
  },
  gradient: {
    type: Boolean,
    default: false
  },
  gradientConfig: {
    type: {
      type: String,
      enum: ["linear", "radial"],
      default: "linear"
    },
    angle: {
      type: Number,
      min: 0,
      max: 360,
      default: 0
    },
    balance: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5
    },
    feather: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.02
    },
    colors: [{
      color: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return /^#[0-9A-Fa-f]{6}$/.test(v);
          },
          message: 'Gradient color must be a valid hex color'
        }
      },
      position: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      name: {
        type: String,
        maxlength: 50
      }
    }]
  }
}, { _id: false });

// Product color configuration schema
const productColorSchema = new Schema({
  // Reference to the product
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  
  // Reference to the ProductTool
  productTool: {
    type: Schema.Types.ObjectId,
    ref: "ProductTool",
    required: true
  },
  
  // Color configurations for different parts
  configurations: {
    // Body parts
    torso: {
      front: colorConfigSchema,
      back: colorConfigSchema
    },
    
    // Sleeve parts
    sleeves: {
      front: colorConfigSchema,
      back: colorConfigSchema,
      left: colorConfigSchema,
      right: colorConfigSchema
    },
    
    // Shoulder parts
    shoulders: {
      left: colorConfigSchema,
      right: colorConfigSchema
    },
    
    // Collar parts
    collar: {
      front: colorConfigSchema,
      back: colorConfigSchema
    },
    
    // Detail parts
    stripes: {
      horizontal: colorConfigSchema,
      vertical: colorConfigSchema,
      diagonal: colorConfigSchema
    },
    
    // Cuff parts
    cuffs: {
      left: colorConfigSchema,
      right: colorConfigSchema
    },
    
    // Pocket parts
    pockets: {
      left: colorConfigSchema,
      right: colorConfigSchema
    },
    
    // Hem parts
    hem: {
      front: colorConfigSchema,
      back: colorConfigSchema
    }
  },
  
  // Whether this color configuration is active
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Version tracking for color configurations
  version: {
    type: Number,
    default: 1
  },
  
  // Metadata for the color configuration
  metadata: {
    name: {
      type: String,
      maxlength: 100
    },
    description: {
      type: String,
      maxlength: 500
    },
    tags: [String]
  }
}, { timestamps: true });

// Indexes for efficient queries
productColorSchema.index({ product: 1, productTool: 1 }, { unique: true });
productColorSchema.index({ product: 1, isActive: 1 });
productColorSchema.index({ "metadata.tags": 1 });

// Virtual for getting all configured parts
productColorSchema.virtual('configuredParts').get(function() {
  const parts = [];
  for (const [partName, positions] of Object.entries(this.configurations)) {
    for (const [positionName, config] of Object.entries(positions)) {
      if (config && config.color) {
        parts.push({
          part: partName,
          position: positionName,
          color: config.color,
          gradient: config.gradient
        });
      }
    }
  }
  return parts;
});

// Method to update a specific part configuration
productColorSchema.methods.updatePartConfig = function(part, position, colorConfig) {
  if (this.configurations[part] && this.configurations[part][position]) {
    this.configurations[part][position] = colorConfig;
    this.version += 1;
    return true;
  }
  return false;
};

// Method to get configuration for a specific part and position
productColorSchema.methods.getPartConfig = function(part, position) {
  if (this.configurations[part] && this.configurations[part][position]) {
    return this.configurations[part][position];
  }
  return null;
};

// Static method to create default color configuration
productColorSchema.statics.createDefault = function(productId, productToolId) {
  const defaultColor = {
    color: "#FFFFFF",
    gradient: false,
    gradientConfig: {
      type: "linear",
      angle: 0,
      balance: 0.5,
      feather: 0.02,
      colors: []
    }
  };
  
  const configurations = {};
  const parts = ['torso', 'sleeves', 'shoulders', 'collar', 'stripes', 'cuffs', 'pockets', 'hem'];
  
  parts.forEach(part => {
    configurations[part] = {};
    if (part === 'torso' || part === 'hem') {
      configurations[part].front = defaultColor;
      configurations[part].back = defaultColor;
    } else if (part === 'sleeves') {
      configurations[part].front = defaultColor;
      configurations[part].back = defaultColor;
      configurations[part].left = defaultColor;
      configurations[part].right = defaultColor;
    } else if (part === 'shoulders' || part === 'cuffs') {
      configurations[part].left = defaultColor;
      configurations[part].right = defaultColor;
    } else if (part === 'collar') {
      configurations[part].front = defaultColor;
      configurations[part].back = defaultColor;
    } else if (part === 'stripes') {
      configurations[part].horizontal = defaultColor;
      configurations[part].vertical = defaultColor;
      configurations[part].diagonal = defaultColor;
    } else if (part === 'pockets') {
      configurations[part].left = defaultColor;
      configurations[part].right = defaultColor;
    }
  });
  
  return new this({
    product: productId,
    productTool: productToolId,
    configurations: configurations,
    metadata: {
      name: "Default Color Configuration",
      description: "Default color settings for all product parts"
    }
  });
};

module.exports = model("ProductColor", productColorSchema);
