require('dotenv').config();
const mongoose = require('mongoose');

const collectionsToMigrate = [
  'reviews',    'gyms',
  'payouts',    'tickets',
  'activities', 'bookings',
  'sessions',   'users',
  'plans'
];

async function migrate() {
    let localConn = null;
    let atlasConn = null;

    try {
        console.log('Connecting to local MongoDB...');
        localConn = await mongoose.createConnection('mongodb://localhost:27017/gymkaana').asPromise();
        console.log('✅ Connected to local MongoDB.');

        console.log('Connecting to Atlas MongoDB...');
        atlasConn = await mongoose.createConnection(process.env.MONGODB_URI).asPromise();
        console.log('✅ Connected to Atlas MongoDB.');

        for (const colName of collectionsToMigrate) {
            console.log(`\nMigrating collection: ${colName}...`);
            
            const localCollection = localConn.db.collection(colName);
            const atlasCollection = atlasConn.db.collection(colName);

            // Fetch all documents from local
            const docs = await localCollection.find({}).toArray();
            console.log(`- Found ${docs.length} documents in local database.`);

            if (docs.length > 0) {
                // Clear Atlas collection first
                console.log(`- Clearing Atlas collection: ${colName}...`);
                await atlasCollection.deleteMany({});

                // Insert into Atlas
                console.log(`- Inserting ${docs.length} documents into Atlas...`);
                await atlasCollection.insertMany(docs);
                console.log(`✅ Completed migration for ${colName}`);
            } else {
                console.log(`- Skipping migration for ${colName} (0 documents).`);
            }
        }

        console.log('\n🎉 ALL COLLECTIONS MIGRATED SUCCESSFULY FROM LOCAL TO ATLAS!');

    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        if (localConn) await localConn.close();
        if (atlasConn) await atlasConn.close();
        process.exit();
    }
}

migrate();
