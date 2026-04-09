const mongoose = require('mongoose');

const partnerDeclarationSchema = new mongoose.Schema({
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String, required: true },
    declarationAccepted: { type: Boolean, required: true, default: false },
    signatureName: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    declarationText: { type: String, required: true }
});

module.exports = mongoose.model('PartnerDeclaration', partnerDeclarationSchema);
