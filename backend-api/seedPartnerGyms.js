require('dotenv').config();
const mongoose = require('mongoose');
const Gym = require('./models/Gym');

const partnerGyms = [
    {
        name: 'Enormous CrossFit Fitness Studio',
        description: 'Premium CrossFit facility with top-tier equipment and trainers.',
        baseDayPassPrice: 500,
        status: 'Approved',
        location: { address: 'CrossFit Ave, Gymkaana' },
        isPartner: true
    },
    {
        name: 'V Fitness',
        description: 'State of the art fitness center for bodybuilding and weight loss.',
        baseDayPassPrice: 300,
        status: 'Approved',
        location: { address: 'V Fitness St, Gymkaana' },
        isPartner: true
    },
    {
        name: 'NXT Gen Fitness',
        description: 'Next generation fitness club for cardio, strength, and group classes.',
        baseDayPassPrice: 400,
        status: 'Approved',
        location: { address: 'NXT Blvd, Gymkaana' },
        isPartner: true
    },
    {
        name: 'BiFit Unisex Fitness Gym',
        description: 'Welcoming unisex gym focusing on holistic fitness.',
        baseDayPassPrice: 200,
        status: 'Approved',
        location: { address: 'BiFit Road, Gymkaana' },
        isPartner: true
    },
    {
        name: 'The Muscle Factory Gym',
        description: 'Hardcore bodybuilding gym with heavy free weights.',
        baseDayPassPrice: 250,
        status: 'Approved',
        location: { address: 'Muscle Factory Lane, Gymkaana' },
        isPartner: true
    },
    {
        name: 'Hexagon Fitness Studio',
        description: 'Functional training and hexagon cage workouts.',
        baseDayPassPrice: 350,
        status: 'Approved',
        location: { address: 'Hexagon St, Gymkaana' },
        isPartner: true
    },
    {
        name: 'Mighty Fitness Club',
        description: 'Premium club for mighty gains and wellness.',
        baseDayPassPrice: 600,
        status: 'Approved',
        location: { address: 'Mighty Rd, Gymkaana' },
        isPartner: true
    },
    {
        name: 'Authentic Fitness Studio',
        description: 'Authentic training methods and dedicated personal trainers.',
        baseDayPassPrice: 450,
        status: 'Approved',
        location: { address: 'Authentic Ave, Gymkaana' },
        isPartner: true
    }
];

const seedGyms = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');

        for (const gymData of partnerGyms) {
            const existing = await Gym.findOne({ name: gymData.name });
            if (!existing) {
                // Ensure a valid ownerId is assigned if needed, or leave blank if schema allows.
                // Assuming we use the Master Admin as owner for these seeded gyms.
                const User = require('./models/User');
                const admin = await User.findOne({ email: 'master@gymkaana.com' });
                
                if (admin) {
                    gymData.ownerId = admin._id;
                }

                await Gym.create(gymData);
                console.log(`✅ Seeded Gym: ${gymData.name}`);
            } else {
                console.log(`ℹ️ Gym already exists: ${gymData.name}`);
            }
        }

        console.log('Seeding completed.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedGyms();
