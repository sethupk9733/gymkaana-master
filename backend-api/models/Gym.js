const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String }, // specific area
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Active', 'Inactive'], default: 'Pending' },
    description: { type: String },
    phone: { type: String },
    email: { type: String },
    timings: { type: String }, // Backward compatibility
    googleMapsLink: { type: String },
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    operatingHours: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        open: { type: String },
        close: { type: String },
        isClosed: { type: Boolean, default: false }
    }],
    images: [{ type: String }], // Array of strings for multiple images
    members: { type: Number, default: 0 },
    checkins: { type: Number, default: 0 },
    baseDayPassPrice: { type: Number, default: 0 },
    revenues: { type: String }, // Keeping as string to match "₹45K" format if needed, or number
    facilities: [{ type: String }],
    specializations: [{ type: String }],
    trainers: [{ type: String }], // Keeping for backward compatibility
    trainerDetails: [{
        name: { type: String },
        experience: { type: String },
        specialization: { type: String },
        photo: { type: String }
    }],
    houseRules: [{ type: String }],
    documentation: {
        tradingLicense: { type: String },
        fireSafety: { type: String },
        insurancePolicy: { type: String },
        bankStatement: { type: String }
    },
    kycDetails: {
        aadhaarNumber: { type: String },
        panNumber: { type: String },
        gstNumber: { type: String },
        businessRegistrationNumber: { type: String }
    },
    bankDetails: {
        accountName: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },
        bankName: { type: String }
    },
    // ─── Cashfree EasySplit ──────────────────────────────────────────────────
    cashfreeVendorId:     { type: String },                            // assigned by Cashfree after vendor KYC
    cashfreeVendorStatus: {
        type: String,
        enum: ['NOT_REGISTERED', 'PENDING', 'ACTIVE', 'BLOCKED'],
        default: 'NOT_REGISTERED'
    },
    commissionPercent: { type: Number, default: 15, min: 0, max: 100 }, // platform fee %, default 15%
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gym', gymSchema);
