const mongoose = require('mongoose');

const workoutLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    workoutType: {
        type: String,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    intensity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    caloriesBurned: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
