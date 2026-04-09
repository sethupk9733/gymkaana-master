const Gym = require('../models/Gym');
const PartnerDeclaration = require('../models/PartnerDeclaration');
const { logActivity } = require('./activityController');

exports.getAllGyms = async (req, res) => {
    try {
        let query = {};
        if (req.user) {
            const hasOwnerRole = req.user.roles && req.user.roles.includes('owner');
            const hasAdminRole = req.user.roles && req.user.roles.includes('admin');

            if (hasOwnerRole && !hasAdminRole) {
                // Strictly filter by ownerId for non-admins
                const mongoose = require('mongoose');
                query.ownerId = new mongoose.Types.ObjectId(req.user._id);
            } else if (hasAdminRole) {
                // Admin sees all
            } else {
                // Regular user sees only approved/active
                query.status = { $in: ['Approved', 'Active'] };
            }
        } else {
            // Public sees only approved/active
            query.status = { $in: ['Approved', 'Active'] };
        }
        console.log('Fetching gyms for user:', req.user ? { id: req.user._id, roles: req.user.roles } : 'Guest');
        const gyms = await Gym.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'gymId',
                    as: 'gymBookings'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'ownerDetails'
                }
            },
            {
                $lookup: {
                    from: 'plans',
                    localField: '_id',
                    foreignField: 'gymId',
                    as: 'gymPlans'
                }
            },
            { $unwind: { path: '$ownerDetails', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    address: 1,
                    location: 1,
                    rating: 1,
                    reviews: 1,
                    status: 1,
                    description: 1,
                    phone: 1,
                    email: 1,
                    timings: 1,
                    images: 1,
                    members: 1,
                    checkins: 1,
                    facilities: 1,
                    specializations: 1,
                    trainers: 1,
                    trainerDetails: 1,
                    houseRules: 1,
                    documentation: 1,
                    bankDetails: 1,
                    baseDayPassPrice: 1,
                    createdAt: 1,
                    ownerId: {
                        _id: '$ownerDetails._id',
                        name: '$ownerDetails.name',
                        email: '$ownerDetails.email',
                        phoneNumber: '$ownerDetails.phoneNumber',
                        roles: '$ownerDetails.roles'
                    },
                    revenues: {
                        $concat: [
                            "₹",
                            {
                                $toString: {
                                    $sum: {
                                        $map: {
                                            input: {
                                                $filter: {
                                                    input: '$gymBookings',
                                                    as: 'b',
                                                    cond: { $in: ['$$b.status', ['active', 'completed', 'upcoming']] }
                                                }
                                            },
                                            as: 'fb',
                                            in: '$$fb.amount'
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    liveFootfall: {
                        $size: {
                            $filter: {
                                input: '$gymBookings',
                                as: 'b',
                                cond: { $in: ['$$b.status', ['active', 'completed', 'upcoming']] }
                            }
                        }
                    },
                    bestDiscount: {
                        $max: {
                            $map: {
                                input: '$gymPlans',
                                as: 'plan',
                                in: { $ifNull: ['$$plan.discount', 0] }
                            }
                        }
                    },
                    maxBaseDiscount: {
                        $max: {
                            $map: {
                                input: '$gymPlans',
                                as: 'plan',
                                in: { $ifNull: ['$$plan.baseDiscount', 0] }
                            }
                        }
                    }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);

        console.log(`Found ${gyms.length} gyms for query:`, JSON.stringify(query));
        console.log('DEBUG First Gym:', gyms[0]?.name, { maxBaseDiscount: gyms[0]?.maxBaseDiscount, bestDiscount: gyms[0]?.bestDiscount });
        res.json(gyms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createGym = async (req, res) => {
    try {
        const { plans, ...gymData } = req.body;

        const gym = new Gym({
            ...gymData,
            ownerId: req.user._id
        });

        const newGym = await gym.save();

        // If plans were provided, create them
        if (plans && Array.isArray(plans)) {
            const Plan = require('../models/Plan');
            const plansToCreate = plans.map(plan => ({
                ...plan,
                gymId: newGym._id
            }));
            await Plan.insertMany(plansToCreate);
        }

        await logActivity({
            userId: req.user._id,
            gymId: newGym._id,
            action: 'Gym Registered',
            description: `New hub "${newGym.name}" awaiting clearance.`,
            type: 'warning'
        });

        res.status(201).json(newGym);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getGymById = async (req, res) => {
    try {
        const gym = await Gym.findById(req.params.id);
        if (!gym) return res.status(404).json({ message: 'Gym not found' });

        // Fetch real-time stats from bookings
        const revenueResult = await require('../models/Booking').aggregate([
            { $match: { gymId: gym._id, status: { $in: ['active', 'completed', 'upcoming'] } } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        const gymObj = gym.toObject();
        gymObj.realRevenue = revenueResult[0]?.total || 0;
        gymObj.realBookings = revenueResult[0]?.count || 0;

        res.json(gymObj);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateGym = async (req, res) => {
    try {
        const gym = await Gym.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!gym) return res.status(404).json({ message: 'Gym not found' });

        // If baseDayPassPrice changed, recalculate all plan discounts for this gym
        if (req.body.baseDayPassPrice !== undefined) {
            const Plan = require('../models/Plan');
            const plans = await Plan.find({ gymId: gym._id });
            const newBasePrice = Number(req.body.baseDayPassPrice);

            for (const plan of plans) {
                const totalDayValue = newBasePrice * (plan.sessions || 1);
                if (totalDayValue > 0) {
                    const calculatedDiscount = Math.round((1 - (plan.price / totalDayValue)) * 100);
                    plan.baseDiscount = Math.max(0, calculatedDiscount);
                    await plan.save();
                }
            }
        }

        res.json(gym);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteGym = async (req, res) => {
    try {
        const gym = await Gym.findByIdAndDelete(req.params.id);
        if (!gym) return res.status(404).json({ message: 'Gym not found' });
        res.json({ message: 'Gym deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.submitDeclaration = async (req, res) => {
    try {
        const { gymId, signatureName, declarationAccepted, declarationText } = req.body;
        
        if (!declarationAccepted) {
            return res.status(400).json({ message: 'Declaration must be accepted.' });
        }

        const declaration = new PartnerDeclaration({
            gymId,
            ownerId: req.user._id,
            ownerName: req.user.name,
            declarationAccepted,
            signatureName,
            declarationText,
            ipAddress: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            timestamp: new Date()
        });

        await declaration.save();

        // Update Gym status if needed or just log it
        await Gym.findByIdAndUpdate(gymId, { status: 'Pending' }); // Ensure it stays pending until admin approval

        await logActivity({
            userId: req.user._id,
            gymId: gymId,
            action: 'Declaration Signed',
            description: `Legal declaration signed by ${signatureName}.`,
            type: 'success'
        });

        res.status(201).json({ message: 'Declaration submitted successfully', declaration });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getDeclarationByGymId = async (req, res) => {
    try {
        const declaration = await PartnerDeclaration.findOne({ gymId: req.params.gymId });
        if (!declaration) return res.status(404).json({ message: 'Declaration not found' });
        res.json(declaration);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
