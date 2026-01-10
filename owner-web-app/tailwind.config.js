/**
 * Tailwind CSS Configuration
 * This config defines a premium color palette and enables JIT mode.
 */
module.exports = {
    mode: 'jit',
    content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
    theme: {
        extend: {
            colors: {
                primary: '#1E3A8A', // deep blue for brand
                accent: '#F59E0B', // amber accent
                glass: 'rgba(255,255,255,0.15)',
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
};
