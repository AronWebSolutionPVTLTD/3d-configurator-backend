/*
Example: How to use PatternArea with ProductTool

This shows how the pattern configuration integrates with your existing architecture
*/

// 1. PatternArea structure (flat list of areas, no hierarchical grouping)
const patternAreasExample = [
  {
    id: "front",
    name: "Front",
    label: "Front",
    active: true,
    selectedPattern: "64f8a1b2c3d4e5f678901241", // Reference to Pattern model
    scale: 1.2,
    angle: 45,
    translateX: 10,
    translateY: -5,
    background: "#f0f0f0"
  },
  {
    id: "back",
    name: "Back",
    label: "Back", 
    active: false,
    selectedPattern: null, // No pattern selected yet
    scale: 1,
    angle: 0,
    translateX: 0,
    translateY: 0,
    background: ""
  },
  {
    id: "rightSleeve",
    name: "Right Sleeve",
    label: "Right sleeve",
    active: false,
    selectedPattern: "64f8a1b2c3d4e5f678901242", // Different pattern
    scale: 1,
    angle: 0,
    translateX: 0,
    translateY: 0,
    background: ""
  },
  {
    id: "leftSleeve",
    name: "Left Sleeve",
    label: "Left sleeve",
    active: false,
    selectedPattern: null,
    scale: 1,
    angle: 0,
    translateX: 0,
    translateY: 0,
    background: ""
  },
  {
    id: "collar",
    name: "Collar",
    label: "Collar",
    active: false,
    selectedPattern: null,
    scale: 1,
    angle: 0,
    translateX: 0,
    translateY: 0,
    background: ""
  },
  {
    id: "element1",
    name: "Element 1",
    label: "Element 1",
    active: false,
    selectedPattern: null,
    scale: 1,
    angle: 0,
    translateX: 0,
    translateY: 0,
    background: ""
  },
  {
    id: "element2",
    name: "Element 2",
    label: "Element 2",
    active: false,
    selectedPattern: null,
    scale: 1,
    angle: 0,
    translateX: 0,
    translateY: 0,
    background: ""
  }
];

// 2. ProductTool configuration for patterns
const productToolPatternExample = {
  product: "64f8a1b2c3d4e5f678901240", // Product ID
  tool: "64f8a1b2c3d4e5f678901242",   // Pattern tool ID
  config: {
    patternAreas: "68b57f6e29f2b5992b2a3b91", // PatternArea collection reference
    customSettings: {
      // Override any default settings if needed
      globalScale: 1.5,
      globalAngle: 30
    }
  }
};

// 3. How to query and use in your application
const getPatternConfiguration = async (productId) => {
  try {
    // Get the ProductTool for patterns
    const productTool = await ProductTool.findOne({
      product: productId,
      tool: { $in: await Tool.find({ value: "pattern" }).select("_id") }
    }).populate("tool");

    if (!productTool) {
      throw new Error("Pattern tool not found for this product");
    }

    // Get all pattern areas with their selected patterns populated
    const patternAreas = await PatternArea.find({})
      .populate("selectedPattern", "id name image");

    return {
      patternAreas,
      customSettings: productTool.config.customSettings || {}
    };
  } catch (error) {
    console.error("Error getting pattern configuration:", error);
    throw error;
  }
};

// 4. Example API response structure
const apiResponseExample = {
  success: true,
  data: {
    patternAreas: [
      {
        id: "front",
        name: "Front",
        label: "Front",
        active: true,
        selectedPattern: {
          _id: "64f8a1b2c3d4e5f678901241",
          id: "geometric1",
          name: "Geometric Pattern",
          image: "path/to/pattern.svg"
        },
        scale: 1.2,
        angle: 45,
        translateX: 10,
        translateY: -5,
        background: "#f0f0f0"
      },
      {
        id: "back",
        name: "Back",
        label: "Back",
        active: false,
        selectedPattern: null,
        scale: 1,
        angle: 0,
        translateX: 0,
        translateY: 0,
        background: ""
      }
    ],
    customSettings: {
      globalScale: 1.5,
      globalAngle: 30
    }
  }
};

// 5. How to update pattern selection for a specific area
const updatePatternSelection = async (areaId, patternId) => {
  try {
    // Find and update the specific pattern area with new pattern
    const patternArea = await PatternArea.findOneAndUpdate(
      { id: areaId },
      { 
        $set: { 
          selectedPattern: patternId,
          active: true // Automatically activate when pattern is selected
        } 
      },
      { new: true }
    ).populate("selectedPattern", "id name image");

    if (!patternArea) {
      throw new Error(`Pattern area ${areaId} not found`);
    }

    return patternArea;
  } catch (error) {
    console.error("Error updating pattern selection:", error);
    throw error;
  }
};

// 6. How to update pattern settings for a specific area
const updatePatternAreaSettings = async (areaId, settings) => {
  try {
    // Find and update the specific pattern area
    const patternArea = await PatternArea.findOneAndUpdate(
      { id: areaId },
      { $set: settings },
      { new: true }
    ).populate("selectedPattern", "id name image");

    if (!patternArea) {
      throw new Error(`Pattern area ${areaId} not found`);
    }

    return patternArea;
  } catch (error) {
    console.error("Error updating pattern area settings:", error);
    throw error;
  }
};

// 7. How to get a specific pattern area with its pattern
const getPatternArea = async (areaId) => {
  try {
    const patternArea = await PatternArea.findOne({ id: areaId })
      .populate("selectedPattern", "id name image");
    
    if (!patternArea) {
      throw new Error(`Pattern area ${areaId} not found`);
    }

    return patternArea;
  } catch (error) {
    console.error("Error getting pattern area:", error);
    throw error;
  }
};

// 8. How to get all areas that have a specific pattern applied
const getAreasWithPattern = async (patternId) => {
  try {
    const patternAreas = await PatternArea.find({ 
      selectedPattern: patternId 
    }).populate("selectedPattern", "id name image");
    
    return patternAreas;
  } catch (error) {
    console.error("Error getting areas with pattern:", error);
    throw error;
  }
};

module.exports = {
  patternAreasExample,
  productToolPatternExample,
  getPatternConfiguration,
  apiResponseExample,
  updatePatternSelection,
  updatePatternAreaSettings,
  getPatternArea,
  getAreasWithPattern
};
