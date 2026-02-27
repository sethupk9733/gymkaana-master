import { motion } from "motion/react";
import { HelpCircle, ChevronRight, ArrowLeft, MessageCircle, Shield, Zap, CreditCard, Clock, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { SEO } from "./SEO";

export function FAQScreen({ onBack, onContactSupport }: { onBack: () => void; onContactSupport: () => void }) {
    const [activeCategory, setActiveCategory] = useState("General");
    const [showContact, setShowContact] = useState(false);

    const faqs = [
        {
            category: "General",
            questions: [
                {
                    q: "What is Gymkaana?",
                    a: "Gymkaana is a premium fitness marketplace that provides universal access to elite fitness venues including gyms, yoga studios, and specialized training centers through a single unified platform."
                },
                {
                    q: "How do I book a session?",
                    a: "Simply browse through our featured venues, select a membership plan that fits your needs, and proceed to secure checkout. Once activated, you'll receive a digital pass with a QR code for instant entry."
                }
            ]
        },
        {
            category: "Memberships",
            questions: [
                {
                    q: "Can I use multiple gyms with one pass?",
                    a: "Most of our elite protocols are venue-specific to ensure the highest quality experience, but you can manage multiple active memberships across different venues directly from your Profile Hub."
                },
                {
                    q: "How do I cancel my membership?",
                    a: "You can manage or cancel your active subscriptions through the 'Manage Membership' section in your Profile Hub. Cancellations follow our standard security protocols."
                }
            ]
        },
        {
            category: "Payments",
            questions: [
                {
                    q: "Is my payment secure?",
                    a: "Yes. Every transaction is processed through high-integrity encrypted channels (AES-256). We do not store your complete card details on our local servers."
                },
                {
                    q: "What payment methods are supported?",
                    a: "We support all major credit/debit cards, UPI, and digital wallets to ensure a seamless checkout experience."
                }
            ]
        },
        {
            category: "Security",
            questions: [
                {
                    q: "How does the QR pass work?",
                    a: "Your QR code is a live security token. When you arrive at a venue, simply scan it at the front desk. The system instantly verifies your clearance and grants entry."
                },
                {
                    q: "What happens if my QR code doesn't work?",
                    a: "In the rare event of a protocol failure, you can access your booking ID directly from the app or reach out to our Help & Support team for an immediate override."
                }
            ]
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
                title="FAQs & Support"
                description="Find answers to common questions about Gymkaana memberships, bookings, and security protocols."
            />
            {/* Header */}
            <div className="pt-32 pb-20 px-6 lg:px-12 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full -mr-32 -mb-32" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 hover:translate-x-2 transition-transform"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Home
                    </button>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
                        FAQ <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">CENTER</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs max-w-xl">
                        Everything you need to know about the Gymkaana ecosystem and our access protocols.
                    </p>
                </div>
            </div>

            {/* Categories */}
            <section className="py-20 px-6 lg:px-12 bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-4">
                    {faqs.map((f) => (
                        <button
                            key={f.category}
                            onClick={() => setActiveCategory(f.category)}
                            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === f.category
                                ? 'bg-black text-white shadow-xl shadow-black/20'
                                : 'bg-white text-gray-400 hover:text-black border border-gray-100 hover:border-black'
                                }`}
                        >
                            {f.category}
                        </button>
                    ))}
                </div>
            </section>

            {/* Questions */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    {faqs.find(f => f.category === activeCategory)?.questions.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group"
                        >
                            <div className="flex gap-6 items-start mb-4">
                                <div className="w-10 h-10 bg-black text-primary rounded-xl flex items-center justify-center shrink-0 font-black italic text-sm">
                                    Q
                                </div>
                                <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors">
                                    {item.q}
                                </h3>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-10 shrink-0" />
                                <p className="text-gray-500 font-medium leading-relaxed text-lg pb-12 border-b border-gray-100 w-full">
                                    {item.a}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Still Need Help */}
            <section className="py-24 px-6 bg-black text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-primary/30">
                        <MessageCircle className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4">Still need assistance?</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-12">Our help protocols are active 24/7 to ensure your mission success.</p>

                    {!showContact ? (
                        <button
                            onClick={() => setShowContact(true)}
                            className="px-12 py-5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/20"
                        >
                            Contact Support Hub
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
                        >
                            <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 group hover:bg-white/10 transition-all">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Comms Line</p>
                                <p className="text-xl font-black italic uppercase tracking-tighter">+91-81222 20884</p>
                            </div>

                            <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 group hover:bg-white/10 transition-all">
                                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Email Relay</p>
                                <p className="text-lg font-black italic uppercase tracking-tighter break-all">SUPPORT@GYMKAANA.COM</p>
                            </div>

                            <button
                                onClick={onContactSupport}
                                className="p-8 bg-primary rounded-[32px] text-left group hover:scale-[1.02] transition-all shadow-2xl shadow-primary/20"
                            >
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                    <MessageCircle className="w-6 h-6 text-white" />
                                </div>
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-2">Live Support</p>
                                <p className="text-xl font-black italic uppercase tracking-tighter text-white">OPEN CHAT CONSOLE</p>
                            </button>
                        </motion.div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}
