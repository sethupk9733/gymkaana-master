import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, CheckSquare, Square, Percent } from 'lucide-react';
import { fetchGymById, fetchPlansByGymId, updatePlan, deletePlan } from '../lib/api';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function MembershipPlans() {
    const { id: gymId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [gym, setGym] = useState<any>(null);
    const [plans, setPlans] = useState<any[]>([]);
    const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
    const [bulkDiscountMode, setBulkDiscountMode] = useState(false);
    const [bulkDiscountValue, setBulkDiscountValue] = useState("");

    useEffect(() => {
        if (gymId) {
            Promise.all([
                fetchGymById(gymId),
                fetchPlansByGymId(gymId)
            ]).then(([gymData, plansData]) => {
                setGym(gymData);
                const hydratedPlans = plansData.map((p: any) => ({ ...p, id: p.id || p._id }));
                setPlans(hydratedPlans);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [gymId]);

    const toggleSelection = (id: string) => {
        setSelectedPlans(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleBulkDiscount = async () => {
        const discount = Number(bulkDiscountValue);
        if (isNaN(discount) || discount < 0 || discount > 100) {
            alert("Enter valid % (0-100)");
            return;
        }

        if (!confirm(`Apply extra ${discount}% to ${selectedPlans.length} plans?`)) return;

        setLoading(true);
        try {
            await Promise.all(selectedPlans.map(id => updatePlan(id, { discount })));
            setPlans(plans.map(p => selectedPlans.includes(p.id) ? { ...p, discount } : p));
            setSelectedPlans([]);
            setBulkDiscountMode(false);
            setBulkDiscountValue("");
        } catch (err) {
            alert("Failed to apply bulk discount");
        } finally {
            setLoading(false);
        }
    };

    const togglePlan = async (planId: string, currentEnabled: boolean) => {
        try {
            await updatePlan(planId, { enabled: !currentEnabled });
            setPlans(plans.map(plan =>
                plan.id === planId ? { ...plan, enabled: !currentEnabled } : plan
            ));
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleDeletePlan = async (planId: string) => {
        if (confirm('Are you sure you want to delete this plan?')) {
            try {
                await deletePlan(planId);
                setPlans(plans.filter(p => p.id !== planId));
            } catch (err) {
                alert("Delete failed");
            }
        }
    };

    const filteredPlans = plans.filter(plan =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(plan.price).includes(searchQuery)
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    if (!gym) return <div className="p-8 text-center">Gym Not Found</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-40">
            {/* Header */}
            <div className="bg-white border-b-2 border-gray-100 px-6 py-4 sticky top-0 z-20">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Membership Plans</h1>
                        <p className="text-xs font-bold text-gray-400">{gym.name}</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search pricing tiers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 h-12 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:border-black transition-all placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/plans/create?gymId=${gymId}`)}
                    className="w-full h-14 bg-black text-white rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-black/20"
                >
                    <Plus className="w-4 h-4" />
                    Create New Tier
                </motion.button>

                <div className="space-y-4">
                    {filteredPlans.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 bg-white rounded-[32px] border-2 border-gray-100">
                            <p className="text-xs font-black uppercase tracking-widest">No plans found</p>
                        </div>
                    ) : (
                        filteredPlans.map((plan) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => toggleSelection(plan.id)}
                                className={cn(
                                    "bg-white border-2 rounded-[32px] p-6 transition-all relative overflow-hidden group mb-4",
                                    plan.enabled !== false ? "border-gray-100 shadow-sm" : "border-gray-100 opacity-60 grayscale bg-gray-50",
                                    selectedPlans.includes(plan.id) ? "border-primary/100 bg-primary/10/20 ring-2 ring-primary/100/10" : ""
                                )}
                            >
                                <div className="absolute top-6 left-4">
                                    {selectedPlans.includes(plan.id) ? (
                                        <CheckSquare className="w-4 h-4 text-primary" />
                                    ) : (
                                        <Square className="w-4 h-4 text-gray-300" />
                                    )}
                                </div>

                                <div className="pl-6">
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-black italic uppercase tracking-tighter text-gray-900">{plan.name}</h3>
                                                {plan.discount > 0 && (
                                                    <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                                                        <Percent size={8} /> {plan.discount}% EXTRA
                                                    </span>
                                                )}
                                            </div>
                                            <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500">
                                                {plan.duration}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black italic tracking-tighter text-gray-900">₹{plan.price}</p>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Inc. Taxes</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-50 relative z-10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); togglePlan(plan.id, plan.enabled !== false); }}
                                            className={cn(
                                                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                                                plan.enabled !== false ? "text-emerald-600" : "text-gray-400"
                                            )}
                                        >
                                            {plan.enabled !== false ? (
                                                <ToggleRight className="w-6 h-6" />
                                            ) : (
                                                <ToggleLeft className="w-6 h-6" />
                                            )}
                                            {plan.enabled !== false ? "Live" : "Disabled"}
                                        </button>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); navigate(`/plans/${plan.id}/edit?gymId=${gymId}`); }}
                                                className="p-2 rounded-xl bg-gray-50 text-gray-600 border border-gray-100"
                                                title="Edit Tier"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }}
                                                className="p-2 rounded-xl bg-red-50 text-red-500 border border-red-100"
                                                title="Delete Tier"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedPlans.length > 0 && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-6 left-6 right-6 z-50"
                    >
                        <div className="bg-black text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4 border border-white/10">
                            <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">{selectedPlans.length} SELECTED</p>
                                {bulkDiscountMode ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            placeholder="%"
                                            className="w-16 h-8 bg-white/10 border border-white/20 rounded-lg text-xs px-2 focus:outline-none font-bold"
                                            value={bulkDiscountValue}
                                            onChange={(e) => setBulkDiscountValue(e.target.value)}
                                        />
                                        <button onClick={handleBulkDiscount} className="px-3 py-1 bg-primary/100 text-white rounded-lg text-[10px] font-black uppercase">APPLY</button>
                                        <button onClick={() => setBulkDiscountMode(false)} className="text-[10px] font-black uppercase opacity-50 px-2">ESC</button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button onClick={() => setBulkDiscountMode(true)} className="px-3 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Percent className="w-3 h-3" /> EXTRA DISCOUNT
                                        </button>
                                        <button onClick={() => setSelectedPlans([])} className="text-[10px] font-black uppercase opacity-50">CLEAR</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
