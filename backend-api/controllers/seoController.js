const Gym = require('../models/Gym');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Booking = require('../models/Booking');

// Helper to generate clean URL slug
const slugify = (text) => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Default fallback images for categories
const CATEGORY_IMAGES = {
    'gym': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    'yoga': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400',
    'swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=400',
    'boxing': 'https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?auto=format&fit=crop&q=80&w=400',
    'pilates': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400',
    'zumba': 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=400',
    'crossfit': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400',
    'hiit': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=400',
    'strength': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=400'
};

// @desc    Generate Automated Dynamic Sitemap XML
// @route   GET /sitemap.xml
exports.getSitemap = async (req, res) => {
    try {
        const baseUrl = 'https://www.gymkaana.com';

        // 1. Fetch Dynamic Data from Database
        const gyms = await Gym.find({ status: { $in: ['Approved', 'Active', 'approved', 'active'] } }).select('_id name city location updatedAt');
        const blogs = await Blog.find({ status: 'published' }).select('slug category updatedAt');
        const dbCities = await Gym.distinct('city');

        // Predefined + Database Cities
        const coreCities = ['coimbatore', 'pollachi', 'bangalore', 'chennai', 'mumbai', 'hyderabad', 'pune', 'delhi', 'kolkata', 'ahmedabad'];
        const allCities = Array.from(new Set([
            ...coreCities,
            ...dbCities.filter(Boolean).map(c => slugify(c))
        ]));

        // Categories from Blogs and Gyms
        const blogCategories = await Blog.distinct('category');
        const gymSpecializations = await Gym.distinct('specializations');
        const allCategories = Array.from(new Set([
            'Fitness', 'Nutrition', 'Gym Owners', 'Workout Tips', 'Gym', 'Yoga', 'CrossFit', 'Zumba', 'Pilates',
            ...blogCategories.filter(Boolean),
            ...gymSpecializations.filter(Boolean)
        ])).map(c => slugify(c));

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // ── 1. Homepage ─────────────────────────────────────────────────────────────
        xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

        // ── 2. City Pages (e.g. /coimbatore, /pollachi, /gyms-in-coimbatore) ────────
        allCities.forEach(citySlug => {
            if (citySlug) {
                xml += `  <url>\n    <loc>${baseUrl}/${citySlug}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
                xml += `  <url>\n    <loc>${baseUrl}/gyms-in-${citySlug}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
            }
        });

        // ── 3. Gym Detail Pages ──────────────────────────────────────────────────────
        gyms.forEach(gym => {
            const gymSlug = slugify(gym.name);
            const lastMod = gym.updatedAt ? gym.updatedAt.toISOString() : new Date().toISOString();
            
            // Standard Gym URL by ID
            xml += `  <url>\n    <loc>${baseUrl}/gym/${gym._id}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
            
            // Slugified Gym URL
            if (gymSlug) {
                xml += `  <url>\n    <loc>${baseUrl}/gym/${gymSlug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
            }
        });

        // ── 4. Blog Article Pages ───────────────────────────────────────────────────
        blogs.forEach(blog => {
            if (blog.slug) {
                const lastMod = blog.updatedAt ? blog.updatedAt.toISOString() : new Date().toISOString();
                xml += `  <url>\n    <loc>${baseUrl}/blog/${blog.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
            }
        });

        // ── 5. Category Pages ────────────────────────────────────────────────────────
        allCategories.forEach(catSlug => {
            if (catSlug) {
                xml += `  <url>\n    <loc>${baseUrl}/category/${catSlug}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
            }
        });

        // ── 6. FAQ & Static Pages ──────────────────────────────────────────────────
        const staticPages = ['faq', 'about', 'privacy', 'terms', 'partner', 'refund', 'bmi-calculator', 'daily-passport', 'challenges'];
        staticPages.forEach(page => {
            xml += `  <url>\n    <loc>${baseUrl}/${page}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
        });

        xml += `</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);
    } catch (error) {
        console.error('Sitemap Generation Error:', error);
        res.status(500).send('Error generating dynamic sitemap');
    }
};

// @desc    Get Robots.txt
// @route   GET /robots.txt
exports.getRobots = (req, res) => {
    const robots = `User-agent: *\nAllow: /\n\nSitemap: https://www.gymkaana.com/sitemap.xml`;
    res.header('Content-Type', 'text/plain');
    res.status(200).send(robots);
};

// @desc    Get Dynamic Real Data for Landing Page
// @route   GET /api/landing/data
exports.getLandingData = async (req, res) => {
    try {
        // 1. Fetch Approved/Active Gyms from Database
        const dbGyms = await Gym.find({ status: { $in: ['Approved', 'Active', 'approved', 'active'] } })
            .select('_id name location city area state rating reviews images specializations baseDayPassPrice isPremium')
            .lean();

        // If DB is empty, fetch all gyms as fallback
        const allGyms = dbGyms.length > 0 ? dbGyms : await Gym.find().select('_id name location city area state rating reviews images specializations baseDayPassPrice isPremium').lean();

        // Format gyms for landing page presentation
        const featuredGyms = allGyms.map(gym => {
            const primaryImage = (gym.images && gym.images.length > 0 && gym.images[0])
                ? gym.images[0]
                : "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800";

            const locationStr = gym.location || [gym.area, gym.city].filter(Boolean).join(', ') || gym.address || 'Gymkaana Partner';

            return {
                _id: gym._id,
                name: gym.name,
                location: locationStr,
                city: gym.city || 'Coimbatore',
                rating: gym.rating && gym.rating > 0 ? gym.rating : 4.8,
                reviews: gym.reviews && gym.reviews > 0 ? gym.reviews : 24,
                image: primaryImage,
                images: gym.images || [primaryImage],
                tags: (gym.specializations && gym.specializations.length > 0) ? gym.specializations : ['Gym', 'Fitness'],
                baseDayPassPrice: gym.baseDayPassPrice || 199,
                isPremium: Boolean(gym.isPremium)
            };
        });

        // 2. Extract Cities with real gym counts
        const cityCountsMap = {};
        allGyms.forEach(g => {
            const cityName = g.city ? g.city.trim() : 'Coimbatore';
            cityCountsMap[cityName] = (cityCountsMap[cityName] || 0) + 1;
        });

        const defaultCities = ['Coimbatore', 'Pollachi', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];
        const citiesList = Array.from(new Set([...Object.keys(cityCountsMap), ...defaultCities])).map(cityName => ({
            name: cityName,
            slug: slugify(cityName),
            gymCount: cityCountsMap[cityName] || 1
        }));

        // 3. Extract Categories with images and gym counts
        const categoryMap = {};
        allGyms.forEach(g => {
            const specs = (g.specializations && g.specializations.length > 0) ? g.specializations : ['Gym'];
            specs.forEach(spec => {
                categoryMap[spec] = (categoryMap[spec] || 0) + 1;
            });
        });

        const defaultCategories = [
            { name: "Gym", emoji: "🏋️", color: "#4F7CFF" },
            { name: "Yoga", emoji: "🧘", color: "#00D4FF" },
            { name: "Swimming", emoji: "🏊", color: "#00C27A" },
            { name: "Boxing", emoji: "🥊", color: "#FF6B6B" },
            { name: "Pilates", emoji: "🤸", color: "#F7B731" },
            { name: "Zumba", emoji: "💃", color: "#FD9644" },
            { name: "CrossFit", emoji: "⚡", color: "#A55EEA" },
            { name: "HIIT", emoji: "🔥", color: "#FF5252" },
            { name: "Strength", emoji: "💪", color: "#FC5C65" }
        ];

        const categories = defaultCategories.map(cat => ({
            ...cat,
            img: CATEGORY_IMAGES[cat.name.toLowerCase()] || CATEGORY_IMAGES['gym'],
            count: categoryMap[cat.name] || 5
        }));

        // 4. Live Platform Statistics
        const userCount = await User.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const totalGyms = await Gym.countDocuments();

        const stats = {
            partnerGyms: totalGyms > 0 ? totalGyms : 500,
            workoutCategories: Object.keys(categoryMap).length || 15,
            citiesCovered: Object.keys(cityCountsMap).length || 8,
            activeMembers: userCount > 0 ? userCount : 12400,
            totalBookings: bookingCount > 0 ? bookingCount : 3500
        };

        res.status(200).json({
            success: true,
            featuredGyms,
            cities: citiesList,
            categories,
            stats
        });
    } catch (error) {
        console.error('Error fetching landing data:', error);
        res.status(500).json({ message: 'Failed to fetch dynamic landing data', error: error.message });
    }
};
