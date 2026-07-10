const WorkoutLog = require('../models/WorkoutLog');
const User = require('../models/User');
const UserChallenge = require('../models/UserChallenge');
const Challenge = require('../models/Challenge');

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

        res.status(200).json({
            dailyCalorieTarget: user.dailyCalorieTarget,
            totalCaloriesBurnedToday,
            workouts: todaysWorkouts
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

        // Aggregate per day
        const dayMap = {};
        for (const w of workouts) {
            const d = new Date(w.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!dayMap[key]) {
                dayMap[key] = { date: key, totalCalories: 0, totalMinutes: 0, workoutCount: 0, workoutTypes: [] };
            }
            dayMap[key].totalCalories  += w.caloriesBurned;
            dayMap[key].totalMinutes   += w.durationMinutes;
            dayMap[key].workoutCount   += 1;
            if (!dayMap[key].workoutTypes.includes(w.workoutType)) {
                dayMap[key].workoutTypes.push(w.workoutType);
            }
        }

        const days = Object.values(dayMap);

        // Monthly totals
        const monthlyTotalCalories  = workouts.reduce((s, w) => s + w.caloriesBurned, 0);
        const monthlyTotalMinutes   = workouts.reduce((s, w) => s + w.durationMinutes, 0);
        const monthlyWorkoutCount   = workouts.length;
        const activeDays            = days.length;

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
            days,                    // array of { date, totalCalories, totalMinutes, workoutCount, workoutTypes }
            monthlyTotalCalories,
            monthlyTotalMinutes,
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

