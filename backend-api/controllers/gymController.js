const Gym = require('../models/Gym');
const PartnerDeclaration = require('../models/PartnerDeclaration');
const { logActivity } = require('./activityController');
const pointsEngine = require('../utils/pointsEngine');

// Diverse fitness placeholder images
const PLACEHOLDER_IMAGES = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", // CrossFit
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800", // Yoga
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800", // Weightlifting
    "https://images.unsplash.com/photo-1532618917136-d6df44dd3f7a?auto=format&fit=crop&q=80&w=800", // Cardio
    "https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?auto=format&fit=crop&q=80&w=800", // Gym Equipment
    "https://images.unsplash.com/photo-1577221084712-56ceb4ee3379?auto=format&fit=crop&q=80&w=800", // Training
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&q=80&w=800", // Strength
    "https://images.unsplash.com/photo-1552821206-1eb8a1be1ac6?auto=format&fit=crop&q=80&w=800", // Fitness
];

// Generate a consistent placeholder based on gym name
function getPlaceholderImageForGym(gymName) {
    let hash = 0;
    for (let i = 0; i < gymName.length; i++) {
        const char = gymName.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % PLACEHOLDER_IMAGES.length;
    return PLACEHOLDER_IMAGES[index];
}

exports.getAllGyms = async (req, res) => {
    try {
        let query = {};
                if (req.user && req.user.roles && req.user.roles.includes('admin')) {
            // Admin sees all for management view
        } else {
            // Marketplace discovery: see only approved hubs
            query.status = { $in: ['Approved', 'Active', 'approved', 'active'] };
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
                    kycDetails: 1,
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

        // Auto-assign a diverse placeholder image if no images provided
        if (!gymData.images || gymData.images.length === 0) {
            gymData.images = [getPlaceholderImageForGym(gymData.name)];
        }

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

        // Gamification: Award points if user is logged in
        if (req.user && req.user._id) {
            try {
                await pointsEngine.awardPoints(req.user._id, 'VIEW_GYM', gym._id, 'Gym');
            } catch (err) {
                console.error('Points engine error on gym view:', err);
            }
        }

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

        // Generate PDF and Send Email in Background
        const gym = await Gym.findById(gymId);
        const gymName = gym ? gym.name : 'Your Hub';
        const { generateDeclarationPDFBuffer } = require('../utils/pdfGenerator');
        const sendEmail = require('../utils/sendEmail');

        generateDeclarationPDFBuffer(declaration, gymName)
            .then(pdfBuffer => {
                sendEmail({
                    email: req.user.email,
                    subject: 'Gymkaana - Your Institutional Partnership Agreement',
                    message: `Dear ${signatureName},\n\nThank you for accepting the Gymkaana Partnership Agreement for ${gymName}.\n\nAttached is your digitally signed Legal Binding Declaration.\n\nBest Regards,\nGymkaana Operations Team`,
                    attachments: [
                        {
                            filename: `Partnership_Agreement_${gymName.replace(/\s+/g, '_')}.pdf`,
                            content: pdfBuffer,
                            contentType: 'application/pdf'
                        }
                    ]
                }).catch(err => console.error("Failed to send declaration email to owner:", err));
            })
            .catch(err => console.error("Failed to generate PDF buffer for email:", err));

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

exports.getDeclarationPDF = async (req, res) => {
    try {
        const { gymId } = req.params;
        const declaration = await PartnerDeclaration.findOne({ gymId });
        if (!declaration) return res.status(404).json({ message: 'Declaration not found' });

        const gym = await Gym.findById(gymId);
        const gymName = gym ? gym.name : 'Unknown Hub';

        // Security: only owner or admin can download the PDF
        const isOwner = req.user.roles && req.user.roles.includes('owner');
        const isAdmin = req.user.roles && req.user.roles.includes('admin');
        
        if (isOwner && !isAdmin) {
            if (declaration.ownerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to access this document' });
            }
        } else if (!isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { generateDeclarationPDF } = require('../utils/pdfGenerator');
        
        // Stream the PDF directly down to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Partnership_Agreement_${gymName.replace(/\s+/g, '_')}.pdf"`);
        
        generateDeclarationPDF(declaration, gymName, res);
    } catch (err) {
        console.error("PDF generation error:", err);
        if (!res.headersSent) {
            res.status(500).json({ message: err.message });
        }
    }
};

exports.getMyGyms = async (req, res) => {
    try {
        const isOwner = req.user.roles && req.user.roles.includes('owner');
        const isAdmin = req.user.roles && req.user.roles.includes('admin');

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Access denied. This endpoint is for institutional partners only.' });
        }

        const mongoose = require('mongoose');
        let query = { ownerId: new mongoose.Types.ObjectId(req.user._id) };
        
        const gyms = await Gym.find(query).sort({ createdAt: -1 });
        res.json(gyms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
