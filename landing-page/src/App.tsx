import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Dumbbell,
    MapPin,
    Search,
    ShieldCheck,
    Zap,
    ArrowRight,
    CheckCircle2,
    Star,
    Smartphone,
    ChevronDown,
    Users,
    BarChart3,
    Globe
} from "lucide-react";
import { Button } from "./components/Button";
import { SEO } from "./components/SEO";
import { VenueCard } from "./components/VenueCard";

const FEATURED_GYMS = [
    {
        _id: "1",
        name: "Iron Paradise Elite",
        location: "Koramangala, Bangalore",
        rating: 4.9,
        reviews: 128,
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
        tags: ["Premium", "CrossFit"]
    },
    {
        _id: "2",
        name: "Zenith Yoga & Wellness",
        location: "Indiranagar, Bangalore",
        rating: 4.8,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
        tags: ["Yoga", "Wellness"]
    },
    {
        _id: "3",
        name: "Titan Strength Center",
        location: "Whitefield, Bangalore",
        rating: 4.7,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=800",
        tags: ["Bodybuilding", "Open Gym"]
    }
];

// Configuration for URLs - Final Verified Ports
const IS_DEV = import.meta.env.DEV;
const URLS = {
    MARKETPLACE: import.meta.env.VITE_MARKETPLACE_URL || "https://app.gymkaana.com",
    OWNER: import.meta.env.VITE_OWNER_URL || "https://owner.gymkaana.com",
    API: import.meta.env.VITE_API_URL || "https://api.gymkaana.com/api",
};

