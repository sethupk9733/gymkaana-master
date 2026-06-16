const mongoose = require('mongoose');

const pointTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'LOGIN', 'VIEW_GYM', 'SAVE_GYM', 'BOOK_TRIAL',
            'PURCHASE_MEMBERSHIP', 'REFERRAL_SIGNUP', 'REFERRAL_TRIAL',
            'REFERRAL_MEMBERSHIP', 'COMPLETE_CHALLENGE', 'REACH_MILESTONE', 'GYM_VISIT'
        ]
    },
    points: {
        type: Number,
        required: true
    },
    entityId: {
        // Optional reference ID, e.g., the Gym ID they viewed or the Booking ID
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'entityModel'
    },
    entityModel: {
        type: String,
        enum: ['Gym', 'Booking', 'Payment', 'User']
    }
}, { timestamps: true });

// Index for efficient querying of points per user and preventing duplicate abuses
pointTransactionSchema.index({ userId: 1, action: 1, createdAt: -1 });
pointTransactionSchema.index({ userId: 1, action: 1, entityId: 1 });

module.exports = mongoose.model('PointTransaction', pointTransactionSchema);
