const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', blogController.getPublishedBlogs);
router.get('/post/:slug', blogController.getBlogBySlug);

// Admin routes
router.get('/admin/all', protect, admin, blogController.getAllBlogsAdmin);
router.post('/', protect, admin, blogController.createBlog);
router.put('/:id', protect, admin, blogController.updateBlog);
router.delete('/:id', protect, admin, blogController.deleteBlog);

module.exports = router;
