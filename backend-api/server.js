const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { cleanupExpiredPayments } = require('./utils/cleanupExpiredPayments');


console.log('=========================================');
console.log('🚀 GYMKAANA BACKEND STARTING UP... (V2)');
console.log('=========================================');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(cors({
    origin: [
        'https://gymkaana.com',
        'https://www.gymkaana.com',
        'https://owner.gymkaana.com',
        'https://admin.gymkaana.com',
        'https://app.gymkaana.com',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://localhost:3001'
    ],
    credentials: true
}));

// ── Payment Infrastructure ──────────────────────────────────────────────────
// Webhook needs raw body for HMAC verification; others need standard JSON.
app.use('/api/payments', (req, res, next) => {
    if (req.originalUrl === '/api/payments/webhook' && req.method === 'POST') {
        return express.raw({ type: 'application/json' })(req, res, next);
    }
    next();
});
// (Router registration moved below express.json() to allow body parsing)

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Disable buffering to catch connection errors immediately
mongoose.set('bufferCommands', false);


// Basic Route
app.get('/', (req, res) => {
    res.send('Gymkaana API is running...');
});

// Debug endpoint to check gym data
app.get('/api/debug/gyms', async (req, res) => {
    try {
        const Gym = require('./models/Gym');
        const Booking = require('./models/Booking');
        
        const gyms = await Gym.find({}).select('_id name');
        console.log('🔍 All Gyms:', gyms);
        
        const gymData = [];
        for (const gym of gyms) {
            const bookings = await Booking.find({ gymId: gym._id });
            const revenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
            gymData.push({
                _id: gym._id,
                name: gym.name,
                bookingCount: bookings.length,
                totalRevenue: revenue,
                bookings: bookings.map(b => ({ status: b.status, amount: b.amount }))
            });
        }
        
        console.log('📊 Gym Data:', gymData);
        res.json(gymData);
    } catch (err) {
        console.error('Debug error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Direct Booking Creation Endpoint - MUST BE BEFORE router.post('/create-order', createOrder);
app.post('/api/bookings/create-direct', async (req, res) => {
    try {
        console.log('\n🎯 DIRECT BOOKING ENDPOINT HIT!');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const Booking = require('./models/Booking');
        console.log('✓ Booking model loaded');
        
        // Validate required fields
        const { gymId, planId, userId, memberName, memberEmail, amount, startDate, endDate, status } = req.body;
        
        console.log('✓ Extracted fields:', { gymId, planId, userId, memberName, memberEmail, amount });
        
        if (!gymId || !planId || !userId || !memberName || !memberEmail || !amount || !startDate || !endDate) {
            console.error('❌ Missing required fields');
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: { gymId, planId, userId, memberName, memberEmail, amount, startDate, endDate }
            });
        }
        
        // Generate transaction ID BEFORE creating document
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const transactionId = `GYM-${dateStr}-${randomStr}`;
        console.log('✓ Transaction ID generated:', transactionId);
        
        console.log('Creating booking document with transaction ID...');
        // Create booking - include transactionId to avoid pre-save hook issues
        const booking = new Booking({
            transactionId,  // Set directly to avoid pre-save hook
            gymId,
            planId,
            userId,
            memberName,
            memberEmail,
            amount,
            startDate,
            endDate,
            status: status || 'upcoming'
        });
        
        console.log('Document created, attempting to save...');
        const savedBooking = await booking.save().catch(err => {
            console.error('Save error caught:', err.message);
            throw err;
        });
        console.log('✅ Booking saved:', savedBooking._id);
        
        // Populate references
        console.log('Populating references...');
        const populated = await Booking.findById(savedBooking._id)
            .populate({
                path: 'gymId',
                populate: { path: 'ownerId' }
            })
            .populate('planId')
            .populate('userId');
        
        console.log('📧 Email triggers skipped (waiting for payment confirmation)');
        console.log('✅ Booking populated, sending response');
        
        res.status(201).json(populated);
    } catch (error) {
        console.error('❌ Direct Booking Error:', error.message);
        console.error('Error type:', error.constructor.name);
        console.error('Stack:', error.stack);
        res.status(500).json({ 
            message: error.message,
            error: error.toString(),
            type: error.constructor.name,
            stack: error.stack
        });
    }
});

// Routes
app.use('/api/gyms', require('./routes/gymRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/payouts', require('./routes/payoutRoutes'));
app.use('/api/accounting', require('./routes/accountingRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// 404 JSON Handler (Prevents "Unexpected token <" HTML errors)
app.use((req, res) => {
    console.warn(`⚠️ 404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        message: `Route ${req.originalUrl} not found on this server.`,
        error: 'Not Found'
    });
});

// Database Seeding Logic
const seedDatabase = async () => {
    try {
        const User = require('./models/User');
        const Gym = require('./models/Gym');
        const bcrypt = require('bcryptjs');

        // 1. Ensure Master Admin exists
        const masterEmail = 'master@gymkaana.com';
        const masterExists = await User.findOne({ email: masterEmail });
        
        if (!masterExists) {
            console.log('🌱 Seeding Master Admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('master@123', salt);
            await User.create({
                name: 'Master Admin',
                email: masterEmail,
                password: hashedPassword,
                roles: ['admin'],
                isVerified: true
            });
            console.log('✅ Master Admin Created: master@gymkaana.com / master@123');
        }

        // 2. Ensure all existing gyms are visible (temporary help)
        const unpublishedCount = await Gym.countDocuments({ isPublished: false });
        if (unpublishedCount > 0) {
            console.log(`🌱 Publishing ${unpublishedCount} hidden gyms...`);
            await Gym.updateMany({}, { isPublished: true, status: 'Approved' });
            console.log('✅ All gyms are now live.');
        }

    } catch (err) {
        console.error('❌ Seeding Error:', err.message);
    }
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10
        });
        console.log('✅ MongoDB Connected Successfully');
        
        // Seed database after connection
        await seedDatabase();
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on port ${PORT}`);
            
            // ── Cleanup Interval ──────────────────────────────────────────
            // Run every 15 mins to clear out stale "PENDING" Cashfree orders
            setInterval(cleanupExpiredPayments, 15 * 60 * 1000);
            console.log('⏰ Payment cleanup worker started (15m interval)');
        });
    } catch (err) {
        console.error('❌ MongoDB Connection Failed:', err.message);
        // Retry logic or graceful fallback
        setTimeout(connectDB, 5000);
    }
};

connectDB();

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
