import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText, ChevronRight, ArrowLeft } from "lucide-react";
import { SEO } from "./SEO";

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
    const sections = [
        {
            icon: Shield,
            title: "Data Safeguarding",
            content: "We employ industry-grade encryption (AES-256) to ensure your personal identity and biometric data are never compromised. Our systems undergo rigorous penetration testing to maintain maximum security integrity."
        },
        {
            icon: Lock,
            title: "Access Control",
            content: "Your fitness history and location data are accessible only by authorized protocols. We use multi-factor authentication for all administrative access to the user database."
        },
        {
            icon: Eye,
            title: "Privacy Transparency",
            content: "We do not sell your personal data to third parties. Data sharing is limited to partner venues only when you authorize a check-in or booking procedure."
        },
        {
            icon: FileText,
            title: "Compliance Protocol",
            content: "Gymkaana is fully compliant with global data protection standards (GDPR/CCPA equivalent). You have the right to request a complete purge of your records at any time."
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
                title="Privacy Policy"
                description="Understand how Gymkaana protects your data integrity and biometric information through high-grade encryption and strict access protocols."
            />
            {/* Header */}
            <div className="pt-32 pb-20 px-6 lg:px-12 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 hover:translate-x-2 transition-transform"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Intelligence
                    </button>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
                        Privacy & <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Security</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs max-w-xl">
                        Our commitment to your data integrity is absolute. Explore the protocols that keep your fitness journey secure.
                    </p>
                </div>
            </div>

            {/* Sections */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto space-y-20">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 30, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col md:flex-row gap-12 items-start"
                        >
                            <div className="w-20 h-20 bg-gray-50 rounded-[28px] flex items-center justify-center shrink-0 border border-gray-100 shadow-sm">
                                <section.icon className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">{section.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    {section.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Last Updated */}
            <div className="py-20 border-t border-gray-100 px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Protocol Version</p>
                        <p className="text-sm font-bold text-gray-900">v2.4.0 (Enhanced Encryption)</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last System Audit</p>
                        <p className="text-sm font-bold text-gray-900">February 2026</p>
                    </div>
                    <button className="px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10">
                        Download Full Documentation
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
