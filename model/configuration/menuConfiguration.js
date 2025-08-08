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

/*
Sample data structure based on the UI image:

[
  {
    id: "type",
    name: "Type",
    icon: "shirt-with-triangle-square",
    type: "navigation",
    isSelected: true,
    sortOrder: 1
  },
  {
    id: "design",
    name: "Design", 
    icon: "pencil",
    type: "navigation",
    isSelected: false,
    sortOrder: 2
  },
  {
    id: "features",
    name: "Features",
    icon: "t-shirt",
    type: "navigation", 
    isSelected: false,
    sortOrder: 3
  },
  {
    id: "color",
    name: "Color",
    icon: "gear",
    type: "navigation",
    isSelected: false,
    sortOrder: 4
  },
  {
    id: "pattern",
    name: "Pattern",
    icon: "infinity",
    type: "navigation",
    isSelected: false,
    sortOrder: 5
  },
  {
    id: "number",
    name: "Number",
    icon: "circled-1",
    type: "navigation",
    isSelected: false,
    sortOrder: 6
  },
  {
    id: "name",
    name: "Name",
    icon: "person",
    type: "navigation",
    isSelected: false,
    sortOrder: 7
  },
  {
    id: "text",
    name: "Text",
    icon: "Aa",
    type: "navigation",
    isSelected: false,
    sortOrder: 8
  },
  {
    id: "logos",
    name: "Logos",
    icon: "picture-frame",
    type: "navigation",
    isSelected: false,
    sortOrder: 9
  },
  {
    id: "undo-redo",
    name: "Undo/Redo",
    icon: "arrows",
    type: "action",
    isSelected: false,
    sortOrder: 10
  },
  {
    id: "support",
    name: "Support",
    icon: "soccer-ball",
    type: "support",
    isSelected: false,
    sortOrder: 11
  }
]
*/

module.exports = mongoose.model('MenuConfiguration', menuConfigurationSchema); 


