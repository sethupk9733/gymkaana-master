const mongoose = require('mongoose');
const Gym = require('./models/Gym');
require('dotenv').config();

// Diverse fitness placeholder images
const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", // CrossFit
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800", // Yoga
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800", // Weightlifting
    "https://images.unsplash.com/photo-1532618917136-d6df44dd3f7a?auto=format&fit=crop&q=80&w=800", // Cardio
    "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&q=80&w=800", // Gym Equipment
    "https://images.unsplash.com/photo-1577221084712-56ceb4ee3379?auto=format&fit=crop&q=80&w=800", // Training
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80&w=800", // Strength
    "https://images.unsplash.com/photo-1552821206-1eb8a1be1ac6?auto=format&fit=crop&q=80&w=800", // Fitness
];

// Generate a consistent placeholder based on gym name
function getPlaceholderImageForGym(gymName) {
    let hash = 0;
    for (let i = 0; i < gymName.length; i++) {
        const char = gymName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % PLACEHOLDER_IMAGES.length;
    return PLACEHOLDER_IMAGES[index];
}

const addPlaceholderImages = async () => {
    try {
        console.log('Connecting to MongoDB:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...\n');

        // Find all gyms with no images or empty images array
        const gymsWithoutImages = await Gym.find({
            $or: [
                { images: { $exists: false } },
                { images: { $size: 0 } }
            ]
        });

        console.log(`Found ${gymsWithoutImages.length} gyms without images\n`);

        let updated = 0;
        for (const gym of gymsWithoutImages) {
            const placeholderImage = getPlaceholderImageForGym(gym.name);
            gym.images = [placeholderImage];
            await gym.save();
            updated++;
            console.log(`✓ Updated: ${gym.name} - ${placeholderImage}`);
        }

        console.log(`\n✅ Successfully updated ${updated} gyms with placeholder images`);
        process.exit(0);
    } catch (err) {
        console.error('❌ ERROR:', err.message);
        if (err.errors) console.error(err.errors);
        process.exit(1);
    }
};

addPlaceholderImages();
