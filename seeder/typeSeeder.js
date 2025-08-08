const MenuConfiguration = require('../model/configuration/menuConfiguration');
const TypeConfiguration = require('../model/configuration/typeConfiguration');

const seedTypeConfiguration = async () => {
    try {
        // First, create the Type menu configuration
        const typeMenu = new MenuConfiguration({
            id: "type",
            name: "Type",
            icon: "shirt-triangle-square",
            type: "navigation",
            isSelected: true,
            sortOrder: 1,
            contentModel: "TypeConfiguration",
            hasTabs: false,
            tabs: []
        });

        await typeMenu.save();
        console.log('Type menu configuration created');

        // Then, create the Type configuration content
        const typeConfig = new TypeConfiguration({
            menuId: "type",
            title: "Select your jersey type",
            description: "Choose from our premium jersey types",
            productTypes: [
                {
                    id: "pro",
                    name: "Pro",
                    image: "/images/jerseys/pro-jersey.jpg",
                    description: "Professional grade jersey",
                    features: ["Embroidered", "High performance", "220GSM"],
                    price: 99,
                    priceNote: "From",
                    tag: "Best Value",
                    isPremium: true,
                    sortOrder: 1
                },
                {
                    id: "elite",
                    name: "Elite",
                    image: "/images/jerseys/elite-jersey.jpg",
                    description: "Elite performance jersey",
                    features: ["Sublimated", "High performance", "220GSM"],
                    price: 63,
                    sortOrder: 2
                },
                {
                    id: "practice",
                    name: "Practice",
                    image: "/images/jerseys/practice-jersey.jpg",
                    description: "Practice jersey",
                    features: ["Sublimated", "High performance", "150GSM"],
                    price: 53,
                    sortOrder: 3
                },
                {
                    id: "inline-hockey",
                    name: "Inline Hockey",
                    image: "/images/jerseys/inline-hockey-jersey.jpg",
                    description: "Inline hockey jersey",
                    features: ["Sublimated", "High performance", "160GSM"],
                    price: 58,
                    sortOrder: 4
                }
            ]
        });

        await typeConfig.save();
        console.log('Type configuration created successfully');

        return { typeMenu, typeConfig };
    } catch (error) {
        console.error('Error seeding type configuration:', error);
        throw error;
    }
};

module.exports = { seedTypeConfiguration }; 