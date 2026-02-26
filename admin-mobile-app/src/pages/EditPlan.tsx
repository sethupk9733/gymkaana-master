import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Clock, FileText, Trash2 } from 'lucide-react';
import { MOCK_GYMS } from '../lib/api';
import { cn } from '../lib/utils';

// Mock data for existing plans - in a real app this would come from an API
const MOCK_PLANS = [
    { id: 1, name: 'Silver Membership', price: '1500', duration: '1 Month', description: 'Includes access to all equipment and lockers.' },
    { id: 2, name: 'Gold Membership', price: '4000', duration: '3 Months', description: 'Access to all equipment, lockers and 1 personal training session per month.' },
];

export default function EditPlan() {
    const navigate = useNavigate();
    const { id: planId } = useParams();
    const [searchParams] = useSearchParams();
    const gymId = searchParams.get('gymId');
    const gym = MOCK_GYMS.find(g => g.id === Number(gymId));

    const [loading, setLoading] = useState(false);
    const [planData, setPlanData] = useState({
        name: '',
        price: '',
        duration: '1 Month',
        description: ''
    });

    useEffect(() => {
        const plan = MOCK_PLANS.find(p => p.id === Number(planId));
        if (plan) {
            setPlanData({
                name: plan.name,
                price: plan.price.replace('₹', '').replace(',', ''),
                duration: plan.duration,
                description: plan.description
            });
        }
    }, [planId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API update
        setTimeout(() => {
            setLoading(false);
            navigate(`/gyms/${gymId}`);
        }, 1500);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this plan?')) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                navigate(`/gyms/${gymId}`);
            }, 1000);
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
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-primary/100 focus:border-transparent outline-none bg-primary/10/30"
                        placeholder="e.g. Gold Membership"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                required
                                value={planData.price}
                                onChange={(e) => setPlanData({ ...planData, price: e.target.value })}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none"
                                placeholder="2500"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <select
                                id="duration"
                                value={planData.duration}
                                onChange={(e) => setPlanData({ ...planData, duration: e.target.value })}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none bg-white"
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
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                            rows={3}
                            value={planData.description}
                            onChange={(e) => setPlanData({ ...planData, description: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none resize-none"
                            placeholder="Includes access to all equipment..."
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
