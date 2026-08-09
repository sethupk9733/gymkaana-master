const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        default: ''
    },
    coverImage: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: 'Gymkaana Team'
    },
    category: {
        type: String,
        default: 'Fitness',
        trim: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    readTime: {
        type: String,
        default: '3 min read'
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Text index for title, content, and tags search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);

