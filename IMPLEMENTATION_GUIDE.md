# Type Configuration Implementation Guide

## Overview
This guide explains how to implement the "Type" configuration for the 3D configurator using the **Single MenuConfiguration Model + Separate Content Models** approach.

## Architecture

### 1. MenuConfiguration Model
- **Purpose**: Manages the sidebar navigation structure
- **Key Fields**: `id`, `name`, `icon`, `type`, `contentModel`, `hasTabs`, `tabs`
- **Content Association**: References content models via `contentModel` field

### 2. TypeConfiguration Model
- **Purpose**: Manages the content for the "Type" menu item
- **Key Fields**: `menuId`, `title`, `productTypes[]`
- **Product Types**: Array of jersey types with images, features, prices, etc.

## API Endpoints

### Menu Configuration
```bash
# Create menu configuration
POST /api/v1/configuration/create-menu-configuration
{
  "id": "type",
  "name": "Type",
  "icon": "shirt-triangle-square",
  "type": "navigation",
  "isSelected": true,
  "sortOrder": 1,
  "contentModel": "TypeConfiguration",
  "hasTabs": false,
  "tabs": []
}

# Get all menu configurations
GET /api/v1/configuration/get-menu-configuration
```

### Type Configuration
```bash
# Create type configuration
POST /api/v1/configuration/create-type-configuration
{
  "menuId": "type",
  "title": "Select your jersey type",
  "description": "Choose from our premium jersey types",
  "productTypes": [
    {
      "id": "pro",
      "name": "Pro",
      "image": "/images/jerseys/pro-jersey.jpg",
      "description": "Professional grade jersey",
      "features": ["Embroidered", "High performance", "220GSM"],
      "price": 99,
      "priceNote": "From",
      "tag": "Best Value",
      "isPremium": true,
      "sortOrder": 1
    }
  ]
}

# Get type configuration by menu ID
GET /api/v1/configuration/get-type-configuration/type

# Update type configuration
PUT /api/v1/configuration/update-type-configuration/type
{
  "title": "Updated title",
  "productTypes": [...]
}
```

## Implementation Steps

### Step 1: Set up the Database
1. Ensure MongoDB is running
2. Create `.env` file with MongoDB connection string
3. Run the application

### Step 2: Seed Initial Data
```javascript
// Run the seeder
const { seedTypeConfiguration } = require('./seeder/typeSeeder');
await seedTypeConfiguration();
```

### Step 3: Test the API
```bash
# Test menu configuration
curl -X GET http://localhost:4000/api/v1/configuration/get-menu-configuration

# Test type configuration
curl -X GET http://localhost:4000/api/v1/configuration/get-type-configuration/type
```

## Frontend Integration

### 1. Fetch Menu Configuration
```javascript
// Get all menu items for sidebar
const fetchMenuConfiguration = async () => {
  const response = await fetch('/api/v1/configuration/get-menu-configuration');
  const data = await response.json();
  return data.data; // Array of menu items
};
```

### 2. Fetch Type Content
```javascript
// Get type configuration content
const fetchTypeConfiguration = async (menuId) => {
  const response = await fetch(`/api/v1/configuration/get-type-configuration/${menuId}`);
  const data = await response.json();
  return data.data; // Type configuration with product types
};
```

### 3. Handle Menu Selection
```javascript
// When user clicks on "Type" menu item
const handleMenuClick = async (menuId) => {
  if (menuId === 'type') {
    const typeConfig = await fetchTypeConfiguration(menuId);
    // Update UI with product types
    displayProductTypes(typeConfig.productTypes);
  }
};
```

## Data Structure Examples

### MenuConfiguration
```javascript
{
  "id": "type",
  "name": "Type",
  "icon": "shirt-triangle-square",
  "type": "navigation",
  "isSelected": true,
  "sortOrder": 1,
  "contentModel": "TypeConfiguration",
  "hasTabs": false,
  "tabs": []
}
```

### TypeConfiguration
```javascript
{
  "menuId": "type",
  "title": "Select your jersey type",
  "description": "Choose from our premium jersey types",
  "productTypes": [
    {
      "id": "pro",
      "name": "Pro",
      "image": "/images/jerseys/pro-jersey.jpg",
      "description": "Professional grade jersey",
      "features": ["Embroidered", "High performance", "220GSM"],
      "price": 99,
      "priceNote": "From",
      "tag": "Best Value",
      "isPremium": true,
      "sortOrder": 1
    }
  ]
}
```

## Benefits of This Approach

1. **Scalable**: Easy to add new menu types
2. **Flexible**: Each content model can have its own structure
3. **Maintainable**: Clear separation of concerns
4. **Performance**: Optimized queries per content type
5. **Future-proof**: Supports complex UI patterns

## Next Steps

1. Implement other menu configurations (Design, Features, Color, etc.)
2. Add user authentication and permissions
3. Implement real-time updates
4. Add image upload functionality
5. Implement caching for better performance 