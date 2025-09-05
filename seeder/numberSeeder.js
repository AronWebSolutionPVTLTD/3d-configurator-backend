const Number = require("../model/Number.js");

const numberSeedData = [
  // Front Center Numbers
  {
    content: "10",
    zone: "frontCenter",
    font: "Impact",
    color: "#FFFFFF",
    outline: {
      enabled: true,
      color: "#000000",
      thickness: 2
    },
    background: {
      enabled: false,
      color: "#FFFFFF",
      opacity: 1
    },
    position: {
      x: 0.5,
      y: 0.5
    },
    size: 40,
    align: "center",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },
  {
    content: "23",
    zone: "frontCenter",
    font: "Arial",
    color: "#FF0000",
    outline: {
      enabled: true,
      color: "#FFFFFF",
      thickness: 3
    },
    background: {
      enabled: true,
      color: "#000000",
      opacity: 0.8
    },
    position: {
      x: 0.5,
      y: 0.4
    },
    size: 45,
    align: "center",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },
  {
    content: "7",
    zone: "frontCenter",
    font: "Helvetica",
    color: "#0000FF",
    outline: {
      enabled: false,
      color: "#000000",
      thickness: 2
    },
    background: {
      enabled: false,
      color: "#FFFFFF",
      opacity: 1
    },
    position: {
      x: 0.5,
      y: 0.6
    },
    size: 50,
    align: "center",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },

  // Left Front Numbers
  {
    content: "99",
    zone: "leftFront",
    font: "Impact",
    color: "#FFFF00",
    outline: {
      enabled: true,
      color: "#000000",
      thickness: 2
    },
    background: {
      enabled: false,
      color: "#FFFFFF",
      opacity: 1
    },
    position: {
      x: 0.3,
      y: 0.5
    },
    size: 35,
    align: "left",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },
  {
    content: "1",
    zone: "leftFront",
    font: "Arial",
    color: "#00FF00",
    outline: {
      enabled: true,
      color: "#FFFFFF",
      thickness: 1
    },
    background: {
      enabled: true,
      color: "#FF0000",
      opacity: 0.5
    },
    position: {
      x: 0.25,
      y: 0.45
    },
    size: 30,
    align: "left",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },

  // Right Front Numbers
  {
    content: "88",
    zone: "rightFront",
    font: "Impact",
    color: "#FF00FF",
    outline: {
      enabled: true,
      color: "#000000",
      thickness: 2
    },
    background: {
      enabled: false,
      color: "#FFFFFF",
      opacity: 1
    },
    position: {
      x: 0.7,
      y: 0.5
    },
    size: 35,
    align: "right",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },
  {
    content: "5",
    zone: "rightFront",
    font: "Helvetica",
    color: "#00FFFF",
    outline: {
      enabled: false,
      color: "#000000",
      thickness: 2
    },
    background: {
      enabled: true,
      color: "#000000",
      opacity: 0.7
    },
    position: {
      x: 0.75,
      y: 0.55
    },
    size: 38,
    align: "right",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },

  // Back Numbers
  {
    content: "12",
    zone: "back",
    font: "Impact",
    color: "#FFFFFF",
    outline: {
      enabled: true,
      color: "#000000",
      thickness: 3
    },
    background: {
      enabled: false,
      color: "#FFFFFF",
      opacity: 1
    },
    position: {
      x: 0.5,
      y: 0.5
    },
    size: 60,
    align: "center",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },
  {
    content: "21",
    zone: "back",
    font: "Arial",
    color: "#000000",
    outline: {
      enabled: true,
      color: "#FFFFFF",
      thickness: 2
    },
    background: {
      enabled: true,
      color: "#FFD700",
      opacity: 0.9
    },
    position: {
      x: 0.5,
      y: 0.4
    },
    size: 55,
    align: "center",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },
  {
    content: "3",
    zone: "back",
    font: "Helvetica",
    color: "#FF4500",
    outline: {
      enabled: false,
      color: "#000000",
      thickness: 2
    },
    background: {
      enabled: false,
      color: "#FFFFFF",
      opacity: 1
    },
    position: {
      x: 0.5,
      y: 0.6
    },
    size: 65,
    align: "center",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: true
    }
  },

  // Special cases with different validations
  {
    content: "ABC",
    zone: "frontCenter",
    font: "Impact",
    color: "#800080",
    outline: {
      enabled: true,
      color: "#FFFFFF",
      thickness: 2
    },
    background: {
      enabled: false,
      color: "#FFFFFF",
      opacity: 1
    },
    position: {
      x: 0.5,
      y: 0.3
    },
    size: 42,
    align: "center",
    mirror: false,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: false
    }
  },
  {
    content: "1A",
    zone: "leftFront",
    font: "Arial",
    color: "#FF6347",
    outline: {
      enabled: true,
      color: "#000000",
      thickness: 1
    },
    background: {
      enabled: true,
      color: "#F0F8FF",
      opacity: 0.6
    },
    position: {
      x: 0.2,
      y: 0.5
    },
    size: 32,
    align: "left",
    mirror: true,
    validations: {
      maxLength: 4,
      allowLetters: true,
      allowSymbols: true,
      noLeadingZero: false
    }
  }
];

async function seedNumbers() {
  try {
    console.log("🌱 Starting Number seeding...");
    
    // Clear existing numbers
    await Number.deleteMany({});
    console.log("🗑 Cleared existing numbers");
    
    // Insert new numbers
    const numbers = await Number.insertMany(numberSeedData);
    console.log(`✅ Inserted ${numbers.length} numbers`);
    
    // Log summary by zone
    const zoneSummary = numbers.reduce((acc, num) => {
      acc[num.zone] = (acc[num.zone] || 0) + 1;
      return acc;
    }, {});
    
    console.log("📊 Numbers by zone:");
    Object.entries(zoneSummary).forEach(([zone, count]) => {
      console.log(`   ${zone}: ${count} numbers`);
    });
    
    console.log("🎉 Number seeding completed!");
    return numbers;
  } catch (error) {
    console.error("❌ Error seeding numbers:", error);
    throw error;
  }
}

module.exports = { seedNumbers, numberSeedData };
