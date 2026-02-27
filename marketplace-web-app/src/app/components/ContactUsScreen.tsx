import { motion } from "motion/react";
import { Mail, Phone, MessageCircle, MapPin, Clock, ArrowLeft, Globe, ShieldCheck } from "lucide-react";
import { SEO } from "./SEO";

export function ContactUsScreen({ onBack, onLiveChat }: { onBack: () => void; onLiveChat: () => void }) {
    const contactMethods = [
        {
            icon: Phone,
            title: "Voice Protocol",
            detail: "+91-81222 20884",
            sub: "Mon - Sat, 9AM - 8PM",
            action: "Call HQ"
        },
        {
            icon: Mail,
            title: "Digital Relay",
            detail: "SUPPORT@GYMKAANA.COM",
            sub: "24/7 Monitoring",
            action: "Send Message"
        },
        {
            icon: MapPin,
            title: "Physical HQ",
            detail: "Pollachi, Coimbatore",
            sub: "Tamil Nadu, India",
            action: "View Map"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-white"
        >
            <SEO
                title="Contact Strategy"
                description="Connect with Gymkaana headquarters. High-priority support channels for users and strategic partners."
            />
            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6 lg:px-12 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-32 -mt-32 opacity-50" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full -ml-16 -mb-16 opacity-30" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 hover:translate-x-2 transition-transform"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Home
                    </button>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
                        Contact <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Strategy</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs max-w-xl">
                        Direct communication channels for technical support, venue partnerships, and corporate inquiries.
                    </p>
                </div>
            </div>

            {/* Contact Grid */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactMethods.map((method, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 group hover:bg-black transition-all duration-500"
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-10 shadow-sm group-hover:bg-primary transition-colors">
                                    <method.icon className="w-8 h-8 text-black group-hover:text-white" />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 group-hover:text-primary transition-colors">{method.title}</h3>
                                <p className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-white transition-colors mb-2 break-all">{method.detail}</p>
                                <p className="text-xs font-bold text-gray-400 mb-10 group-hover:text-gray-500 transition-colors uppercase tracking-widest">{method.sub}</p>

                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary border-b-2 border-primary/20 pb-1 group-hover:border-primary transition-all">
                                    {method.action}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Chat CTA - The "Command Console" */}
            <section className="py-24 px-6 lg:px-12 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-black rounded-[60px] p-10 md:p-20 relative overflow-hidden group">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-xl text-center md:text-left">
                                <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Connectivity Active</span>
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 leading-none">
                                    Universal <br /> <span className="text-primary italic">Live Support</span>
                                </h2>
                                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs leading-relaxed">
                                    Initiate a secure session with our high-clearance support team for immediate technical and operational overrides.
                                </p>
                            </div>

                            <button
                                onClick={onLiveChat}
                                className="w-full md:w-auto px-16 py-8 bg-primary text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 group"
                            >
                                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                Initialize Console
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-20 px-6 border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:opacity-50 transition-all">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Secure Link</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Globe className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Ops</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Zero Latency</span>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
