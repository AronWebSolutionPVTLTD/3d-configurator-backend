# Customized Products API

This API allows users to create and manage customized products based on existing products in the system.

## Endpoints

### 1. Create or Update Customized Product

**POST** `/api/v1/merchant/products/customized`

Creates a new customized product or updates an existing one based on `referencedProduct` and `customizedByUser`.

#### Request Body

```json
{
  "referencedProduct": "68bae845df3c4deefb65972e",
  "customizedByUser": "user123",
  "customizations": {
    "numbers": [
      {
        "id": "back",
        "content": "23",
        "font": "Arial",
        "color": "#ff0000",
        "size": 40
      }
    ],
    "names": [
      {
        "id": "chest_center",
        "content": "John Doe",
        "font": "Times New Roman",
        "color": "#000000"
      }
    ],
    "colors": [
      {
        "id": "front",
        "value": "#ff0000",
        "gradient": false
      }
    ],
    "patterns": [
      {
        "id": "pattern1",
        "scale": 1.5,
        "angle": 45,
        "patternColor": "#00ff00"
      }
    ]
  },
  "name": "Custom Jersey for John Doe",
  "description": "Personalized jersey with custom number and name",
  "basePrice": 75.00,
  "images": [
    {
      "url": "https://example.com/custom-jersey.jpg",
      "alt": "Custom Jersey"
    }
  ]
}
```

#### Response

```json
{
  "success": true,
  "message": "Customized product created successfully",
  "data": {
    "product": {
      "_id": "68c81348effa345832f5d70b",
      "merchant": "68bae845df3c4deefb65972e",
      "sport": {...},
      "category": {...},
      "name": "Custom Jersey for John Doe",
      "description": "Personalized jersey with custom number and name",
      "basePrice": 75.00,
      "images": [...],
      "tools": [...],
      "stock": {...},
      "status": "draft",
      "isCustomizedByUser": true,
      "customizedByUser": "user123",
      "reffrencedProduct": "68bae845df3c4deefb65972e",
      "customizations": {...},
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "isNew": true
  }
}
```

### 2. Get Customized Products for User

**GET** `/api/v1/merchant/products/customized/:customizedByUser`

Retrieves all customized products for a specific user.

#### Query Parameters

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

#### Response

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "68c81348effa345832f5d70b",
        "name": "Custom Jersey for John Doe",
        "basePrice": 75.00,
        "status": "draft",
        "isCustomizedByUser": true,
        "customizedByUser": "user123",
        "reffrencedProduct": {
          "_id": "68bae845df3c4deefb65972e",
          "name": "Base Jersey",
          "basePrice": 50.00,
          "images": [...]
        },
        "customizations": {...},
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10
    }
  }
}
```

## Business Logic

### Create vs Update Logic

The API automatically determines whether to create a new customized product or update an existing one based on:

1. **`referencedProduct`**: The ID of the original product being customized
2. **`customizedByUser`**: Unique identifier for the user (could be user ID, session ID, etc.)

If a product with the same `referencedProduct` and `customizedByUser` combination exists, it will be updated. Otherwise, a new customized product will be created.

### Customizations Structure

The `customizations` object can contain any of the following tool types:

- `numbers`: Array of number customizations
- `names`: Array of name customizations  
- `text`: Array of text customizations
- `logos`: Array of logo customizations
- `colors`: Array of color customizations
- `patterns`: Array of pattern customizations
- `features`: Array of feature customizations
- `designs`: Array of design customizations
- `jerseyTypes`: Array of jersey type customizations

Each customization object should contain the relevant properties for that tool type.

### Product Inheritance

When creating a new customized product, it inherits the following properties from the referenced product:

- `sport`
- `category` 
- `tools`
- `stock`
- `images` (if not provided in request)
- `name` (if not provided, defaults to "{originalName} (Customized)")
- `description` (if not provided)
- `basePrice` (if not provided)

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Error Responses

### 404 - Referenced Product Not Found

```json
{
  "success": false,
  "message": "Referenced product not found"
}
```

### 400 - Validation Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "referencedProduct",
      "message": "Referenced product ID is required"
    }
  ]
}
```

### 500 - Server Error

```json
{
  "success": false,
  "message": "Error creating/updating customized product",
  "error": "Detailed error message"
}
```