export default function App() {
    const [liveGyms, setLiveGyms] = useState<any[]>([]);
    const [loadingGyms, setLoadingGyms] = useState(true);
    const [liveStats, setLiveStats] = useState<any>(null);

    const onExplore = () => { window.location.href = URLS.MARKETPLACE; };
    const onLogin = () => { window.location.href = `${URLS.MARKETPLACE}?action=login`; };
    const onListGym = () => { window.location.href = `${URLS.MARKETPLACE}?screen=partner`; };
    const onOwnerPortal = () => { window.location.href = URLS.OWNER; };

    // Specific screen links for Footer/About
    const goToMarketplaceScreen = (screen: string) => {
        window.location.href = `${URLS.MARKETPLACE}?screen=${screen}`;
    };

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                // Fetch gyms
                const gymRes = await fetch(`${URLS.API}/gyms`);
                if (gymRes.ok) {
                    const data = await gymRes.json();
                    setLiveGyms(data.slice(0, 3));
                }

                // Fetch public stats
                const statsRes = await fetch(`${URLS.API}/dashboard/public-stats`);
                if (statsRes.ok) {
                    const stats = await statsRes.json();
                    setLiveStats(stats);
                }
            } catch (err) {
                console.error("Failed to fetch landing data:", err);
            } finally {
                setLoadingGyms(false);
            }
        };
        fetchLandingData();
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Gymkaana",
        "url": "https://gymkaana.com",
        "logo": "https://gymkaana.com/logo.png",
        "sameAs": [
            "https://facebook.com/gymkaana",
            "https://instagram.com/gymkaana",
            "https://twitter.com/gymkaana"
        ],
        "description": "Discover and book the best gym memberships, yoga studios, and fitness classes near you with Gymkaana."
    };

    return (
        <div className="flex flex-col min-h-screen bg-transparent selection:bg-primary selection:text-black">
            <SEO
                title="Discover Top Gyms & Fitness Centers"
                description="The ultimate fitness marketplace. Find, compare, and book the best gyms near you. Get flexible memberships and start your fitness journey today."
            />
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>

            {/* Sticky Navbar */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md z-[100] border-b border-slate-200/40">
                <div className="container mx-auto px-6 h-full flex items-center justify-between">
                    <div className="-skew-x-12 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <h1 className="text-2xl font-[1000] uppercase flex items-center">
                            <span className="text-slate-900">GYM</span>
                            <span className="text-primary italic ml-0.5">KAA</span>
                            <span className="text-slate-900">NA</span>
                        </h1>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#how-it-works" className="text-[10px] font-black text-slate-600 hover:text-primary transition-colors uppercase tracking-widest">How It Works</a>
                        <a href="#features" className="text-[10px] font-black text-slate-600 hover:text-primary transition-colors uppercase tracking-widest">Features</a>
                        <a href="#faq" className="text-[10px] font-black text-slate-600 hover:text-primary transition-colors uppercase tracking-widest">FAQ</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="font-black uppercase tracking-widest text-[10px] hidden lg:flex" onClick={onOwnerPortal}>Owner Portal</Button>
                        <Button variant="ghost" className="font-black uppercase tracking-widest text-[10px] hidden sm:flex" onClick={onLogin}>Sign In</Button>
                        <Button className="rounded-full px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20" onClick={onExplore}>Explore</Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="lg:w-1/2 text-center lg:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black mb-6 animate-pulse uppercase tracking-widest">
                                <Zap size={14} /> The Future of Fitness
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-[1000] tracking-tighter text-slate-900 leading-[1] mb-6">
                                Your Fitness Journey, <span className="text-primary italic">Unlimited</span> Access.
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                                Discover the best gyms, yoga studios, and CrossFit centers in your city. One platform, thousands of possibilities. No hidden fees, just sweat.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Button
                                    onClick={onExplore}
                                    size="lg"
                                    className="h-16 px-10 rounded-2xl text-lg font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto uppercase tracking-wider"
                                >
                                    Explore Gyms <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={onListGym}
                                    variant="outline"
                                    size="lg"
                                    className="h-16 px-10 rounded-2xl text-lg font-black border-2 hover:bg-slate-50 transition-all w-full sm:w-auto uppercase tracking-wider"
                                >
                                    List Your Gym
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-2">
                                    <Star className="text-yellow-500" fill="currentColor" size={20} />
                                    <span className="font-bold text-slate-900">{liveStats?.platformRating || "4.9"}/5 Rating</span>
                                </div>
                                <div className="w-px h-6 bg-slate-200"></div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">{liveStats?.totalGyms || "500+"} Partners</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
                                <img
                                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=1200"
                                    alt="Fitness Training"
                                    className="w-full h-auto object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200";
                                    }}
                                />
                            </div>

                            {/* Stats Card Overlay */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Members</p>
                                    <p className="text-2xl font-[1000] text-slate-900">{liveStats?.activeMembers || "12.4K+"}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Area */}
            <section className="py-16 bg-background/40 border-y border-slate-200/40">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Gyms Listed", value: liveStats?.totalGyms || "500+" },
                            { label: "Active Members", value: liveStats?.activeMembers || "1.2k" },
                            { label: "Cities Covered", value: liveStats?.citiesCovered || "10+" },
                            { label: "Success Rate", value: "99.9%" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <p className="text-4xl font-[1000] text-slate-900 mb-1">{stat.value}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-[1000] text-slate-900 mb-4 tracking-tighter uppercase">How It Works</h2>
                        <p className="text-slate-400 text-lg font-medium">Your fitness transformation is just four simple steps away.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            {
                                icon: Search,
                                title: "Discover",
                                desc: "Search for gyms by location, discipline, or amenities.",
                                color: "bg-blue-500"
                            },
                            {
                                icon: BarChart3,
                                title: "Compare",
                                desc: "Check plans, facilities, and real user reviews.",
                                color: "bg-purple-500"
                            },
                            {
                                icon: ShieldCheck,
                                title: "Book",
                                desc: "Secure your spot instantly with our easy checkout.",
                                color: "bg-primary"
                            },
                            {
                                icon: Dumbbell,
                                title: "Train",
                                desc: "Go to your chosen gym and start your session.",
                                color: "bg-orange-500"
                            }
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="relative group p-8 rounded-3xl hover:bg-slate-50 transition-all duration-300"
                            >
                                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-xl font-[1000] text-slate-900 mb-3 uppercase tracking-tighter">{step.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                                {i < 3 && (
                                    <div className="hidden lg:block absolute top-12 -right-6 text-slate-200">
                                        <ArrowRight size={24} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Gyms */}
            <section id="gyms" className="py-24 bg-background/60">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-[1000] text-slate-900 mb-4 tracking-tighter uppercase">Explore Featured Venues</h2>
                            <p className="text-slate-400 text-lg font-medium">Hand-picked premium fitness studios achieving 5-star results.</p>
                        </div>
                        <Button
                            onClick={onExplore}
                            variant="link"
                            className="text-primary font-[1000] text-lg p-0 h-auto uppercase tracking-widest"
                        >
                            View All Gyms <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loadingGyms ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[4/3] rounded-[2.5rem] bg-slate-100 animate-pulse border border-slate-200/50" />
                            ))
                        ) : (liveGyms.length > 0 ? liveGyms : FEATURED_GYMS).map((gym, i) => (
                            <motion.div
                                key={gym._id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <VenueCard
                                    gym={gym}
                                    onClick={() => onExplore()}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-[1000] text-slate-900 mb-4 tracking-tighter uppercase">Loved by Thousands</h2>
                        <div className="flex items-center justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((_, i) => <Star key={i} className="text-yellow-500" fill="currentColor" size={20} />)}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {(liveStats?.recentReviews || [
                            {
                                text: "Gymkaana changed how I workout. I can literally pick a gym based on my mood and location. The flexible plans are exactly what I needed.",
                                author: "Rahul S.",
                                role: "Marathon Runner"
                            },
                            {
                                text: "Starting my yoga journey was so easy. I compared five studios in my area and booked a session in seconds. The prices are better than offline!",
                                author: "Priya M.",
                                role: "Yoga Enthusiast"
                            },
                            {
                                text: "Everything is seamless. The check-in at the gym is super fast—I just show my QR code and I'm in. No questions asked.",
                                author: "Arjun K.",
                                role: "Bodybuilder"
                            }
                        ]).map((t: any, i: number) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-white relative"
                            >
                                <div className="absolute -top-6 left-10 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black text-2xl font-[1000]">
                                    "
                                </div>
                                <p className="text-slate-600 text-lg leading-relaxed mb-8 italic">"{t.text}"</p>
                                <div>
                                    <p className="text-slate-900 font-[1000]">{t.author}</p>
                                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* App Promotion */}
            <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-white text-[10px] font-black mb-8 uppercase tracking-[0.2em] border border-white/20">
                            Coming Soon
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-[1000] mb-8 leading-tight uppercase tracking-tighter text-white">Your Fitness, <br /><span className="text-primary italic">In Your Pocket.</span></h2>
                        <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            We're building the most advanced fitness app. Track sessions, manage passes, and earn rewards while you train.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Button size="lg" className="h-16 px-10 rounded-2xl bg-white text-black hover:bg-slate-200 font-[1000] flex items-center gap-3 w-full sm:w-auto uppercase tracking-widest">
                                <Smartphone size={24} /> App Store
                            </Button>
                            <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10 font-[1000] flex items-center gap-3 w-full sm:w-auto uppercase tracking-widest">
                                <Smartphone size={24} /> Google Play
                            </Button>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-30"></div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 bg-white/50">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-[1000] text-slate-900 mb-4 tracking-tighter uppercase">Got Questions?</h2>
                        <p className="text-slate-400 text-lg font-medium">Everything you need to know about the platform.</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Is Gymkaana a gym itself?", a: "No, Gymkaana is a marketplace that connects you with hundreds of independent gyms and studios in your area." },
                            { q: "How do I check in at the gym?", a: "Once you book a pass, you'll receive a unique QR code. Simply show it to the gym's reception to get verified instantly." },
                            { q: "Can I cancel my membership anytime?", a: "Yes! Most of our plans are flexible. You can cancel upcoming sessions or non-recurring passes directly from your profile." },
                            { q: "How much does it cost?", a: "Pricing varies by gym and plan. We aggregate the best deals from our partners so you can choose what fits your budget." }
                        ].map((faq, i) => (
                            <div key={i} className="border border-slate-100 rounded-[2rem] p-8 hover:border-slate-300 transition-all group">
                                <h4 className="text-lg font-[1000] text-slate-900 mb-4 flex items-center justify-between cursor-pointer uppercase tracking-tighter">
                                    {faq.q} <ChevronDown className="text-slate-300 group-hover:text-primary transition-colors" />
                                </h4>
                                <p className="text-slate-500 leading-relaxed font-medium">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 relative group overflow-hidden bg-primary">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="bg-slate-900 rounded-[4rem] p-12 lg:p-24 text-center shadow-3xl overflow-hidden relative border border-white/10">
                        <div className="relative z-10">
                            <h2 className="text-5xl lg:text-7xl font-[1000] text-white mb-8 leading-tight tracking-tight uppercase">
                                Start Your <span className="text-primary italic">Fitness</span> <br />Journey Today.
                            </h2>
                            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[12px]">
                                Create your account and find your first workout in seconds.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button
                                    onClick={onExplore}
                                    size="lg"
                                    className="h-16 px-12 rounded-2xl bg-primary text-black hover:opacity-90 font-[1000] text-xl shadow-2xl transition-all hover:scale-105 uppercase tracking-widest"
                                >
                                    Explore Now
                                </Button>
                                <Button
                                    onClick={onListGym}
                                    size="lg"
                                    variant="outline"
                                    className="h-16 px-12 rounded-2xl border-white/20 text-white hover:bg-white/10 font-[1000] text-xl transition-all uppercase tracking-widest"
                                >
                                    List Business
                                </Button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-12 opacity-5 text-white">
                            <Dumbbell size={300} strokeWidth={1} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 bg-slate-950 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
                        <div className="-skew-x-12 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <h3 className="text-3xl font-[1000] uppercase flex items-center group-hover:scale-105 transition-transform no-skew-x-0">
                                <span className="text-white">GYM</span>
                                <span className="text-primary italic mx-0.5">KAA</span>
                                <span className="text-white">NA</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex gap-x-12 gap-y-6 text-center md:text-left">
                            {[
                                { label: 'About Us', action: () => goToMarketplaceScreen('about') },
                                { label: 'Explore Venues', action: onExplore },
                                { label: 'Partner Program', action: onListGym },
                                { label: 'Owner Portal', action: onOwnerPortal },
                                { label: 'Privacy & Security', action: () => goToMarketplaceScreen('privacy') },
                                { label: 'Terms of Service', action: () => goToMarketplaceScreen('terms') },
                                { label: 'Help & FAQs', action: () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }) },
                            ].map((link) => (
                                <button
                                    key={link.label}
                                    onClick={link.action}
                                    className="text-[9px] font-[1000] uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-all"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <p className="text-slate-600 text-[9px] font-[1000] uppercase tracking-[0.3em]">
                            © {new Date().getFullYear()} VUEGAM SOLUTIONS. ALL RIGHTS RESERVED. Protocol v2.4.0
                        </p>
                        <div className="flex items-center gap-10">
                            {['Facebook', 'Instagram', 'Twitter', 'Youtube'].map(social => (
                                <button key={social} className="text-slate-600 hover:text-primary transition-all text-[9px] font-[1000] uppercase tracking-[0.2em]">
                                    {social}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
/ /   S Y N C   F O R   R E N D E R   C I   A S S O C I A T I O N   U P D A T E  
 