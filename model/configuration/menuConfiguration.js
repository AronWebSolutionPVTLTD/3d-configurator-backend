const mongoose = require('mongoose');

const menuConfigurationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
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
  },
  type: {
    type: String,
    enum: ['navigation', 'action', 'support'],
    default: 'navigation'
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  hasSubItems: {
    type: Boolean,
    default: false
  },
  subItems: [{
    id: String,
    name: String,
    icon: String,
    isActive: Boolean,
    sortOrder: Number
  }],
  // New fields for content management
  contentModel: {
    type: String,
    required: false // Not all menu items will have a content model (e.g., action items)
  },
  hasTabs: {
    type: Boolean,
    default: false
  },
  tabs: [{
    id: String,
    name: String,
    isActive: Boolean
  }]
}, {
  timestamps: true
});

// Index for better query performance
menuConfigurationSchema.index({ isActive: 1, sortOrder: 1, type: 1 });

// Ensure virtual fields are serialized
menuConfigurationSchema.set('toJSON', { virtuals: true });
menuConfigurationSchema.set('toObject', { virtuals: true });


/* 1. Type Menu (Simple
  {
    id: "type",
    hasSubItems: false,        // No sub-items
    contentModel: "TypeConfiguration", // Loads jersey types
    hasTabs: false            // No tabs
  }

2. Features Menu (Sub-items)
{
  id: "features", 
  hasSubItems: true,        // Has sub-items
  subItems: [
    { id: "shoulder-style", name: "Shoulder Style" },
    { id: "collar-style", name: "Collar Style" }
  ],
  contentModel: "FeaturesConfiguration"
}

3. Color Menu (Tabs)
{
  id: "color",
  hasSubItems: false,       // No sub-items
  contentModel: "ColorConfiguration",
  hasTabs: true,           // Has tabs
  tabs: [
    { id: "colors", name: "Colors" },
    { id: "gradient", name: "Gradient" }
  ]
}

4. Design Menu (Complex - Both)
{
  id: "design",
  hasSubItems: true,        // Has sub-items
  subItems: [...],
  contentModel: "DesignConfiguration", 
  hasTabs: true,           // Also has tabs
  tabs: [...]
} */

module.exports = mongoose.model('MenuConfiguration', menuConfigurationSchema); 


