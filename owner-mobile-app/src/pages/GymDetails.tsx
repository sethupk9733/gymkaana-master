import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, TrendingUp, Dumbbell, Image as ImageIcon, LayoutList, Check, Clock, Users, ArrowUpRight, Edit, Phone, Mail, ChevronRight, CreditCard, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchGymById, fetchPlansByGymId, fetchDashboardStats, updateGymBankDetails } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';

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
                fetchPlansByGymId(id),
                fetchDashboardStats(id) // Fetch stats for this specific gym
            ])
                .then(([gymData, plansData, statsData]) => {
                    // Find this gym's performance data
                    const thisGymPerf = statsData?.gymPerformance?.find((g: any) => g._id === id);

                    // Merge stats into gym data
                    const enrichedGym = {
                        ...gymData,
                        id: gymData._id || gymData.id,
                        realRevenue: statsData?.totalRevenue || 0,
                        realBookings: statsData?.totalBookingCount || statsData?.bookingCount || thisGymPerf?.bookingCount || 0,
                        realMembers: statsData?.totalMembers || statsData?.activeMembers || 0,
                        realCheckins: statsData?.dailyCheckins || statsData?.checkInsToday || 0
                    };

                    setGym(enrichedGym);
                    setPlans(plansData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    if (!gym) return (
        <div className="p-8 text-center mt-20 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
                <LayoutList className="text-gray-300 w-10 h-10" />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Venue Not Located</h3>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-10">We couldn't find the specific branch profile you're looking for.</p>
            <button
                onClick={() => navigate('/gyms')}
                className="mt-8 bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
                Back to Portfolio
            </button>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Performance', icon: LayoutList },
        { id: 'facilities', label: 'Amenities', icon: Dumbbell },
        { id: 'plans', label: 'Pricing', icon: Star },
        { id: 'photos', label: 'Media', icon: ImageIcon },
        { id: 'trainers', label: 'Staff', icon: Users },
        { id: 'bank', label: 'Bank', icon: CreditCard },
    ];

    const facilities = ['WiFi', 'AC', 'Showers', 'Lockers', 'Cardio', 'Weights', 'Personal Training'];

    return (
        <div className="bg-gray-50 min-h-screen pb-20 overflow-x-hidden">
            {/* Immersive Header */}
            <div className="relative h-64 w-full bg-black overflow-hidden">
                <img
                    src={gym.images?.[0] || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000"}
                    alt={gym.name}
                    className="w-full h-full object-cover opacity-60 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-black/40"></div>

                <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-20">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white"
                        title="Go back"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </motion.button>
                    <div className="flex gap-2">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/gyms/${id}/edit`)}
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest"
                            title="Edit Venue"
                        >
                            <Edit className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                <div className="absolute bottom-6 inset-x-6 z-20">
                    <div className="flex justify-between items-end">
                        <div className="flex-1">
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">{gym.name}</h1>
                            <div className="flex items-center text-gray-500 text-[10px] font-black uppercase tracking-widest mt-3">
                                <MapPin className="w-4 h-4 mr-2 text-primary" />
                                <span className="truncate">{gym.location}</span>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-green-500 text-white rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-500/20">
                            {gym.status}
                        </div>
                    </div>
                </div>
            </div>


            {/* Navigation Tabs */}
            <div className="px-6 mt-8 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex gap-4 min-w-max pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all",
                                activeTab === tab.id
                                    ? "bg-black border-black text-white shadow-lg"
                                    : "bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                    {/* Overview Content */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-6 rounded-[32px] border-2 border-gray-300 space-y-6 shadow-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    Live Performance
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between aspect-square">
                                        <div>
                                            <p className="text-3xl font-black text-gray-900 mb-1">{gym.realCheckins || 0}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Daily Entry</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <LayoutList size={16} className="text-orange-600" />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between aspect-square">
                                        <div>
                                            <p className="text-3xl font-black text-gray-900 mb-1">{gym.realBookings || 0}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Bookings</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <ShieldCheck size={16} className="text-purple-600" />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between aspect-square">
                                        <div>
                                            <p className="text-3xl font-black text-emerald-600 mb-1 italic">₹{(gym.realRevenue || 0).toLocaleString()}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <TrendingUp size={16} className="text-emerald-600" />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between aspect-square">
                                        <div>
                                            <p className="text-3xl font-black text-yellow-600 mb-1">{gym.rating || 0}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Member Rating</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <Star size={16} className="text-yellow-600 fill-yellow-600" />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/gyms/${gym.id || gym._id}/plans`)}
                                    className="w-full h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">Configure Pricing</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    Venue Logistics
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-orange-500" />
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Operational Hours</p>
                                                <p className="text-xs font-black text-gray-900">{gym.timings || '6:00 AM - 10:00 PM'}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                                    Contact Grid
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-bold text-gray-900">{gym.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl">
                                        <Mail className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm font-bold text-gray-900 truncate">{gym.email}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Facilities Content */}
                    {activeTab === 'facilities' && (
                        <motion.div
                            key="facilities"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-6 rounded-[32px] border-2 border-gray-100"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                                Verified Portfolio
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {(gym.facilities || facilities).map((item: any) => (
                                    <div key={item} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border-2 border-transparent hover:border-primary/20 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                                <Check className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 uppercase tracking-tighter italic">{item}</span>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-gray-200" />
                                    </div>
                                ))}
                            </div>

                            {gym.specializations && gym.specializations.length > 0 && (
                                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        Specialized Disciplines
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {gym.specializations.map((spec: string, index: number) => (
                                            <div key={index} className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest border-2 border-primary/20">
                                                {spec}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Plans Content */}
                    {activeTab === 'plans' && (
                        <motion.div
                            key="plans"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    Pricing Architecture
                                </h3>
                                <button
                                    onClick={() => navigate(`/plans/create?gymId=${gym._id || gym.id}`)}
                                    className="text-[10px] font-black text-primary uppercase tracking-widest border-b-2 border-primary pb-0.5"
                                >
                                    + Add Plan
                                </button>
                            </div>
                            {plans.map((plan: any) => (
                                <div
                                    key={plan._id || plan.id}
                                    onClick={() => navigate(`/plans/${plan._id || plan.id}/edit?gymId=${gym._id || gym.id}`)}
                                    className="bg-white p-6 rounded-[32px] border-2 border-gray-100 flex justify-between items-center group active:scale-95 transition-all relative overflow-hidden cursor-pointer"
                                >
                                    <div className="flex-1 relative z-10">
                                        <h4 className="text-lg font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors uppercase">{plan.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock size={12} className="text-gray-400" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{plan.duration}</p>
                                        </div>
                                    </div>
                                    <div className="text-right relative z-10">
                                        <p className="text-2xl font-black italic tracking-tighter text-gray-900">₹{plan.price}</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Inc. of all taxes</p>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-primary group-hover:text-black mt-2 underline block">
                                            Modify Tier
                                        </span>
                                    </div>
                                    <div className="absolute right-0 bottom-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <Dumbbell className="w-20 h-20 rotate-[-15deg] translate-x-4 translate-y-4" />
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => navigate(`/gyms/${gym.id}/plans`)}
                                className="w-full h-14 bg-white border-2 border-gray-300 rounded-2xl flex items-center justify-center gap-3 hover:bg-black hover:text-white hover:border-black transition-all group"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Configure Tiers</span>
                                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-white" />
                            </button>
                        </motion.div>
                    )}

                    {/* Trainers Content */}
                    {activeTab === 'trainers' && (
                        <motion.div
                            key="trainers"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-6 rounded-[32px] border-2 border-gray-100"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                Certified Faculty
                            </h3>
                            <div className="space-y-4">
                                {(gym.trainers || ['Rahul Dev', 'Sanjana M', 'Vikram Singh']).map((trainer: string) => (
                                    <div key={trainer} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group">
                                        <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-black/10 group-hover:scale-105 transition-transform rotate-3 group-hover:rotate-0">
                                            {trainer[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-black italic uppercase tracking-tighter text-gray-900">{trainer}</h4>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">S-Tier Certified Expert</p>
                                        </div>
                                        <div className="ml-auto w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <ChevronRight className="w-4 h-4 text-gray-300" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Photos Content */}
                    {activeTab === 'photos' && (
                        <motion.div
                            key="photos"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                                    Venue Portfolio
                                </h3>
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest border-b-2 border-primary pb-0.5">
                                    + Add Content
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pb-20">
                                {gym.images && gym.images.length > 0 ? (
                                    gym.images.map((img: string, i: number) => (
                                        <div key={i} className="aspect-square bg-gray-200 rounded-[32px] border-2 border-gray-100 overflow-hidden relative group">
                                            <img src={img} alt="Gym" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImageIcon size={24} className="text-white" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-2 py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                                        <ImageIcon size={40} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Media Uploaded</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                    {activeTab === 'bank' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm"
                        >
                            <BankMobileSection gym={gym} setGym={setGym} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function BankMobileSection({ gym, setGym }: { gym: any, setGym: any }) {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bankData, setBankData] = useState({
        accountName: gym.bankDetails?.accountName || '',
        accountNumber: gym.bankDetails?.accountNumber || '',
        ifscCode: gym.bankDetails?.ifscCode || '',
        bankName: gym.bankDetails?.bankName || ''
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateGymBankDetails(gym._id, bankData);
            setGym({ ...gym, bankDetails: bankData });
            setEditing(false);
        } catch (err: any) {
            alert(err.message || 'Failed to update bank details');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Settlement details</h3>
                    <p className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Configure Payouts</p>
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="p-2 bg-gray-50 rounded-xl text-primary"
                        title="Edit Bank Details"
                    >
                        <Edit size={16} />
                    </button>
                )}
            </div>

            {editing ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Holder Name</label>
                        <input
                            type="text"
                            value={bankData.accountName}
                            onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black outline-none"
                            placeholder="Enter name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
                        <input
                            type="text"
                            value={bankData.accountNumber}
                            onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black outline-none"
                            placeholder="0000000000"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">IFSC Code</label>
                        <input
                            type="text"
                            value={bankData.ifscCode}
                            onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black outline-none"
                            placeholder="BANK0123"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
                        <input
                            type="text"
                            value={bankData.bankName}
                            onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:border-black outline-none"
                            placeholder="e.g. HDFC"
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-black/20"
                        >
                            {loading ? 'Securing...' : 'Save Account'}
                        </button>
                        <button
                            onClick={() => setEditing(false)}
                            className="px-6 bg-gray-100 text-gray-400 rounded-2xl font-bold text-xs"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {gym.bankDetails?.accountNumber ? (
                        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[32px] p-6 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-8 opacity-60">Connected Account</p>
                                <p className="text-2xl font-black italic tracking-tighter mb-2">
                                    •••• •••• •••• {gym.bankDetails.accountNumber.slice(-4)}
                                </p>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-8">{gym.bankDetails.bankName}</p>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Holder</p>
                                        <p className="text-xs font-black uppercase tracking-tight">{gym.bankDetails.accountName}</p>
                                    </div>
                                    <ShieldCheck className="text-emerald-400 w-8 h-8 opacity-80" />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <CreditCard size={120} className="-rotate-12 translate-x-8 -translate-y-8" />
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <CreditCard className="text-gray-200" size={32} />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Bank Configured</p>
                            <button
                                onClick={() => setEditing(true)}
                                className="mt-4 text-primary font-black uppercase tracking-widest text-[9px]"
                            >
                                Setup Account +
                            </button>
                        </div>
                    )}
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <ShieldCheck className="text-orange-600" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-orange-900">Security Protocol</p>
                            <p className="text-[9px] font-bold text-orange-600/70 mt-0.5 leading-relaxed">Funds are settled weekly after 15% platform commission. Ensure IFSC accuracy.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
