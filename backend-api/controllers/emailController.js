const OTP = require('../models/OTP');
const { sendOTPEmail, sendEmail } = require('../utils/emailService');

/**
 * Generate 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP for verification
 */
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email address is required' });
        }

        // Rate limiting (max 5 OTP in last hour)
        const hourAgo = new Date();
        hourAgo.setHours(hourAgo.getHours() - 1);
        
        const recentOTPs = await OTP.countDocuments({
            email: email.toLowerCase(),
            createdAt: { $gte: hourAgo }
        });

        if (recentOTPs >= 5) {
            return res.status(429).json({ message: 'Too many requests. Please try again after an hour.' });
        }

        const otp = generateOTP();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 5);

        // Save OTP to database
        await OTP.create({
            email: email.toLowerCase(),
            otp,
            expiresAt,
            verified: false
        });

        // Send via Resend
        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent successfully to ' + email });
    } catch (err) {
        console.error('🔥 Send OTP Error:', err);
        res.status(500).json({ message: 'Failed to send OTP', error: err.message });
    }
};

/**
 * Verify OTP
 */
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are both required' });
        }

        const verification = await OTP.findOne({
            email: email.toLowerCase(),
            otp,
            verified: false,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!verification) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark OTP as verified
        verification.verified = true;
        await verification.save();

        res.json({ message: 'Email verified successfully', success: true });
    } catch (err) {
        console.error('🔥 Verify OTP Error:', err);
        res.status(500).json({ message: 'Failed to verify OTP', error: err.message });
    }
};

/**
 * Generic Email Endpoint
 */
exports.sendGenericEmail = async (req, res) => {
    try {
        const { to, subject, html } = req.body;

        if (!to || !subject || !html) {
            return res.status(400).json({ message: 'Target email, subject and HTML are all required' });
        }

        // Basic security check - only internal/authorized triggers should call this
        // In real production, this should have middleware for auth
        
        await sendEmail(to, subject, html);

        res.json({ message: 'Email sent successfully' });
    } catch (err) {
        console.error('🔥 Generic Email Error:', err);
        res.status(500).json({ message: 'Failed to send email', error: err.message });
    }
};
