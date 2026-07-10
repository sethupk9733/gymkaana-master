const mongoose = require('mongoose');
const User = require('./models/User');
const WorkoutLog = require('./models/WorkoutLog');
require('dotenv').config();

const WORKOUT_TYPES = [
    { type: "Running", baseCals: 10 },
    { type: "Cycling", baseCals: 8 },
    { type: "Weight Training", baseCals: 6 },
    { type: "Swimming", baseCals: 9 },
    { type: "Yoga", baseCals: 4 },
    { type: "HIIT", baseCals: 12 },
    { type: "CrossFit", baseCals: 13 },
];

const INTENSITIES = ['Low', 'Medium', 'High'];

const seedDummyWorkouts = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        
        // Find any user (preferably the first one)
        let user = await User.findOne({ email: 'user@gymkaana.com' });
        if (!user) {
            user = await User.findOne({ role: 'user' });
        }
        if (!user) {
            console.error('No users found in the database. Please register an account first.');
            process.exit(1);
        }

        // Clear existing workouts for this user to avoid duplicates
        await WorkoutLog.deleteMany({ userId: user._id });
        console.log('Cleared existing workouts for test user.');

        const workouts = [];
        const today = new Date();
        today.setHours(12, 0, 0, 0);

        // Generate data for the last 30 days
        for (let i = 0; i < 30; i++) {
            // Randomly skip some days (e.g. 20% chance to take a rest day)
            if (Math.random() < 0.2) continue;

            const date = new Date(today);
            date.setDate(today.getDate() - i);

            // 1 to 2 workouts per active day
            const workoutsPerDay = Math.random() < 0.3 ? 2 : 1;

            for (let j = 0; j < workoutsPerDay; j++) {
                const wt = WORKOUT_TYPES[Math.floor(Math.random() * WORKOUT_TYPES.length)];
                const duration = [15, 30, 45, 60, 90][Math.floor(Math.random() * 5)];
                const intensity = INTENSITIES[Math.floor(Math.random() * INTENSITIES.length)];
                
                let multiplier = 1.0;
                if (intensity === 'Low') multiplier = 0.8;
                if (intensity === 'High') multiplier = 1.3;

                const caloriesBurned = Math.round(wt.baseCals * duration * multiplier);

                workouts.push({
                    userId: user._id,
                    workoutType: wt.type,
                    durationMinutes: duration,
                    intensity: intensity,
                    caloriesBurned: caloriesBurned,
                    notes: `Dummy generated log for ${wt.type}`,
                    date: new Date(date.getTime() + j * 4 * 60 * 60 * 1000) // add 4 hours between workouts if multiple
                });
            }
        }

        await WorkoutLog.insertMany(workouts);
        console.log(`Successfully generated ${workouts.length} dummy workout logs for user@gymkaana.com over the last 30 days.`);

        process.exit();
    } catch (err) {
        console.error('Error generating dummy workouts:', err);
        process.exit(1);
    }
};

seedDummyWorkouts();
