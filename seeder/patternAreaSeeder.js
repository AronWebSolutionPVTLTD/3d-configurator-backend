const PatternArea = require("../model/PatternArea");

const patternAreaData = [
  {
    id: "front",
    name: "Front",
    label: "Front",
    active: true,
    scale: 1,
    angle: 0,
    translateX: 0,
    translateY: 0,
    background: ""
  },
  {
    id: "back",
    name: "Back",
    label: "Back",
    active: false,
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
    scale: 1,
    angle: 0,
    translateX: 0,
    translateY: 0,
    background: ""
  }
];

const seedPatternAreas = async () => {
  try {
    // Clear existing pattern areas
    await PatternArea.deleteMany({});
    
    // Insert new pattern areas
    const result = await PatternArea.insertMany(patternAreaData);
    
    console.log(`✅ Successfully seeded ${result.length} pattern areas`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding pattern areas:", error);
    throw error;
  }
};

module.exports = { seedPatternAreas };
