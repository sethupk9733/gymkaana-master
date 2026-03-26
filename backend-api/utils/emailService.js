const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generic email sender with retry logic
 */
const sendEmail = async (to, subject, html, retry = true) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Gymkaana <no-reply@gymkaana.com>',
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
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Welcome to Gymkaana, ${name}!</h2>
            <p style="color: #666; font-size: 16px;">We're thrilled to have you join our elite fitness ecosystem. Your journey towards more accessible and efficient fitness starts now.</p>
            <div style="background: #000; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                <a href="https://app.gymkaana.com" style="color: #fff; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Start Exploring Venues</a>
            </div>
            <p style="color: #666; font-size: 14px;">Keep an eye out for exclusive offers and new gym openings in your area.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #000; font-weight: bold; font-size: 14px;">Powered by Vuegam Solutions</p>
        </div>
    `;
    return await sendEmail(to, "Welcome to Gymkaana", html);
};

/**
 * Send Booking Confirmation
 */
const sendBookingConfirmation = async (to, booking) => {
    const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #000; text-transform: uppercase; letter-spacing: 2px;">Booking Confirmed</h2>
            <p style="color: #666; font-size: 16px;">Your fitness session is locked in! Here are your booking details:</p>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #000;">
                <p style="margin: 5px 0;"><b>Gym:</b> ${booking.gymName}</p>
                <p style="margin: 5px 0;"><b>Plan:</b> ${booking.planName}</p>
                <p style="margin: 5px 0;"><b>Date:</b> ${new Date(booking.startDate).toLocaleDateString()}</p>
                <p style="margin: 5px 0;"><b>Amount:</b> ₹${booking.amount}</p>
            </div>
            <p style="color: #666; font-size: 14px;">Please present your QR code at the venue for verification.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="text-align: center; color: #000; font-weight: bold; font-size: 14px;">Powered by Vuegam Solutions</p>
        </div>
    `;
    return await sendEmail(to, `Booking Confirmation: ${booking.gymName}`, html);
};

module.exports = {
    sendEmail,
    sendOTPEmail,
    sendWelcomeEmail,
    sendBookingConfirmation
};
