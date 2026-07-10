require('dotenv').config();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const ownerIdToFind = '69e1d92c3fdc4cc5f3996e21';
const gymIdToFind = '69e1deda3fdc4cc5f3997693';

async function findByIds() {
    // Check both local and Atlas
    const connections = [
        { label: 'LOCAL', uri: 'mongodb://localhost:27017/gymkaana' },
        { label: 'ATLAS', uri: process.env.MONGODB_URI }
    ];

    for (const conn of connections) {
        console.log(`\n=== Checking ${conn.label} DB ===`);
        let dbConn;
        try {
            dbConn = await mongoose.createConnection(conn.uri).asPromise();

            // Look up the owner by ID
            const user = await dbConn.db.collection('users').findOne({
                _id: new ObjectId(ownerIdToFind)
            });
            if (user) {
                console.log(`✅ FOUND Owner in ${conn.label}:`);
                console.log(`   Name:  ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Roles: ${user.roles}`);
            } else {
                console.log(`❌ Owner ID ${ownerIdToFind} NOT found in ${conn.label}`);
            }

            // Look up the gym by ID
            const gym = await dbConn.db.collection('gyms').findOne({
                _id: new ObjectId(gymIdToFind)
            });
            if (gym) {
                console.log(`✅ FOUND Gym in ${conn.label}:`);
                console.log(`   Name:    ${gym.name}`);
                console.log(`   Address: ${gym.address}`);
                console.log(`   Status:  ${gym.status}`);
            } else {
                console.log(`❌ Gym ID ${gymIdToFind} NOT found in ${conn.label}`);
            }

        } catch (err) {
            console.error(`Error connecting to ${conn.label}:`, err.message);
        } finally {
            if (dbConn) await dbConn.close();
        }
    }
}

findByIds();
