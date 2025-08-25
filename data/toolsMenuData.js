// 🎨 Color Swatches Data
const colorSwatches = [
  { name: "Light Yellow", value: "#f1eb9c" },
  { name: "Bright Yellow", value: "#fcf770" },
  { name: "Gold", value: "#fedd00" },
  { name: "Amber", value: "#ffcd00" },
  { name: "Orange", value: "#ffb81c" },
  { name: "Dark Orange", value: "#ff8200" },
  { name: "Coral", value: "#fe5000" },
  { name: "Light Pink", value: "#f2aaaa" },
  { name: "Peach", value: "#f5a38e" },
  { name: "Red", value: "#f26363" },
  { name: "Salmon", value: "#fcb67e" },
  { name: "Light Red", value: "#ff8674" },
  { name: "Crimson", value: "#f9423a" },
  { name: "Red Wine", value: "#e4002b" },
  { name: "Dark Red", value: "#d50032" },
  { name: "Burgundy", value: "#a6192e" },
  { name: "Dark Purple", value: "#6c1d45" },
  { name: "Hot Pink", value: "#ff59a1" },
  { name: "Fuchsia", value: "#ce0058" },
  { name: "Lavender", value: "#d48bc8" },
  { name: "Purple", value: "#93328e" },
  { name: "Light Lavender", value: "#c7bce5" },
  { name: "Medium Purple", value: "#9678d3" },
  { name: "Dark Blue", value: "#582c83" },
  { name: "Teal", value: "#6a3460" },
  { name: "Light Blue", value: "#bdd6e6" },
  { name: "Sky Blue", value: "#91cdd9" },
  { name: "Turquoise", value: "#66c3cc" },
  { name: "Light Turquoise", value: "#8bb8e8" },
  { name: "Medium Turquoise", value: "#66b2cc" },
  { name: "Steel Blue", value: "#468fc7" },
  { name: "Royal Blue", value: "#4a7bda" },
  { name: "Cobalt Blue", value: "#085dbf" },
  { name: "Navy Blue", value: "#004c97" },
  { name: "Dark Navy", value: "#171c8f" },
  { name: "Dark Slate Blue", value: "#072661" },
  { name: "Dark Cyan", value: "#004052" },
  { name: "Midnight Blue", value: "#0f1144" },
  { name: "Mint Green", value: "#b2dbbc" },
  { name: "Sea Green", value: "#7fc7a8" },
  { name: "Light Sea Green", value: "#6eceb2" },
  { name: "Turquoise Green", value: "#33aba9" },
  { name: "Dark Green", value: "#248f86" },
  { name: "Forest Green", value: "#338059" },
  { name: "Emerald", value: "#008591" },
  { name: "Teal Green", value: "#045463" },
  { name: "Light Lime", value: "#e6ff73" },
  { name: "Lime", value: "#e3e935" },
  { name: "Bright Green", value: "#78be21" },
  { name: "Dark Green", value: "#007a33" },
  { name: "Deep Green", value: "#006747" },
  { name: "Dark Olive", value: "#00331e" },
  { name: "Olive", value: "#9a9e6c" },
  { name: "Olive Drab", value: "#949300" },
  { name: "Dark Olive Green", value: "#3d441e" },
  { name: "Light Beige", value: "#f2e5b1" },
  { name: "Tan", value: "#a68a46" },
  { name: "Amber", value: "#cf9814" },
  { name: "Mustard", value: "#b47e00" },
  { name: "Brown", value: "#9f694d" },
  { name: "Dark Brown", value: "#4d290f" },
  { name: "Rust", value: "#a9431e" },
  { name: "Dark Chocolate", value: "#4b3815" },
  { name: "Light Gray", value: "#cbc4bc" },
  { name: "Gray", value: "#968c71" },
  { name: "Silver", value: "#c1c6c8" },
  { name: "Dark Gray", value: "#989a9a" },
  { name: "Slate Gray", value: "#5b6770" },
  { name: "Charcoal", value: "#46494c" },
  { name: "Black", value: "#3d3935" },
  { name: "Dark Slate", value: "#414449" },
  { name: "White", value: "#ffffff" },
  { name: "Dark Black", value: "#000000" },
];

// 🟦 Pattern Data
const patterns = [
  {
    id: "pattern-1",
    name: "Pattern 1",
    image: "/patterns/spizd_patterns_57_2_preview.svg",
  },
  {
    id: "pattern-2",
    name: "Pattern 2",
    image: "/patterns/spized_patterns_30_2_preview.svg",
  },
  {
    id: "pattern-3",
    name: "Pattern 3",
    image: "/patterns/spized_patterns_35_2_preview.svg",
  },
  {
    id: "pattern-4",
    name: "Pattern 4",
    image: "/patterns/spized_patterns_37_2_preview.svg",
  },
  {
    id: "pattern-5",
    name: "Pattern 5",
    image: "/patterns/spized_patterns_72_2_preview.svg",
  },
  {
    id: "pattern-6",
    name: "Pattern 6",
    image: "/patterns/spized_patterns_77_2_preview.svg",
  },
  {
    id: "pattern-7",
    name: "Pattern 7",
    image: "/patterns/stripes_2_preview.svg",
  },
  {
    id: "pattern-8",
    name: "Pattern 8",
    image: "/patterns/topography_2_preview.svg",
  },
];

