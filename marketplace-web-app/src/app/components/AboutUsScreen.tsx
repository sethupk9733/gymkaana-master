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
                        src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2000"
                        alt="Gymkaana Atmosphere"
                        className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                </div>

                <div className="relative z-10 text-center px-6">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white uppercase mb-6 leading-none"
                    >
                        Redefining <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Fitness Access</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-300 font-bold uppercase tracking-[0.4em] text-xs md:text-sm max-w-2xl mx-auto"
                    >
                        Universal access to the finest fitness venues, powered by intelligent technology.
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 px-6 lg:px-12 bg-white text-black">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">Our Mission</h3>
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight mb-8">
                            WE ARE ON A QUEST TO <span className="text-gray-300">DEMOCRATIZE</span> ELITE WELLNESS.
                        </h2>
                        <p className="text-gray-600 text-lg font-medium leading-relaxed mb-8">
                            Gymkaana was born out of a simple realization: the world's best fitness experiences were often siloed behind restrictive memberships and geographic boundaries. We set out to dissolve those barriers, creating a unified ecosystem where your location or long-term commitments never dictate your potential.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-4xl font-black italic mb-1 text-black">500+</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Partner Venues</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black italic mb-1 text-black">50K+</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Members</div>
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

            {/* Core Values */}
            <section className="py-24 bg-gray-50 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-4">The DNA</h3>
                        <h2 className="text-4xl font-black italic tracking-tighter uppercase">Our Core Principles</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Globe,
                                title: "Universal",
                                desc: "One pass, endless possibilities. Access gyms wherever you go."
                            },
                            {
                                icon: ShieldCheck,
                                title: "Integrity",
                                desc: "Transparent pricing with no hidden fees. Your trust is our currency."
                            },
                            {
                                icon: Zap,
                                title: "Intelligent",
                                desc: "Leveraging data to personalize your fitness journey and optimize results."
                            },
                            {
                                icon: Users,
                                title: "Community",
                                desc: "Uniting fitness enthusiasts and venue owners in a thriving ecosystem."
                            }
                        ].map((value, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                            >
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                                    <value.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-xl font-black italic uppercase tracking-tight mb-3">{value.title}</h4>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-black text-white relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10 px-6">
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-8 leading-none">
                        READY TO JOIN THE <br /> <span className="text-primary">EVOLUTION?</span>
                    </h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onGoHome}
                        className="bg-primary text-white px-12 py-5 rounded-full font-black text-sm uppercase tracking-[0.3em] flex items-center gap-4 mx-auto hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/20"
                    >
                        START EXPLORING <ChevronRight className="w-5 h-5" />
                    </motion.button>
                </div>
                <Dumbbell className="absolute -left-20 -bottom-20 w-96 h-96 text-white/5 rotate-12" />
                <Dumbbell className="absolute -right-20 -top-20 w-96 h-96 text-white/5 -rotate-12" />
            </section>
        </motion.div>
    );
}
