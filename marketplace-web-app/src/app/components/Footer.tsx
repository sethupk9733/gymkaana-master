import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react";

export function Footer({
    onDisciplineClick,
    onAboutClick,
    onPrivacyClick,
    onHelpClick,
    onFAQClick,
    onContactClick,
    onCareersClick,
    onTermsClick,
    onPartnerClick
}: {
    onDisciplineClick?: (discipline: string) => void;
    onAboutClick?: () => void;
    onPrivacyClick?: () => void;
    onHelpClick?: () => void;
    onFAQClick?: () => void;
    onContactClick?: () => void;
    onCareersClick?: () => void;
    onTermsClick?: () => void;
    onPartnerClick?: () => void;
}) {
    const cities = [
        "Gyms in Bangalore",
        "Gyms in Mumbai",
        "Gyms in Delhi",
        "Gyms in Hyderabad",
        "Gyms in Chennai",
        "Gyms in Pune",
        "Gyms in Kolkata",
        "Gyms in Ahmedabad"
    ];

    const disciplines = [
        { label: "Yoga Studios near me", value: "Yoga" },
        { label: "CrossFit boxes near me", value: "CrossFit" },
        { label: "Zumba classes near me", value: "Zumba" },
        { label: "Pilates studios near me", value: "Pilates" },
        { label: "MMA training near me", value: "MMA/Kickboxing" },
        { label: "Swimming pools near me", value: "Swimming" },
        { label: "Aerobics classes near me", value: "Aerobics" },
        { label: "Bodybuilding gyms near me", value: "Bodybuilding" }
    ];

    const company = [
        { label: "About Us", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Help & Support", href: "#" },
        { label: "FAQs", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Partner with Us", href: "#" },
        { label: "Careers", href: "#" }
    ];

    const handleDisciplineClick = (e: React.MouseEvent, value: string) => {
        e.preventDefault();
        if (onDisciplineClick) {
            onDisciplineClick(value);
        }
    };

    return (
        <footer className="bg-black text-white pt-20 pb-10 px-6 lg:px-12 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand & Mission */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-[1000] tracking-[-0.08em] uppercase flex items-center -skew-x-12">
                            <span className="text-white">GYM</span>
                            <span className="text-primary italic mx-0.5">KAA</span>
                            <span className="text-white">NA</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                            ELEVATING THE FITNESS ECOSYSTEM. UNIVERSAL ACCESS TO THE FINEST VENUES, POWERED BY INTELLIGENT TECHNOLOGY.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://www.instagram.com/gymkaana1?igsh=amU4cDgybXludjFw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                                title="Follow us on Instagram"
                            >
                                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="https://www.facebook.com/share/184fY4GscQ/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                                title="Follow us on Facebook"
                            >
                                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                                title="Follow us on Twitter"
                            >
                                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                                title="Follow us on Youtube"
                            >
                                <Youtube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Backlinks: Cities */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Top Locations</h3>
                        <ul className="grid grid-cols-1 gap-3">
                            {cities.map((city, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        onClick={(e) => handleDisciplineClick(e, city.replace('Gyms in ', ''))}
                                        className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                                    >
                                        {city}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Backlinks: Disciplines */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Explore Fitness</h3>
                        <ul className="grid grid-cols-1 gap-3">
                            {disciplines.map((d, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        onClick={(e) => handleDisciplineClick(e, d.value)}
                                        className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                                    >
                                        {d.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Protocol Hub (Formerly Connect) */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Protocol Hub</h3>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-400 group cursor-pointer hover:text-white transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold tracking-wider">SUPPORT@GYMKAANA.COM</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-400 group cursor-pointer hover:text-white transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold tracking-wider">+91-81222 20884</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
                                    {company.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href={link.href}
                                                onClick={(e) => {
                                                    if (link.label === "About Us" && onAboutClick) {
                                                        e.preventDefault();
                                                        onAboutClick();
                                                    } else if (link.label === "Contact Us" && onContactClick) {
                                                        e.preventDefault();
                                                        onContactClick();
                                                    } else if ((link.label === "Privacy Policy" || link.label === "Privacy & Security") && onPrivacyClick) {
                                                        e.preventDefault();
                                                        onPrivacyClick();
                                                    } else if (link.label === "Help & Support" && onHelpClick) {
                                                        e.preventDefault();
                                                        onHelpClick();
                                                    } else if (link.label === "Terms of Service" && onTermsClick) {
                                                        e.preventDefault();
                                                        onTermsClick();
                                                    } else if (link.label === "Careers" && onCareersClick) {
                                                        e.preventDefault();
                                                        onCareersClick();
                                                    } else if (link.label === "Partner with Us" && onPartnerClick) {
                                                        e.preventDefault();
                                                        onPartnerClick();
                                                    } else if (link.label === "FAQs" && onFAQClick) {
                                                        e.preventDefault();
                                                        onFAQClick();
                                                    }
                                                }}
                                                className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors"
                                            >
                                                {link.label === "Privacy Policy" ? "Privacy & Security" : link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} VUEGAM SOLUTIONS. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] hover:text-white cursor-pointer transition-colors">Sitemap</span>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] hover:text-white cursor-pointer transition-colors">Back to top</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
