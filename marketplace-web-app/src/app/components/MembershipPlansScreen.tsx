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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full pb-20"
        >
            {/* Page Header */}
            <div className="bg-white border-b border-gray-100 py-12 mb-12">
                <div className="px-6 max-w-7xl mx-auto text-center">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Gym Details
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-gray-900 uppercase mb-4">
                        Choose Your <span className="text-primary">Plan</span>
                    </h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-xl mx-auto">
                        Unlock your potential with premium facilities and expert guidance
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectPlan(plan.name)}
                            className={`relative border rounded-[32px] p-8 transition-all hover:-translate-y-2 hover:shadow-2xl cursor-pointer group flex flex-col ${plan.popular
                                ? 'bg-gray-900 border-gray-900 text-white shadow-xl ring-4 ring-primary/20 scale-105 z-10'
                                : 'bg-white border-gray-100 text-gray-900 hover:border-gray-300'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                                    <Zap className="w-3 h-3 fill-current" />
                                    Most Popular
                                </div>
                            )}

                            <div className="flex flex-col items-center text-center mb-8">
                                <h4 className={`font-black text-2xl italic uppercase tracking-tight mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                                    {plan.name}
                                </h4>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-5xl font-black italic tracking-tighter">{plan.price}</span>
                                    <span className={`text-xs uppercase font-bold tracking-widest ${plan.popular ? 'text-white/40' : 'text-gray-400'}`}>
                                        {plan.duration}
                                    </span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-colors ${plan.popular
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                >
                                    Select Plan
                                </motion.button>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div className={`h-px w-full my-4 ${plan.popular ? 'bg-white/10' : 'bg-gray-100'}`} />
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-white/10 text-primary' : 'bg-gray-100 text-black'}`}>
                                            <CheckCircle2 className="w-3 h-3" />
                                        </div>
                                        <span className={`text-sm font-bold leading-tight ${plan.popular ? 'text-white/80' : 'text-gray-600'}`}>
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Selection Info Footer */}
                <div className="py-12 text-center">
                    <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                        All plans include basic equipment access & support
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
