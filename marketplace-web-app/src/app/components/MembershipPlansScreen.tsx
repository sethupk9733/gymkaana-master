import { ArrowLeft, CheckCircle2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { fetchPlansByGymId, fetchGymById } from "../lib/api";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface Plan {
    id: string;
    name: string;
    price: string;
    planBasePrice: string;
    dayPassTotal: string;
    showDayPassStrike: boolean;
    showPlanBaseStrike: boolean;
    dayPassPrice: number;
    duration: string;
    features: string[];
    popular?: boolean;
    savingsLabel?: string | null;
    extraDiscountLabel?: string | null;
    promoDiscount: number;
    stage1Discount: number;
    stage2Discount: number;
}

export function MembershipPlansScreen({
    gymId,
    onBack,
    onSelectPlan,
    venueType = "gym"
}: {
    gymId: string | null;
    onBack: () => void;
    onSelectPlan: (plan: any) => void;
    venueType?: "gym" | "other"
}) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (gymId) {
            Promise.all([
                fetchPlansByGymId(gymId),
                fetchGymById(gymId)
            ])
                .then(([plansData, gymData]) => {
                    const mappedPlans = plansData.map((plan: any) => {
                        const planBasePrice = plan.price;
                        const promoDiscount = plan.discount || 0;
                        const finalPriceValue = Math.round(planBasePrice * (1 - promoDiscount / 100));
                        const dayPassTotal = (gymData.baseDayPassPrice || 0) * (plan.sessions || 1);

                        let savingsLabel = null;
                        let extraDiscountLabel = null;

                        if (dayPassTotal > 0 && plan.sessions > 1) {
                            const totalSavingPercent = Math.round((1 - (finalPriceValue / dayPassTotal)) * 100);
                            if (totalSavingPercent > 0) {
                                savingsLabel = `${totalSavingPercent}% TOTAL SAVINGS`;
                            }
                        }

                        if (promoDiscount > 0) {
                            extraDiscountLabel = `${promoDiscount}% EXTRA DISCOUNT`;
                        }

                        return {
                            id: plan._id,
                            name: plan.name,
                            price: `₹${finalPriceValue.toLocaleString()}`,
                            planBasePrice: `₹${planBasePrice.toLocaleString()}`,
                            dayPassTotal: `₹${dayPassTotal.toLocaleString()}`,
                            showDayPassStrike: dayPassTotal > planBasePrice,
                            showPlanBaseStrike: promoDiscount > 0,
                            dayPassPrice: gymData.baseDayPassPrice,
                            duration: `/${plan.duration}`,
                            sessions: plan.sessions,
                            features: plan.features || [],
                            popular: plan.name.toLowerCase().includes('pro') || plan.name.toLowerCase().includes('popular'),
                            savingsLabel,
                            extraDiscountLabel,
                            promoDiscount,
                            stage1Discount: dayPassTotal > 0 ? Math.round((1 - (planBasePrice / dayPassTotal)) * 100) : 0,
                            stage2Discount: promoDiscount
                        };
                    });
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
            <div className="bg-background border-b border-border py-12 mb-12">
                <div className="px-6 max-w-7xl mx-auto text-center">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest hover:text-foreground mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Gym Details
                    </button>
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-foreground uppercase mb-4">
                        Choose Your <span className="text-primary">Plan</span>
                    </h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest max-w-xl mx-auto">
                        Unlock your potential with premium facilities and expert guidance
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <div className="px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => {
                                localStorage.setItem('last_selected_plan', JSON.stringify(plan));
                                onSelectPlan(plan);
                            }}
                            className={`relative border rounded-[40px] p-10 transition-all hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] cursor-pointer group flex flex-col ${plan.popular
                                ? 'bg-secondary border-secondary text-white shadow-2xl scale-105 z-10'
                                : 'bg-white border-border/60 text-secondary hover:border-primary'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-8 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 italic">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="flex flex-col items-center text-center mb-10">
                                <h4 className={`font-black text-3xl italic uppercase tracking-tighter mb-4 ${plan.popular ? 'text-primary' : 'text-secondary'}`}>
                                    {plan.name}
                                </h4>
                                <div className="flex flex-col items-center gap-2 mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-7xl font-black italic tracking-tighter">{plan.price}</span>
                                        <span className={`text-[10px] uppercase font-bold tracking-[0.2em] opacity-40 uppercase`}>
                                            {plan.duration}
                                        </span>
                                    </div>

                                    {/* Discount Badges */}
                                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                                        {plan.stage1Discount > 0 && (
                                            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">
                                                {plan.stage1Discount}% OFF
                                            </span>
                                        )}
                                        {plan.stage2Discount > 0 && (
                                            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic">
                                                EXTRA {plan.stage2Discount}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl italic ${plan.popular
                                        ? 'bg-primary text-white shadow-primary/30'
                                        : 'bg-secondary text-white hover:bg-primary'
                                        }`}
                                >
                                    BOOK NOW
                                </motion.button>
                            </div>

                            <div className="space-y-5 flex-1 pt-8 border-t border-current/10">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-muted text-secondary'}`}>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className={`text-[11px] font-bold leading-tight uppercase tracking-wider ${plan.popular ? 'text-white/80' : 'text-secondary/70'}`}>
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
