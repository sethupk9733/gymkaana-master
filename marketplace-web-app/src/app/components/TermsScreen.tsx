import { motion } from "motion/react";
import { FileText, ArrowLeft, ShieldCheck, Scale, AlertCircle } from "lucide-react";
import { SEO } from "./SEO";

export function TermsScreen({ onBack }: { onBack: () => void }) {
    const sections = [
        {
            icon: Scale,
            title: "1 & 2. Introduction & Platform Scope",
            content: "Gymkaana is a digital platform operated by Vuegam Solutions. We connect users with gyms and fitness centers while providing management tools for our gym partners. We do not own, operate, or control the fitness centers listed."
        },
        {
            icon: ShieldCheck,
            title: "3, 4 & 5. Eligibility & Account Security",
            content: "Users must be 18+ and provide accurate data. You are responsible for account confidentiality. Gymkaana provides gym discovery, membership tools, and business analytics for partners."
        },
        {
            icon: AlertCircle,
            title: "6 & 7. Payments, Pricing & Refunds",
            content: "Payments are processed through secure gateways. Gymkaana may charge platform fees and commissions. Refunds are subject to our Refund Policy, gym partner policies, and usage timing."
        },
        {
            icon: Scale,
            title: "8 & 9. Duties & User Conduct",
            content: "Gym partners must honor services and maintain hygiene. Users must not use the platform for illegal activities, hack the system, or upload misleading information."
        },
        {
            icon: ShieldCheck,
            title: "10, 11 & 12. Intellectual Property & Liability",
            content: "All content belongs to Vuegam Solutions. We are not liable for injuries at gym locations, service issues by partners, or third-party service failures. Use is at your own risk."
        },
        {
            icon: FileText,
            title: "13 - 17. Legal, Termination & Privacy",
            content: "You agree to indemnify Vuegam Solutions. We reserve the right to terminate accounts for misuse. These terms are governed by the laws of India, subject to courts in Tamil Nadu."
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
                title="Terms of Service | Gymkaana"
                description="📄 TERMS & CONDITIONS – GYMKAANA. Operated by Vuegam Solutions. Review our 17-point legal framework for users and partners."
            />
            {/* Header */}
            <div className="pt-32 pb-20 px-6 lg:px-12 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -ml-32 -mb-32" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 hover:translate-x-2 transition-transform"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Home
                    </button>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
                        Gymkaana <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Agreement</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs max-w-xl">
                        Official Terms & Conditions – Powered by Vuegam Solutions.
                    </p>
                </div>
            </div>

            {/* Content */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto space-y-16">
                    {sections.map((section, idx) => (
                        <div key={idx} className="group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-primary transition-all">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">{section.title}</h3>
                            </div>
                            <p className="text-gray-600 font-medium leading-relaxed text-lg pl-14">
                                {section.content}
                            </p>
                        </div>
                    ))}

                    <div className="pt-20 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Last Legal Update</p>
                        <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).toUpperCase()} — VUEGAM SOLUTIONS PROTOCOL</p>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
