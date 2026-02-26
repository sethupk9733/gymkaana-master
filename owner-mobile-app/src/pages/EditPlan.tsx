import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Clock, FileText, Trash2, Zap, TrendingUp, Percent } from 'lucide-react';
import { fetchGymById, fetchPlansByGymId, updatePlan, deletePlan } from '../lib/api';
import { cn } from '../lib/utils';

export default function EditPlan() {
    const navigate = useNavigate();
    const { id: planId } = useParams();
    const [searchParams] = useSearchParams();
    const gymId = searchParams.get('gymId');
    const [gym, setGym] = useState<any>(null);

    const [loading, setLoading] = useState(false);
    const [planData, setPlanData] = useState({
        name: '',
        price: '',
        duration: '1 Month',
        sessions: '30',
        discount: '0',
        baseDiscount: '0',
        description: ''
    });

    useEffect(() => {
        if (gymId) {
            fetchGymById(gymId).then(setGym);
            fetchPlansByGymId(gymId).then(plans => {
                const plan = plans.find((p: any) => p._id === planId || p.id?.toString() === planId);
                if (plan) {
                    setPlanData({
                        name: plan.name,
                        price: plan.price.toString().replace('₹', '').replace(',', ''),
                        duration: plan.duration,
                        sessions: (plan.sessions || 30).toString(),
                        discount: (plan.discount || 0).toString(),
                        baseDiscount: (plan.baseDiscount || 0).toString(),
                        description: (plan.features || []).join(', ')
                    });
                }
            });
        }
    }, [gymId, planId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePlan(planId!, {
                ...planData,
                price: Number(planData.price),
                sessions: Number(planData.sessions),
                discount: Number(planData.discount),
                baseDiscount: Number(planData.baseDiscount),
                features: planData.description.split(',').map(f => f.trim()).filter(f => f)
            });
            navigate(`/gyms/${gymId}`);
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            setLoading(true);
            try {
                await deletePlan(planId!);
                navigate(`/gyms/${gymId}`);
            } catch (error) {
                console.error('Delete failed:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!gym) return <div className="p-10 text-center">Invalid Gym ID</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto min-h-screen bg-gray-50 pb-20">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Edit Plan</h1>
                        <p className="text-xs text-gray-500">for {gym.name}</p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Plan"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <input
                        type="text"
                        required
                        value={planData.name}
                        onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-primary/100 focus:border-transparent outline-none bg-primary/10/30 text-sm"
                        placeholder="e.g. Gold Membership"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="relative">
                        <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            required
                            value={planData.price}
                            onChange={(e) => setPlanData({ ...planData, price: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none text-sm"
                            placeholder="2500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <select
                                id="duration"
                                title="Plan Duration"
                                value={planData.duration}
                                onChange={(e) => setPlanData({ ...planData, duration: e.target.value })}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none bg-white text-sm"
                            >
                                <option>Daily</option>
                                <option>Weekly (5 days)</option>
                                <option>Weekend (Sat-Sun)</option>
                                <option>1 Month</option>
                                <option>3 Months</option>
                                <option>6 Months</option>
                                <option>1 Year</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sessions Count</label>
                        <div className="relative">
                            <Zap className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                required
                                value={planData.sessions}
                                onChange={(e) => setPlanData({ ...planData, sessions: e.target.value })}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none text-sm"
                                placeholder="30"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Discount (%)</label>
                        <div className="relative">
                            <TrendingUp className="absolute left-3 top-2.5 w-4 h-4 text-primary/100" />
                            <input
                                type="number"
                                value={planData.baseDiscount}
                                onChange={(e) => setPlanData({ ...planData, baseDiscount: e.target.value })}
                                className="w-full pl-9 pr-4 py-2 border border-primary/20 bg-primary/10/20 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none text-sm"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Extra Promo (%)</label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-2.5 w-4 h-4 text-emerald-500" />
                            <input
                                type="number"
                                value={planData.discount}
                                onChange={(e) => setPlanData({ ...planData, discount: e.target.value })}
                                className="w-full pl-9 pr-4 py-2 border border-emerald-100 bg-emerald-50/20 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Yield Preview */}
                {gym && planData.price && planData.sessions && (
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-emerald-50 border border-primary/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Yield Analytics
                            </span>
                            {(() => {
                                const p = Number(planData.price);
                                const s = Number(planData.sessions);
                                const d = Number(planData.discount || 0);
                                const dayVal = gym.baseDayPassPrice * s;
                                if (dayVal <= 0) return null;

                                const finalP = Math.round(p * (1 - d / 100));
                                const totalSave = Math.round((1 - (finalP / dayVal)) * 100);

                                return (
                                    <div className="text-right">
                                        <p className="text-lg font-black text-gray-900 italic">₹{finalP.toLocaleString()}</p>
                                        <p className="text-[9px] font-black text-emerald-600 uppercase italic">
                                            {totalSave}% Saving vs Day Pass
                                        </p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                            rows={3}
                            value={planData.description}
                            onChange={(e) => setPlanData({ ...planData, description: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none resize-none text-sm"
                            placeholder="Gym Access, Lockers, Personal Trainer..."
                        ></textarea>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                        "w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:bg-secondary transition-all mt-4",
                        loading && "opacity-70"
                    )}
                >
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
