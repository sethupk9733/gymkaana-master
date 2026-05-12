import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    Eye,
    MessageCircle,
    TrendingUp,
    CheckCircle2,
    Zap,
    ChevronDown,
    Phone,
    ArrowRight,
    Send,
    AlertCircle,
    CheckCircle,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Star,
    Users
} from "lucide-react";

type OwnerLandingProps = {
    onNavigateToLogin: (mode: "login" | "signup") => void;
};

const FAQ_ITEMS = [
    {
        question: "Is onboarding free?",
        answer: "Yes! Onboarding is completely free. You only pay a small commission on successful memberships."
    },
    {
        question: "How does Gymkaana work?",
        answer: "Users nearby search for gyms on Gymkaana. Your gym gets discovered. They contact you directly for membership."
    },
    {
        question: "Will users contact us directly?",
        answer: "Yes! Interested users message your gym directly. You handle conversations and conversions."
    },
    {
        question: "Is Gymkaana available in my city?",
        answer: "We're expanding rapidly across Tamil Nadu and major Indian cities. Contact us to confirm availability."
    },
    {
        question: "How long does onboarding take?",
        answer: "Just 5 minutes! Provide your gym details and you're live. Our team helps with the rest."
    }
];

const PAIN_POINTS = [
    { icon: Eye, title: "Low Visibility", desc: "Hard to get discovered locally" },
    { icon: MessageCircle, title: "Inconsistent Enquiries", desc: "Relying only on Instagram ads" },
    { icon: Users, title: "Few Local Members", desc: "Difficult to attract nearby users" },
    { icon: Zap, title: "Marketing Burnout", desc: "Constant content creation needed" }
];

const BENEFITS = [
    "Better local visibility for your gym",
    "Direct enquiries from interested users",
    "Increase membership revenue",
    "5-minute easy onboarding",
    "Mobile-friendly member management",
    "Discover more local gym members"
];

const SAMPLE_GYMS = [
    { _id: "1", name: "PowerFlex Gym", city: "Chennai", rating: 4.8, reviews: 156, image: "https://picsum.photos/800/600?random=1", tags: ["Strength", "Cardio"] },
    { _id: "2", name: "FitZone Studio", city: "Bangalore", rating: 4.9, reviews: 203, image: "https://picsum.photos/800/600?random=2", tags: ["Yoga", "Wellness"] },
    { _id: "3", name: "Titan Strength", city: "Tamil Nadu", rating: 4.7, reviews: 187, image: "https://picsum.photos/800/600?random=3", tags: ["Bodybuilding", "CrossFit"] },
    { _id: "4", name: "Elite Fitness", city: "Hyderabad", rating: 4.8, reviews: 219, image: "https://picsum.photos/800/600?random=4", tags: ["Premium", "Personal Training"] },
    { _id: "5", name: "Iron House", city: "Mumbai", rating: 4.9, reviews: 245, image: "https://picsum.photos/800/600?random=5", tags: ["Open Gym", "Training"] },
    { _id: "6", name: "Muscle Hub", city: "Delhi", rating: 4.6, reviews: 178, image: "https://picsum.photos/800/600?random=6", tags: ["Strength", "Cardio"] },
    { _id: "7", name: "Strong Body", city: "Pune", rating: 4.8, reviews: 162, image: "https://picsum.photos/800/600?random=7", tags: ["Fitness", "Wellness"] },
    { _id: "8", name: "Ultimate Gym", city: "Kolkata", rating: 4.7, reviews: 149, image: "https://picsum.photos/800/600?random=8", tags: ["Gym", "Training"] },
    { _id: "9", name: "Fit Warriors", city: "Jaipur", rating: 4.8, reviews: 134, image: "https://picsum.photos/800/600?random=9", tags: ["CrossFit", "Strength"] },
    { _id: "10", name: "Power Zone", city: "Ahmedabad", rating: 4.6, reviews: 121, image: "https://picsum.photos/800/600?random=10", tags: ["Cardio", "Fitness"] },
    { _id: "11", name: "Victory Fitness", city: "Lucknow", rating: 4.7, reviews: 108, image: "https://picsum.photos/800/600?random=11", tags: ["Strength", "Training"] },
    { _id: "12", name: "Apex Gym", city: "Chandigarh", rating: 4.8, reviews: 97, image: "https://picsum.photos/800/600?random=12", tags: ["Premium", "Wellness"] }
];

