const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Gym = require('../models/Gym');
const { logActivity } = require('./activityController');

exports.getAllBookings = async (req, res) => {
    try {
        let filter = {};
        const isOwner = req.user.roles && req.user.roles.includes('owner');
        const isAdmin = req.user.roles && req.user.roles.includes('admin');
        
        if (isOwner && !isAdmin) {
            const myGyms = await Gym.find({ ownerId: req.user._id });
            filter = { gymId: { $in: myGyms.map(g => g._id) } };
        } else if (!isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view all bookings' });
        }

        const bookings = await Booking.find(filter)
            .populate('gymId')
            .populate('planId')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookingsByGym = async (req, res) => {
    try {
        const bookings = await Booking.find({ gymId: req.params.gymId })
            .populate('planId')
            .populate('userId', 'name email');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id })
            .populate('gymId')
            .populate('planId')
            .sort({ createdAt: -1 });
        res.json(bookings);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const { sendBookingConfirmation, sendOwnerBookingNotification } = require('../utils/emailService');

function calculateEndDate(startDate, duration) {
    if (!startDate || !duration) return null;
    const start = new Date(startDate);
    const durationLower = duration.toLowerCase();
    let daysToAdd = 1;

    if (durationLower.includes('month')) {
        const months = parseInt(durationLower) || 1;
        daysToAdd = months * 30; // Standardize month to 30 days
    } else if (durationLower.includes('day')) {
        daysToAdd = parseInt(durationLower) || 1;
    } else if (durationLower.includes('year')) {
        const years = parseInt(durationLower) || 1;
        daysToAdd = years * 365;
    } else if (durationLower.includes('week')) {
        const weeks = parseInt(durationLower) || 1;
        daysToAdd = weeks * 7;
    }

    const end = new Date(start.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
    return end;
}

exports.createBooking = async (req, res) => {
    try {
        console.log('===== BOOKING CREATION DEBUG =====');
        
        let { startDate, endDate, planId } = req.body;
        
        // Auto-calculate endDate if missing or to ensure it matches the plan
        if (planId) {
            const plan = await mongoose.model('Plan').findById(planId);
            if (plan && plan.duration) {
                const calculatedEnd = calculateEndDate(startDate, plan.duration);
                if (calculatedEnd) endDate = calculatedEnd.toISOString();
                console.log(`[AutoExpiry] Plan: ${plan.name} | Duration: ${plan.duration} | End: ${endDate}`);
            }
        }

        const booking = new Booking({
            gymId: req.body.gymId,
            planId: req.body.planId,
            userId: req.body.userId,
            memberName: req.body.memberName,
            memberEmail: req.body.memberEmail,
            amount: req.body.amount,
            startDate: startDate,
            endDate: endDate,
            status: req.body.status || 'upcoming'
        });

        const newBooking = await booking.save();
        
        // Populate deeply to get gym owner info for email
        const populated = await Booking.findById(newBooking._id)
            .populate({
                path: 'gymId',
                populate: { path: 'ownerId' }
            })
            .populate('planId');

        // Emails are now sent via the Cashfree Webhook after successful payment.
        console.log("✓ Booking created. Emails will follow payment success.");

        logActivity({
            userId: req.body.userId,
            gymId: req.body.gymId,
            action: 'Booking Created',
            description: `New booking for ₹${req.body.amount} secured.`,
            type: 'success'
        }).catch(err => console.error("Activity log failed:", err.message));

        res.status(201).json(populated);
    } catch (err) {
        console.error("===== BOOKING ERROR =====", err.message);
        res.status(400).json({ message: err.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('gymId')
            .populate('planId')
            .populate('userId', 'name email phoneNumber');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.verifyBooking = async (req, res) => {
    try {
        const { bookingId, action } = req.body; // action can be 'approve' or 'reject'
        let booking;

        // Try searching by full ObjectId first
        if (mongoose.Types.ObjectId.isValid(bookingId)) {
            booking = await Booking.findById(bookingId)
                .populate('gymId')
                .populate('planId');
        }

        // Fallback: If not found or if bookingId is short (8 chars), try to find by short display ID
        if (!booking && (bookingId && (bookingId.length === 8 || bookingId.length === 24))) {
            const regex = new RegExp(bookingId + '$', 'i');
            booking = await Booking.findOne({
                $expr: {
                    $regexMatch: {
                        input: { $toString: "$_id" },
                        regex: regex
                    }
                }
            }).populate('gymId').populate('planId');
        }

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Security Check: Only the gym owner or an admin can verify this booking
        const isOwner = req.user.roles && req.user.roles.includes('owner');
        const isAdmin = req.user.roles && req.user.roles.includes('admin');

        if (isOwner && !isAdmin) {
            const gymId = booking.gymId._id || booking.gymId;
            const gym = await Gym.findById(gymId);
            if (!gym || gym.ownerId.toString() !== req.user._id.toString()) {
                console.warn(`Unauthorized verification attempt by owner ${req.user._id} for booking at gym ${gymId}`);
                return res.status(403).json({ message: 'Authorization Failed: You can only verify check-ins for your own gym.' });
            }
        }

        // Return details if no action provided (PREVIEW)
        if (!action) {
            if (booking.status === 'completed') {
                return res.status(400).json({ message: 'This booking has already been used.', booking });
            }
            if (booking.status === 'cancelled') {
                return res.status(400).json({ message: 'This booking is cancelled.', booking });
            }
            return res.json({ message: 'Booking verified. Pending approval.', booking, needsAction: true });
        }

        if (action === 'reject') {
            booking.status = 'upcoming'; // Reset to upcoming if it was pending or something
            await booking.save();
            
            logActivity({
                userId: booking.userId,
                gymId: booking.gymId,
                action: 'Check-in Rejected',
                description: `Owner rejected check-in for member ${booking.memberName}.`,
                type: 'warning'
            }).catch(err => console.error("Activity log failed:", err.message));

            return res.json({ message: 'Check-in rejected. Booking remains valid for future use.', booking });
        }

        if (action === 'approve') {
            booking.status = 'completed';
            await booking.save();

            logActivity({
                userId: booking.userId,
                gymId: booking.gymId,
                action: 'Check-in Approved',
                description: `Member ${booking.memberName} checked in successfully.`,
                type: 'success'
            }).catch(err => console.error("Activity log failed:", err.message));

            return res.json({ message: 'Check-in approved successfully!', booking });
        }

        return res.status(400).json({ message: 'Invalid action parameter' });

        // Log activity asynchronously
        logActivity({
            userId: booking.userId,
            gymId: booking.gymId,
            action: 'Check-in Verified',
            description: `Member ${booking.memberName} checked in successfully.`,
            type: 'info'
        }).catch(err => console.error("Activity log failed:", err.message));

        res.json({ message: 'Booking verified successfully', booking });
    } catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Security check
        const isAdmin = req.user.roles && req.user.roles.includes('admin');
        if (booking.userId.toString() !== req.user._id.toString() && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const now = new Date();
        const bookingTime = new Date(booking.createdAt);
        const diffMs = now - bookingTime;
        const diffHrs = diffMs / (1000 * 60 * 60);

        let canCancel = false;
        let reason = "";

        // Within 1 hour of booking OR before checking in (upcoming status)
        if (booking.status === 'upcoming') {
            canCancel = true;
            reason = "Before check-in";
        } else if (diffHrs <= 1 && booking.status !== 'cancelled') {
            // This case handles edge cases where status might have changed but still within 1hr cooling off
            // though usually check-in happens after 1hr unless it's a very quick walk-in
            canCancel = true;
            reason = "Within 1 hour of booking";
        }

        if (!canCancel) {
            return res.status(400).json({
                message: 'Cancellation policy: Must be before check-in or within 1 hour of booking. Otherwise, please contact support.',
                requiresChat: true
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        logActivity({
            userId: booking.userId,
            gymId: booking.gymId,
            action: 'Booking Cancelled',
            description: `Booking ${booking._id} cancelled by user. Reason: ${reason}`,
            type: 'warning'
        }).catch(err => console.error("Activity log failed:", err.message));

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBookingDate = async (req, res) => {
    try {
        // Option removed as per user request
        return res.status(400).json({ message: 'Date modification is no longer allowed. Please cancel and re-book if needed.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

