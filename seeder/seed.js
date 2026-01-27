const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Models
const Tool = require("../model/Tool.js");
const ColorSwatch = require("../model/ColorSwatch.js");
const Pattern = require("../model/Pattern.js");
const JerseyType = require("../model/JerseyType.js");
const DesignTemplate = require("../model/DesignTemplate.js");
const FeatureMenu = require("../model/FeatureMenu.js");
const CustomColorSection = require("../model/CustomColorSection.js");
const PatternArea = require("../model/PatternArea.js");
const Number = require("../model/Number.js");
const Font = require("../model/Font.js");
const PlacementZone = require("../model/PlacementZone.js");

// Data
const {
  colorSwatches,
  patterns,
  toolsMenuWithOptions,
} = require("../data/toolsMenuData.js");
const { seedNumbers, numberSeedData } = require("./numberSeeder.js");

// Seed fonts (can be replaced by admin UI later)
const fontSeeds = [
  { name: "edge-dallas", label: "Edge Dallas", fontFamily: "Edge Dallas" },
  { name: "roboto", label: "Roboto", fontFamily: "Roboto" },
  { name: "montserrat", label: "Montserrat", fontFamily: "Montserrat" },
  { name: "times-new-roman", label: "Times New Roman", fontFamily: "Times New Roman" },
  { name: "impact", label: "Impact", fontFamily: "Impact" },
];

// Seed placement zones (starter set per toolType)
const placementZoneSeeds = [
  { key: "chest-center", name: "Chest Center", label: "Chest Center", toolType: "name", order: 1 },
  { key: "chest-left", name: "Chest Left", label: "Chest Left", toolType: "name", order: 2 },
  { key: "chest-right", name: "Chest Right", label: "Chest Right", toolType: "name", order: 3 },
  { key: "back-top", name: "Back Top", label: "Back Top", toolType: "name", order: 4 },
  { key: "back-center", name: "Back Center", label: "Back Center", toolType: "name", order: 5 },
  { key: "back-bottom", name: "Back Bottom", label: "Back Bottom", toolType: "name", order: 6 },

  { key: "number-front-center", name: "Front Center", label: "Front Center", toolType: "numbers", order: 1 },
  { key: "number-back", name: "Back", label: "Back", toolType: "numbers", order: 2 },
  { key: "number-chest-left", name: "Chest Left", label: "Chest Left", toolType: "numbers", order: 3 },
  { key: "number-chest-right", name: "Chest Right", label: "Chest Right", toolType: "numbers", order: 4 },

  { key: "logo-front", name: "Front", label: "Front", toolType: "logo", order: 1 },
  { key: "logo-back", name: "Back", label: "Back", toolType: "logo", order: 2 },
  { key: "logo-sleeve", name: "Sleeve", label: "Sleeve", toolType: "logo", order: 3 },

  { key: "text-front", name: "Front", label: "Front", toolType: "text", order: 1 },
  { key: "text-back", name: "Back", label: "Back", toolType: "text", order: 2 },
];

const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://3d-db:lxnHi3VIJq2VhJtr@cluster0.54afd9b.mongodb.net/3d-configurator";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Tool.deleteMany({}),
      ColorSwatch.deleteMany({}),
      Pattern.deleteMany({}),
      JerseyType.deleteMany({}),
      DesignTemplate.deleteMany({}),
      FeatureMenu.deleteMany({}),
      CustomColorSection.deleteMany({}),
      PatternArea.deleteMany({}),
      Number.deleteMany({}),
      Font.deleteMany({}),
      PlacementZone.deleteMany({}),
    ]);

    console.log("🗑 Cleared old data");

    // Insert Color Swatches
    const swatches = await ColorSwatch.insertMany(colorSwatches);
    console.log(`🎨 Inserted ${swatches.length} color swatches`);

    // Insert Fonts
    const fonts = await Font.insertMany(fontSeeds);
    console.log(`🔤 Inserted ${fonts.length} fonts`);

    // Insert Placement Zones
    const zones = await PlacementZone.insertMany(placementZoneSeeds);
    console.log(`📍 Inserted ${zones.length} placement zones`);

    // Insert Patterns
    const pats = await Pattern.insertMany(patterns);
    console.log(`🟦 Inserted ${pats.length} patterns`);

    // Insert Tools + Related Data
    for (const tool of toolsMenuWithOptions) {
      const { value, label, description, options } = tool;
      const toolDoc = await Tool.create({
        value,
        label,
        description,
        relatedModels: [],
      });

      // Handle per-tool data
      if (value === "jersey-type") {
        const docs = await JerseyType.insertMany(options.jerseyTypes);
        docs.forEach((doc) => {
          toolDoc.relatedModels.push({ model: "JerseyType", ref: doc._id });
        });
      }

      if (value === "design") {
        const docs = await DesignTemplate.insertMany(options.designs);
        docs.forEach((doc) => {
          toolDoc.relatedModels.push({ model: "DesignTemplate", ref: doc._id });
        });
      }

      if (value === "features") {
        const docs = await FeatureMenu.insertMany(options.fitmentMenus);
        docs.forEach((doc) => {
          toolDoc.relatedModels.push({ model: "FeatureMenu", ref: doc._id });
        });
      }

      if (value === "color") {
        const docs = await CustomColorSection.insertMany(
          options.customColorSections
        );
        docs.forEach((doc) => {
          toolDoc.relatedModels.push({
            model: "CustomColorSection",
            ref: doc._id,
          });
        });
        // Note: colorSwatches already inserted separately
      }

      if (value === "pattern") {
        // First, get a pattern to assign (assuming patterns were already inserted)
        const firstPattern = await Pattern.findOne({});

        const docs = await PatternArea.insertMany([
          {
            id: "front",
            name: "Front",
            label: "Front",
            active: true,
            selectedPattern: firstPattern ? firstPattern._id : null,
            scale: 1,
            angle: 0,
            translateX: 0,
            translateY: 0,
            background: "",
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
            background: "",
          },
          {
            id: "rightSleeve",
            name: "Right Sleeve",
            label: "Right sleeve",
            active: false,
            selectedPattern: null,
            scale: 1,
            angle: 0,
            translateX: 0,
            translateY: 0,
            background: "",
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
            background: "",
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
            background: "",
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
            background: "",
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
            background: "",
          },
        ]);
        docs.forEach((doc) => {
          toolDoc.relatedModels.push({
            model: "PatternArea",
            ref: doc._id,
          });
        });
      }
      if (value === "numbers") {
        // saved number make relation for the tool
        const numbers = await Number.insertMany(numberSeedData);
        numbers.forEach((number) => {
          toolDoc.relatedModels.push({ model: "Number", ref: number._id });
        });
      }

      // Numbers, names, text, logos → store configs inside Tool itself for now
      // If needed, can make separate models for them

      await toolDoc.save();
      console.log(`✅ Inserted tool: ${value}`);
    }


    console.log("🌱 Seeding completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding data", err);
    process.exit(1);
  }
}

seed();
