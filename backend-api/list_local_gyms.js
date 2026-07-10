require('dotenv').config();
const mongoose = require('mongoose');
const Gym = require('./models/Gym');
const User = require('./models/User');

async function listLocalGymsAndOwners() {
    try {
        console.log('Connecting to LOCAL MongoDB...');
        const localConn = await mongoose.createConnection('mongodb://localhost:27017/gymkaana').asPromise();
        console.log('Connected!\n');

        const gyms = await localConn.db.collection('gyms').find({}).toArray();
        const users = await localConn.db.collection('users').find({}).toArray();

        console.log(`Found ${gyms.length} gyms:\n`);

        for (const gym of gyms) {
            console.log(`----------------------------------------`);
            console.log(`Gym Name:    ${gym.name}`);
            console.log(`Gym ID:      ${gym._id}`);
            console.log(`Status:      ${gym.status}`);
            console.log(`Day Pass:    ${gym.baseDayPassPrice}`);
            console.log(`Address:     ${gym.address}`);

            if (gym.ownerId) {
                const owner = users.find(u => u._id.toString() === gym.ownerId.toString());
                if (owner) {
                    console.log(`Owner Name:  ${owner.name}`);
                    console.log(`Owner ID:    ${owner._id}`);
                    console.log(`Owner Email: ${owner.email}`);
                    console.log(`Owner Roles: ${owner.roles}`);
                } else {
                    console.log(`Owner ID:    ${gym.ownerId} (user not found in local DB)`);
                }
            } else {
                console.log(`Owner:       (no ownerId set)`);
            }
        }
        console.log(`----------------------------------------`);
        console.log('\nAll Users in Local DB:');
        users.forEach(u => {
            console.log(`  - ${u.email} | ID: ${u._id} | Roles: ${u.roles}`);
        });

        await localConn.close();
    } catch (err) {
        console.error('Error:', err);
    }
}

listLocalGymsAndOwners();
