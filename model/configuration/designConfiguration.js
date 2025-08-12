const mongoose = require('mongoose');

const designConfigurationSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['nhl', 'all', 'custom']
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for better query performance
designConfigurationSchema.index({ isActive: 1, category: 1, sortOrder: 1 });
designConfigurationSchema.index({ value: 1 }, { unique: true });
designConfigurationSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for formatted display name
// designConfigurationSchema.virtual('displayName').get(function() {
//   return this.name || this.value;
// });

// Ensure virtual fields are serialized
designConfigurationSchema.set('toJSON', { virtuals: true });
designConfigurationSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure sortOrder is set
designConfigurationSchema.pre('save', function(next) {
  if (this.isNew && this.sortOrder === undefined) {
    // Set sortOrder to the next available number if not provided
    this.constructor.countDocuments().then(count => {
      this.sortOrder = count;
      next();
    }).catch(next);
  } else {
    next();
  }
});

// Static method to get designs by category
designConfigurationSchema.statics.getByCategory = function(category, isActive = true) {
  return this.find({ category, isActive }).sort({ sortOrder: 1, name: 1 });
};

// Static method to search designs
designConfigurationSchema.statics.search = function(query, options = {}) {
  const { category, isActive = true, limit = 20 } = options;
  
  let searchQuery = {
    isActive,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };
  
  if (category) {
    searchQuery.category = category;
  }
  
  return this.find(searchQuery)
    .sort({ sortOrder: 1, name: 1 })
    .limit(limit);
};

// Instance method to toggle active status
designConfigurationSchema.methods.toggleActive = function() {
  this.isActive = !this.isActive;
  return this.save();
};

// Instance method to update sort order
designConfigurationSchema.methods.updateSortOrder = function(newSortOrder) {
  this.sortOrder = newSortOrder;
  return this.save();
};

module.exports = mongoose.model('DesignConfiguration', designConfigurationSchema);
