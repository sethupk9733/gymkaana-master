const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const Session = require('../models/Session');
const { sendWelcomeEmail, sendOTPEmail } = require('../utils/emailService');
const crypto = require('crypto');
const OTP = require('../models/OTP');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const checkAndTrackOTPRateLimit = async (email, otpCode) => {
    const hourAgo = new Date();
    hourAgo.setHours(hourAgo.getHours() - 1);
    const recentOTPs = await OTP.countDocuments({
        email: email.toLowerCase(),
        createdAt: { $gte: hourAgo }
    });
    if (recentOTPs >= 5) {
        throw new Error('Too many requests. Please try again after an hour.');
    }
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    await OTP.create({
        email: email.toLowerCase(),
        otp: otpCode,
        expiresAt,
        verified: false
    });
};

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, roles: user.roles },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }   // Extended from 15m to 7d
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
        { expiresIn: '30d' }  // Extended from 7d to 30d
    );
};

const setAuthCookies = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.DOMAIN?.includes('gymkaana.com');
    const cookieOptions = {
        httpOnly: true,
        secure: true, // Always true for HTTPS production
        sameSite: 'none', // Required for cross-site subdomains
        domain: isProduction ? '.gymkaana.com' : 'localhost',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    };

    res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, cookieOptions);
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        // Security: Prevent public registration of admin accounts
        if (role === 'admin') {
            return res.status(403).json({ message: 'Administrative roles cannot be created via public registration.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        await checkAndTrackOTPRateLimit(email, otp);

        const user = await User.create({
            name,
            email,
            password,
            roles: role ? [role] : ['user'],
            isVerified: false,
            otp,
            otpExpires
        });

        if (user) {
            // Send OTP Email via Resend
            try {
                await sendOTPEmail(user.email, user.otp);
            } catch (emailErr) {
                console.warn('OTP email failed but user created:', emailErr.message);
            }
            res.status(201).json({
                message: 'Registration successful. An OTP has been sent to your email.',
                email: user.email,
                requiresVerification: true
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        
        console.log(`📡 Login Attempt: ${email}`);

        // Safety check for password presence (prevents 'Illegal arguments' crash)
        if (!user) {
             console.warn(`❌ Login Failed: User not found (${email})`);
             return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        if (!user.password) {
             console.warn(`❌ Login Failed: User has no password set (${email}) - Likely Google Login only.`);
             return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (await user.comparePassword(password)) {
            console.log(`✅ Login Success: ${email}`);
            if (!user.isVerified) {
                return res.status(401).json({
                    message: 'Please verify your account first.',
                    requiresVerification: true,
                    email: user.email
                });
            }
            // Migrate old 'role' field to 'roles' array if needed
            if (!user.roles || user.roles.length === 0) {
                user.roles = user.role ? [user.role] : ['user'];
                await user.save();
                console.log('Migrated user roles for:', email, '->', user.roles);
            }

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            await Session.create({
                userId: user._id,
                tokenHash: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });

            setAuthCookies(res, accessToken, refreshToken);

            console.log('Login successful for:', email, 'roles:', user.roles);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles,
                accessToken
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    const { idToken, role } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
            }
            // Migrate old 'role' field to 'roles' array if needed
            if (!user.roles || user.roles.length === 0) {
                user.roles = user.role ? [user.role] : ['user'];
            }
            // Add role if not present
            if (role && !user.roles.includes(role)) {
                user.roles.push(role);
            }
            await user.save();
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                roles: role ? [role] : ['user'],
                profileImage: picture
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await Session.create({
            userId: user._id,
            tokenHash: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        setAuthCookies(res, accessToken, refreshToken);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            accessToken
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Google authentication failed', error: error.message });
    }
};

exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
        const session = await Session.findOne({ tokenHash: refreshToken, isRevoked: false });

        if (!session) return res.status(401).json({ message: 'Invalid session' });

        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: 'User not found' });

        // Migrate old 'role' field to 'roles' array if needed
        if (!user.roles || user.roles.length === 0) {
            user.roles = user.role ? [user.role] : ['user'];
            await user.save();
            console.log('Migrated user roles during refresh for:', user.email, '->', user.roles);
        }

        const accessToken = generateAccessToken(user);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000
        });

        res.json({ accessToken, roles: user.roles, _id: user._id });
    } catch (error) {
        res.status(401).json({ message: 'Refresh failed' });
    }
};

exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        await Session.findOneAndUpdate({ tokenHash: refreshToken }, { isRevoked: true });
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

// Admin only: Register a new administrator
exports.createAdminUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            roles: ['admin'], // Explicitly set as admin
            isVerified: true // Admins created via this portal are pre-verified
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            message: 'New administrator created successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const Booking = require('../models/Booking');

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, photo, phoneNumber, profileImage, gender, age, address, occupation } = req.body;
        if (name) user.name = name;
        if (photo) user.photo = photo;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (profileImage) user.profileImage = profileImage;
        if (gender !== undefined) user.gender = gender;
        if (age !== undefined) user.age = age;
        if (address !== undefined) user.address = address;
        if (occupation !== undefined) user.occupation = occupation;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await Session.create({
            userId: user._id,
            tokenHash: refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });

        setAuthCookies(res, accessToken, refreshToken);

        // Send welcome email upon successful verification
        const { sendWelcomeEmail } = require('../utils/emailService');
        try {
            await sendWelcomeEmail(user.email, user.name);
        } catch (emailErr) {
            console.warn('Welcome email failed but verification succeeded:', emailErr.message);
        }

        res.json({
            message: 'Account verified successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            accessToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resendOTP = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'Account already verified' });

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await checkAndTrackOTPRateLimit(email, otp);

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendOTPEmail(user.email, otp);

        res.json({ message: 'New OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found with this email' });

        // For forgot password, we'll use a 6-digit OTP as well for simplicity
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await checkAndTrackOTPRateLimit(email, otp);

        user.resetPasswordToken = otp; // Reusing logic but keeping fields separate
        user.resetPasswordExpires = otpExpires;
        await user.save();

        const { sendEmail: resendGeneric } = require('../utils/emailService');
        await resendGeneric(
            user.email,
            'Gymkaana - Password Reset Code',
            `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #000; text-transform: uppercase;">Password Reset</h2>
                    <p style="color: #666; font-size: 16px;">You requested a password reset. Use this code to continue:</p>
                    <div style="background: #f4f4f4; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0;">
                        <span style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #000;">${otp}</span>
                    </div>
                    <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="text-align: center; color: #000; font-weight: bold; font-size: 14px;">Powered by Vuegam Solutions</p>
                </div>
            `
        );

        res.json({ message: 'Password reset code sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset code' });
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'userBookings'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    roles: 1,
                    phoneNumber: 1,
                    profileImage: 1,
                    createdAt: 1,
                    gender: 1,
                    age: 1,
                    address: 1,
                    occupation: 1,
                    bookingsCount: { $size: '$userBookings' },
                    totalSpent: { $sum: '$userBookings.totalAmount' }, // Changed from amount to totalAmount to match schema
                    lastActive: { $max: '$userBookings.bookingDate' }
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
