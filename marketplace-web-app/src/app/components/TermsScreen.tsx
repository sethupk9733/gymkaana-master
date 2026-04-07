import { motion } from "motion/react";
import { FileText, ArrowLeft, ShieldCheck, Scale, AlertCircle } from "lucide-react";
import { SEO } from "./SEO";

export function TermsScreen({ onBack }: { onBack: () => void }) {
    const sections = [
        {
            icon: Scale,
            title: "1. Acceptance of Protocol",
            content: "By accessing the Gymkaana ecosystem, you agree to abide by our unified access protocols and operational guidelines. Any unauthorized override of system security is strictly prohibited."
        },
        {
            icon: ShieldCheck,
            title: "2. Membership Integrity",
            content: "All memberships are venue-specific and non-transferable. Users must present a live QR pass for every check-in procedure. Identity verification may be required by venue command staff."
        },
        {
            icon: AlertCircle,
            title: "3. Booking Liability",
            content: "Gymkaana facilitates the connection between users and fitness venues. While we maintain high clearance standards for all partners, the specific liability for physical safety remains with the venue operative."
        },
        {
            icon: FileText,
            title: "4. Cancellation & Refunds",
            content: "Cancellation available within 1hr of booking or before check-in. Refund protocols are processed through encrypted financial channels and may take 5-7 standard operational days."
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
                title="Terms of Service"
                description="Review the legal framework and operational standards governing the Gymkaana fitness ecosystem. Information on bookings, memberships, and liability."
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
                        Terms of <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Service</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs max-w-xl">
                        Legal framework and operational standards governing the Gymkaana fitness ecosystem.
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
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">Last Protocol Update</p>
                        <p className="text-sm font-bold text-gray-900">FEBRUARY 05, 2026 — VERSION 4.1.2</p>
                    </div>
                </div>
            </section>
        </motion.div>
    );
}
