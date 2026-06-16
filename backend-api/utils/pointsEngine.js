const PointTransaction = require('../models/PointTransaction');
const User = require('../models/User');

const POINT_VALUES = {
    LOGIN: 10,
    VIEW_GYM: 20,
    SAVE_GYM: 30,
    BOOK_TRIAL: 100,
    PURCHASE_MEMBERSHIP: 500,
    REFERRAL_SIGNUP: 100,
    REFERRAL_TRIAL: 200,
    REFERRAL_MEMBERSHIP: 500
};

/**
 * Award points to a user for a specific action
 * @param {String} userId - The user's ID
 * @param {String} action - The action from POINT_VALUES
 * @param {String} [entityId] - Optional associated entity ID (like Gym ID)
 * @param {String} [entityModel] - Optional associated entity Model
 * @returns {Object} result containing success, pointsAwarded, and totalPoints
 */
exports.awardPoints = async (userId, action, entityId = null, entityModel = null) => {
    try {
        if (!POINT_VALUES[action]) {
            throw new Error(`Invalid gamification action: ${action}`);
        }

        const pointsToAward = POINT_VALUES[action];

        // Abuse prevention logic
        if (action === 'LOGIN') {
            // Prevent multiple login points per day
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const existingLogin = await PointTransaction.findOne({
                userId,
                action: 'LOGIN',
                createdAt: { $gte: startOfDay }
            });

            if (existingLogin) {
                return { success: false, message: 'Already awarded login points today.' };
            }
        } else if (action === 'VIEW_GYM' || action === 'SAVE_GYM') {
            // Prevent multiple view points for the same gym per day
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const existingView = await PointTransaction.findOne({
                userId,
                action,
                entityId,
                createdAt: { $gte: startOfDay }
            });

            if (existingView) {
                return { success: false, message: `Already awarded ${action} points for this gym today.` };
            }
        }

        // Create transaction
        const transaction = new PointTransaction({
            userId,
            action,
            points: pointsToAward,
            entityId,
            entityModel
        });

        await transaction.save();

        return { success: true, pointsAwarded: pointsToAward };

    } catch (error) {
        console.error('Error awarding points:', error);
        return { success: false, message: error.message };
    }
};

/**
 * Get total points for a user
 * @param {String} userId
 * @returns {Number} total points
 */
exports.getUserTotalPoints = async (userId) => {
    try {
        const result = await PointTransaction.aggregate([
            { $match: { userId: new require('mongoose').Types.ObjectId(userId) } },
            { $group: { _id: null, total: { $sum: '$points' } } }
        ]);

        return result.length > 0 ? result[0].total : 0;
    } catch (error) {
        console.error('Error calculating total points:', error);
        return 0;
    }
};
