require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Gym = require('./models/Gym');

const gymOwners = [
    {
        gymName: 'Enormous CrossFit Fitness Studio',
        owner: {
            name: 'Enormous CrossFit Owner',
            email: 'enormous@gymkaana.com',
            password: 'owner123',
            roles: ['owner'],
            isVerified: true
        }
    },
    {
        gymName: 'V Fitness',
        owner: {
            name: 'V Fitness Owner',
            email: 'vfitness@gymkaana.com',
            password: 'owner123',
            roles: ['owner'],
            isVerified: true
        }
    },
    {
        gymName: 'NXT Gen Fitness',
        owner: {
            name: 'NXT Gen Owner',
            email: 'nxtgen@gymkaana.com',
            password: 'owner123',
            roles: ['owner'],
            isVerified: true
        }
    },
    {
        gymName: 'BiFit Unisex Fitness Gym',
        owner: {
            name: 'BiFit Owner',
            email: 'bifit@gymkaana.com',
            password: 'owner123',
            roles: ['owner'],
            isVerified: true
        }
    },
    {
        gymName: 'The Muscle Factory Gym',
        owner: {
            name: 'Muscle Factory Owner',
            email: 'musclefactory@gymkaana.com',
            password: 'owner123',
            roles: ['owner'],
            isVerified: true
        }
    },
    {
        gymName: 'Hexagon Fitness Studio',
        owner: {
            name: 'Hexagon Fitness Owner',
            email: 'hexagon@gymkaana.com',
            password: 'owner123',
            roles: ['owner'],
            isVerified: true
        }
    },
    {
        gymName: 'Mighty Fitness Club',
        owner: {
            name: 'Mighty Fitness Owner',
            email: 'mighty@gymkaana.com',
            password: 'owner123',
            roles: ['owner'],
            isVerified: true
        }
    },
    {
        gymName: 'Authentic Fitness Studio',
        owner: {
            name: 'Authentic Fitness Owner',
            email: 'authentic@gymkaana.com',
            password: 'owner123',
            roles: ['owner'],
            isVerified: true
        }
    }
];

async function createGymOwners() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!\n');

        console.log('╔══════════════════════════════════════════════════════╗');
        console.log('║           GYM OWNER LOGIN CREDENTIALS                ║');
        console.log('╚══════════════════════════════════════════════════════╝\n');

        for (const entry of gymOwners) {
            // Find the gym
            const gym = await Gym.findOne({ name: entry.gymName });
            if (!gym) {
                console.log(`⚠️  Gym not found: ${entry.gymName}`);
                continue;
            }

            // Create or update owner
            let owner = await User.findOne({ email: entry.owner.email });
            if (!owner) {
                owner = await User.create(entry.owner);
                console.log(`✅ Created owner for: ${entry.gymName}`);
            } else {
                owner.password = entry.owner.password;
                owner.isVerified = true;
                await owner.save();
                console.log(`♻️  Updated owner for: ${entry.gymName}`);
            }

            // Link owner to gym
            gym.ownerId = owner._id;
            await gym.save();

            console.log(`   Gym:      ${entry.gymName}`);
            console.log(`   Email:    ${entry.owner.email}`);
            console.log(`   Password: ${entry.owner.password}`);
            console.log('');
        }

        console.log('╔══════════════════════════════════════════════════════╗');
        console.log('║  All gym owner accounts created! Password = owner123  ║');
        console.log('╚══════════════════════════════════════════════════════╝');

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

createGymOwners();
