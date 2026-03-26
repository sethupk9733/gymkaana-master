import { motion } from "motion/react";
import { Award, Users, Globe, Target, ChevronRight, Dumbbell, ShieldCheck, Zap } from "lucide-react";
import { SEO } from "./SEO";

export function AboutUsScreen({ onGoHome }: { onGoHome: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
        >
            <SEO
                title="About Us"
                description="Learn about Gymkaana's mission to democratize elite wellness through universal access to the finest fitness venues."
            />
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-black">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000"
                        alt="Gymkaana Atmosphere"
                        className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                </div>

                <div className="relative z-10 text-center px-6">
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4 mb-8"
                    >
                        <p className="text-primary font-black uppercase tracking-[0.5em] text-xs">A Product of Vuegam Solutions</p>
                        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
                            Simplifying <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Fitness Discovery</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Who We Are */}
            <section className="py-24 px-6 lg:px-12 bg-white text-black">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Who We Are</h3>
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight mb-8">
                            BUILT TO SIMPLIFY <span className="text-gray-300">DISCOVERY & ACCESS.</span>
                        </h2>
                        <p className="text-gray-600 text-lg font-medium leading-relaxed mb-8">
                            Gymkaana is a digital fitness platform built to simplify how people discover, access, and manage gym memberships. We are a product of **Vuegam Solutions**, a technology-driven company focused on building smart solutions for real-world problems in fitness, retail, and supply chain.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="text-2xl font-black italic mb-1 text-black">ACCESSIBLE</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Our Core Goal</div>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="text-2xl font-black italic mb-1 text-black">EFFICIENT</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Our Methodology</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-[48px] overflow-hidden bg-gray-100 border-8 border-white shadow-2xl rotate-3 relative z-10">
                            <img
                                src="https://images.unsplash.com/photo-1571902258032-72175ad23db3?q=80&w=1000"
                                alt="Modern Gym"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="absolute inset-0 bg-primary/10 rounded-[48px] rotate-[-3deg] -z-0 translate-x-4 translate-y-4" />
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className="py-24 bg-gray-50 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Ecosystem</h3>
                        <h2 className="text-5xl font-black italic tracking-tighter uppercase">What We Deliver</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Users */}
                        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Users className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="text-2xl font-black italic uppercase italic">For Seekers</h4>
                            <ul className="space-y-4">
                                {["Discover local venues", "Compare Pricing & Ratings", "Seamless Membership Purchase", "Centralized Subscription Management"].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm font-bold text-gray-500 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Partners */}
                        <div className="bg-black p-10 rounded-[40px] shadow-2xl space-y-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Target className="w-8 h-8 text-primary" />
                            </div>
                            <h4 className="text-2xl font-black italic uppercase italic text-white">For Owners</h4>
                            <ul className="space-y-4">
                                {["Digitized Membership Management", "Automated Payout Tracking", "Enhanced Visibility & Growth", "Operations Control Suite"].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm font-bold text-gray-400 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Transparency */}
            <section className="py-24 px-6 lg:px-12 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center justify-between">
                    <div className="max-w-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Trust Protocol</h3>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-8">CLEAN. SECURE. TRANSPARENT.</h2>
                        <p className="text-gray-600 font-medium leading-relaxed">
                            We noticed a major gap in the fitness industry: No centralized platform, manual management, and zero transparency. Gymkaana solves this by prioritizing verified listings and secure payments for a reliable user experience.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                        <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col items-center gap-4 text-center">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">VERIFIED LISTINGS</span>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col items-center gap-4 text-center">
                            <Zap className="w-8 h-8 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">SECURE PAYMENTS</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-black text-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-8 leading-none">
                        SMARTER CONNECTED <br /> <span className="text-primary">ECOSYSTEM.</span>
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onGoHome}
                        className="bg-primary text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.3em] flex items-center gap-4 mx-auto hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/20"
                    >
                        EXPLORER MODE <ChevronRight className="w-5 h-5" />
                    </motion.button>
                </div>
                <Dumbbell className="absolute -left-20 -bottom-20 w-96 h-96 text-white/5 rotate-12" />
                <Dumbbell className="absolute -right-20 -top-20 w-96 h-96 text-white/5 -rotate-12" />
            </section>
        </motion.div>
    );
}
