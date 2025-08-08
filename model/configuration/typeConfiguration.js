const mongoose = require('mongoose');

const typeConfigurationSchema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true,
    ref: 'MenuConfiguration'
  },
  title: {
    type: String,
    default: 'Select your jersey type'
  },
  description: {
    type: String,
    default: ''
  },
  productTypes: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    features: [{
      type: String
    }], // e.g., ["Embroidered", "High performance", "220GSM"]
    price: {
      type: Number,
      required: true
    },
    priceNote: {
      type: String,
      default: null // e.g., "From" for "From $99"
    },
    tag: {
      type: String,
      default: null // e.g., "Best Value"
    },
    isPremium: {
      type: Boolean,
      default: false
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
  }
}, {
  timestamps: true
});

// Index for better query performance
typeConfigurationSchema.index({ menuId: 1, isActive: 1 });
typeConfigurationSchema.index({ 'productTypes.isActive': 1, 'productTypes.sortOrder': 1 });

// Ensure virtual fields are serialized
typeConfigurationSchema.set('toJSON', { virtuals: true });
typeConfigurationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TypeConfiguration', typeConfigurationSchema); 