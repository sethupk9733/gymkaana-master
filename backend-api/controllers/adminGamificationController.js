const Challenge = require('../models/Challenge');
const PointTransaction = require('../models/PointTransaction');
const UserChallenge = require('../models/UserChallenge');
const User = require('../models/User');

exports.createChallenge = async (req, res) => {
    try {
        const challenge = new Challenge(req.body);
        await challenge.save();
        res.status(201).json({ success: true, data: challenge });
    } catch (error) {
        console.error('Error creating challenge:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!challenge) {
            return res.status(404).json({ success: false, message: 'Challenge not found' });
        }
        res.status(200).json({ success: true, data: challenge });
    } catch (error) {
        console.error('Error updating challenge:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.endChallenge = async (req, res) => {
    try {
        // Allow both ending and re-activating depending on request body
        const updateData = req.body.isActive !== undefined
            ? { isActive: req.body.isActive }
            : { isActive: false };

        const challenge = await Challenge.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!challenge) {
            return res.status(404).json({ success: false, message: 'Challenge not found' });
        }
        res.status(200).json({ success: true, data: challenge });
    } catch (error) {
        console.error('Error updating challenge status:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        // 1. Action breakdown — count per action
        const actionBreakdown = await PointTransaction.aggregate([
            { $group: { _id: '$action', count: { $sum: 1 }, totalPoints: { $sum: '$points' } } },
            { $project: { action: '$_id', count: 1, totalPoints: 1, _id: 0 } },
            { $sort: { count: -1 } }
        ]);

        // 2. Total points awarded
        const totalsAgg = await PointTransaction.aggregate([
            { $group: { _id: null, totalPoints: { $sum: '$points' }, totalTransactions: { $sum: 1 } } }
        ]);
        const totalPoints = totalsAgg[0]?.totalPoints || 0;
        const totalTransactions = totalsAgg[0]?.totalTransactions || 0;

        // 3. Unique users with transactions
        const uniqueUsersAgg = await PointTransaction.distinct('userId');
        const uniqueUsers = uniqueUsersAgg.length;

        // 4. Top actions by total points
        const topActions = [...actionBreakdown].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 6);

        // 5. Recent activity (last 20 transactions with user info)
        const recentActivity = await PointTransaction.aggregate([
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmpty: true } },
            {
                $project: {
                    action: 1,
                    points: 1,
                    createdAt: 1,
                    userName: '$user.name'
                }
            }
        ]);

        // 6. Challenge-specific metrics (legacy)
        const challengeJoins = await UserChallenge.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                actionBreakdown,
                totalPoints,
                totalTransactions,
                uniqueUsers,
                topActions,
                recentActivity,
                challengeJoins
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find();
        res.status(200).json({ success: true, data: challenges });
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
