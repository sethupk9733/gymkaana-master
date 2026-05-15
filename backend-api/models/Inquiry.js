const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    gymName: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'on progress', 'conversion on process', 'success', 'contacted', 'onboarded', 'ignored'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
