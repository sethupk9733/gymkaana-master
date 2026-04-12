const { Resend } = require('resend');

// Lazy initialization — avoids crash at startup if RESEND_API_KEY is missing
let _resend = null;
const getResend = () => {
    if (!_resend) {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not set in environment variables');
        }
        _resend = new Resend(process.env.RESEND_API_KEY);
    }
    return _resend;
};

/**
 * Generic email sender with retry logic
 */
const sendEmail = async (to, subject, html, retry = true) => {
    try {
        const { data, error } = await getResend().emails.send({
            from: 'Gymkaana <no-reply@contact.gymkaana.com>',
            to,
            subject,
            html,
        });

        if (error) {
            console.error('❌ Resend API Error:', error);
            if (retry) {
                console.log('🔄 Retrying email send...');
                return await sendEmail(to, subject, html, false);
            }
            throw new Error(error.message);
        }

        return data;
    } catch (err) {
        console.error('🔥 Email Service Failure:', err.message);
        if (retry) {
            console.log('🔄 Retrying email send after catch...');
            return await sendEmail(to, subject, html, false);
        }
        throw err;
    }
};

/**
 * Send OTP for verification
 */
const sendOTPEmail = async (to, otp) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Gymkaana Verification</h2>
            <p style="color: #666; font-size: 16px;">Use the following 6-digit code to verify your account. This code is valid for <b>5 minutes</b>.</p>
            <div style="background: #f4f4f4; padding: 30px; text-align: center; border-radius: 10px; margin: 20px 0;">
                <span style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #000;">${otp}</span>
            </div>
            <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #000; font-weight: bold; font-size: 14px;">Powered by Vuegam Solutions</p>
        </div>
    `;
    return await sendEmail(to, "Your Gymkaana OTP", html);
};

/**
 * Send Welcome Email
 */
const sendWelcomeEmail = async (to, name) => {
    const marketplaceUrl = process.env.MARKETPLACE_URL || 'https://app.gymkaana.com';
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Welcome to Gymkaana, ${name}!</h2>
            <p style="color: #666; font-size: 16px;">We're thrilled to have you join our elite fitness ecosystem. Your journey towards more accessible and efficient fitness starts now.</p>
            <div style="background: #000; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                <a href="${marketplaceUrl}" style="color: #fff; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Start Exploring Venues</a>
            </div>
            <p style="color: #666; font-size: 14px;">Keep an eye out for exclusive offers and new gym openings in your area.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #000; font-weight: bold; font-size: 14px;">Powered by Vuegam Solutions</p>
        </div>
    `;
    return await sendEmail(to, "Welcome to Gymkaana", html);
};

/**
 * Send Booking Confirmation to User (with QR Code)
 */
const sendBookingConfirmation = async (to, booking) => {
    const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${booking._id}&choe=UTF-8`;
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Booking Confirmed</h2>
            <p style="color: #666; font-size: 16px;">Your fitness session is locked in! Here are your booking details:</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #000;">
                <p style="margin: 5px 0;"><b>Gym:</b> ${booking.gymName || (booking.gymId && booking.gymId.name)}</p>
                <p style="margin: 5px 0;"><b>Plan:</b> ${booking.planName || (booking.planId && booking.planId.name)}</p>
                <p style="margin: 5px 0;"><b>Date:</b> ${new Date(booking.startDate).toLocaleDateString()}</p>
                <p style="margin: 5px 0;"><b>Amount:</b> ₹${booking.amount}</p>
                <p style="margin: 5px 0;"><b>ID:</b> ${booking._id.toString().slice(-8).toUpperCase()}</p>
            </div>

            <div style="text-align: center; margin: 30px 0; padding: 20px; border: 2px dashed #eee; border-radius: 10px;">
                <p style="text-transform: uppercase; font-weight: bold; font-size: 12px; margin-bottom: 10px; color: #666;">Scan for Check-in</p>
                <img src="${qrUrl}" alt="Check-in QR" style="width: 200px; height: 200px;" />
            </div>

            <p style="color: #666; font-size: 14px;">Please present this QR code at the venue for verification.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #000; font-weight: bold; font-size: 14px;">Powered by Vuegam Solutions</p>
        </div>
    `;
    return await sendEmail(to, `Booking Confirmation: ${booking.gymName || 'Your Session'}`, html);
};

/**
 * Send New Booking Notification to Owner
 */
const sendOwnerBookingNotification = async (to, booking) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">New Sale!</h2>
            <p style="color: #666; font-size: 16px;">A new booking has been confirmed for your hub:</p>
            
            <div style="background: #eefdf5; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981;">
                <p style="margin: 5px 0;"><b>Customer:</b> ${booking.memberName}</p>
                <p style="margin: 5px 0;"><b>Plan:</b> ${booking.planName || (booking.planId && booking.planId.name)}</p>
                <p style="margin: 5px 0;"><b>Amount:</b> ₹${booking.amount}</p>
                <p style="margin: 5px 0;"><b>Starts:</b> ${new Date(booking.startDate).toLocaleDateString()}</p>
            </div>

            <p style="color: #666; font-size: 14px;">Prepare your facility for the check-in. You can view full details in your owner dashboard.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #000; font-weight: bold; font-size: 14px;">Powered by Vuegam Solutions</p>
        </div>
    `;
    return await sendEmail(to, `New Sale Alert: ${booking.memberName}`, html);
};

/**
 * Send Login Notification
 */
const sendLoginNotification = async (to, name) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Security Alert: New Sign-in</h2>
            <p style="color: #666; font-size: 16px;">Hello ${name}, your Gymkaana account was recently accessed via <b>Google Login</b>.</p>
            
            <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #000;">
                <p style="margin: 5px 0;"><b>Activity:</b> Successful Login</p>
                <p style="margin: 5px 0;"><b>Date:</b> ${new Date().toLocaleString()}</p>
                <p style="margin: 5px 0;"><b>Platform:</b> Gymkaana Ecosystem</p>
            </div>

            <p style="color: #999; font-size: 12px;">If this wasn't you, please secure your account immediately or contact support.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #000; font-weight: bold; font-size: 14px;">Powered by Vuegam Solutions</p>
        </div>
    `;
    return await sendEmail(to, "Security Alert: New Login at Gymkaana", html);
};

module.exports = {
    sendEmail,
    sendOTPEmail,
    sendWelcomeEmail,
    sendBookingConfirmation,
    sendOwnerBookingNotification,
    sendLoginNotification
};
