import { useState, useEffect } from 'react';
import { ArrowLeft, IndianRupee, Clock, FileText, Trash2, Zap, TrendingUp } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { fetchPlanById, updatePlan, deletePlan, fetchGymById } from "../lib/api";

interface EditPlanProps {
    planId: string;
    onBack: () => void;
}

export function EditPlan({ planId, onBack }: EditPlanProps) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [gym, setGym] = useState<any>(null);
    const [formData, setFormData] = useState({
        gymId: '',
        name: '',
        price: '',
        duration: '',
        sessions: '',
        discount: '0',
        baseDiscount: '0',
        description: ''
    });

    useEffect(() => {
        fetchPlanById(planId)
            .then(async data => {
                setFormData({
                    gymId: data.gymId?._id || data.gymId || '',
                    name: data.name,
                    price: String(data.price),
                    duration: data.duration,
                    sessions: String(data.sessions || '30'),
                    discount: String(data.discount || '0'),
                    baseDiscount: String(data.baseDiscount || '0'),
                    description: (data.features || []).join(', ')
                });

                // Fetch gym for discount calculation
                const gId = data.gymId?._id || data.gymId;
                if (gId) {
                    const gymData = await fetchGymById(gId);
                    setGym(gymData);
                }

                setFetching(false);
            })
            .catch(err => {
                console.error(err);
                alert("Failed to fetch plan details");
                onBack();
            });
    }, [planId]);

    // Auto-calculate base discount when price or sessions change
    useEffect(() => {
        if (gym && gym.baseDayPassPrice > 0 && formData.price && formData.sessions) {
            const price = Number(formData.price);
            const sessions = Number(formData.sessions);
            const totalDayValue = gym.baseDayPassPrice * sessions;

            if (totalDayValue > 0) {
                const calculated = Math.round((1 - (price / totalDayValue)) * 100);
                setFormData(prev => ({ ...prev, baseDiscount: String(Math.max(0, calculated)) }));
            }
        }
    }, [formData.price, formData.sessions, gym?.baseDayPassPrice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePlan(planId, {
                ...formData,
                price: Number(formData.price),
                sessions: Number(formData.sessions),
                discount: Number(formData.discount),
                baseDiscount: Number(formData.baseDiscount),
                features: formData.description.split(',').map(f => f.trim()).filter(f => f)
            });
            onBack();
        } catch (err) {
            console.error(err);
            alert("Failed to update plan");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this plan?")) {
            setLoading(true);
            try {
                await deletePlan(planId);
                onBack();
            } catch (err) {
                console.error(err);
                alert("Failed to delete plan");
                setLoading(false);
            }
        }
    };

    if (fetching) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors" title="Go back">
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Edit Plan</h1>
                            <p className="text-sm text-gray-500">Update membership details</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center text-sm font-medium"
                        disabled={loading}
                    >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete Plan
                    </button>
                </div>
            </div>

            <div className="p-6 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Name</label>
                        <Input
                            type="text"
                            required
                            className="h-11 border-gray-300"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="number"
                                    required
                                    className="pl-9 h-11 border-gray-300"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Sessions / Days Count</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="number"
                                    required
                                    className="pl-9 h-11 border-gray-300"
                                    value={formData.sessions}
                                    onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1.5">Display Duration</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    id="duration"
                                    title="Select Duration"
                                    className="w-full pl-9 pr-4 h-11 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Base Discount from Day Pass (%)</label>
                            <div className="relative">
                                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                                <Input
                                    type="number"
                                    className="pl-9 h-11 border-blue-100 bg-blue-50/30 focus:bg-white transition-all"
                                    placeholder="e.g. 30"
                                    value={formData.baseDiscount}
                                    onChange={(e) => setFormData({ ...formData, baseDiscount: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Extra Promo Discount (%)</label>
                            <div className="relative">
                                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                <Input
                                    type="number"
                                    className="pl-9 h-11 border-emerald-100 bg-emerald-50/30 focus:bg-white transition-all"
                                    placeholder="e.g. 10"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Discount Preview */}
                    {gym && gym.baseDayPassPrice > 0 && formData.price && formData.sessions && (
                        <div className="p-5 bg-gradient-to-br from-indigo-50 to-emerald-50 border border-emerald-100 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3" /> Yield Analytics
                                </span>
                                {(() => {
                                    const price = Number(formData.price);
                                    const sessions = Number(formData.sessions);
                                    const promoDiscount = Number(formData.discount || 0);
                                    const totalDayValue = gym.baseDayPassPrice * sessions;

                                    if (totalDayValue <= 0) return null;

                                    const yieldDiscount = Math.round((1 - (price / totalDayValue)) * 100);
                                    const finalPrice = Math.round(price * (1 - promoDiscount / 100));
                                    const totalEffectiveDiscount = Math.round((1 - (finalPrice / totalDayValue)) * 100);

                                    return (
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className="text-[10px] font-bold text-gray-400 line-through">₹{totalDayValue.toLocaleString()}</span>
                                                <span className="text-lg font-black italic text-gray-900">₹{finalPrice.toLocaleString()}</span>
                                            </div>
                                            <div className="flex gap-2 mt-1">
                                                {yieldDiscount > 0 && (
                                                    <span className="text-[9px] font-black text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full uppercase">
                                                        {yieldDiscount}% Value Save
                                                    </span>
                                                )}
                                                {promoDiscount > 0 && (
                                                    <span className="text-[9px] font-black text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full uppercase">
                                                        {promoDiscount}% Promo Extra
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 text-xs font-black uppercase text-emerald-700 italic tracking-tighter">
                                                Total Savings: {totalEffectiveDiscount}% vs Day Pass
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Textarea
                                rows={4}
                                className="pl-9 border-gray-300 min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-12 bg-gray-900 border-2 border-black text-white hover:bg-white hover:text-black transition-all rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl"
                            disabled={loading}
                        >
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}

