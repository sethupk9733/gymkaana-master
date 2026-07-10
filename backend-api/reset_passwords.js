require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetPasswords() {
    try {
        console.log('Connecting to Atlas database...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const accounts = [
            { email: 'sethu@gymkaana.com', password: 'admin123' },
            { email: 'admin@gymkaana.com', password: 'admin123' },
            { email: 'master@gymkaana.com', password: 'admin123' }
        ];

        for (const account of accounts) {
            const user = await User.findOne({ email: account.email });
            if (user) {
                user.password = account.password;
                await user.save();
                console.log(`✅ Reset password for ${account.email} to: ${account.password}`);
            } else {
                console.log(`❌ User ${account.email} not found in database.`);
            }
        }

        await mongoose.disconnect();
        console.log('Done!');
    } catch (err) {
        console.error('Error resetting passwords:', err);
    }
}

resetPasswords();
