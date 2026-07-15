import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  ogImage?: string;
  /** JSON-LD schema object or array of objects to inject for this screen */
  schema?: Record<string, unknown> | Record<string, unknown>[];
  /** If true, injects <meta name="robots" content="noindex,nofollow"> to block bots */
  noindex?: boolean;
}

const BASE_URL = 'https://gymkaana.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export function SEO({
  title,
  description,
  canonical,
  keywords,
  ogImage,
  schema,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const baseTitle = 'Gymkaana';
    const fullTitle = title
      ? `${title} | ${baseTitle}`
      : `${baseTitle} | Book Gyms, Yoga & Fitness Studios Near You`;
    document.title = fullTitle;

    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    const descText =
      description ||
      `Discover and book the best gym memberships, yoga studios, and fitness classes near you. India's premier fitness marketplace.`;
    const imageUrl = ogImage || DEFAULT_IMAGE;
    const canonicalUrl = canonical || BASE_URL;

    // ── Primary meta ────────────────────────────────────────────────────────
    setMeta('meta[name="description"]', 'content', descText);
    if (keywords) setMeta('meta[name="keywords"]', 'content', keywords);

    // ── Open Graph ──────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', descText);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', imageUrl);

    // ── Twitter ─────────────────────────────────────────────────────────────
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', descText);
    setMeta('meta[name="twitter:image"]', 'content', imageUrl);

    // ── Canonical ───────────────────────────────────────────────────────────
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute('href', canonicalUrl);

    // ── JSON-LD schema (AEO / AIO) ──────────────────────────────────────────
    const SCHEMA_ID = 'gymkaana-dynamic-schema';
    let schemaTag = document.getElementById(SCHEMA_ID);

    if (schema) {
      const payload = Array.isArray(schema)
        ? schema
        : [schema];
      const jsonContent = JSON.stringify(
        payload.length === 1 ? payload[0] : { '@context': 'https://schema.org', '@graph': payload },
        null,
        0
      );
      if (!schemaTag) {
        schemaTag = document.createElement('script');
        schemaTag.id = SCHEMA_ID;
        (schemaTag as HTMLScriptElement).type = 'application/ld+json';
        document.head.appendChild(schemaTag);
      }
      schemaTag.textContent = jsonContent;
    } else {
      // Remove dynamic schema when navigating to a screen that doesn't need one
      if (schemaTag) schemaTag.remove();
    }

    // ── Robots noindex (login / private screens) ────────────────────────────
    const ROBOTS_ID = 'gymkaana-robots-meta';
    let robotsMeta = document.getElementById(ROBOTS_ID) as HTMLMetaElement | null;

    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.id = ROBOTS_ID;
        robotsMeta.name = 'robots';
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.content = 'noindex,nofollow';
    } else {
      if (robotsMeta) robotsMeta.remove();
    }
  }, [title, description, canonical, keywords, ogImage, schema, noindex]);

  return null;
}
