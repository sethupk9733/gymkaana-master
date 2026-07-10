const WorkoutLog = require('../models/WorkoutLog');
const User = require('../models/User');
const UserChallenge = require('../models/UserChallenge');
const Challenge = require('../models/Challenge');
const WaterLog = require('../models/WaterLog');

// Log a new workout
exports.logWorkout = async (req, res) => {
    try {
        const { workoutType, durationMinutes, intensity, caloriesBurned, notes } = req.body;
        const userId = req.user._id;

        const newWorkout = new WorkoutLog({
            userId,
            workoutType,
            durationMinutes,
            intensity: intensity || 'Medium',
            caloriesBurned,
            notes
        });

        await newWorkout.save();

        // Update progress for any active 'WORKOUTS' or 'CALORIES' challenges
        const activeUserChallenges = await UserChallenge.find({ userId, status: 'IN_PROGRESS' }).populate('challengeId');
        
        for (const uc of activeUserChallenges) {
            const challenge = uc.challengeId;
            if (challenge && challenge.isActive) {
                if (challenge.targetType === 'CALORIES') {
                    uc.currentProgress += Number(caloriesBurned);
                } else if (challenge.targetType === 'WORKOUTS') {
                    uc.currentProgress += 1;
                }
                
                // Check if completed
                if (uc.currentProgress >= challenge.target) {
                    uc.status = 'COMPLETED';
                    // We can add logic to award points to user here if needed
                }
                await uc.save();
            }
        }

        res.status(201).json({ message: 'Workout logged successfully', workout: newWorkout });
    } catch (error) {
        console.error('Error logging workout:', error);
        res.status(500).json({ message: 'Server error logging workout', error: error.message });
    }
};

// Helper to calculate workout streak
async function calculateWorkoutStreak(userId) {
    const workouts = await WorkoutLog.find({ userId }).sort({ date: -1 });
    if (workouts.length === 0) return 0;

    // Convert dates to unique local YYYY-MM-DD strings
    const uniqueDates = [];
    workouts.forEach(w => {
        const d = new Date(w.date);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (!uniqueDates.includes(dateStr)) {
            uniqueDates.push(dateStr);
        }
    });

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // Check if streak is active (has workout today or yesterday)
    if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
        return 0;
    }

    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const prevDate = new Date(uniqueDates[i + 1]);
        
        // Difference in time
        const diffTime = Math.abs(currentDate - prevDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

// Get today's daily passport
exports.getDailyPassport = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todaysWorkouts = await WorkoutLog.find({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ date: -1 });

        const totalCaloriesBurnedToday = todaysWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

        // Aggregate water intake
        const todaysWater = await WaterLog.find({
            userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });
        const totalWaterToday = todaysWater.reduce((sum, w) => sum + w.amount, 0);

        // Calculate active workout streak
        const workoutStreak = await calculateWorkoutStreak(userId);

        res.status(200).json({
            dailyCalorieTarget: user.dailyCalorieTarget,
            totalCaloriesBurnedToday,
            workouts: todaysWorkouts,
            totalWaterToday,
            dailyWaterTarget: user.dailyWaterTarget || 2000,
            workoutStreak
        });
    } catch (error) {
        console.error('Error fetching daily passport:', error);
        res.status(500).json({ message: 'Server error fetching daily passport', error: error.message });
    }
};

// Update daily calorie target
exports.updateTarget = async (req, res) => {
    try {
        const userId = req.user._id;
        const { target } = req.body;

        if (!target || isNaN(target)) {
            return res.status(400).json({ message: 'Valid target is required' });
        }

        const user = await User.findByIdAndUpdate(userId, { dailyCalorieTarget: Number(target) }, { new: true });
        
        res.status(200).json({ message: 'Target updated successfully', target: user.dailyCalorieTarget });
    } catch (error) {
        console.error('Error updating target:', error);
        res.status(500).json({ message: 'Server error updating target', error: error.message });
    }
};

