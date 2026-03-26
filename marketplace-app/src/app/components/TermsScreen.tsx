import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck, FileText, Scale, AlertCircle, Info, UserCheck, CreditCard, ShieldAlert, Gavel } from "lucide-react";

export function TermsScreen({ onBack }: { onBack: () => void }) {
    const sections = [
        {
            icon: Info,
            title: "1. Introduction",
            content: "Welcome to Gymkaana, a digital platform operated by Vuegam Solutions (“Company”, “we”, “us”, “our”). Gymkaana connects users with gyms and provides tools for partners to manage operations."
        },
        {
            icon: Scale,
            title: "2. About Gymkaana",
            content: "Gymkaana is a marketplace and SaaS platform for gym discovery and digital management. We do not own, operate, or control any fitness centers listed on the Platform."
        },
        {
            icon: UserCheck,
            title: "3. Eligibility & 4. Accounts",
            content: "You must be 18+ and provide accurate data. You are responsible for account confidentiality. We reserve the right to suspend accounts in case of misuse."
        },
        {
            icon: FileText,
            title: "5. Services",
            content: "For users: discovery and membership tools. For partners: management, payment tracking, and analytics."
        },
        {
            icon: CreditCard,
            title: "6. Payments & 7. Refunds",
            content: "Secure third-party processing. We may charge platform fees or commissions. Refunds depend on usage, partner policies, and cancellation timing."
        },
        {
            icon: ShieldCheck,
            title: "8. Partner Obligations",
            content: "Partners must honor memberships, provide accurate info, and maintain safety standards. Gymkaana is not responsible for gym service quality."
        },
        {
            icon: ShieldAlert,
            title: "9. User Conduct",
            content: "No illegal activities, fraudulent bookings, or platform disruption. False information is strictly prohibited."
        },
        {
            icon: Scale,
            title: "10 - 13. Liability & IP",
            content: "IP belongs to Vuegam Solutions. We are not liable for gym injuries, partner service issues, or payment delays. Indemnity applies to misuse of the platform."
        },
        {
            icon: Gavel,
            title: "14 - 17. Governance",
            content: "Accounts may be terminated for breach. Indian Governing Law applies. Disputes are subject to the jurisdiction of Tamil Nadu courts."
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="h-full bg-white flex flex-col"
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center gap-4">
                <button
                    title="Back"
                    onClick={onBack}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold">Terms & Conditions</h2>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Official Agreement</p>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Gymkaana <br />Protocol</h1>
                </div>

                <div className="space-y-8">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-900">
                                <section.icon className="w-5 h-5 text-primary" />
                                <h3 className="font-black text-sm uppercase tracking-tight italic">{section.title}</h3>
                            </div>
                            <p className="text-xs text-gray-500 font-medium leading-relaxed pl-8">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="pt-10 border-t border-gray-100 pb-10">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2 text-center">Last Updated: MARCH 2026</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">© VUEGAM SOLUTIONS. ALL RIGHTS RESERVED.</p>
                </div>
            </div>
        </motion.div>
    );
}
