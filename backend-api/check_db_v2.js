require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Gym = require('./models/Gym');

async function checkBookings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const gymId = '697094c2cbb8950d0c74b52f';
        const bookings = await Booking.find({ gymId: mongoose.Types.ObjectId(gymId) });

        console.log(`GYM_ID: ${gymId}`);
        console.log(`TOTAL_BOOKINGS: ${bookings.length}`);

        const statusCount = {};
        bookings.forEach(b => {
            statusCount[b.status] = (statusCount[b.status] || 0) + 1;
        });
        console.log(`STATUS_COUNT: ${JSON.stringify(statusCount)}`);

        const totalAmt = bookings.reduce((sum, b) => sum + b.amount, 0);
        console.log(`TOTAL_AMOUNT (ALL): ${totalAmt}`);

        const activeAmt = bookings.filter(b => ['active', 'completed'].includes(b.status)).reduce((sum, b) => sum + b.amount, 0);
        console.log(`ACTIVE_COMPLETED_AMOUNT: ${activeAmt}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkBookings();
