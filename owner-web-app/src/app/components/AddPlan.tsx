import { useState, useEffect } from 'react';
import { ArrowLeft, IndianRupee, Clock, FileText, Zap, TrendingUp } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { createPlan, fetchGyms } from "../lib/api";

interface AddPlanProps {
    gymId?: string;
    onBack: () => void;
}

export function AddPlan({ gymId, onBack }: AddPlanProps) {
    const [loading, setLoading] = useState(false);
    const [gyms, setGyms] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        gymId: gymId || '',
        name: '',
        price: '',
        duration: '1 Month',
        sessions: '30',
        discount: '0',
        baseDiscount: '0',
        description: ''
    });

    useEffect(() => {
        fetchGyms().then(setGyms).catch(console.error);
    }, []);

    // Auto-calculate base discount when price, sessions or selected gym changes
    useEffect(() => {
        const selectedGym = gyms.find(g => g._id === formData.gymId);
        if (selectedGym && selectedGym.baseDayPassPrice > 0 && formData.price && formData.sessions) {
            const price = Number(formData.price);
            const sessions = Number(formData.sessions);
            const totalDayValue = selectedGym.baseDayPassPrice * sessions;

            if (totalDayValue > 0) {
                const calculated = Math.round((1 - (price / totalDayValue)) * 100);
                setFormData(prev => ({ ...prev, baseDiscount: String(Math.max(0, calculated)) }));
            }
        }
    }, [formData.price, formData.sessions, formData.gymId, gyms]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.gymId) {
            alert("Please select a gym");
            return;
        }
        setLoading(true);
        try {
            await createPlan({
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
            alert("Failed to create plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center">
                    <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors" title="Go back">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Create Plan</h1>
                        <p className="text-sm text-gray-500">Add a new membership plan</p>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    {/* Gym Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Gym</label>
                        <select
                            className="w-full h-11 px-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                            aria-label="Select Gym"
                            value={formData.gymId}
                            onChange={(e) => setFormData({ ...formData, gymId: e.target.value })}
                            required
                        >
                            <option value="">Select a gym...</option>
                            {gyms.map(gym => (
                                <option key={gym._id} value={gym._id}>{gym.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Name</label>
                        <Input
                            type="text"
                            required
                            className="h-11 border-gray-300"
                            placeholder="e.g. Gold Membership"
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
                                    placeholder="2500"
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
                                    placeholder="e.g. 30"
                                    value={formData.sessions}
                                    onChange={(e) => setFormData({ ...formData, sessions: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Base Discount from Day Pass (%)</label>
                            <div className="relative">
                                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                                <Input
                                    type="number"
                                    className="pl-9 h-11 border-blue-100 bg-blue-50/30 focus:bg-white transition-all"
                                    placeholder="e.g. 70"
                                    value={formData.baseDiscount}
                                    onChange={(e) => setFormData({ ...formData, baseDiscount: e.target.value })}
                                />
                            </div>
                            <p className="text-[10px] text-blue-600 mt-1 font-bold uppercase tracking-tight">Shown as "Up to X% OFF" on cards</p>
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
                            <p className="text-[10px] text-emerald-600 mt-1 font-bold uppercase tracking-tight">Shown as "Extra X% OFF" badge</p>
                        </div>
                    </div>

                    {/* Discount Preview */}
                    {formData.gymId && formData.price && formData.sessions && (
                        <div className="p-5 bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3" /> Yield Analytics
                                </span>
                                {(() => {
                                    const gym = gyms.find(g => g._id === formData.gymId);
                                    if (!gym || !gym.baseDayPassPrice) return null;

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
                                placeholder="Includes access to all equipment..."
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
                            {loading ? 'Creating Plan...' : 'Create Plan'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}

