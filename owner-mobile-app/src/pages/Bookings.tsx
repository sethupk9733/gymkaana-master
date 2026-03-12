import { Calendar, MapPin, Search, Filter, X, Building2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchGyms, fetchBookings } from '../lib/api';

export default function Bookings() {
    const [filter, setFilter] = useState('All');
    const [selectedGym, setSelectedGym] = useState('All Gyms');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [gyms, setGyms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [gymsData, bookingsData] = await Promise.all([
                fetchGyms(),
                fetchBookings()
            ]);
            setGyms(gymsData);

            // Remove duplicate bookings by _id
            const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];
            const uniqueBookings = Array.from(
                new Map(bookingsArray.map((b: any) => [b._id, b])).values()
            );
            setBookings(uniqueBookings);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(b => {
        const gymName = b.gymId?.name || '';
        const memberName = b.userId?.name || 'Anonymous Client';
        const memberId = b._id || '';

        const status = b.status?.toLowerCase();
        const matchesStatus =
            filter === 'All' ||
            (filter === 'Upcoming' && status === 'upcoming') ||
            (filter === 'Active' && (status === 'active' || status === 'checked-in')) ||
            (filter === 'Completed' && status === 'completed') ||
            (filter === 'Cancelled' && (status === 'cancelled' || status === 'rejected'));

        const matchesGym = selectedGym === 'All Gyms' || gymName === selectedGym;
        const matchesSearch = memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memberId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesGym && matchesSearch;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Synchronizing Fleet...</p>
        </div>
    );

    const getStatusStyles = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'active' || s === 'checked-in') return "bg-emerald-500 text-white border-emerald-500";
        if (s === 'completed') return "bg-gray-100 text-gray-500 border-gray-200";
        if (s === 'cancelled' || s === 'rejected') return "bg-red-500 text-white border-red-500";
        return "bg-black text-white border-black"; // upcoming
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 relative">
            {/* Header */}
            <div className="bg-white p-6 shadow-sm sticky top-0 z-10 border-b-2 border-gray-50">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Fleet Control</h1>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Real-time Deployment Feed</p>
                    </div>
                    <div className="relative">
                        <select
                            value={selectedGym}
                            onChange={(e) => setSelectedGym(e.target.value)}
                            className="text-[9px] font-black uppercase tracking-widest text-black bg-gray-100 border-none rounded-xl px-4 py-2.5 outline-none appearance-none cursor-pointer pr-8"
                            title="Select Gym"
                        >
                            <option value="All Gyms">Global View</option>
                            {gyms.map(gym => (
                                <option key={gym._id} value={gym.name}>{gym.name.toUpperCase()}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Building2 className="w-3 h-3 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH IDENTITY OR ID..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-[10px] font-black tracking-widest uppercase placeholder:text-gray-300 focus:bg-white focus:border-black outline-none transition-all"
                        />
                    </div>
                    <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-black hover:bg-white border-2 border-transparent hover:border-black transition-all" title="Filter deployments">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar pb-1">
                    {['All', 'Upcoming', 'Active', 'Completed', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={cn(
                                "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all border-2",
                                filter === status
                                    ? "bg-black border-black text-white shadow-xl -translate-y-1"
                                    : "bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            <div className="p-4 space-y-4">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => {
                        const memberName = booking.userId?.name || 'Anonymous Client';
                        const gymName = booking.gymId?.name || 'Unknown Facility';
                        const planName = booking.planId?.name || 'Standard Access';

                        return (
                            <motion.div
                                key={booking._id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedBooking(booking)}
                                className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-gray-100 hover:border-black transition-all cursor-pointer group relative overflow-hidden"
                            >
                                {/* Left strip for status */}
                                <div className={cn(
                                    "absolute left-0 top-0 bottom-0 w-1.5",
                                    getStatusStyles(booking.status).split(' ')[0]
                                )}></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl border-4 border-white overflow-hidden -rotate-3 group-hover:rotate-0 transition-transform">
                                            {booking.userId?.profileImage ? (
                                                <img src={booking.userId.profileImage} alt="User" className="w-full h-full object-cover rotate-3 group-hover:rotate-0" />
                                            ) : (
                                                memberName.split(' ').map((n: any) => n[0]).join('').toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors leading-none">{memberName}</h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="text-[8px] text-white font-black bg-black px-2 py-0.5 rounded uppercase tracking-widest italic">{planName}</span>
                                                <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">#{booking._id?.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-lg border-2 shadow-sm",
                                        getStatusStyles(booking.status)
                                    )}>
                                        {booking.status?.toUpperCase()}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-5 border-t-2 border-gray-50 text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-black" />
                                        <span className="truncate">{gymName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <p className="text-gray-900">₹{booking.amount || 0}</p>
                                        <Calendar className="w-4 h-4 text-black" />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mb-8 shadow-sm border-2 border-dashed border-gray-100">
                            <Search className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">No Signatures Found</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2">Check communication channels</p>
                    </div>
                )}
            </div>

            {/* Detailed View Bottom Sheet */}
            <AnimatePresence>
                {selectedBooking && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 inset-x-0 bg-white rounded-t-[48px] z-50 max-h-[92vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white/90 backdrop-blur-md p-8 border-b-2 border-gray-50 flex items-center justify-between z-10">
                                <div>
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Intelligence Hub</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Full Entity Disclosure</p>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-4 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all transform active:scale-95"
                                    title="Close"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Status Banner */}
                                <div className={`p-6 rounded-[32px] flex items-center gap-5 border-2 ${selectedBooking.status?.toLowerCase() === 'cancelled' || selectedBooking.status?.toLowerCase() === 'rejected' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                    <div className={`p-3 rounded-2xl ${selectedBooking.status?.toLowerCase() === 'cancelled' || selectedBooking.status?.toLowerCase() === 'rejected' ? 'bg-red-500' : 'bg-emerald-500'} text-white shadow-lg`}>
                                        {selectedBooking.status?.toLowerCase() === 'cancelled' || selectedBooking.status?.toLowerCase() === 'rejected' ? (
                                            <XCircle className="w-6 h-6" />
                                        ) : (
                                            <CheckCircle className="w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-900 italic">
                                            Status: {selectedBooking.status?.toUpperCase()}
                                        </p>
                                        <p className="text-xs font-bold text-gray-500 mt-1">
                                            {selectedBooking.status?.toLowerCase() === 'cancelled' || selectedBooking.status?.toLowerCase() === 'rejected'
                                                ? `Operation terminated by ${selectedBooking.cancelledBy?.toUpperCase() || 'SYSTEM'}`
                                                : 'Secure and verified deployment active.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Member Card */}
                                <div className="bg-black rounded-[40px] p-8 relative overflow-hidden shadow-2xl">
                                    <div className="flex items-start gap-6 relative z-10">
                                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md text-white rounded-[32px] flex items-center justify-center font-black text-4xl shadow-inner border-2 border-white/20 overflow-hidden">
                                            {selectedBooking.userId?.profileImage ? (
                                                <img src={selectedBooking.userId.profileImage} alt="User" className="w-full h-full object-cover" />
                                            ) : (
                                                (selectedBooking.userId?.name || 'U').charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div className="flex-1 pt-2">
                                            <h4 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-tight">{selectedBooking.userId?.name || 'Anonymous Client'}</h4>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">SECURE_ID:</span>
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">#{selectedBooking._id?.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Building2 className="absolute -right-12 -bottom-12 w-56 h-56 text-white/5 -rotate-12" />

                                    <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Signal Channel</p>
                                            <p className="text-xs font-black text-white tracking-widest">{selectedBooking.userId?.phoneNumber || 'SIGNAL LOST'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] mb-1">Digital Identity</p>
                                            <p className="text-xs font-black text-white tracking-tighter truncate">{selectedBooking.userId?.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Plan Intelligence */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3 italic">
                                        <div className="w-8 h-[2px] bg-black"></div>
                                        Contract Parameters
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { label: 'Access Tier', value: selectedBooking.planId?.name || 'STANDARD', color: 'text-gray-900' },
                                            { label: 'Net Capital', value: `₹${selectedBooking.amount}`, color: 'text-emerald-600' },
                                            { label: 'Activation', value: new Date(selectedBooking.bookingDate).toLocaleDateString(), color: 'text-gray-900' },
                                            { label: 'Expiration', value: selectedBooking.bookingTime || 'SCHEDULED', color: 'text-gray-900' }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-gray-50 p-6 rounded-[28px] border-2 border-transparent hover:border-black transition-colors">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">{stat.label}</p>
                                                <p className={cn("text-sm font-black uppercase tracking-tight italic", stat.color)}>{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Location Logistics */}
                                <div className="bg-gray-900 p-8 rounded-[40px] shadow-xl border-t-4 border-primary">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border-2 border-white/10 shadow-lg">
                                            <Building2 size={32} className="text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 italic">Asset Allocation</p>
                                            <h5 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">{selectedBooking.gymId?.name || 'HUB_FACILITY'}</h5>
                                            <p className="text-[10px] font-bold text-white/40 mt-2 uppercase tracking-wider">{selectedBooking.gymId?.address || 'COORDINATES REQUESTED'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-24" /> {/* Extra spacer for scroll clearance */}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
