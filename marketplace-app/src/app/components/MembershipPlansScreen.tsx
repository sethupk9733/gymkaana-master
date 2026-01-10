import { ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { fetchPlansByGymId } from "../lib/api";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface Plan {
    id: string;
    name: string;
    price: string;
    duration: string;
    features: string[];
    popular?: boolean;
}

export function MembershipPlansScreen({
    gymId,
    onBack,
    onSelectPlan,
    venueType = "gym"
}: {
    gymId: string | null;
    onBack: () => void;
    onSelectPlan: (planName: string) => void;
    venueType?: "gym" | "other"
}) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (gymId) {
            fetchPlansByGymId(gymId)
                .then(data => {
                    const mappedPlans = data.map((plan: any) => ({
                        id: plan._id,
                        name: plan.name,
                        price: `₹${plan.price}`,
                        duration: `/${plan.duration}`,
                        features: plan.features || [],
                        popular: plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('popular')
                    }));
                    setPlans(mappedPlans);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [gymId]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full bg-white flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Go back">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black uppercase italic tracking-tight">Select your plan</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                <div className="space-y-6 pb-10">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectPlan(plan.name)}
                            className={`relative border rounded-[32px] p-6 transition-all hover:shadow-xl cursor-pointer group ${plan.popular
                                ? 'bg-gray-900 border-gray-900 text-white shadow-2xl scale-[1.02]'
                                : 'bg-white border-gray-100 text-gray-900'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-8 bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                                    <Zap className="w-3 h-3 fill-current" />
                                    Most Popular
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className={`font-black text-xl italic uppercase tracking-tight mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                                        {plan.name}
                                    </h4>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-black italic tracking-tighter">{plan.price}</span>
                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${plan.popular ? 'text-white/40' : 'text-gray-400'}`}>
                                            {plan.duration}
                                        </span>
                                    </div>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${plan.popular ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                </motion.div>
                            </div>

                            <div className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${plan.popular ? 'bg-primary' : 'bg-gray-300'}`} />
                                        <span className={`text-xs font-bold leading-none ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Selection Info Footer */}
            <div className="p-6 bg-white border-t border-gray-50 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    All plans include basic equipment access & support
                </p>
            </div>
        </motion.div>
    );
}
