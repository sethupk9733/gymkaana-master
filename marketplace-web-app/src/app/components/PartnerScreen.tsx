import { motion } from "motion/react";
import { Building2, ArrowLeft, CheckCircle2, Rocket, BarChart3, Users, ExternalLink, ShieldCheck } from "lucide-react";
import { SEO } from "./SEO";
import { OWNER_URL } from "../config/api";

export function PartnerScreen({ onBack }: { onBack: () => void }) {
    const joinSteps = [
        {
            icon: Rocket,
            title: "Initialize Strategy",
            description: "Submit your venue details through our high-integrity onboarding portal for protocol verification."
        },
        {
            icon: ShieldCheck,
            title: "Quality Clearance",
            description: "Our mission specialists will perform a venue audit to ensure alignment with Gymkaana's elite standards."
        },
        {
            icon: BarChart3,
            title: "Deploy & Scale",
            description: "Once activated, your venue instantly goes live to our global user base with real-time analytics."
        }
    ];

    const checklist = [
        "Legal Business Documentation",
        "High-Resolution Venue Photography",
        "Verified Safety & Hygiene Protocols",
        "Detailed Equipment & Amenity Inventory",
        "Operational Hour Synchronization",
        "Standardized Membership Pricing Structure"
    ];

    const benefits = [
        { title: "Universal Visibility", desc: "Gain instant access to a premium demographic of fitness enthusiasts." },
        { title: "Protocol Automation", desc: "Automated check-ins, bookings, and financial settlements." },
        { title: "Live Analytics", desc: "Deep insights into user behavior and revenue trends." }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full min-h-screen bg-white"
        >
            <SEO
                title="Partner Alliance"
                description="List your gym or fitness studio on Gymkaana. Access the Owner Portal to join our elite network and grow your business."
            />
            {/* Hero Section */}
            <div className="pt-32 pb-20 px-6 lg:px-12 bg-black text-white relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full -ml-32 -mt-32 opacity-50" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-8 hover:translate-x-2 transition-transform"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Home
                    </button>
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none mb-6">
                        Partner <br /> <span className="text-primary underline decoration-white decoration-8 underline-offset-[12px]">Alliance</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs max-w-xl">
                        Integrate your venue into the world's most advanced fitness marketplace and unlock a new dimension of growth.
                    </p>
                </div>
            </div>

            {/* How to Join */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-12">
                            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter">Strategic Onboarding</h2>
                            <div className="space-y-10">
                                {joinSteps.map((step, idx) => (
                                    <div key={idx} className="flex gap-6">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                            <step.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{step.title}</h3>
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <div className="bg-black rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl" />
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8 text-primary">Onboarding Checklist</h3>
                                <div className="space-y-6">
                                    {checklist.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <div className="w-5 h-5 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary transition-colors">
                                                <CheckCircle2 className="w-3 h-3 text-primary group-hover:text-black" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partner with Us Benefits */}
            <section className="py-24 px-6 lg:px-12 bg-gray-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="p-10 bg-white rounded-[40px] border border-gray-100 hover:border-black transition-all">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 text-gray-900">{benefit.title}</h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] leading-loose">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6 lg:px-12 bg-black text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <Building2 className="w-20 h-20 text-primary mx-auto mb-10 opacity-50" />
                    <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-8 italic">Ready to Initialize?</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs mb-16 leading-relaxed">
                        Access the Gymkaana Owner Portal to begin your application and join our elite network of fitness venues.
                    </p>
                    <button
                        onClick={() => window.open(OWNER_URL, '_blank')}
                        className="px-16 py-8 bg-primary text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 mx-auto group"
                    >
                        Access Owner Portal
                        <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                </div>
            </section>
        </motion.div>
    );
}