// Get monthly stats (for heatmap + charts)
exports.getMonthlyStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        // Default: current month. Accept ?year=2026&month=7 (1-indexed)
        const now = new Date();
        const year  = parseInt(req.query.year  || now.getFullYear());
        const month = parseInt(req.query.month || (now.getMonth() + 1)); // 1-indexed

        const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endOfMonth   = new Date(year, month, 0, 23, 59, 59, 999); // last day of month

        const workouts = await WorkoutLog.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ date: 1 });

        const waterLogs = await WaterLog.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).sort({ date: 1 });

        // Aggregate per day
        const dayMap = {};
        
        // Process workouts
        for (const w of workouts) {
            const d = new Date(w.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!dayMap[key]) {
                dayMap[key] = { date: key, totalCalories: 0, totalMinutes: 0, workoutCount: 0, workoutTypes: [], totalWater: 0 };
            }
            dayMap[key].totalCalories  += w.caloriesBurned;
            dayMap[key].totalMinutes   += w.durationMinutes;
            dayMap[key].workoutCount   += 1;
            if (!dayMap[key].workoutTypes.includes(w.workoutType)) {
                dayMap[key].workoutTypes.push(w.workoutType);
            }
        }

        // Process water logs
        for (const wl of waterLogs) {
            const d = new Date(wl.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!dayMap[key]) {
                dayMap[key] = { date: key, totalCalories: 0, totalMinutes: 0, workoutCount: 0, workoutTypes: [], totalWater: 0 };
            }
            dayMap[key].totalWater += wl.amount;
        }

        const days = Object.values(dayMap);

        // Monthly totals
        const monthlyTotalCalories  = workouts.reduce((s, w) => s + w.caloriesBurned, 0);
        const monthlyTotalMinutes   = workouts.reduce((s, w) => s + w.durationMinutes, 0);
        const monthlyTotalWater     = waterLogs.reduce((s, w) => s + w.amount, 0);
        const monthlyWorkoutCount   = workouts.length;
        
        // Active days: days with at least one workout or water log
        const activeDays = days.length;

        // Best day
        const bestDay = days.reduce((best, d) => (!best || d.totalCalories > best.totalCalories) ? d : best, null);

        // Favourite workout type this month
        const typeCount = {};
        for (const w of workouts) {
            typeCount[w.workoutType] = (typeCount[w.workoutType] || 0) + 1;
        }
        const favouriteType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        res.status(200).json({
            year,
            month,
            dailyCalorieTarget: user.dailyCalorieTarget,
            dailyWaterTarget: user.dailyWaterTarget || 2000,
            days,                    // array of { date, totalCalories, totalMinutes, workoutCount, workoutTypes, totalWater }
            monthlyTotalCalories,
            monthlyTotalMinutes,
            monthlyTotalWater,
            monthlyWorkoutCount,
            activeDays,
            bestDay,
            favouriteType,
        });
    } catch (error) {
        console.error('Error fetching monthly stats:', error);
        res.status(500).json({ message: 'Server error fetching monthly stats', error: error.message });
    }
};

// Log water intake
exports.logWater = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user._id;

        if (amount === undefined || isNaN(amount)) {
            return res.status(400).json({ message: 'Valid amount is required' });
        }

        const newLog = new WaterLog({
            userId,
            amount: Number(amount)
        });
        await newLog.save();

        // Update progress for active 'WATER' challenges
        const activeUserChallenges = await UserChallenge.find({ userId, status: 'IN_PROGRESS' }).populate('challengeId');
        for (const uc of activeUserChallenges) {
            const challenge = uc.challengeId;
            if (challenge && challenge.isActive && challenge.targetType === 'WATER') {
                uc.currentProgress += Number(amount);
                if (uc.currentProgress >= challenge.target) {
                    uc.status = 'COMPLETED';
                }
                await uc.save();
            }
        }

        res.status(201).json({ message: 'Water intake logged successfully', log: newLog });
    } catch (error) {
        console.error('Error logging water:', error);
        res.status(500).json({ message: 'Server error logging water', error: error.message });
    }
};

// Update daily water target
exports.updateWaterTarget = async (req, res) => {
    try {
        const userId = req.user._id;
        const { target } = req.body;

        if (!target || isNaN(target)) {
            return res.status(400).json({ message: 'Valid target is required' });
        }

        const user = await User.findByIdAndUpdate(userId, { dailyWaterTarget: Number(target) }, { new: true });
        
        res.status(200).json({ message: 'Water target updated successfully', target: user.dailyWaterTarget });
    } catch (error) {
        console.error('Error updating water target:', error);
        res.status(500).json({ message: 'Server error updating water target', error: error.message });
    }
};

