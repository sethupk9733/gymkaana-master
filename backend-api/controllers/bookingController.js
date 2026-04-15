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

exports.createBooking = async (req, res) => {
    try {
        console.log('===== BOOKING CREATION DEBUG =====');
        
        const booking = new Booking({
            gymId: req.body.gymId,
            planId: req.body.planId,
            userId: req.body.userId,
            memberName: req.body.memberName,
            memberEmail: req.body.memberEmail,
            amount: req.body.amount,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
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

        // Send Member Confirmation
        sendBookingConfirmation(populated.memberEmail, populated).catch(err => 
            console.error("User email failed:", err.message)
        );

        // Send Owner Notification if gym has owner email
        const ownerEmail = populated.gymId?.ownerId?.email || populated.gymId?.email;
        if (ownerEmail) {
            sendOwnerBookingNotification(ownerEmail, populated).catch(err => 
                console.error("Owner email failed:", err.message)
            );
        }

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
        const { bookingId } = req.body;
        let booking;

        // Try searching by full ObjectId first
        if (mongoose.Types.ObjectId.isValid(bookingId)) {
            booking = await Booking.findById(bookingId)
                .populate('gymId')
                .populate('planId');
        }

        // Fallback: If not found or if bookingId is short (8 chars), try to find by short display ID
        if (!booking && (bookingId.length === 8 || bookingId.length === 24)) {
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

        // Update status to completed
        booking.status = 'completed';
        await booking.save();

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

