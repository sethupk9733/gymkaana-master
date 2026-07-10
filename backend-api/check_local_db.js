const mongoose = require('mongoose');

async function checkLocalDB() {
    try {
        console.log('Connecting to local MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/gymkaana');
        console.log('Connected!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in local DB:', collections.map(c => c.name));

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`- Collection ${col.name}: ${count} documents`);
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error connecting to local DB:', err.message);
    }
}

checkLocalDB();
