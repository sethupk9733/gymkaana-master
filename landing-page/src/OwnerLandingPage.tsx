import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Eye,
    MessageCircle,
    TrendingUp,
    CheckCircle2,
    MapPin,
    Users,
    Clock,
    Zap,
    ChevronDown,
    Star,
    Phone,
    ArrowRight
} from "lucide-react";

const TESTIMONIALS = [
    {
        gym: "PowerFlex Gym",
        city: "Chennai",
        quote: "More enquiries from Gymkaana in 2 weeks than 3 months of Instagram ads.",
        owner: "Rajesh K."
    },
    {
        gym: "FitZone Studio",
        city: "Bangalore",
        quote: "Our membership conversion improved by 40% after joining Gymkaana.",
        owner: "Priya M."
    },
    {
        gym: "Titan Strength",
        city: "Tamil Nadu",
        quote: "Local gym discovery feature helped us reach members in our area.",
        owner: "Arjun P."
    }
];

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
    {
        icon: Eye,
        title: "Low Visibility",
        desc: "Hard to get discovered locally"
    },
    {
        icon: MessageCircle,
        title: "Inconsistent Enquiries",
        desc: "Relying only on Instagram ads"
    },
    {
        icon: Users,
        title: "Few Local Members",
        desc: "Difficult to attract nearby users"
    },
    {
        icon: Zap,
        title: "Marketing Burnout",
        desc: "Constant content creation needed"
    }
];

const BENEFITS = [
    "Better local visibility for your gym",
    "Direct enquiries from interested users",
    "Increase membership revenue",
    "5-minute easy onboarding",
    "Mobile-friendly member management",
    "Discover more local gym members"
];

