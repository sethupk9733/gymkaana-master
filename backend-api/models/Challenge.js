const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    target: { type: Number, required: true },
    rewardPoints: { type: Number, default: 0 },
    description: { type: String }
}, { _id: false });

const challengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        required: true,
        enum: ['GYM_EXPLORER', '7_DAY_PASSPORT', 'BRING_A_FRIEND', 'MONTHLY_WARRIOR', 'STREAK_MASTER', 'CUSTOM'],
        default: 'CUSTOM'
    },
    // How many actions/points needed to complete this challenge
    target: {
        type: Number,
        default: 100
    },
    // Points awarded on completion
    rewardPoints: {
        type: Number,
        default: 0
    },
    // Optional badge / achievement text
    rewardBadge: {
        type: String
    },
    milestones: [milestoneSchema],
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);
