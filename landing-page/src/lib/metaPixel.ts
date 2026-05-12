/**
 * Meta Pixel Configuration
 * Initialize Meta Pixel for conversion tracking
 */

export const initMetaPixel = (pixelId: string = "YOUR_PIXEL_ID") => {
    if (window.fbq) return;

    // Load Meta Pixel
    !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod
                ? n.callMethod.apply(n, arguments)
                : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
    );

    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
};

// Track events
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    if (window.fbq) {
        window.fbq("track", eventName, eventData);
    }
};

// Track owner registration leads
export const trackOwnerRegistrationLead = (gymName: string, city: string) => {
    trackEvent("Lead", {
        content_name: `Gym Registration - ${gymName}`,
        content_category: "Owner Registration",
        city: city,
        value: 0,
        currency: "INR"
    });
};

// Track WhatsApp contact
export const trackWhatsAppContact = () => {
    trackEvent("Contact", {
        content_name: "WhatsApp Inquiry"
    });
};

// Track form submission
export const trackFormSubmission = (gymName: string, city: string) => {
    trackEvent("Lead", {
        content_name: `Owner Registration - ${gymName}`,
        city: city,
        value: 0,
        currency: "INR"
    });
};

// Declare window.fbq type
declare global {
    interface Window {
        fbq: any;
    }
}
