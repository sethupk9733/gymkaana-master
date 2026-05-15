const Inquiry = require('../models/Inquiry');

exports.createInquiry = async (req, res) => {
    try {
        const { gymName, contact, location } = req.body;

        if (!gymName || !contact || !location) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const inquiry = new Inquiry({
            gymName,
            contact,
            location
        });

        await inquiry.save();

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            inquiry
        });
    } catch (err) {
        console.error('Inquiry submission error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) return res.status(404).json({ message: 'Enquiry not found' });
        res.json({ message: 'Enquiry deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateInquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!inquiry) return res.status(404).json({ message: 'Enquiry not found' });
        res.json(inquiry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
