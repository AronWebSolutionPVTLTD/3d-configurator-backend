# MenuConfiguration JSON Structure for TypeConfiguration

## Overview
This document shows the complete JSON structure for `MenuConfiguration` that corresponds to the `TypeConfiguration` model, based on your 3D configurator UI.

## Complete JSON Structure

### 1. **Type Menu Configuration** (Corresponds to TypeConfiguration)
```json
{
  "_id": "ObjectId",
  "id": "type",
  "name": "Type",
  "icon": "shirt-triangle-square",
  "isActive": true,
  "sortOrder": 1,
  "type": "navigation",
  "isSelected": true,
  "hasSubItems": false,
  "subItems": [],
  "contentModel": "TypeConfiguration",
  "hasTabs": false,
  "tabs": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. **Complete MenuConfiguration Collection**
```json
[
  {
    "_id": "ObjectId",
    "id": "type",
    "name": "Type",
    "icon": "shirt-triangle-square",
    "isActive": true,
    "sortOrder": 1,
    "type": "navigation",
    "isSelected": true,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": "TypeConfiguration",
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "design",
    "name": "Design",
    "icon": "pencil",
    "isActive": true,
    "sortOrder": 2,
    "type": "navigation",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": "DesignConfiguration",
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "features",
    "name": "Features",
    "icon": "t-shirt",
    "isActive": true,
    "sortOrder": 3,
    "type": "navigation",
    "isSelected": false,
    "hasSubItems": true,
    "subItems": [
      {
        "id": "shoulder-style",
        "name": "Shoulder Style",
        "icon": "shoulder-icon",
        "isActive": true,
        "sortOrder": 1
      },
      {
        "id": "collar-style",
        "name": "Collar Style",
        "icon": "collar-icon",
        "isActive": false,
        "sortOrder": 2
      },
      {
        "id": "fight-strap",
        "name": "Fight Strap",
        "icon": "strap-icon",
        "isActive": false,
        "sortOrder": 3
      }
    ],
    "contentModel": "FeaturesConfiguration",
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "color",
    "name": "Color",
    "icon": "gear",
    "isActive": true,
    "sortOrder": 4,
    "type": "navigation",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": "ColorConfiguration",
    "hasTabs": true,
    "tabs": [
      {
        "id": "colors",
        "name": "Colors",
        "isActive": true
      },
      {
        "id": "gradient",
        "name": "Gradient",
        "isActive": false
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "pattern",
    "name": "Pattern",
    "icon": "infinity",
    "isActive": true,
    "sortOrder": 5,
    "type": "navigation",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": "PatternConfiguration",
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "number",
    "name": "Number",
    "icon": "circled-1",
    "isActive": true,
    "sortOrder": 6,
    "type": "navigation",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": "NumberConfiguration",
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "name",
    "name": "Name",
    "icon": "person",
    "isActive": true,
    "sortOrder": 7,
    "type": "navigation",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": "NameConfiguration",
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "text",
    "name": "Text",
    "icon": "Aa",
    "isActive": true,
    "sortOrder": 8,
    "type": "navigation",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": "TextConfiguration",
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "logos",
    "name": "Logos",
    "icon": "picture-frame",
    "isActive": true,
    "sortOrder": 9,
    "type": "navigation",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": "LogosConfiguration",
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "undo-redo",
    "name": "Undo/Redo",
    "icon": "arrows",
    "isActive": true,
    "sortOrder": 10,
    "type": "action",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": null,
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "ObjectId",
    "id": "support",
    "name": "Support",
    "icon": "soccer-ball",
    "isActive": true,
    "sortOrder": 11,
    "type": "support",
    "isSelected": false,
    "hasSubItems": false,
    "subItems": [],
    "contentModel": null,
    "hasTabs": false,
    "tabs": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Field Explanations

### **Core Fields**
- **`id`**: Unique identifier for the menu item (e.g., "type", "color", "features")
- **`name`**: Display name shown in the UI (e.g., "Type", "Color", "Features")
- **`icon`**: Icon identifier for the menu item
- **`isActive`**: Whether the menu item is active/visible
- **`sortOrder`**: Order in which menu items appear in the sidebar

### **Type Classification**
- **`type`**: Categorizes menu items into:
  - `"navigation"`: Main menu items with content
  - `"action"`: Action buttons (undo, redo)
  - `"support"`: Support/help items

### **Selection State**
- **`isSelected`**: Whether this menu item is currently selected/active
- **`hasSubItems`**: Whether this menu has child items
- **`subItems`**: Array of child menu items (for hierarchical menus)

### **Content Management**
- **`contentModel`**: References which content model to use (e.g., "TypeConfiguration")
- **`hasTabs`**: Whether this menu has tabs
- **`tabs`**: Array of tab configurations

### **Timestamps**
- **`createdAt`**: When the record was created
- **`updatedAt`**: When the record was last updated

## API Request Examples

### **Create MenuConfiguration**
```bash
POST /api/v1/configuration/create-menu-configuration
Content-Type: application/json

{
  "id": "type",
  "name": "Type",
  "icon": "shirt-triangle-square",
  "isActive": true,
  "sortOrder": 1,
  "type": "navigation",
  "isSelected": true,
  "hasSubItems": false,
  "subItems": [],
  "contentModel": "TypeConfiguration",
  "hasTabs": false,
  "tabs": []
}
```

### **Get MenuConfiguration**
```bash
GET /api/v1/configuration/get-menu-configuration
```

**Response:**
```json
{
  "success": true,
  "message": "Menu configuration fetched successfully",
  "data": [
    {
      "_id": "ObjectId",
      "id": "type",
      "name": "Type",
      "icon": "shirt-triangle-square",
      "isActive": true,
      "sortOrder": 1,
      "type": "navigation",
      "isSelected": true,
      "hasSubItems": false,
      "subItems": [],
      "contentModel": "TypeConfiguration",
      "hasTabs": false,
      "tabs": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Relationship with TypeConfiguration

The MenuConfiguration with `id: "type"` and `contentModel: "TypeConfiguration"` corresponds to the TypeConfiguration model:

```json
// MenuConfiguration
{
  "id": "type",
  "contentModel": "TypeConfiguration"
}

// Corresponding TypeConfiguration
{
  "menuId": "type",  // References the MenuConfiguration id
  "title": "Select your jersey type",
  "productTypes": [
    {
      "id": "pro",
      "name": "Pro",
      "price": 99,
      "tag": "Best Value"
    }
  ]
}
```

## Frontend Usage

### **Rendering Menu Items**
```javascript
const renderMenuItems = (menuConfigurations) => {
  return menuConfigurations
    .filter(item => item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(item => {
      if (item.type === 'navigation') {
        return renderNavigationItem(item);
      } else if (item.type === 'action') {
        return renderActionItem(item);
      } else if (item.type === 'support') {
        return renderSupportItem(item);
      }
    });
};
```

### **Loading Content**
```javascript
const loadMenuContent = async (menuItem) => {
  if (menuItem.contentModel) {
    const response = await fetch(`/api/v1/configuration/get-${menuItem.contentModel.toLowerCase()}/${menuItem.id}`);
    const content = await response.json();
    return content.data;
  }
  return null;
};
```

This JSON structure provides a complete, scalable foundation for your 3D configurator's menu system!
