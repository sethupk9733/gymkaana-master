import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
}

export function SEO({ title, description, canonical }: SEOProps) {
    useEffect(() => {
        const baseTitle = "Gymkaana";
        const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} | Universal Access to the Finest Fitness Venues`;
        document.title = fullTitle;

        // Update Meta Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description || "Discover and book the best gym memberships, yoga studios, and fitness classes near you.");
        }

        // Update OG Title
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', fullTitle);
        }

        // Update OG Description
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.setAttribute('content', description || "Discover and book the best gym memberships near you.");
        }

        // Update Canonical
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.setAttribute('href', canonical || "https://gymkaana.com");
        }
    }, [title, description, canonical]);

    return null;
}