// 🛠 Complete Tools Menu (trimmed down for seeds, references used for details)
const toolsMenuWithOptions = [
  {
    value: "jersey-type",
    label: "Type",
    description: "Select jersey type and style",
    options: {
      jerseyTypes: [
        {
          name: "Pro",
          style: "Embroidered",
          performance: "High",
          gsm: "220GSM",
          price: 99,
          priceNote: "Best value",
          premium: true,
          tag: "Recommended",
          image: "/jerseys/pro.png",
        },
        {
          name: "Premium",
          style: "Sublimated",
          performance: "Elite",
          gsm: "240GSM",
          price: 129,
          priceNote: "Premium pick",
          premium: true,
          tag: "Best quality",
          image: "/jerseys/premium.png",
        },
        {
          name: "Goalie",
          style: "Padded",
          performance: "Specialized",
          gsm: "260GSM",
          price: 149,
          priceNote: "For goalkeepers",
          premium: false,
          tag: "Special",
          image: "/jerseys/goalie.png",
        },
      ],
    },
  },
  {
    value: "design",
    label: "Designs",
    description: "Choose from existing designs",
    options: {
      designs: [
        { value: "d1", src: "/designs/design1.png", category: "nhl" },
        { value: "d2", src: "/designs/design2.png", category: "all" },
        { value: "d3", src: "/designs/design3.png", category: "all" },
        { value: "d4", src: "/designs/design4.png", category: "nhl" },
      ],
    },
  },
  {
    value: "features",
    label: "Features",
    description: "Customize jersey fitment",
    options: {
      fitmentMenus: [
        {
          id: "collar",
          title: "Collar Style",
          options: [
            {
              heading: "Round",
              groupId: "collar",
              items: [
                { label: "Round Small", value: "round-sm" },
                { label: "Round Large", value: "round-lg" },
              ],
            },
            {
              heading: "V-Neck",
              groupId: "collar",
              items: [
                { label: "V Small", value: "v-sm" },
                { label: "V Large", value: "v-lg" },
              ],
            },
          ],
        },
        {
          id: "sleeves",
          title: "Sleeve Style",
          options: [
            {
              heading: "Full Sleeve",
              groupId: "sleeves",
              items: [
                { label: "Standard", value: "sleeve-std" },
                { label: "Tapered", value: "sleeve-tpr" },
              ],
            },
            {
              heading: "Half Sleeve",
              groupId: "sleeves",
              items: [
                { label: "Standard", value: "sleeve-half" },
                { label: "Loose", value: "sleeve-loose" },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    value: "color",
    label: "Colors",
    description: "Customize jersey colors",
    options: {
      customColorSections: [
        {
          id: "body",
          name: "Body",
          children: [
            { id: "front", name: "Front", value: "#FF0000" },
            { id: "back", name: "Back", value: "#0000FF" },
          ],
        },
        {
          id: "sleeves",
          name: "Sleeves",
          children: [
            { id: "left", name: "Left Sleeve", value: "#FFFFFF" },
            { id: "right", name: "Right Sleeve", value: "#000000" },
          ],
        },
        {
          id: "collar",
          name: "Collar",
          children: [
            { id: "collar-front", name: "Front Collar", value: "#FF00FF" },
            { id: "collar-back", name: "Back Collar", value: "#00FFFF" },
          ],
        },
      ],
    },
  },
  {
    value: "pattern",
    label: "Patterns",
    description: "Apply a background pattern",
    options: { patterns },
  },
  {
    value: "numbers",
    label: "Numbers",
    description: "Customize player numbers",
    options: {
      numbersConfig: {
        font: "Arial Black",
        placement: ["front", "back", "sleeve"],
        size: { min: 12, max: 32 },
        color: "#FFFFFF",
      },
    },
  },
  {
    value: "names",
    label: "Names",
    description: "Add player names",
    options: {
      namesConfig: {
        font: "Helvetica",
        placement: ["back"],
        size: { min: 12, max: 24 },
        color: "#FFFF00",
      },
    },
  },
  {
    value: "text",
    label: "Text",
    description: "Add custom text",
    options: {
      textConfig: {
        font: "Times New Roman",
        placement: ["front"],
        size: { min: 10, max: 20 },
        color: "#00FF00",
      },
    },
  },
  {
    value: "logos",
    label: "Logos",
    description: "Upload team or sponsor logos",
    options: {
      logosConfig: {
        placement: ["chest", "sleeve", "back"],
        upload: true,
      },
    },
  },
];

module.exports = { colorSwatches, patterns, toolsMenuWithOptions };
