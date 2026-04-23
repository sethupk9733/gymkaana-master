const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    transactionId:      { type: String, unique: true, sparse: true },
    gymId:              { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    planId:             { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
    userId:             { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    memberName:         { type: String, required: true },
    memberEmail:        { type: String, required: true },
    amount:             { type: Number, required: true },
    status:             { type: String, enum: ['active', 'cancelled', 'completed', 'upcoming'], default: 'upcoming' },
    bookingDate:        { type: Date, default: Date.now },
    startDate:          { type: Date, required: true },
    endDate:            { type: Date, required: true },

    // ─── Cashfree / EasySplit fields ────────────────────────────────────────
    cashfreeOrderId:    { type: String, index: true, sparse: true },   // CF order_id
    paymentSessionId:   { type: String },                               // CF payment_session_id → sent to frontend SDK
    paymentStatus:      {                                               // mirrors CF order status
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'USER_DROPPED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
        default: 'PENDING'
    },
    cashfreeVendorId:   { type: String },                               // EasySplit vendor_id of the gym
    vendorAmount:       { type: Number },                               // 85% → gym owner
    platformFee:        { type: Number },                               // 15% → Gymkaana
    paidAt:             { type: Date },                                 // populated on payment SUCCESS webhook
    refundId:           { type: String },                               // CF refund_id
    refundStatus:       { type: String, enum: ['PENDING', 'SUCCESS', 'CANCELLED', null], default: null },
    refundAmount:       { type: Number },
    webhookPayload:     { type: mongoose.Schema.Types.Mixed }           // raw webhook body stored for audit
}, { timestamps: true });

// Transaction ID is now generated in the direct endpoint, so we don't need this pre-save hook
// Disabling to avoid any "next is not a function" issues
// bookingSchema.pre('save', function (next) {
//     if (!this.transactionId) {
//         const date = new Date();
//         const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
//         const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
//         this.transactionId = `GYM-${dateStr}-${randomStr}`;
//         console.log('✓ Transaction ID generated:', this.transactionId);
//     }
//     next();
// });

module.exports = mongoose.model('Booking', bookingSchema);
