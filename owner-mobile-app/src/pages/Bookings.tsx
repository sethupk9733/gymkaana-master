import { Calendar, MapPin, Search, Filter, X, Mail, Building2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchGyms } from '../lib/api';
import { API_URL } from '../config/api';

export default function Bookings() {
    const [filter, setFilter] = useState('All');
    const [selectedGym, setSelectedGym] = useState('All Gyms');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [gyms, setGyms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [gymsData, bookingsData] = await Promise.all([
                    fetchGyms(),
                    fetch(`${API_URL}/bookings`, {
                        //@ts-ignore
                        credentials: 'include'
                    }).then(res => res.json())
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
        loadData();
    }, []);

    const filteredBookings = bookings.filter(b => {
        const gymName = b.gymId?.name || b.gym || '';
        const memberName = b.memberName || b.user?.name || b.user || 'Unknown';
        const memberId = b.memberId || b._id || '';

        const matchesStatus = filter === 'All' || b.status?.toLowerCase() === filter.toLowerCase();
        const matchesGym = selectedGym === 'All Gyms' || gymName === selectedGym;
        const matchesSearch = memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            memberId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesGym && matchesSearch;
    });

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />Loading bookings...</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20 relative">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Bookings</h1>
                    <select
                        value={selectedGym}
                        onChange={(e) => setSelectedGym(e.target.value)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border-none rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer"
                        title="Select Gym"
                    >
                        <option value="All Gyms">All Venues</option>
                        {gyms.map(gym => (
                            <option key={gym._id} value={gym.name}>{gym.name}</option>
                        ))}
                    </select>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or ID..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold placeholder:text-gray-300 focus:border-primary/100 outline-none transition-all"
                        />
                    </div>
                    <button className="p-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-400 hover:text-black hover:border-black transition-all" title="Filter bookings">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                    {['All', 'Upcoming', 'Active', 'Completed', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={cn(
                                "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2",
                                filter === status
                                    ? "bg-black border-black text-white shadow-lg"
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
                        const memberName = booking.memberName || booking.user?.name || 'Unknown';
                        const gymName = booking.gymId?.name || booking.gym || 'Unknown';
                        const planName = booking.planId?.name || booking.plan || 'Membership';

                        return (
                            <motion.div
                                key={booking._id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedBooking(booking)}
                                className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-black transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary/100 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                                            {memberName.split(' ').map((n: any) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h3 className="font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors">{memberName}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-primary font-black bg-primary/10 px-2 py-0.5 rounded uppercase tracking-widest">{planName}</span>
                                                <span className="text-[10px] text-gray-300 font-bold uppercase">#{booking._id?.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border shadow-sm",
                                        (booking.status?.toLowerCase() === 'active') && "bg-green-500 text-white border-green-500",
                                        (booking.status?.toLowerCase() === 'completed') && "bg-gray-100 text-gray-600 border-gray-200",
                                        (booking.status?.toLowerCase() === 'cancelled') && "bg-red-500 text-white border-red-500",
                                        (booking.status?.toLowerCase() === 'upcoming') && "bg-primary/100 text-white border-primary/100"
                                    )}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span className="truncate">{gymName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border-2 border-dashed border-gray-100">
                            <Search className="w-8 h-8 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-gray-900">No Bookings Found</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Try adjusting your filters</p>
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 inset-x-0 bg-white rounded-t-[40px] z-50 max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y"
                        >
                            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Booking Details</h2>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"
                                    title="Close"
                                >
                                    <X className="w-6 h-6 text-gray-900" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Status Banner */}
                                <div className={`p-4 rounded-2xl flex items-center gap-4 ${selectedBooking.status?.toLowerCase() === 'cancelled' ? 'bg-red-50 border-2 border-red-100' : 'bg-green-50 border-2 border-green-100'}`}>
                                    {selectedBooking.status?.toLowerCase() === 'cancelled' ? (
                                        <XCircle className="w-8 h-8 text-red-600" />
                                    ) : (
                                        <CheckCircle className="w-8 h-8 text-green-600" />
                                    )}
                                    <div>
                                        <p className={`font-black uppercase tracking-widest text-[10px] ${selectedBooking.status?.toLowerCase() === 'cancelled' ? 'text-red-900' : 'text-green-900'}`}>
                                            Booking {selectedBooking.status}
                                        </p>
                                        <p className={`text-xs font-bold ${selectedBooking.status?.toLowerCase() === 'cancelled' ? 'text-red-700' : 'text-green-700'}`}>
                                            {selectedBooking.status?.toLowerCase() === 'cancelled'
                                                ? `Revoked by ${selectedBooking.cancelledBy?.toUpperCase() || 'SYSTEM'}`
                                                : 'Verified and active subscription.'}
                                        </p>
                                        {selectedBooking.status?.toLowerCase() === 'cancelled' && selectedBooking.cancellationReason && (
                                            <p className="text-[10px] font-bold text-red-500 italic mt-1 leading-tight">
                                                Reason: "{selectedBooking.cancellationReason}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Member Card */}
                                <div className="bg-gray-50 rounded-3xl p-6 border-2 border-gray-100 relative overflow-hidden">
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-20 h-20 bg-black text-white rounded-3xl flex items-center justify-center font-black text-3xl shadow-2xl">
                                            {(selectedBooking.memberName || selectedBooking.user?.name || 'U').charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">{selectedBooking.memberName || selectedBooking.user?.name || 'Unknown'}</h4>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">#{selectedBooking._id?.slice(-8)}</p>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                    <Mail className="w-3 h-3" /> {(selectedBooking.memberEmail || selectedBooking.user?.email) ? `${(selectedBooking.memberEmail || selectedBooking.user?.email).split('@')[0].substring(0, 2)}***@${(selectedBooking.memberEmail || selectedBooking.user?.email).split('@')[1]}` : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Building2 className="absolute -right-8 -bottom-8 w-40 h-40 text-black/5 rotate-12" />
                                </div>

                                {/* Plan Intelligence */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                                        Subscription Terms
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-2xl border-2 border-gray-100">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Membership Plan</p>
                                            <p className="text-sm font-black text-gray-900 uppercase italic leading-tight">{selectedBooking.planId?.name || selectedBooking.plan || 'Membership'}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border-2 border-gray-100">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Payment</p>
                                            <p className="text-sm font-black text-emerald-600 italic leading-tight">₹{selectedBooking.amount}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border-2 border-gray-100">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Start Date</p>
                                            <p className="text-sm font-black text-gray-900 leading-tight">{new Date(selectedBooking.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border-2 border-gray-100">
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">End Date</p>
                                            <p className="text-sm font-black text-gray-900 leading-tight">{new Date(selectedBooking.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Location Logistics */}
                                <div className="bg-white p-6 rounded-3xl border-2 border-gray-100 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <Building2 size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black italic uppercase tracking-tighter text-gray-900">{selectedBooking.gymId?.name || selectedBooking.gym || 'Venue'}</p>
                                            <p className="text-[10px] font-bold text-gray-400">{selectedBooking.gymId?.location || 'Location'}</p>
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
