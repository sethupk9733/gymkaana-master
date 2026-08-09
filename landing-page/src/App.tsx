import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Dumbbell, MapPin, Search, ShieldCheck, Zap, ArrowRight, CheckCircle2,
    Star, Smartphone, ChevronDown, Users, BarChart3, Globe, QrCode,
    Calendar, Clock, Heart, Flame, Trophy, Target, Activity
} from "lucide-react";
import { Button } from "./components/Button";
import { SEO } from "./components/SEO";
import { VenueCard } from "./components/VenueCard";
import OwnerLandingPage from "./OwnerLandingPage";
import { BlogSection } from "./components/BlogSection";


// ─── Data ─────────────────────────────────────────────────────────────────────

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

const CATEGORIES = [
    { name: "Gym", emoji: "🏋️", color: "#4F7CFF", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400" },
    { name: "Yoga", emoji: "🧘", color: "#00D4FF", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400" },
    { name: "Swimming", emoji: "🏊", color: "#00C27A", img: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=400" },
    { name: "Boxing", emoji: "🥊", color: "#FF6B6B", img: "https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?auto=format&fit=crop&q=80&w=400" },
    { name: "Pilates", emoji: "🤸", color: "#F7B731", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400" },
    { name: "Zumba", emoji: "💃", color: "#FD9644", img: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&q=80&w=400" },
    { name: "CrossFit", emoji: "⚡", color: "#A55EEA", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=400" },
    { name: "HIIT", emoji: "🔥", color: "#FF5252", img: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=400" },
    { name: "Calisthenics", emoji: "🤼", color: "#26de81", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400" },
    { name: "Strength", emoji: "💪", color: "#FC5C65", img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=400" },
    { name: "Functional", emoji: "🎯", color: "#45AAF2", img: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&q=80&w=400" },
    { name: "Sports", emoji: "⚽", color: "#0FB9B1", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400" },
];

const TESTIMONIALS = [
    { text: "Gymkaana changed how I workout. I pick a gym based on mood and location. The flexible plans are exactly what I needed.", author: "Rahul S.", role: "Marathon Runner" },
    { text: "Starting my yoga journey was so easy. I compared five studios and booked in seconds. Better prices than offline!", author: "Priya M.", role: "Yoga Enthusiast" },
    { text: "Everything is seamless. The check-in is super fast — I just show my QR code and I'm in. No questions asked.", author: "Arjun K.", role: "Bodybuilder" },
    { text: "The Daily Passport is revolutionary. CrossFit on Monday, Yoga Wednesday, Boxing Friday. All from one app.", author: "Sneha R.", role: "Fitness Explorer" },
    { text: "Finally a platform that treats fitness seriously. Premium gyms, great UI, and instant booking.", author: "Dev P.", role: "CrossFit Athlete" },
    { text: "QR check-in works like magic. My gym sees me scan and I walk straight in. No paperwork, no wait.", author: "Meena K.", role: "Pilates Instructor" },
];

const GALLERY = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1579126038374-6064e9370f0f?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1549824506-3d9d0c5b59c8?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&q=80&w=500",
];

const HOW_IT_WORKS = [
    { step: "01", title: "Discover", desc: "Search gyms by location, discipline, or amenity near you.", icon: Search, color: "#4F7CFF" },
    { step: "02", title: "Choose Pass", desc: "Pick from Daily, Weekly or Monthly access passes.", icon: QrCode, color: "#00D4FF" },
    { step: "03", title: "Book", desc: "Secure checkout in seconds. No hidden fees.", icon: CheckCircle2, color: "#00C27A" },
    { step: "04", title: "Scan & Enter", desc: "Show your QR at the gym door and walk right in.", icon: Zap, color: "#A3E635" },
    { step: "05", title: "Train Hard", desc: "Get your best workout with top-tier facilities.", icon: Flame, color: "#FF6B6B" },
    { step: "06", title: "Repeat", desc: "Build a habit. Track your progress. Earn rewards.", icon: Trophy, color: "#F7B731" },
];

// ─── URLs ──────────────────────────────────────────────────────────────────────
const URLS = {
    MARKETPLACE: import.meta.env.VITE_MARKETPLACE_URL || "https://app.gymkaana.com",
    OWNER: import.meta.env.VITE_OWNER_URL || "https://owner.gymkaana.com",
    API: import.meta.env.VITE_API_URL || "https://api.gymkaana.com/api",
};

// ─── Counter hook ──────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!active) return;
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 80));
        const timer = setInterval(() => {
            cur = Math.min(cur + step, target);
            setCount(cur);
            if (cur >= target) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [active, target]);
    return count;
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
    // All hooks unconditionally at top
    const [liveGyms, setLiveGyms] = useState<any[]>([]);
    const [liveCategories, setLiveCategories] = useState<any[]>([]);
    const [liveCities, setLiveCities] = useState<any[]>([]);
    const [liveStats, setLiveStats] = useState<any>(null);
    const [loadingGyms, setLoadingGyms] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocus, setSearchFocus] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);

    // Determine owner landing before hooks only for routing — computed, not a hook
    const isOwnerLanding = (() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("type") === "owner" || params.get("mode") === "owner") return true;
        if (params.get("utm_source")?.includes("owner") || params.get("utm_campaign")?.includes("owner")) return true;
        return false;
    })();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (isOwnerLanding) return;
        const ctrl = new AbortController();
        const tid = setTimeout(() => ctrl.abort(), 8000);

        fetch(`${URLS.API}/landing/data?_t=${Date.now()}`, { signal: ctrl.signal })
            .then(r => r.ok ? r.json() : null)
            .then(data => {
                if (data && data.success) {
                    if (data.featuredGyms?.length) setLiveGyms(data.featuredGyms);
                    if (data.categories?.length) setLiveCategories(data.categories);
                    if (data.cities?.length) setLiveCities(data.cities);
                    if (data.stats) setLiveStats(data.stats);
                }
            })
            .catch(err => {
                console.log('Landing dynamic fetch fallback:', err);
            })
            .finally(() => {
                clearTimeout(tid);
                setLoadingGyms(false);
            });

        return () => ctrl.abort();
    }, [isOwnerLanding]);


    // Early return AFTER all hooks
    if (isOwnerLanding) return <OwnerLandingPage />;

    const displayGyms = liveGyms.length > 0 ? liveGyms : FEATURED_GYMS;
    const displayCategories = liveCategories.length > 0 ? liveCategories : CATEGORIES;
    const onExplore = () => { window.location.href = `${URLS.MARKETPLACE}?screen=home&action=explore`; };

    const onListGym = () => { window.location.href = `${URLS.OWNER}?action=onboard`; };
    const onGymSelect = (id: string) => { window.location.href = `${URLS.MARKETPLACE}?screen=details&gym=${id}`; };

    const BG = "#080808";
    const BG2 = "#111111";
    const ACCENT = "#4F7CFF";
    const GREEN = "#A3E635";

    return (
        <div style={{ background: BG, color: "#fff", fontFamily: "Inter, system-ui, sans-serif", overflowX: "hidden" }}>
            <SEO
                title="Discover Top Gyms & Fitness Centers"
                description="The ultimate fitness marketplace. Find, compare, and book the best gyms near you. Get flexible memberships and start your fitness journey today."
            />

            {/* ── Scroll progress bar ── */}
            <ScrollBar />

            {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
            <header style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
                height: "72px",
                background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
                backdropFilter: scrolled ? "blur(24px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
                transition: "all 0.4s ease",
                display: "flex", alignItems: "center",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ cursor: "pointer", transform: "skewX(-12deg)" }} onClick={() => window.location.href = "/"}>
                        <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.06em", textTransform: "uppercase" }}>
                            <span style={{ color: "#fff" }}>GYM</span>
                            <span style={{ color: GREEN, fontStyle: "italic" }}>KAA</span>
                            <span style={{ color: "#fff" }}>NA</span>
                        </span>
                    </div>
                    <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
                        {[["#how-it-works", "How It Works"], ["#gyms", "Gyms"], ["#blogs", "Blogs & Journal"], ["#faq", "FAQ"]].map(([href, label]) => (
                            <a key={href} href={href} style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none", transition: "color 0.2s" }}

                                onMouseOver={e => (e.currentTarget.style.color = GREEN)}
                                onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                            >{label}</a>
                        ))}
                    </nav>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <a href={URLS.OWNER} style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none" }}>Owner Portal</a>
                        <a href={`${URLS.MARKETPLACE}?action=login`} style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none", marginLeft: 8 }}>Sign In</a>
                        <a href={`${URLS.MARKETPLACE}?screen=home&action=explore`}
                            style={{ background: GREEN, color: "#000", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em", textDecoration: "none", padding: "10px 20px", borderRadius: 100, marginLeft: 8, display: "flex", alignItems: "center", gap: 6 }}>
                            <Zap size={12} /> Explore
                        </a>
                    </div>
                </div>
            </header>

            {/* ══ HERO ════════════════════════════════════════════════════ */}
            <section id="features" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 80, overflow: "hidden" }}>
                {/* Background Base */}
                <div style={{ position: "absolute", inset: 0, background: BG }} />

                {/* Aurora blobs (subtle) */}
                <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 700, height: 600, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(79,124,255,0.12) 0%, transparent 60%)", filter: "blur(100px)", animation: "aurora 15s ease-in-out infinite" }} />
                <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(163,230,53,0.08) 0%, transparent 60%)", filter: "blur(100px)", animation: "aurora 18s ease-in-out infinite 2s" }} />

                <div style={{ maxWidth: 1280, margin: "0 auto", width: "100%", padding: "40px 24px 80px", position: "relative", zIndex: 2 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 64, alignItems: "center", justifyContent: "space-between" }}>
                        
                        {/* LEFT COLUMN: Typography & CTAs */}
                        <div style={{ flex: "1 1 480px", minWidth: 320, display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", gap: 32 }}>
                            {/* Badge */}
                            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, background: "rgba(79,124,255,0.08)", border: "1px solid rgba(79,124,255,0.2)", color: ACCENT, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                                <Zap size={12} style={{ color: GREEN }} /> The Future of Fitness
                            </motion.div>

                            {/* Headline */}
                            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{ fontSize: "clamp(48px, 6.5vw, 84px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, margin: 0 }}>
                                <span style={{ color: "#fff" }}>Train anywhere.</span>
                                <br />
                                <span style={{ background: "linear-gradient(135deg, #4F7CFF, #00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>No limits.</span>
                            </motion.h1>

                            {/* Subheadline */}
                            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{ fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
                                Access thousands of premium gyms, yoga studios, and CrossFit boxes with a single membership. Your fitness, your rules.
                            </motion.p>

                            {/* CTAs */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 8 }}>
                                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href={`${URLS.MARKETPLACE}?screen=home&action=explore`}
                                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "18px 36px", borderRadius: 20, background: `linear-gradient(135deg, ${GREEN}, #00C27A)`, color: "#000", fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none", boxShadow: "0 20px 40px rgba(163,230,53,0.2)" }}>
                                    <Zap size={16} /> Explore Gyms <ArrowRight size={16} />
                                </motion.a>
                                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href={`${URLS.OWNER}?action=onboard`}
                                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "18px 36px", borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>
                                    Partner With Us
                                </motion.a>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
                                style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", marginTop: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: -8 }}>
                                    {["https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/44.jpg", "https://randomuser.me/api/portraits/men/85.jpg", "https://randomuser.me/api/portraits/women/68.jpg"].map((src, i) => (
                                        <img key={i} src={src} alt="User" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #080808", marginLeft: i === 0 ? 0 : -12, zIndex: 10 - i }} />
                                    ))}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        {[1,2,3,4,5].map(i => <Star key={i} size={12} style={{ fill: "#FBBF24", color: "#FBBF24" }} />)}
                                    </div>
                                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700, marginTop: 2 }}>Trusted by 12,000+ athletes</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN: Interactive / Floating Visuals */}
                        <div style={{ flex: "1 1 400px", position: "relative", height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {/* Main Video Card */}
                            <motion.div 
                                initial={{ opacity: 0, y: 40, rotate: -4 }} 
                                animate={{ opacity: 1, y: 0, rotate: -2 }} 
                                transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 360, height: 500, borderRadius: 32, overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}
                            >
                                <video autoPlay loop muted playsInline src="https://assets.mixkit.co/videos/preview/mixkit-working-out-with-dumbbells-in-the-gym-4475-large.mp4" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)" }} />
                                <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN, boxShadow: `0 0 12px ${GREEN}` }} />
                                        <span style={{ color: "#fff", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Workout</span>
                                    </div>
                                    <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>High Intensity Interval Training</h3>
                                </div>
                            </motion.div>

                            {/* Floating Card 1: Gym Pass */}
                            <motion.div 
                                initial={{ opacity: 0, x: 40, y: 20 }} 
                                animate={{ opacity: 1, x: 0, y: [0, -10, 0] }} 
                                transition={{ opacity: { delay: 0.5, duration: 0.8 }, y: { delay: 0.5, duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                                style={{ position: "absolute", top: 80, right: -10, zIndex: 3, width: 230, padding: 20, borderRadius: 24, background: "rgba(20,20,20,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${ACCENT}, #00D4FF)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <QrCode size={20} color="#fff" />
                                    </div>
                                    <div>
                                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px" }}>Access Pass</p>
                                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 900, margin: 0 }}>Daily Passport</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ color: GREEN, fontSize: 12, fontWeight: 800 }}>Active</span>
                                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 700 }}>Ends 11:59 PM</span>
                                </div>
                            </motion.div>

                            {/* Floating Card 2: Stats */}
                            <motion.div 
                                initial={{ opacity: 0, x: -40, y: 20 }} 
                                animate={{ opacity: 1, x: 0, y: [0, 10, 0] }} 
                                transition={{ opacity: { delay: 0.7, duration: 0.8 }, y: { delay: 0.7, duration: 7, repeat: Infinity, ease: "easeInOut" } }}
                                style={{ position: "absolute", bottom: 60, left: -20, zIndex: 3, width: 240, padding: 20, borderRadius: 24, background: "rgba(20,20,20,0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(163,230,53,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Activity size={20} color={GREEN} />
                                    </div>
                                    <div>
                                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px" }}>Calories Burned</p>
                                        <p style={{ color: "#fff", fontSize: 18, fontWeight: 900, margin: 0 }}>1,240 <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>kcal</span></p>
                                    </div>
                                </div>
                                <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden", marginTop: 12 }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }} style={{ height: "100%", background: GREEN }} />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ══ STATS ═══════════════════════════════════════════════════ */}
            <section ref={statsRef} style={{ background: BG2, borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "64px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32, textAlign: "center" }}>
                    {[
                        { val: liveStats?.partnerGyms || liveStats?.totalGyms || 500, suf: "+", label: "Partner Gyms" },
                        { val: liveStats?.workoutCategories || 15, suf: "+", label: "Workout Categories" },
                        { val: liveStats?.citiesCovered || 8, suf: "+", label: "Cities" },
                        { val: liveStats?.activeMembers || 12400, suf: "+", label: "Active Members" },
                    ].map((s, i) => {
                        const numVal = typeof s.val === "number" ? s.val : parseInt(String(s.val).replace(/\D/g,"")) || 0;
                        return <StatCard key={i} value={numVal} suffix={s.suf} label={s.label} active={statsVisible} />;
                    })}
                </div>
            </section>

            {/* ══ CATEGORIES ══════════════════════════════════════════════ */}
            <section style={{ padding: "80px 0" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 32px" }}>
                    <SectionBadge color={ACCENT} icon={<Activity size={12} />} label="Fitness Disciplines" />
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "16px 0 8px" }}>
                        Every Workout. <span style={{ background: "linear-gradient(135deg,#4F7CFF,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>One Platform.</span>
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 17 }}>From Yoga to MMA, Swimming to CrossFit — find the discipline that moves you.</p>
                </div>
                <div style={{ overflowX: "auto", paddingBottom: 16, scrollbarWidth: "none" }}>
                    <div style={{ display: "flex", gap: 16, padding: "0 24px", width: "max-content" }}>
                        {displayCategories.map((cat, i) => (

                            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                                onClick={() => window.location.href = `${URLS.MARKETPLACE}?screen=home&q=${cat.name}`}
                                style={{ width: 160, height: 220, borderRadius: 20, overflow: "hidden", position: "relative", cursor: "pointer", flexShrink: 0, border: "1px solid rgba(255,255,255,0.07)" }}>
                                <img src={cat.img} alt={cat.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)` }} />
                                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px" }}>
                                    <div style={{ fontSize: 24, marginBottom: 4 }}>{cat.emoji}</div>
                                    <p style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", color: "#fff", margin: 0 }}>{cat.name}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
            <section id="how-it-works" style={{ background: BG2, padding: "80px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <SectionBadge color="#00C27A" icon={<Target size={12} />} label="The Gymkaana Way" />
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "16px 0 8px" }}>How It Works</h2>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 17 }}>Your fitness transformation is just six simple steps away.</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                        {HOW_IT_WORKS.map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                style={{ padding: 32, borderRadius: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: 12, right: 16, fontSize: 52, fontWeight: 900, color: "rgba(255,255,255,0.04)", userSelect: "none" }}>{s.step}</div>
                                <div style={{ width: 52, height: 52, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: `${s.color}1a`, border: `1px solid ${s.color}33`, marginBottom: 20 }}>
                                    <s.icon size={22} style={{ color: s.color }} />
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", marginBottom: 8 }}>{s.title}</h3>
                                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FEATURED GYMS ═══════════════════════════════════════════ */}
            <section id="gyms" style={{ padding: "80px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
                        <div>
                            <SectionBadge color="#FFA500" icon={<Star size={12} />} label="Featured Venues" />
                            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "16px 0 8px" }}>Explore Featured Venues</h2>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, margin: 0 }}>Hand-picked premium fitness studios achieving 5-star results.</p>
                        </div>
                        <a href={`${URLS.MARKETPLACE}?screen=home&action=explore`} style={{ display: "flex", alignItems: "center", gap: 6, color: GREEN, fontWeight: 900, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.1em", textDecoration: "none" }}>
                            View All <ArrowRight size={16} />
                        </a>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                        {loadingGyms ? [1,2,3].map(i => (
                            <div key={i} style={{ aspectRatio: "4/3", borderRadius: 24, background: "rgba(255,255,255,0.04)", animation: "pulse 1.5s ease-in-out infinite" }} />
                        )) : displayGyms.map((gym, i) => (
                            <motion.div key={gym._id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <VenueCard gym={gym} onClick={() => onGymSelect(gym._id)} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ PASS TYPES ══════════════════════════════════════════════ */}
            <section style={{ background: BG2, padding: "80px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <SectionBadge color="#00D4FF" icon={<QrCode size={12} />} label="Membership Passes" />
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "16px 0 8px" }}>
                            Choose Your <span style={{ background: "linear-gradient(135deg,#4F7CFF,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Access Pass</span>
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 17 }}>Flexible plans for every fitness lifestyle. No long-term commitments.</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 960, margin: "0 auto" }}>
                        {[
                            { type: "Daily Pass", icon: "🎫", color: ACCENT, features: ["1 Day Access", "Any Partner Gym", "QR Check-in", "No Commitment"], cta: true },
                            { type: "Weekly Pass", icon: "📅", color: GREEN, features: ["7 Day Access", "Unlimited Venues", "QR Check-in", "Streak Tracking"], badge: "Most Popular", cta: true },
                            { type: "Monthly Pass", icon: "💎", color: "#FFA500", features: ["30 Day Access", "Premium Venues", "Priority Booking", "Rewards Points"], badge: "Coming Soon", cta: false },
                        ].map((pass, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                                style={{ padding: 32, borderRadius: 24, background: `${pass.color}09`, border: `1px solid ${pass.color}25`, position: "relative" }}>
                                {pass.badge && (
                                    <div style={{ position: "absolute", top: 16, right: 16, padding: "4px 12px", borderRadius: 100, background: `${pass.color}20`, border: `1px solid ${pass.color}40`, color: pass.color, fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                        {pass.badge}
                                    </div>
                                )}
                                <div style={{ fontSize: 36, marginBottom: 16 }}>{pass.icon}</div>
                                <div style={{ width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: `${pass.color}18`, border: `1px solid ${pass.color}30`, marginBottom: 20 }}>
                                    <QrCode size={26} style={{ color: pass.color }} />
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{pass.type}</h3>
                                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 8 }}>
                                    {pass.features.map(f => (
                                        <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                                            <CheckCircle2 size={13} style={{ color: pass.color, flexShrink: 0 }} /> {f}
                                        </li>
                                    ))}
                                </ul>
                                {pass.cta && (
                                    <button onClick={onExplore} style={{ width: "100%", padding: "12px", borderRadius: 16, background: `${pass.color}18`, border: `1px solid ${pass.color}40`, color: pass.color, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>
                                        Get Pass →
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ GALLERY ══════════════════════════════════════════════════ */}
            <section style={{ padding: "80px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto 48px" }}>
                    <SectionBadge color={GREEN} icon={<Heart size={12} />} label="Fitness Gallery" />
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "16px 0 0" }}>
                        Live the <span style={{ background: `linear-gradient(135deg,${GREEN},#00C27A)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Fit Life</span>
                    </h2>
                </div>
                <div style={{ maxWidth: 1200, margin: "0 auto", columns: "4 200px", columnGap: 16 }}>
                    {GALLERY.map((src, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: (i % 4) * 0.08 }}
                            style={{ breakInside: "avoid", marginBottom: 16, borderRadius: 18, overflow: "hidden", position: "relative" }}>
                            <img src={src} loading="lazy" alt="Fitness" style={{ width: "100%", display: "block", aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/3" : "1/1" }} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ══ TESTIMONIALS ═════════════════════════════════════════════ */}
            <section style={{ background: BG2, padding: "80px 0", overflow: "hidden" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto 48px", padding: "0 24px", textAlign: "center" }}>
                    <SectionBadge color="#FFA500" icon={<Users size={12} />} label="Community Love" />
                    <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", margin: "16px 0 8px" }}>Loved by Thousands</h2>
                    <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8 }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={16} style={{ fill: "#FBBF24", color: "#FBBF24" }} />)}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 20, padding: "0 24px", overflowX: "auto", scrollbarWidth: "none" }}>
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                        <div key={i} style={{ width: 320, flexShrink: 0, padding: 32, borderRadius: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", position: "relative" }}>
                            <div style={{ position: "absolute", top: -16, left: 28, width: 36, height: 36, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(79,124,255,0.2)", border: "1px solid rgba(79,124,255,0.3)", color: ACCENT, fontSize: 18, fontWeight: 900 }}>"</div>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.6)", fontStyle: "italic", marginBottom: 24 }}>"{t.text}"</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#4F7CFF,#00D4FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900 }}>
                                    {t.author.split(" ").map(w => w[0]).join("")}
                                </div>
                                <div>
                                    <p style={{ fontWeight: 900, fontSize: 14, margin: "0 0 2px" }}>{t.author}</p>
                                    <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: ACCENT, margin: 0 }}>{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ APP PROMO ════════════════════════════════════════════════ */}
            <section style={{ padding: "80px 24px", textAlign: "center" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 100, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 28 }}>Coming Soon</div>
                    <h2 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
                        Your Fitness,<br />
                        <span style={{ background: `linear-gradient(135deg,${GREEN},#00C27A)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>In Your Pocket.</span>
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>We're building the most advanced fitness app. Track sessions, manage passes, and earn rewards while you train.</p>
                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        {["App Store", "Google Play"].map(label => (
                            <button key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>
                                <Smartphone size={18} /> {label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FAQ ══════════════════════════════════════════════════════ */}
            <section id="faq" style={{ background: BG2, padding: "80px 24px" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 12 }}>Got Questions?</h2>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 17 }}>Everything you need to know about the platform.</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {[
                            { q: "Is Gymkaana a gym itself?", a: "No, Gymkaana is a marketplace that connects you with hundreds of independent gyms and studios in your area." },
                            { q: "How do I check in at the gym?", a: "Once you book a pass, you'll receive a unique QR code. Simply show it to the gym's reception to get verified instantly." },
                            { q: "Can I cancel my membership anytime?", a: "Yes! Most of our plans are flexible. You can cancel upcoming sessions or non-recurring passes directly from your profile." },
                            { q: "How much does it cost?", a: "Pricing varies by gym and plan. We aggregate the best deals from our partners so you can choose what fits your budget." }
                        ].map((faq, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                                style={{ padding: "28px 32px", borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <h4 style={{ fontSize: 16, fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.01em", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    {faq.q} <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }} />
                                </h4>
                                <p style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0, fontSize: 14 }}>{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ FINAL CTA ════════════════════════════════════════════════ */}
            <section style={{ padding: "80px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(79,124,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 48px", borderRadius: 40, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center", position: "relative", backdropFilter: "blur(40px)" }}>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h2 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
                            Start Your <span style={{ background: `linear-gradient(135deg,${GREEN},#00C27A)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Fitness</span><br />Journey Today.
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 17, marginBottom: 40 }}>Create your account and find your first workout in seconds.</p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <button onClick={onExplore} style={{ padding: "16px 40px", borderRadius: 18, background: `linear-gradient(135deg,${GREEN},#00C27A)`, color: "#000", fontWeight: 900, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer", border: "none", boxShadow: "0 0 40px rgba(163,230,53,0.3)" }}>Explore Now</button>
                            <button onClick={onListGym} style={{ padding: "16px 40px", borderRadius: 18, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontWeight: 900, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>List Business</button>
                        </div>
                    </motion.div>
                    <div style={{ position: "absolute", top: 0, right: 0, padding: 40, opacity: 0.03, pointerEvents: "none" }}>
                        <Dumbbell size={280} strokeWidth={0.5} />
                    </div>
                </div>
            </section>

            {/* ══ BLOGS SECTION ════════════════════════════════════════════ */}
            <BlogSection />

            {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
            <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "64px 24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 40, marginBottom: 48 }}>
                        <div style={{ cursor: "pointer", transform: "skewX(-12deg)" }} onClick={() => window.location.href = "/"}>
                            <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.06em", textTransform: "uppercase" }}>
                                <span style={{ color: "#fff" }}>GYM</span>
                                <span style={{ color: GREEN, fontStyle: "italic" }}>KAA</span>
                                <span style={{ color: "#fff" }}>NA</span>
                            </span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px" }}>
                            {[
                                { label: "About Us", href: `${URLS.MARKETPLACE}?screen=about` },
                                { label: "Blogs & Journal", href: "#blogs" },
                                { label: "Explore Venues", href: `${URLS.MARKETPLACE}?screen=home&action=explore` },
                                { label: "Partner Program", href: `${URLS.OWNER}?action=onboard` },
                                { label: "Owner Portal", href: URLS.OWNER },
                                { label: "Privacy & Security", href: `${URLS.MARKETPLACE}?screen=privacy` },
                                { label: "Terms of Service", href: `${URLS.MARKETPLACE}?screen=terms` },
                                { label: "Help & FAQs", href: "#faq" },
                            ].map(link => (

                                <a key={link.label} href={link.href} style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none" }}
                                    onMouseOver={e => (e.currentTarget.style.color = GREEN)}
                                    onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                                >{link.label}</a>
                            ))}
                        </div>
                    </div>
                    <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(79,124,255,0.4), rgba(163,230,53,0.4), transparent)", marginBottom: 32 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.25em", margin: 0 }}>
                            © {new Date().getFullYear()} Vuegam Solutions. All rights reserved. Protocol v2.4.0
                        </p>
                        <div style={{ display: "flex", gap: 28 }}>
                            {["Facebook", "Instagram", "Twitter", "Youtube"].map(s => (
                                <button key={s} style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em", background: "none", border: "none", cursor: "pointer" }}
                                    onMouseOver={e => (e.currentTarget.style.color = GREEN)}
                                    onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                                >{s}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Aurora animation keyframes */}
            <style>{`
                @keyframes aurora { 0%,100%{transform:translate(0%,0%) scale(1)} 33%{transform:translate(3%,-4%) scale(1.05)} 66%{transform:translate(-2%,3%) scale(0.95)} }
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 4px; height: 4px; }
                ::-webkit-scrollbar-track { background: #080808; }
                ::-webkit-scrollbar-thumb { background: rgba(79,124,255,0.4); border-radius: 4px; }
            `}</style>
        </div>
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ScrollBar() {
    const [w, setW] = useState(0);
    useEffect(() => {
        const fn = () => {
            const doc = document.documentElement;
            setW((window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100);
        };
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);
    return <div style={{ position: "fixed", top: 0, left: 0, width: `${w}%`, height: 2, background: "linear-gradient(90deg,#4F7CFF,#00D4FF,#A3E635)", zIndex: 99999 }} />;
}

function SectionBadge({ color, icon, label }: { color: string; icon: React.ReactNode; label: string }) {
    return (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 100, background: `${color}12`, border: `1px solid ${color}25`, color, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.15em" }}>
            {icon} {label}
        </div>
    );
}

function StatCard({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
    const count = useCountUp(value, active);
    return (
        <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8, color: "#fff" }}>
                {count.toLocaleString()}<span style={{ color: "#4F7CFF" }}>{suffix}</span>
            </p>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", margin: 0 }}>{label}</p>
        </div>
    );
}