export default function OwnerLandingPage() {
    const [scrollY, setScrollY] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        gymName: "",
        ownerName: "",
        phone: "",
        city: ""
    });

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Track Meta Pixel event
        if (window.fbq) {
            window.fbq('track', 'Lead', {
                value: 0,
                currency: 'INR',
                content_name: 'Gym Registration Lead'
            });
        }

        // Get base URL
        const baseURL = import.meta.env.VITE_OWNER_URL || "https://owner.gymkaana.com";
        
        // Redirect to owner portal with pre-filled data
        const params = new URLSearchParams({
            action: "onboard",
            gymName: formData.gymName,
            ownerName: formData.ownerName,
            phone: formData.phone,
            city: formData.city
        });
        
        window.location.href = `${baseURL}?${params.toString()}`;
    };

    const openWhatsApp = () => {
        // Track event
        if (window.fbq) {
            window.fbq('track', 'Contact');
        }
        
        const message = encodeURIComponent(
            "Hi! I'm interested in listing my gym on Gymkaana. Can you help me get started?"
        );
        window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
    };

    return (
        <div className="bg-slate-950 text-white overflow-hidden">
            {/* Meta Pixel Script Ready */}
            <script async src="https://connect.facebook.net/en_US/fbevents.js"></script>

            {/* ===== STICKY MOBILE CTA BAR ===== */}
            <div className="fixed bottom-0 left-0 right-0 z-[9998] md:hidden bg-slate-900 border-t border-primary/20 p-3 flex gap-2">
                <button
                    onClick={handleFormSubmit}
                    className="flex-1 bg-primary text-black font-black py-3 rounded-xl hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                    Register Now
                </button>
                <button
                    onClick={openWhatsApp}
                    className="flex-1 bg-green-600 text-white font-black py-3 rounded-xl hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    <MessageCircle size={16} />
                    Chat
                </button>
            </div>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-30" />
                <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Trust badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-xs font-black mb-6 uppercase tracking-widest">
                            <Zap size={14} />
                            Free Onboarding
                        </div>

                        {/* Main headline */}
                        <h1 className="text-5xl md:text-7xl font-[1000] mb-6 leading-[1.1] tracking-tighter">
                            Get More Local <span className="text-primary italic">Members</span> for Your Gym
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed font-medium max-w-xl mx-auto">
                            Gymkaana helps nearby users discover and join your gym. Get more enquiries, grow your membership base.
                        </p>

                        {/* Trust line */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-bold text-slate-400 mb-12">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-primary" />
                                Free onboarding
                            </span>
                            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-primary" />
                                Local gym discovery
                            </span>
                            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
                            <span className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-primary" />
                                5-min setup
                            </span>
                        </div>

                        {/* Primary and Secondary CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <button
                                onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-4 bg-primary text-black font-black rounded-2xl hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest text-sm shadow-2xl shadow-primary/40 flex items-center justify-center gap-2"
                            >
                                Register My Gym <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={openWhatsApp}
                                className="px-10 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={18} />
                                Chat on WhatsApp
                            </button>
                        </div>

                        {/* Hero image placeholder */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="relative"
                        >
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-slate-800 bg-slate-900">
                                <img
                                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
                                    alt="Gym members"
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                                {/* Overlay text */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div>
                                        <p className="text-primary font-black text-sm uppercase tracking-widest">Powered by Gymkaana</p>
                                        <p className="text-white font-black text-lg">Growing gym networks daily</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <ChevronDown className="text-primary/50" size={32} />
                </motion.div>
            </section>

            {/* ===== PAIN POINTS SECTION ===== */}
            <section className="py-20 px-6 bg-slate-900/50">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[1000] mb-4 tracking-tighter">
                            Still depending only on <span className="text-primary">Instagram ads?</span>
                        </h2>
                        <p className="text-slate-300 text-lg font-medium">
                            Here's what we hear from gym owners like you:
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {PAIN_POINTS.map((point, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                                        <point.icon className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg mb-2">{point.title}</h3>
                                        <p className="text-slate-400 text-sm">{point.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="text-center mt-12"
                    >
                        <p className="text-slate-300 mb-6 font-medium">
                            Sound familiar? Let's change this.
                        </p>
                        <button
                            onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-primary text-black font-black rounded-2xl hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest inline-flex items-center gap-2"
                        >
                            List My Gym <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ===== HOW GYMKAANA HELPS ===== */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[1000] mb-4 tracking-tighter">
                            How <span className="text-primary">Gymkaana</span> Helps Your Gym Grow
                        </h2>
                        <p className="text-slate-300 text-lg font-medium">
                            Three simple ways we bring members to your door.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Eye,
                                title: "Get Discovered",
                                desc: "Local fitness users find your gym when searching nearby.",
                                color: "bg-blue-500/20 text-blue-400"
                            },
                            {
                                icon: MessageCircle,
                                title: "Receive Enquiries",
                                desc: "Interested users contact you directly through Gymkaana.",
                                color: "bg-purple-500/20 text-purple-400"
                            },
                            {
                                icon: TrendingUp,
                                title: "Grow Memberships",
                                desc: "Convert interested users into paying members.",
                                color: "bg-primary/20 text-primary"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="text-center"
                            >
                                <div className={`w-20 h-20 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-6`}>
                                    <item.icon size={40} />
                                </div>
                                <h3 className="text-2xl font-[1000] mb-3">{item.title}</h3>
                                <p className="text-slate-400 text-base leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SOCIAL PROOF SECTION ===== */}
            <section className="py-20 px-6 bg-slate-900/50">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[1000] mb-4 tracking-tighter">
                            Trusted by <span className="text-primary">Gym Owners</span> Across India
                        </h2>
                        <p className="text-slate-300 text-lg font-medium">
                            Real stories from real gym owners.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {TESTIMONIALS.map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-800/50 border border-slate-700 p-8 rounded-2xl"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-slate-200 mb-6 italic">"{testimonial.quote}"</p>
                                <div>
                                    <p className="font-black text-sm">{testimonial.gym}</p>
                                    <p className="text-primary text-xs font-bold uppercase tracking-widest">
                                        {testimonial.city} • {testimonial.owner}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-8 text-center border-t border-slate-700 pt-12">
                        <div>
                            <p className="text-4xl font-[1000] text-primary mb-2">500+</p>
                            <p className="text-slate-400 text-sm font-medium">Gym Partners</p>
                        </div>
                        <div>
                            <p className="text-4xl font-[1000] text-primary mb-2">50K+</p>
                            <p className="text-slate-400 text-sm font-medium">Active Members</p>
                        </div>
                        <div>
                            <p className="text-4xl font-[1000] text-primary mb-2">10+</p>
                            <p className="text-slate-400 text-sm font-medium">Indian States</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BENEFITS SECTION ===== */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[1000] mb-4 tracking-tighter">
                            Why Gym Owners Choose <span className="text-primary">Gymkaana</span>
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        {BENEFITS.map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-primary/30 transition-colors"
                            >
                                <CheckCircle2 className="text-primary flex-shrink-0" size={24} />
                                <span className="font-bold text-lg">{benefit}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 p-8 rounded-3xl text-center"
                    >
                        <p className="text-primary font-black uppercase tracking-widest text-sm mb-4">
                            Limited Time Offer
                        </p>
                        <h3 className="text-3xl font-[1000] mb-4">
                            Free Onboarding for Early Partner Gyms
                        </h3>
                        <p className="text-slate-300 text-lg mb-6">
                            Join now and get setup support at no cost.
                        </p>
                        <button
                            onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-4 bg-primary text-black font-black rounded-2xl hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest inline-flex items-center gap-2"
                        >
                            Register Now <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ===== REGISTRATION FORM ===== */}
            <section id="registration" className="py-24 px-6 bg-slate-900/50">
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-[1000] mb-4 tracking-tighter">
                            Get Started in <span className="text-primary">5 Minutes</span>
                        </h2>
                        <p className="text-slate-300 text-lg font-medium">
                            Quick onboarding. Our team will help with the rest.
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        onSubmit={handleFormSubmit}
                        className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-slate-300 mb-3">
                                Gym Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., PowerFlex Gym"
                                value={formData.gymName}
                                onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-slate-900 transition-all text-base font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-slate-300 mb-3">
                                Owner Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Your full name"
                                value={formData.ownerName}
                                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-slate-900 transition-all text-base font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-slate-300 mb-3">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="+91 9876543210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-slate-900 transition-all text-base font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-black uppercase tracking-widest text-slate-300 mb-3">
                                City *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g., Chennai, Bangalore"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-slate-900 transition-all text-base font-medium"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-700">
                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-primary text-black font-black rounded-2xl hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest text-lg shadow-2xl shadow-primary/40"
                            >
                                Register My Gym Now
                            </button>
                            <p className="text-center text-slate-400 text-sm mt-4 font-medium">
                                Our team will contact you shortly to complete onboarding.
                            </p>
                        </div>
                    </motion.form>
                </div>
            </section>

            {/* ===== FAQ SECTION ===== */}
            <section className="py-24 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-[1000] mb-4 tracking-tighter">
                            Frequently Asked <span className="text-primary">Questions</span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {FAQ_ITEMS.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-slate-900/50 border border-slate-700 rounded-xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors text-left"
                                >
                                    <h3 className="font-black text-lg">{item.question}</h3>
                                    <motion.div
                                        animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="text-primary flex-shrink-0" size={24} />
                                    </motion.div>
                                </button>

                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{
                                        height: expandedFaq === i ? "auto" : 0,
                                        opacity: expandedFaq === i ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-6 py-5 text-slate-300 border-t border-slate-700 leading-relaxed">
                                        {item.answer}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FINAL CTA SECTION ===== */}
            <section className="py-32 px-6 bg-gradient-to-b from-slate-900/50 to-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-[1000] mb-6 tracking-tighter leading-[1.1]">
                            Start Growing Your <span className="text-primary italic">Gym</span> with Gymkaana
                        </h2>

                        <p className="text-xl text-slate-300 mb-12 font-medium max-w-xl mx-auto leading-relaxed">
                            Join gyms getting discovered by local fitness users. Limited-time free onboarding available.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <button
                                onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 bg-primary text-black font-black rounded-2xl hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-widest text-lg shadow-2xl shadow-primary/50 flex items-center justify-center gap-2"
                            >
                                Register My Gym <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={openWhatsApp}
                                className="px-10 py-5 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all active:scale-95 uppercase tracking-widest text-lg flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={20} />
                                Chat on WhatsApp
                            </button>
                        </div>

                        <p className="text-slate-400 text-sm font-medium">
                            ✓ Free onboarding • ✓ No credit card • ✓ Setup in 5 minutes
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== BOTTOM MARGIN FOR STICKY BAR ===== */}
            <div className="h-20 md:h-0" />
        </div>
    );
}
