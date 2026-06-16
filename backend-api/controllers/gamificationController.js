const PointTransaction = require('../models/PointTransaction');
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const User = require('../models/User');
const pointsEngine = require('../utils/pointsEngine');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Get total points
        const totalPoints = await pointsEngine.getUserTotalPoints(userId);

        // 2. Get activity history
        const activityHistory = await PointTransaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('entityId', 'name title'); // Populate gym name if applicable

        // 3. Get joined challenges
        const joinedChallenges = await UserChallenge.find({ userId })
            .populate('challengeId');

        // 4. Calculate User Rank (simple calculation for now)
        // In a real scenario, this might be cached or calculated via a materialized view
        const allUsersPoints = await PointTransaction.aggregate([
            { $group: { _id: '$userId', total: { $sum: '$points' } } },
            { $sort: { total: -1 } }
        ]);

        const rankIndex = allUsersPoints.findIndex(u => u._id.toString() === userId);
        const currentRank = rankIndex !== -1 ? rankIndex + 1 : 'Unranked';

        // 5. Get Badges/Rewards Earned
        // For now, derive badges based on total points or completed challenges
        const rewardsEarned = [];
        if (totalPoints >= 100) rewardsEarned.push({ name: 'Explorer', icon: '🚀' });
        if (totalPoints >= 500) rewardsEarned.push({ name: 'Challenger', icon: '🏆' });
        
        joinedChallenges.forEach(uc => {
            uc.completedMilestones.forEach(m => {
                rewardsEarned.push({ name: `Milestone Achieved`, icon: '🌟' });
            });
        });

        res.status(200).json({
            success: true,
            data: {
                totalPoints,
                currentRank,
                joinedChallenges,
                rewardsEarned,
                activityHistory
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.joinChallenge = async (req, res) => {
    try {
        const userId = req.user.id;
        const { challengeId } = req.body;

        const challenge = await Challenge.findById(challengeId);
        if (!challenge || !challenge.isActive) {
            return res.status(404).json({ success: false, message: 'Active challenge not found' });
        }

        const existingJoin = await UserChallenge.findOne({ userId, challengeId });
        if (existingJoin) {
            return res.status(400).json({ success: false, message: 'Already joined this challenge' });
        }

        const userChallenge = new UserChallenge({
            userId,
            challengeId
        });

        await userChallenge.save();

        res.status(201).json({ success: true, data: userChallenge });
    } catch (error) {
        console.error('Error joining challenge:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        // Users Leaderboard
        const usersLeaderboard = await PointTransaction.aggregate([
            { $group: { _id: '$userId', totalPoints: { $sum: '$points' } } },
            { $sort: { totalPoints: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    userId: '$_id',
                    name: '$user.name',
                    profileImage: '$user.profileImage',
                    totalPoints: 1
                }
            }
        ]);

        // Gyms Leaderboard (mocked for now, based on hypothetical gym points if we tracked them, 
        // or based on most viewed/booked gyms)
        const gymsLeaderboard = await PointTransaction.aggregate([
            { $match: { entityModel: 'Gym', entityId: { $ne: null } } },
            { $group: { _id: '$entityId', popularityScore: { $sum: 1 } } },
            { $sort: { popularityScore: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'gyms',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'gym'
                }
            },
            { $unwind: '$gym' },
            {
                $project: {
                    gymId: '$_id',
                    name: '$gym.name',
                    logo: '$gym.logo',
                    popularityScore: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                users: usersLeaderboard,
                gyms: gymsLeaderboard
            }
        });

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getActiveChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({ isActive: true });
        res.status(200).json({ success: true, data: challenges });
    } catch (error) {
        console.error('Error fetching challenges:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
