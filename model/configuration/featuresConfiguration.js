const mongoose = require('mongoose');

const featuresConfigurationSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
    default: 'features'
  },
  title: {
    type: String,
    default: 'Features'
  },
  description: {
    type: String,
    default: 'Select jersey elements and styles'
  },
  features: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['simple', 'grouped', 'boolean'],
      default: 'simple'
    },
    options: [{
      label: {
        type: String,
        required: true
      },
      value: {
        type: mongoose.Schema.Types.Mixed, // Can be string, boolean, or number
        required: true
      },
      isActive: {
        type: Boolean,
        default: true
      },
      sortOrder: {
        type: Number,
        default: 0
      }
    }],
    // For grouped options (like collar styles)
    groups: [{
      heading: {
        type: String,
        required: true
      },
      groupId: {
        type: String,
        required: true
      },
      items: [{
        label: {
          type: String,
          required: true
        },
        value: {
          type: String,
          required: true
        },
        isActive: {
          type: Boolean,
          default: true
        },
        sortOrder: {
          type: Number,
          default: 0
        }
      }],
      isActive: {
        type: Boolean,
        default: true
      },
      sortOrder: {
        type: Number,
        default: 0
      }
    }],
    defaultValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    },
    metadata: {
      type: Map,
      of: String
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
featuresConfigurationSchema.index({ menuId: 1, isActive: 1 });
featuresConfigurationSchema.index({ 'features.isActive': 1, 'features.sortOrder': 1 });

// Ensure virtual fields are serialized
featuresConfigurationSchema.set('toJSON', { virtuals: true });
featuresConfigurationSchema.set('toObject', { virtuals: true });

// Static method to get features by menu ID
featuresConfigurationSchema.statics.getByMenuId = function(menuId) {
  return this.findOne({ menuId, isActive: true }).sort({ 'features.sortOrder': 1 });
};

// Instance method to get active features
featuresConfigurationSchema.methods.getActiveFeatures = function() {
  return this.features.filter(feature => feature.isActive);
};

// Instance method to get feature by ID
featuresConfigurationSchema.methods.getFeatureById = function(featureId) {
  return this.features.find(feature => feature.id === featureId && feature.isActive);
};

module.exports = mongoose.model('FeaturesConfiguration', featuresConfigurationSchema);
