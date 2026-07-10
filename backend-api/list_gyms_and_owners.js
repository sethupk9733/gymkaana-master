require('dotenv').config();
const mongoose = require('mongoose');
const Gym = require('./models/Gym');
const User = require('./models/User');

async function listGymsAndOwners() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const gyms = await Gym.find({});
        console.log(`\nFound ${gyms.length} gyms in the database:\n`);

        for (const gym of gyms) {
            console.log(`----------------------------------------`);
            console.log(`Gym Name:  ${gym.name}`);
            console.log(`Gym ID:    ${gym._id}`);
            console.log(`Base Price: ${gym.baseDayPassPrice}`);
            
            if (gym.ownerId) {
                const owner = await User.findById(gym.ownerId);
                if (owner) {
                    console.log(`Owner Name:  ${owner.name}`);
                    console.log(`Owner ID:    ${owner._id}`);
                    console.log(`Owner Email: ${owner.email}`);
                } else {
                    console.log(`Owner ID:    ${gym.ownerId} (User document not found)`);
                }
            } else {
                console.log(`Owner:      No ownerId linked to this gym`);
            }
        }
        console.log(`----------------------------------------`);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error querying gyms:', err);
    }
}

listGymsAndOwners();
