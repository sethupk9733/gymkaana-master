require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function showAdmins() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const admins = await User.find({ roles: 'admin' });
        console.log('Admins found in Atlas DB:');
        admins.forEach(a => {
            console.log(`- Email: ${a.email}, Name: ${a.name}, Roles: ${a.roles}`);
        });
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

showAdmins();
