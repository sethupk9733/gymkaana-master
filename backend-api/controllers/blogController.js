const Blog = require('../models/Blog');

// Helper to generate slug from title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Helper to estimate reading time
const calculateReadTime = (content) => {
    if (!content) return '1 min read';
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
};

// @desc    Get all published blogs (Public)
// @route   GET /api/blogs
exports.getPublishedBlogs = async (req, res) => {
    try {
        const { category, tag, search, page = 1, limit = 12 } = req.query;
        const query = { status: 'published' };

        if (category && category !== 'All') {
            query.category = new RegExp(`^${category}$`, 'i');
        }

        if (tag) {
            query.tags = { $in: [new RegExp(tag, 'i')] };
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { excerpt: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Blog.countDocuments(query);
        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            blogs,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error('Error fetching published blogs:', error);
        res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
    }
};

// @desc    Get single blog by slug (Public)
// @route   GET /api/blogs/:slug
exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOneAndUpdate(
            { slug, status: 'published' },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!blog) {
            // Check if post exists as draft (for preview purposes)
            const draftBlog = await Blog.findOne({ slug });
            if (draftBlog) {
                return res.status(200).json({ blog: draftBlog, isDraft: true });
            }
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.status(200).json({ blog });
    } catch (error) {
        console.error('Error fetching blog by slug:', error);
        res.status(500).json({ message: 'Failed to fetch blog', error: error.message });
    }
};

// @desc    Get all blogs including drafts (Admin)
// @route   GET /api/blogs/admin/all
exports.getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ blogs });
    } catch (error) {
        console.error('Error fetching all blogs for admin:', error);
        res.status(500).json({ message: 'Failed to fetch blogs', error: error.message });
    }
};

// @desc    Create new blog post (Admin)
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
    try {
        const { title, slug: customSlug, content, excerpt, coverImage, author, category, tags, status } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        let slug = customSlug ? generateSlug(customSlug) : generateSlug(title);
        
        // Ensure slug uniqueness
        let existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }

        const readTime = calculateReadTime(content);
        const parsedTags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);

        const blog = new Blog({
            title,
            slug,
            content,
            excerpt: excerpt || title,
            coverImage: coverImage || '',
            author: author || 'Gymkaana Team',
            category: category || 'Fitness',
            tags: parsedTags,
            status: status || 'draft',
            readTime
        });

        await blog.save();
        res.status(201).json({ message: 'Blog created successfully', blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Failed to create blog', error: error.message });
    }
};

// @desc    Update blog post (Admin)
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug: customSlug, content, excerpt, coverImage, author, category, tags, status } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        if (title) blog.title = title;
        if (content) {
            blog.content = content;
            blog.readTime = calculateReadTime(content);
        }
        if (excerpt !== undefined) blog.excerpt = excerpt;
        if (coverImage !== undefined) blog.coverImage = coverImage;
        if (author !== undefined) blog.author = author;
        if (category !== undefined) blog.category = category;
        if (status !== undefined) blog.status = status;

        if (tags !== undefined) {
            blog.tags = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
        }

        if (customSlug && customSlug !== blog.slug) {
            let newSlug = generateSlug(customSlug);
            const existingBlog = await Blog.findOne({ slug: newSlug, _id: { $ne: id } });
            if (existingBlog) {
                newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
            }
            blog.slug = newSlug;
        }

        await blog.save();
        res.status(200).json({ message: 'Blog updated successfully', blog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Failed to update blog', error: error.message });
    }
};

// @desc    Delete blog post (Admin)
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Failed to delete blog', error: error.message });
    }
};
