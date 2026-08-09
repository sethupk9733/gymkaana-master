require('dotenv').config();
const mongoose = require('mongoose');

const collectionsToMigrate = [
  'reviews',    'gyms',
  'payouts',    'tickets',
  'activities', 'bookings',
  'sessions',   'users',
  'plans'
];

async function backup() {
    let localConn = null;
    let prodConn = null;

    const prodUri = process.env.PROD_MONGODB_URI;
    const localUri = 'mongodb://localhost:27017/gymkaana';

    if (!prodUri) {
        console.error('❌ Error: PROD_MONGODB_URI environment variable is not set.');
        console.error('Please run the script as: PROD_MONGODB_URI="mongodb+srv://..." node backup_production_to_local.js');
        process.exit(1);
    }

    try {
        console.log('Connecting to Production MongoDB (READ ONLY)...');
        prodConn = await mongoose.createConnection(prodUri).asPromise();
        console.log('✅ Connected to Production MongoDB.');

        console.log('Connecting to Local MongoDB...');
        localConn = await mongoose.createConnection(localUri).asPromise();
        console.log('✅ Connected to Local MongoDB.');

        for (const colName of collectionsToMigrate) {
            console.log(`\nBacking up collection: ${colName}...`);
            
            const prodCollection = prodConn.db.collection(colName);
            const localCollection = localConn.db.collection(colName);

            // Fetch all documents from Production
            // We ONLY use .find() on the production connection to ensure we never alter it.
            const docs = await prodCollection.find({}).toArray();
            console.log(`- Found ${docs.length} documents in production database.`);

            if (docs.length > 0) {
                // Clear Local collection first
                console.log(`- Clearing Local collection: ${colName}...`);
                await localCollection.deleteMany({});

                // Insert into Local
                console.log(`- Inserting ${docs.length} documents into Local database...`);
                await localCollection.insertMany(docs);
                console.log(`✅ Completed backup for ${colName}`);
            } else {
                console.log(`- Skipping backup for ${colName} (0 documents).`);
            }
        }

        console.log('\n🎉 BACKUP COMPLETED: ALL DATA SECURELY COPIED FROM PRODUCTION TO LOCAL!');

    } catch (err) {
        console.error('❌ Backup failed:', err);
    } finally {
        if (localConn) await localConn.close();
        if (prodConn) await prodConn.close();
        process.exit();
    }
}

backup();
