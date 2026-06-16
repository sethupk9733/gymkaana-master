const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    status: {
        type: String,
        enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
        default: 'IN_PROGRESS'
    },
    currentProgress: {
        type: Number,
        default: 0
    },
    completedMilestones: [{
        milestoneId: mongoose.Schema.Types.ObjectId,
        achievedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

userChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

module.exports = mongoose.model('UserChallenge', userChallengeSchema);