export function OwnerLanding({ onNavigateToLogin }: OwnerLandingProps) {
    const [liveStats, setLiveStats] = useState<any>(null);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [onboardedGyms, setOnboardedGyms] = useState<any[]>(SAMPLE_GYMS);
    const [scrollPosition, setScrollPosition] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    
    // Enquiry form state
    const [enquiryForm, setEnquiryForm] = useState({ gymName: "", contact: "", location: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [showHeaderForm, setShowHeaderForm] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || "https://api.gymkaana.com/api";

    // Fetch stats and gyms
    useEffect(() => {
        const fetchData = async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);

                // Fetch stats
                const statsRes = await fetch(`${API_URL}/dashboard/public-stats`, {
                    signal: controller.signal,
                });
                
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setLiveStats(data);
                }

                // Fetch gyms (with fallback to sample data)
                try {
                    const gymsRes = await fetch(`${API_URL}/gyms`, {
                        signal: controller.signal,
                    });

                    if (gymsRes.ok) {
                        const gymsData = await gymsRes.json();
                        const processedGyms = Array.isArray(gymsData) 
                            ? gymsData.slice(0, 12) 
                            : gymsData.data?.slice(0, 12) || [];
                        
                        if (processedGyms.length > 0) {
                            setOnboardedGyms(processedGyms);
                        }
                    }
                } catch (gymErr) {
                    console.warn("Could not fetch real gyms, using sample data:", gymErr);
                    // Keep sample gyms as fallback
                }

                clearTimeout(timeoutId);
            } catch (err) {
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Auto-scroll carousel
    useEffect(() => {
        if (onboardedGyms.length === 0) return;

        const interval = setInterval(() => {
            if (carouselRef.current) {
                const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
                let newPosition = scrollPosition + 350;
                
                if (newPosition >= maxScroll) {
                    newPosition = 0;
                }
                
                carouselRef.current.scrollTo({
                    left: newPosition,
                    behavior: 'smooth'
                });
                setScrollPosition(newPosition);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [scrollPosition, onboardedGyms.length]);

    const handleSignUp = () => {
        if (window.fbq) {
            window.fbq('track', 'Lead', {
                content_name: 'Gym Owner Registration',
                value: 0,
                currency: 'INR'
            });
        }
        onNavigateToLogin("signup");
    };

    const handleEnquirySubmit = async (e: React.FormEvent, isHeaderForm: boolean = false) => {
        e.preventDefault();
        
        // Trim whitespace and validate
        const trimmed = {
            gymName: enquiryForm.gymName.trim(),
            contact: enquiryForm.contact.trim(),
            location: enquiryForm.location.trim()
        };

        if (!trimmed.gymName || !trimmed.contact || !trimmed.location) {
            setSubmitStatus("error");
            return;
        }

        setSubmitting(true);
        setSubmitStatus("idle");

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            // Try multiple endpoints in order
            const endpoints = [
                {
                    url: `${API_URL}/inquiry`,
                    data: trimmed
                }
            ];

            let success = false;
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint.url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(endpoint.data),
                        signal: controller.signal,
                    });

                    if (response.ok || response.status === 201) {
                        success = true;
                        console.log("Enquiry submitted to:", endpoint.url);
                        break;
                    }
                } catch (e) {
                    console.warn(`Endpoint ${endpoint.url} failed, trying next...`, e);
                }
            }

            clearTimeout(timeoutId);

                if (success) {
                    setSubmitStatus("success");
                    setEnquiryForm({ gymName: "", contact: "", location: "" });
                    
                    if (window.fbq) {
                        window.fbq('track', 'Lead', {
                            content_name: 'Gym Enquiry',
                            value: 0,
                            currency: 'INR'
                        });
                    }

                    if (isHeaderForm) {
                        setTimeout(() => setShowHeaderForm(false), 1000);
                    }

                    setTimeout(() => setSubmitStatus("idle"), 3000);
                } else {
                    setSubmitStatus("error");
                    console.error("All enquiry endpoints failed");
                }
            } else {
                setSubmitStatus("error");
                console.error("All enquiry endpoints failed");
            }
        } catch (err) {
            console.error("Enquiry submission failed:", err);
            setSubmitStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    const scrollCarousel = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -350 : 350;
            carouselRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-hidden">
            {/* ===== STICKY HEADER ===== */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-[100] backdrop-blur-md bg-white/90 border-b border-slate-200"
            >
                <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="text-2xl md:text-3xl font-[1000] tracking-[-0.08em] uppercase">
                        <span>GYM</span>
                        <span className="text-[#2EDD3B] italic">KAANA</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-xs font-black text-slate-600 hover:text-[#2EDD3B] uppercase">Features</a>
                        <a href="#gyms" className="text-xs font-black text-slate-600 hover:text-[#2EDD3B] uppercase">Gyms</a>
                        <a href="#faq" className="text-xs font-black text-slate-600 hover:text-[#2EDD3B] uppercase">FAQ</a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowHeaderForm(true)} className="text-xs font-black text-slate-600 hover:text-[#2EDD3B] uppercase hidden sm:block">Quick Enquiry</button>
                        <button onClick={() => onNavigateToLogin("login")} className="text-xs font-black text-slate-600 hover:text-[#2EDD3B] uppercase hidden sm:block">Sign In</button>
                        <button onClick={handleSignUp} className="px-6 py-2.5 rounded-lg bg-[#2EDD3B] text-black font-black uppercase text-xs shadow-lg hover:shadow-xl hover:bg-[#2EDD3B]/90 transition-all">Get Started</button>
                    </div>
                </div>

                {/* Header Enquiry Form Modal */}
                {showHeaderForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50 border-t border-slate-200"
                    >
                        <div className="container mx-auto px-6 py-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black">Quick Enquiry</h3>
                                <button onClick={() => setShowHeaderForm(false)} className="text-slate-600 hover:text-slate-900">
                                    <ChevronDown className="rotate-180" size={20} />
                                </button>
                            </div>
                            <form onSubmit={(e) => handleEnquirySubmit(e, true)} className="grid md:grid-cols-4 gap-3 items-end">
                                <input type="text" placeholder="Gym Name" value={enquiryForm.gymName} onChange={(e) => setEnquiryForm({ ...enquiryForm, gymName: e.target.value })} className="px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#2EDD3B] focus:ring-2 focus:ring-[#2EDD3B]/20" required />
                                <input type="tel" placeholder="Contact" value={enquiryForm.contact} onChange={(e) => setEnquiryForm({ ...enquiryForm, contact: e.target.value })} className="px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#2EDD3B] focus:ring-2 focus:ring-[#2EDD3B]/20" required />
                                <input type="text" placeholder="Location" value={enquiryForm.location} onChange={(e) => setEnquiryForm({ ...enquiryForm, location: e.target.value })} className="px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#2EDD3B] focus:ring-2 focus:ring-[#2EDD3B]/20" required />
                                <button type="submit" disabled={submitting} className="px-6 py-3 bg-[#2EDD3B] text-black font-black rounded-lg hover:bg-[#2EDD3B]/90 disabled:opacity-50 uppercase text-xs">
                                    {submitting ? "Sending..." : "Send"}
                                </button>
                                {submitStatus === "success" && <p className="col-span-4 text-green-600 text-sm font-medium">✓ Enquiry sent!</p>}
                                {submitStatus === "error" && (
                                    <p className="col-span-4 text-red-600 text-sm font-medium">
                                        {enquiryForm.gymName && enquiryForm.contact && enquiryForm.location 
                                            ? "Submission failed. Please try again." 
                                            : "Please fill all fields"}
                                    </p>
                                )}
                            </form>
                        </div>
                    </motion.div>
                )}
            </motion.header>

            <section className="relative min-h-[100vh] flex items-center justify-center px-6 py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2EDD3B]/5 via-transparent to-transparent" />
                
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2EDD3B]/10 text-[#2EDD3B] text-xs font-black mb-8 uppercase tracking-widest border border-[#2EDD3B]/30">
                            <Zap size={14} />
                            Free Onboarding
                        </div>

                        <h1 className="text-6xl md:text-8xl font-[1000] mb-8 leading-[1.1] tracking-tighter">
                            Get More <span className="text-[#2EDD3B]">Local Members</span> for Your Gym
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                            Gymkaana connects nearby fitness enthusiasts with your gym. Simple discovery. Direct memberships. Real growth.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                            <button onClick={handleSignUp} className="px-10 py-4 bg-[#2EDD3B] text-black font-black rounded-lg hover:bg-[#2EDD3B]/90 transition-all active:scale-95 uppercase text-sm shadow-2xl flex items-center justify-center gap-2">
                                List Your Gym <ArrowRight size={18} />
                            </button>
                            <button onClick={() => onNavigateToLogin("login")} className="px-10 py-4 bg-slate-100 text-black font-black rounded-lg hover:bg-slate-200 transition-all uppercase text-sm flex items-center justify-center gap-2">
                                <Phone size={18} /> Sign In
                            </button>
                        </div>

                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="relative"
                        >
                            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=900" alt="Gym" className="w-full h-96 object-cover rounded-2xl shadow-2xl" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ===== ENQUIRY FORM (BELOW HERO) ===== */}
            <section className="py-12 px-6 bg-white border-b border-slate-200">
                <div className="max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-[1000] mb-3 tracking-tighter">Get Your Gym on Gymkaana</h2>
                        <p className="text-lg text-slate-600">Join hundreds of gyms discovering local members. Fill this to get started.</p>
                    </motion.div>

                    <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={(e) => handleEnquirySubmit(e, false)} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Gym Name</label>
                                <input type="text" placeholder="Enter your gym name" value={enquiryForm.gymName} onChange={(e) => setEnquiryForm({ ...enquiryForm, gymName: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2EDD3B] focus:ring-2 focus:ring-[#2EDD3B]/20 transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
                                <input type="tel" placeholder="Your phone number" value={enquiryForm.contact} onChange={(e) => setEnquiryForm({ ...enquiryForm, contact: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2EDD3B] focus:ring-2 focus:ring-[#2EDD3B]/20 transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">City/Location</label>
                                <input type="text" placeholder="Your city" value={enquiryForm.location} onChange={(e) => setEnquiryForm({ ...enquiryForm, location: e.target.value })} className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2EDD3B] focus:ring-2 focus:ring-[#2EDD3B]/20 transition-all" required />
                            </div>
                        </div>

                        {submitStatus === "error" && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg">
                                <AlertCircle size={18} />
                                {enquiryForm.gymName && enquiryForm.contact && enquiryForm.location 
                                    ? "Submission failed. Our team is looking into it, please try again later." 
                                    : "Please fill all fields correctly."}
                            </motion.div>
                        )}

                        {submitStatus === "success" && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg">
                                <CheckCircle size={18} />
                                Submitted! We'll contact you soon.
                            </motion.div>
                        )}

                        <button type="submit" disabled={submitting} className="w-full px-6 py-4 bg-[#2EDD3B] text-black font-black rounded-lg hover:bg-[#2EDD3B]/90 disabled:opacity-50 transition-all uppercase text-base flex items-center justify-center gap-2 shadow-lg">
                            {submitting ? "Submitting..." : "Submit Enquiry"} <Send size={18} />
                        </button>
                    </motion.form>
                </div>
            </section>

            {/* ===== PAIN POINTS ===== */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-[1000] mb-6 tracking-tighter">The Gym Owner's Challenge</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">You know these problems too well:</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {PAIN_POINTS.map((point, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#2EDD3B]/10 flex items-center justify-center flex-shrink-0">
                                        <point.icon className="text-[#2EDD3B]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-[1000] text-lg mb-2">{point.title}</h3>
                                        <p className="text-slate-600">{point.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section id="features" className="py-28 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-[1000] mb-6 tracking-tighter">How Gymkaana Works</h2>
                        <p className="text-xl text-slate-600">Three simple steps to grow your gym:</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Eye, title: "Get Discovered", desc: "Local fitness users find your gym when searching nearby.", num: "01" },
                            { icon: MessageCircle, title: "Receive Enquiries", desc: "Interested users contact you directly through Gymkaana.", num: "02" },
                            { icon: TrendingUp, title: "Grow Memberships", desc: "Convert interested users into paying members.", num: "03" }
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                                <div className="text-5xl font-[1000] text-[#2EDD3B]/20 mb-4">{item.num}</div>
                                <div className="w-16 h-16 rounded-xl bg-[#2EDD3B]/10 flex items-center justify-center mb-6">
                                    <item.icon size={32} className="text-[#2EDD3B]" />
                                </div>
                                <h3 className="text-2xl font-[1000] mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== ONBOARDED GYMS CAROUSEL ===== */}
            <section id="gyms" className="py-28 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-[1000] mb-4 tracking-tighter">Gyms Growing with Gymkaana</h2>
                        <p className="text-xl text-slate-600">{onboardedGyms.length}+ gyms discovering local members</p>
                    </motion.div>

                    <div className="relative">
                        <div ref={carouselRef} className="overflow-x-auto scrollbar-hide flex gap-6 pb-6">
                            {onboardedGyms.map((gym, i) => (
                                    <motion.div 
                                        key={gym._id || i} 
                                        initial={{ opacity: 0 }} 
                                        whileInView={{ opacity: 1 }} 
                                        viewport={{ once: true }} 
                                        onClick={() => {
                                            const marketplaceUrl = import.meta.env.VITE_MARKETPLACE_URL || "https://app.gymkaana.com";
                                            window.open(`${marketplaceUrl}?screen=details&gym=${gym._id}`, '_blank');
                                        }}
                                        className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-200 group cursor-pointer"
                                    >
                                        {/* Gym Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                            <img 
                                                src={
                                                    gym.images?.[0] 
                                                        ? (gym.images[0].startsWith('http') ? gym.images[0] : `${API_URL.replace('/api', '')}/${gym.images[0]}`)
                                                        : (gym.image?.startsWith('http') ? gym.image : (gym.image ? `${API_URL.replace('/api', '')}/${gym.image}` : "https://picsum.photos/800/600?random=" + i))
                                                } 
                                                alt={gym.name} 
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://picsum.photos/800/600?random=" + i;
                                                }}
                                            />
                                            {/* Rating Badge */}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                                <Star className="text-yellow-500 fill-yellow-500" size={14} />
                                                <span className="text-xs font-black text-slate-900">{gym.rating || "4.8"}</span>
                                            </div>
                                            {/* Tags */}
                                            {gym.tags && gym.tags.length > 0 && (
                                                <div className="absolute bottom-4 left-4 flex gap-2">
                                                    {gym.tags.map((tag: string) => (
                                                        <span key={tag} className="bg-slate-900/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Gym Info */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-[#2EDD3B] transition-colors mb-2 line-clamp-1">
                                                {gym.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-slate-600 mb-4">
                                                <MapPin size={14} className="shrink-0" />
                                                <span className="text-sm font-medium line-clamp-1">{gym.city || gym.location || "Local Hub"}</span>
                                            </div>
                                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-1">
                                                    <Star className="text-yellow-500 fill-yellow-500" size={12} />
                                                    <span className="text-xs font-bold text-slate-600">{gym.reviews || "100+"} reviews</span>
                                                </div>
                                                <span className="text-[10px] font-black text-[#2EDD3B] uppercase tracking-widest flex items-center gap-1">
                                                    View Gym <ArrowRight size={10} />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                            ))}
                        </div>

                        {onboardedGyms.length > 0 && (
                            <div className="flex gap-3 mt-8 justify-center">
                                <button onClick={() => scrollCarousel('left')} className="w-12 h-12 rounded-lg bg-[#2EDD3B]/10 hover:bg-[#2EDD3B]/20 flex items-center justify-center transition-colors">
                                    <ChevronLeft className="text-[#2EDD3B]" size={20} />
                                </button>
                                <button onClick={() => scrollCarousel('right')} className="w-12 h-12 rounded-lg bg-[#2EDD3B]/10 hover:bg-[#2EDD3B]/20 flex items-center justify-center transition-colors">
                                    <ChevronRight className="text-[#2EDD3B]" size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-24 text-center">
                        <div>
                            <p className="text-5xl font-[1000] text-[#2EDD3B] mb-2">{liveStats?.totalGyms || "500+"}</p>
                            <p className="text-slate-600 font-medium">Gym Partners</p>
                        </div>
                        <div>
                            <p className="text-5xl font-[1000] text-[#2EDD3B] mb-2">{liveStats?.activeMembers || "50K+"}</p>
                            <p className="text-slate-600 font-medium">Active Members</p>
                        </div>
                        <div>
                            <p className="text-5xl font-[1000] text-[#2EDD3B] mb-2">10+</p>
                            <p className="text-slate-600 font-medium">Indian States</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BENEFITS ===== */}
            <section className="py-28 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-[1000] mb-4 tracking-tighter">Why Choose Gymkaana</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {BENEFITS.map((benefit, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 p-6 rounded-lg bg-[#2EDD3B]/5 border border-[#2EDD3B]/20 hover:border-[#2EDD3B]/40 transition-colors">
                                <CheckCircle2 className="text-[#2EDD3B] flex-shrink-0" size={28} />
                                <span className="font-bold text-lg">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section id="faq" className="py-28 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                        <h2 className="text-5xl md:text-6xl font-[1000] mb-4 tracking-tighter">Frequently Asked Questions</h2>
                    </motion.div>

                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
                                    <h3 className="font-black text-lg">{item.question}</h3>
                                    <motion.div animate={{ rotate: expandedFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                        <ChevronDown className="text-[#2EDD3B]" size={24} />
                                    </motion.div>
                                </button>

                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: expandedFaq === i ? "auto" : 0, opacity: expandedFaq === i ? 1 : 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                    <p className="px-6 py-5 text-slate-600 border-t border-slate-200 leading-relaxed">{item.answer}</p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FOOTER CTA ===== */}
            <section className="py-20 px-6 bg-slate-900 text-white text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2 className="text-4xl md:text-5xl font-[1000] mb-6 tracking-tighter">Start Growing Your Gym Today</h2>
                    <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Join hundreds of gym owners who are getting discovered by local fitness enthusiasts and converting them to paying members.</p>
                    <button onClick={handleSignUp} className="px-10 py-5 bg-[#2EDD3B] text-black font-black rounded-lg hover:bg-[#2EDD3B]/90 transition-all uppercase text-lg inline-flex items-center gap-2 shadow-2xl">
                        List Your Gym Now <ArrowRight size={20} />
                    </button>
                </motion.div>
            </section>
        </div>
    );
}
