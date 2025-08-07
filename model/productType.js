// ProductType model - Focused on "Type" tab only
// Clean model for product type selection without customization options

const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ['jersey', 'shorts', 'trousers', 'socks', 'collar_shirt', 'pullover', 'training_suit', 'accessory']
  },
  description: {
    type: String,
    default: null
  },
  style: {
    type: String,
    default: null
  },
  performance: {
    type: String,
    default: null
  },
  gsm: {
    type: String,
    default: null
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceNote: {
    type: String,
    default: null
  },
  tag: {
    type: String,
    default: null
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better query performance
productTypeSchema.index({ isActive: 1, sortOrder: 1 });

// Virtual for formatted price
productTypeSchema.virtual('formattedPrice').get(function() {
  if (this.priceNote) {
    return `${this.priceNote} $${this.price}`;
  }
  return `$${this.price}`;
});

// Ensure virtual fields are serialized
productTypeSchema.set('toJSON', { virtuals: true });
productTypeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ProductType', productTypeSchema); 


