import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Clock, FileText, Loader2, Zap, TrendingUp, Percent } from 'lucide-react';
import { fetchGymById, createPlan } from '../lib/api';
import { cn } from '../lib/utils';

export default function AddPlan() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const gymId = searchParams.get('gymId');
    const [gym, setGym] = useState<any>(null);
    const [loadingGym, setLoadingGym] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('1 Month');
    const [sessions, setSessions] = useState('30');
    const [discount, setDiscount] = useState('0');
    const [baseDiscount, setBaseDiscount] = useState('0');
    const [features, setFeatures] = useState('');

    useEffect(() => {
        if (gymId) {
            fetchGymById(gymId)
                .then(data => {
                    setGym(data);
                    setLoadingGym(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingGym(false);
                });
        }
    }, [gymId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gymId) return;

        setLoading(true);
        try {
            await createPlan({
                gymId,
                name,
                price: Number(price),
                duration,
                sessions: Number(sessions),
                discount: Number(discount),
                baseDiscount: Number(baseDiscount),
                features: features.split(',').map(f => f.trim()).filter(f => f),
                enabled: true
            });
            navigate(`/gyms/${gymId}`);
        } catch (err) {
            console.error(err);
            alert('Failed to create plan');
        } finally {
            setLoading(false);
        }
    };

    if (loadingGym) return <div className="p-10 text-center flex flex-col items-center gap-2"><Loader2 className="w-6 h-6 animate-spin" /><span>Loading gym details...</span></div>;
    if (!gym) return <div className="p-10 text-center">Invalid Gym ID</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto min-h-screen bg-gray-50 pb-20">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Create Plan</h1>
                    <p className="text-xs text-gray-500">for {gym.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-primary/100 focus:border-transparent outline-none bg-primary/10/30"
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
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none"
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
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
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
                                value={sessions}
                                onChange={(e) => setSessions(e.target.value)}
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
                                value={baseDiscount}
                                onChange={(e) => setBaseDiscount(e.target.value)}
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
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-emerald-100 bg-emerald-50/20 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Yield Preview */}
                {gym && price && sessions && (
                    <div className="p-4 bg-gradient-to-br from-primary/10 to-emerald-50 border border-primary/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Yield Analytics
                            </span>
                            {(() => {
                                const p = Number(price);
                                const s = Number(sessions);
                                const d = Number(discount || 0);
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
                            value={features}
                            onChange={(e) => setFeatures(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none resize-none"
                            placeholder="Gym Access, Lockers, Personal Trainer..."
                        ></textarea>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                        "w-full bg-primary text-white font-bold py-3 rounded-lg shadow-md hover:bg-secondary transition-all mt-4 flex items-center justify-center gap-2",
                        loading && "opacity-70"
                    )}
                >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {loading ? 'Creating Plan...' : 'Create Plan'}
                </button>

            </form>
        </div>
    );
}
