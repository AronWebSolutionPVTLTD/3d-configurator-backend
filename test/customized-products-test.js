/**
 * Test script for Customized Products API
 * 
 * This script demonstrates how to use the new customized products API endpoints.
 * Make sure to update the BASE_URL and test data before running.
 */

const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:3000/api/v1/merchant';
const TEST_TOKEN = 'your_jwt_token_here'; // Replace with actual JWT token
const TEST_REFERENCED_PRODUCT = '68bae845df3c4deefb65972e'; // Replace with actual product ID
const TEST_USER_ID = 'user123';

// Test data
const testCustomizations = {
  numbers: [
    {
      id: "back",
      content: "23",
      font: "Arial",
      color: "#ff0000",
      size: 40,
      heightCm: 5,
      widthCm: 3
    }
  ],
  names: [
    {
      id: "chest_center",
      content: "John Doe",
      font: "Times New Roman",
      color: "#000000",
      height: 4,
      width: 8
    }
  ],
  colors: [
    {
      id: "front",
      value: "#ff0000",
      gradient: false
    },
    {
      id: "back", 
      value: "#00ff00",
      gradient: true,
      gradientAngle: 45
    }
  ],
  patterns: [
    {
      id: "pattern1",
      scale: 1.5,
      angle: 45,
      patternColor: "#00ff00",
      backgroundColor: "#ffffff"
    }
  ]
};

// Helper function to make authenticated requests
const makeRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error making ${method} request to ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

// Test functions
const testCreateCustomizedProduct = async () => {
  console.log('\n🧪 Testing: Create Customized Product');
  
  const requestData = {
    referencedProduct: TEST_REFERENCED_PRODUCT,
    customizedByUser: TEST_USER_ID,
    tools: [
      "68c8100482269cd190057d92",
      "68c8100582269cd190057d9c",
      "68c8100582269cd190057da8",
      "68c8100582269cd190057dbc",
      "68c8100582269cd190057dcc",
      "68c8100582269cd190057ddf",
      "68c8100582269cd190057e13",
      "68c8100582269cd190057e16",
      "68c8100582269cd190057e19"
    ],
    name: "Custom Jersey for John Doe",
    description: "Personalized jersey with custom number and name",
    basePrice: 75.00
  };

  try {
    const result = await makeRequest('POST', '/products/customized', requestData);
    console.log('✅ Success:', result.message);
    console.log('📦 Product ID:', result.data.product._id);
    console.log('🆕 Is New:', result.data.isNew);
    return result.data.product._id;
  } catch (error) {
    console.error('❌ Failed to create customized product');
    throw error;
  }
};

const testUpdateCustomizedProduct = async () => {
  console.log('\n🧪 Testing: Update Customized Product');
  
  const updatedCustomizations = {
    ...testCustomizations,
    numbers: [
      {
        ...testCustomizations.numbers[0],
        content: "99", // Changed from "23" to "99"
        color: "#0000ff" // Changed from red to blue
      }
    ]
  };

  const requestData = {
    referencedProduct: TEST_REFERENCED_PRODUCT,
    customizedByUser: TEST_USER_ID,
    tools: [
      "68c8100482269cd190057d92",
      "68c8100582269cd190057d9c",
      "68c8100582269cd190057da8",
      "68c8100582269cd190057dbc",
      "68c8100582269cd190057dcc",
      "68c8100582269cd190057ddf",
      "68c8100582269cd190057e13",
      "68c8100582269cd190057e16",
      "68c8100582269cd190057e19"
    ],
    name: "Updated Custom Jersey for John Doe",
    basePrice: 80.00
  };

  try {
    const result = await makeRequest('POST', '/products/customized', requestData);
    console.log('✅ Success:', result.message);
    console.log('📦 Product ID:', result.data.product._id);
    console.log('🆕 Is New:', result.data.isNew);
    return result.data.product._id;
  } catch (error) {
    console.error('❌ Failed to update customized product');
    throw error;
  }
};

const testGetCustomizedProducts = async () => {
  console.log('\n🧪 Testing: Get Customized Products');
  
  try {
    const result = await makeRequest('GET', `/products/customized/${TEST_USER_ID}`);
    console.log('✅ Success: Retrieved customized products');
    console.log('📊 Total Products:', result.data.pagination.totalItems);
    console.log('📄 Current Page:', result.data.pagination.currentPage);
    
    if (result.data.products.length > 0) {
      console.log('📦 First Product:', {
        id: result.data.products[0]._id,
        name: result.data.products[0].name,
        basePrice: result.data.products[0].basePrice,
        status: result.data.products[0].status
      });
    }
    
    return result.data.products;
  } catch (error) {
    console.error('❌ Failed to get customized products');
    throw error;
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Customized Products API Tests');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Create customized product
    const productId = await testCreateCustomizedProduct();
    
    // Test 2: Update the same customized product
    await testUpdateCustomizedProduct();
    
    // Test 3: Get all customized products for user
    const products = await testGetCustomizedProducts();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testCreateCustomizedProduct,
  testUpdateCustomizedProduct,
  testGetCustomizedProducts,
  runTests
};
