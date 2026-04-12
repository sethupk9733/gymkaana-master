import { motion } from "motion/react";
import { ArrowLeft, RefreshCcw, XCircle, ShieldCheck, Clock, CreditCard, AlertTriangle, FileText, Scale } from "lucide-react";
import { SEO } from "./SEO";

export function RefundScreen({ onBack }: { onBack: () => void }) {
    const sections = [
        {
            icon: RefreshCcw,
            title: "1 & 2. Introduction & Services",
            content: "This policy applies to all transactions on Gymkaana (Vuegam Solutions). We provide membership purchases, subscription fitness, and partner gym access. Services are time-bound, making refunds subject to specific conditions."
        },
        {
            icon: XCircle,
            title: "3. Cancellation Policy",
            content: "Users: Cancellations allowed only BEFORE activation. Once a membership is activated or partially used, no cancellation is permitted. Subscriptions: Can be cancelled anytime, but no refund for the remaining period."
        },
        {
            icon: ShieldCheck,
            title: "4 & 5. Refund Eligibility & Partner Duties",
            content: "Eligible for duplicate payments, technical delivery failures, or partner inability to serve. Ineligible for change of mind, partial usage, or expired passes. Gym partners are responsible for service delivery."
        },
        {
            icon: Clock,
            title: "6 & 7. Process & Timeline",
            content: "Requests must be made within 48 hours of transaction with proof. Approved refunds are processed within 5–7 working days to the original payment method. Gymkaana reserves all rights for verification."
        },
        {
            icon: CreditCard,
            title: "8 & 9. Charges & Fraud",
            content: "Platform fees or gateway charges may be non-refundable. Deductions may apply. Gymkaana reserves the right to reject requests or suspend accounts in case of suspected fraud or system abuse."
        },
        {
            icon: Scale,
            title: "10. Policy Evolution",
            content: "Gymkaana may update this policy at any time without prior notice. Users are advised to review it periodically as part of our transparent operational commitment."
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
                title="Refund & Cancellation Policy | Gymkaana"
                description="📄 REFUND & CANCELLATION POLICY – GYMKAANA. Operated by Vuegam Solutions. Review our protocols for user cancellations and refund eligibility."
            />
            {/* Header */}
            <div className="pt-32 pb-20 px-6 lg:px-12 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/10 blur-[100px] rounded-full -ml-32 -mb-32" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 mb-8 hover:translate-x-2 transition-transform"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Home
                    </button>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
                        Refund <br /> <span className="text-red-500 underline decoration-white decoration-8 underline-offset-[12px]">Policy</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs max-w-xl">
                        Operational protocols for transaction cancellations and refund disbursements.
                    </p>
                </div>
            </div>

            {/* Content */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-4xl mx-auto space-y-16">
                    {sections.map((section, idx) => (
                        <div key={idx} className="group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-red-500 transition-all text-gray-500 group-hover:rotate-6">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">{section.title}</h3>
                            </div>
                            <p className="text-gray-600 font-medium leading-relaxed text-lg pl-14 border-l-2 border-gray-100 ml-6">
                                {section.content}
                            </p>
                        </div>
                    ))}

                    <div className="pt-20 border-t border-gray-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Last Updated</p>
                            <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).toUpperCase()} — VUEGAM SOLUTIONS</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-gray-100" />
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
