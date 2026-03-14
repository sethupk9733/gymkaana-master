import { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
}

export function SEO({ title, description, canonical }: SEOProps) {
    useEffect(() => {
        const baseTitle = "Gymkaana";
        const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} | Universal Access to Fitness`;
        document.title = fullTitle;

        // Update Meta Description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description || "Discover and book the best gym memberships near you.");

        // Update Canonical
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonical || "https://gymkaana.com");
    }, [title, description, canonical]);

    return null;
}
