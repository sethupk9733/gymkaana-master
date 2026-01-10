import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, TrendingUp, Dumbbell, Image as ImageIcon, LayoutList, Check, Upload, Clock, Users, ArrowUpRight, Edit } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchGymById, fetchPlansByGymId } from '../lib/api';

export default function GymDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [gym, setGym] = useState<any>(null);
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (id) {
            Promise.all([
                fetchGymById(id),
                fetchPlansByGymId(id)
            ])
                .then(([gymData, plansData]) => {
                    setGym(gymData);
                    setPlans(plansData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return <div className="p-4 text-center mt-10">Loading gym details...</div>;
    if (!gym) return <div className="p-4 text-center mt-10">Gym not found</div>;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutList },
        { id: 'facilities', label: 'Facilities', icon: Dumbbell },
        { id: 'trainers', label: 'Trainers', icon: Users },
        { id: 'plans', label: 'Plans', icon: Star },
        { id: 'photos', label: 'Photos', icon: ImageIcon },
    ];

    const MOCK_PLANS = [
        { id: 1, name: 'Silver Membership', price: '₹1,500', duration: '1 Month' },
        { id: 2, name: 'Gold Membership', price: '₹4,000', duration: '3 Months' },
    ];

    const facilities = ['WiFi', 'AC', 'Showers', 'Lockers', 'Cardio', 'Weights', 'Personal Training'];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100" title="Go back" aria-label="Go back">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 truncate max-w-[200px]">{gym.name}</h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/gyms/${id}/edit`)}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                        title="Edit Gym Details"
                        aria-label="Edit Gym Details"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => navigate(`/earnings?gymId=${gym._id}`)}
                        className="flex items-center gap-1.5 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                    >
                        <TrendingUp className="w-4 h-4" />
                        Earnings
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 flex overflow-x-auto px-4 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex flex-col items-center gap-1 px-4 py-3 min-w-[80px] border-b-2 transition-colors",
                            activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="p-4 space-y-4">
                {/* Overview Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                                <span>{gym.address || gym.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="w-5 h-5 mr-2 text-gray-400" />
                                <span>{gym.timings || '6:00 AM - 10:00 PM'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Star className="w-5 h-5 mr-2 text-yellow-400 fill-current" />
                                <span>{gym.rating || 0} Rating</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                                <span>{gym.revenues || '₹0'} Revenue</span>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
                            <h3 className="font-semibold text-gray-900">Map Location</h3>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">{gym.mapCoords || '12.9716, 77.5946'}</span>
                                </div>
                                <button className="text-blue-600 text-sm font-bold flex items-center gap-1">
                                    Open Map <ArrowUpRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h3 className="font-semibold text-blue-900 mb-2">Owner's Note</h3>
                            <p className="text-sm text-blue-800">
                                {gym.members > 100 ? "This gym is performing well. Keep up the good work!" : "Start marketing campaigns to increase memberships."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Facilities Content */}
                {activeTab === 'facilities' && (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold mb-3">Amenities</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {(gym.facilities || facilities).map((item: any) => (
                                <div key={item} className="flex items-center gap-2 text-gray-700">
                                    <Check className="w-4 h-4 text-green-500" />
                                    <span className="text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trainers Content */}
                {activeTab === 'trainers' && (
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Our Trainers</h3>
                        <div className="space-y-4">
                            {(gym.trainers || ['Rahul Dev', 'Sanjana M', 'Vikram Singh']).map((trainer: string) => (
                                <div key={trainer} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        {trainer[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{trainer}</h4>
                                        <p className="text-xs text-gray-500 font-medium">Certified Expert</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Plans Content */}
                {activeTab === 'plans' && (
                    <div className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold">Membership Plans</h3>
                            <button
                                onClick={() => navigate(`/plans/create?gymId=${gym._id}`)}
                                className="text-sm text-blue-600 font-bold hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                            >
                                + Add Plan
                            </button>
                        </div>
                        {plans.map((plan: any) => (
                            <div key={plan._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">{plan.name}</h4>
                                    <p className="text-sm text-gray-500">{plan.duration}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-blue-600">₹{plan.price}</span>
                                    <button
                                        onClick={() => navigate(`/plans/${plan._id}/edit?gymId=${gym._id}`)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                                        title="Edit Plan"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Photos Content */}
                {activeTab === 'photos' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold">Gallery</h3>
                            <button className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
                                <Upload className="w-4 h-4" />
                                Add Photo
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-8 h-8" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
