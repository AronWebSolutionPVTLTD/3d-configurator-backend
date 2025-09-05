const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { seedNumbers } = require("./numberSeeder.js");

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://3d-db:lxnHi3VIJq2VhJtr@cluster0.54afd9b.mongodb.net/3d-configurator";

async function runNumberSeeder() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    await seedNumbers();

    console.log("🎉 Number seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error running number seeder:", err);
    process.exit(1);
  }
}

runNumberSeeder();
