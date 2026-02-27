import { motion } from "motion/react";
import { Briefcase, ArrowLeft, Search, BellRing, Sparkles } from "lucide-react";
import { SEO } from "./SEO";

export function CareersScreen({ onBack }: { onBack: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-white"
        >
            <SEO
                title="Careers"
                description="Join the elite team building the future of fitness technology. Explore career opportunities at Gymkaana."
            />
            {/* Header */}
            <div className="pt-32 pb-20 px-6 lg:px-12 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32 opacity-50" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 hover:translate-x-2 transition-transform"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Home
                    </button>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
                        Join the <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Elite</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs max-w-xl">
                        Building the future of fitness technology requires exceptional talent. Are you ready for the mission?
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-gray-100 shadow-sm">
                        <Search className="w-10 h-10 text-gray-300" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 mb-6">No Current Openings</h2>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg mb-12 max-w-2xl mx-auto">
                        Our team is currently at full capacity. However, we are always on the lookout for visionary designers, engineers, and fitness enthusiasts to join our talent pool.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <BellRing className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-2">Talent Alert</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Follow us on LinkedIn to be the first to know about new protocol openings.</p>
                        </div>
                        <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-2">Future Mission</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email your portfolio to careers@gymkaana.com for future consideration.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-24 px-6 lg:px-12 bg-black text-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-primary font-black uppercase italic tracking-widest">High Clearance</h4>
                        <p className="text-gray-400 text-sm font-bold uppercase leading-relaxed">We only hire the top 1% of talent who can handle high-integrity systems.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-primary font-black uppercase italic tracking-widest">Zero Latency</h4>
                        <p className="text-gray-400 text-sm font-bold uppercase leading-relaxed">Speed is our competitive advantage. We build fast, we fail fast, we win fast.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-primary font-black uppercase italic tracking-widest">Global Impact</h4>
                        <p className="text-gray-400 text-sm font-bold uppercase leading-relaxed">Your work will directly influence the fitness journey of millions globally.</p>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
