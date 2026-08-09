const Gym = require('../models/Gym');

exports.getSitemap = async (req, res) => {
    try {
        const gyms = await Gym.find({ isPublished: true }).select('name updatedAt');
        const baseUrl = 'https://www.gymkaana.com';
        
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Homepage
        xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

        // BMI Calculator
        xml += `  <url>\n    <loc>${baseUrl}/bmi-calculator</loc>\n    <lastmod>2026-04-27T00:00:00Z</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;

        // City Pages (Predefined cities)
        const cities = ['chennai', 'coimbatore', 'bangalore', 'mumbai', 'hyderabad', 'pune', 'delhi'];
        cities.forEach(city => {
            xml += `  <url>\n    <loc>${baseUrl}/gyms-in-${city}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
        });

        // Gym Pages
        gyms.forEach(gym => {
            const slug = gym.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            xml += `  <url>\n    <loc>${baseUrl}/gym/${slug}</loc>\n    <lastmod>${gym.updatedAt ? gym.updatedAt.toISOString() : new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });

        xml += `</urlset>`;

        res.header('Content-Type', 'application/xml');
        res.status(200).send(xml);
    } catch (error) {
        console.error('Sitemap Error:', error);
        res.status(500).send('Error generating sitemap');
    }
};

exports.getRobots = (req, res) => {
    const robots = `User-agent: *\nAllow: /\n\nSitemap: https://www.gymkaana.com/sitemap.xml`;
    res.header('Content-Type', 'text/plain');
    res.status(200).send(robots);
};
