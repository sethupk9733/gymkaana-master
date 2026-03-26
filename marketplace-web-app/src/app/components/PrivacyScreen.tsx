import { motion } from "motion/react";
import { Shield, Lock, Eye, FileText, ChevronRight, ArrowLeft } from "lucide-react";
import { SEO } from "./SEO";

export function PrivacyScreen({ onBack }: { onBack: () => void }) {
    const sections = [
        {
            icon: Shield,
            title: "1, 2 & 3. Scope & Collection",
            content: "Operated by Vuegam Solutions, this policy applies to Users, Gym Partners, and Visitors. We collect personal info (Name, Phone, Email), account credentials, and platform usage data. We process payments via secure third-party gateways and do not store sensitive card details."
        },
        {
            icon: Lock,
            title: "4 & 5. Usage & Data Sharing",
            content: "Your data powers service management, transaction processing, and user-partner connections. We share info with partners only to enable services and with service providers for hosting or payments. We do not sell your personal data to third parties."
        },
        {
            icon: Eye,
            title: "6, 7 & 8. Security & Retention",
            content: "We use reasonable security measures and secure servers to protect your data. Cookies are used to enhance experience and analyze usage. Data is retained only as long as necessary for legal compliance or business purposes."
        },
        {
            icon: FileText,
            title: "9 - 12. Rights & Governance",
            content: "You have the right to access, update, or delete your account. Services are for users aged 18+. Continued use of the platform after policy updates constitutes acceptance. Links to third-party services are subject to their own privacy standards."
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
                title="Privacy Policy | Gymkaana"
                description="📄 PRIVACY POLICY – GYMKAANA. Operated by Vuegam Solutions. Learn how we collect, use, and protect your personal information."
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
                        Gymkaana <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Privacy</span>
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
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Protocol Status</p>
                        <p className="text-sm font-bold text-gray-900">ACTIVE — SECURE SSL</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Update</p>
                        <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}</p>
                    </div>
                    <button className="px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-black/10">
                        View Full Documentation
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
