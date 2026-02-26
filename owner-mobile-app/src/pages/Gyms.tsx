import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, ChevronRight, Users, Building2, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { fetchGyms } from '../lib/api';
import { motion } from 'motion/react';

export default function Gyms() {
    const navigate = useNavigate();
    const [gyms, setGyms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');

    useEffect(() => {
        fetchGyms()
            .then(data => {
                setGyms(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredGyms = Array.isArray(gyms) ? gyms.filter(gym => {
        const matchesSearch = gym.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            gym.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const isPending = gym.status === 'Pending' || gym.status === 'pending';
        if (activeTab === 'pending') return isPending && matchesSearch;
        return !isPending && matchesSearch;
    }) : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-primary/100/20 border-t-primary/100 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header Area */}
            <div className="bg-white p-6 shadow-sm border-b border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">My Venues</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Operational Control</p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/gyms/add')}
                        className="bg-black text-white p-3 rounded-2xl shadow-xl shadow-black/20"
                        title="Add New Gym"
                    >
                        <Plus className="w-6 h-6" />
                    </motion.button>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search your portfolio..."
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                    />
                </div>

                <div className="flex p-1 bg-gray-100 rounded-xl">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={cn(
                            "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                            activeTab === 'active' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Active Venues
                    </button>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={cn(
                            "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all relative",
                            activeTab === 'pending' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Under Review
                        {gyms.some(g => g.status === 'Pending' || g.status === 'pending') && (
                            <span className="absolute top-2 right-4 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        )}
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className="p-4 space-y-4">
                {filteredGyms.length > 0 ? (
                    filteredGyms.map((gym: any, index) => (
                        <motion.div
                            key={gym._id || gym.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => navigate(`/gyms/${gym._id}`)}
                            className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 -translate-x-[-40%] -translate-y-[40%] rounded-full group-hover:bg-primary/10/50 transition-colors" />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="flex flex-col flex-1">
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors leading-tight">{gym.name}</h3>
                                    <div className="flex items-center text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/100" />
                                        <span className="truncate">{gym.location}</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    "px-3 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm border",
                                    (gym.status === 'active' || gym.status === 'Active' || gym.status === 'Approved')
                                        ? "bg-green-500 text-white border-green-500"
                                        : (gym.status === 'Pending' || gym.status === 'pending')
                                            ? "bg-orange-500 text-white border-orange-500"
                                            : "bg-red-500 text-white border-red-500"
                                )}>
                                    {gym.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-50 mt-auto relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Members</span>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-black text-gray-900">{gym.members || 0}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">MTD Revenue</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-black text-emerald-600 italic">₹{(gym.revenues || 0).toLocaleString()}</span>
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-200">
                            <Building2 className="w-8 h-8 text-gray-100" />
                        </div>
                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-gray-900">No Venues Found</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Start by adding a new branch</p>
                    </div>
                )}
            </div>
        </div>
    );
}
