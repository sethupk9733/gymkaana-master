import { useState, useEffect } from "react";
import { fetchBookings } from "../lib/api";
import { Search, Activity, CheckCircle, XCircle, Clock, Calendar, Building2, User } from "lucide-react";

interface BookingDetail {
    id: string;
    transactionId?: string;
    memberName: string;
    memberEmail: string;
    gymName: string;
    planName: string;
    amount: number;
    status: string;
    startDate: string;
    endDate: string;
    bookingDate: string;
    cancellationReason?: string;
    cancellationDate?: string;
    refundStatus?: string;
    duration?: string;
    cancelledBy?: string;
}

export function BookingManagement() {
    const [bookings, setBookings] = useState<BookingDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed' | 'Cancelled'>('All');
    const [searchQuery, setSearchQuery] = useState("");

    const loadBookings = async () => {
        setLoading(true);
        try {
            const data = await fetchBookings();
            const mappedBookings = data.map((b: any) => ({
                id: b._id,
                transactionId: b.transactionId,
                memberName: b.userId?.name || b.memberName || "Unknown",
                memberEmail: b.userId?.email || b.memberEmail || "N/A",
                gymName: b.gymId?.name || "Unknown Gym",
                planName: b.planId?.name || "Unknown Plan",
                amount: b.amount,
                status: b.status || "Unknown",
                startDate: new Date(b.startDate).toLocaleDateString(),
                endDate: new Date(b.endDate).toLocaleDateString(),
                bookingDate: new Date(b.bookingDate).toLocaleDateString(),
                cancellationReason: b.cancellationReason,
                cancellationDate: b.cancellationDate ? new Date(b.cancellationDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : undefined,
                refundStatus: b.refundDetails?.status,
                duration: b.planId?.duration,
                cancelledBy: b.cancelledBy
            }));

            // Remove duplicates by ID
            const uniqueBookings = Array.from(
                new Map(mappedBookings.map((b: BookingDetail) => [b.id, b])).values()
            );

            setBookings(uniqueBookings as BookingDetail[]);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const filteredBookings = bookings.filter(b => {
        const matchesStatus = filterStatus === 'All' || b.status.toLowerCase() === filterStatus.toLowerCase();
        const matchesSearch =
            b.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.gymName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.planName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'completed': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <>
            <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20 font-sans">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Booking Matrix</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Live Transactional Monitoring</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative group w-full md:w-80">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                placeholder="SEARCH BOOKINGS..."
                                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[28px] text-[10px] font-black outline-none focus:ring-4 focus:ring-black/5 shadow-sm transition-all uppercase tracking-widest"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="flex bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm w-fit">
                    {['All', 'Active', 'Completed', 'Cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-8 py-3 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all ${filterStatus === status
                                ? 'bg-black text-white shadow-lg'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-100 rounded-[48px] shadow-sm overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-full p-20">
                            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Activity className="w-6 h-6 text-gray-300" />
                            </div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No bookings found matching criteria</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Member ID</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Hub Detail</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Plan Terms</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Status</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Validity / Cancellation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                        onClick={() => setSelectedBooking(booking)}
                                    >
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black italic text-sm group-hover:bg-primary group-hover:text-black transition-colors">
                                                    {booking.memberName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 uppercase italic tracking-tighter">{booking.memberName}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{booking.memberEmail}</p>
                                                    {booking.transactionId && (
                                                        <p className="text-[9px] font-bold text-blue-600 mt-0.5">{booking.transactionId}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-300" />
                                                <span className="font-bold text-sm text-gray-700">{booking.gymName}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-col">
                                                <span className="font-black uppercase italic text-gray-900">{booking.planName}</span>
                                                <span className="text-[10px] font-bold text-emerald-600">₹{booking.amount}</span>
                                            </div>
                                        </td>
                                        <td className="p-8 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                                {booking.status.toLowerCase() === 'cancelled' && booking.cancellationReason && (
                                                    <p className="text-[8px] font-bold text-red-500 italic max-w-[120px] leading-tight">
                                                        "{booking.cancellationReason}"
                                                    </p>
                                                )}
                                                {booking.status.toLowerCase() === 'cancelled' && (
                                                    <span className="text-[7px] font-black uppercase tracking-widest text-red-300 bg-red-50 px-2 py-0.5 rounded leading-none">
                                                        BY {booking.cancelledBy || 'SYSTEM'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    {booking.status.toLowerCase() === 'cancelled' ? 'Terminated On' : 'Valid Until'}
                                                </span>
                                                <span className={`font-black text-sm ${booking.status.toLowerCase() === 'cancelled' ? 'text-red-600' : ''}`}>
                                                    {booking.status.toLowerCase() === 'cancelled' ? booking.cancellationDate : booking.endDate}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Selected Booking Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden shadow-2xl relative p-10 font-sans">
                        <button
                            onClick={() => setSelectedBooking(null)}
                            title="Close Details"
                            className="absolute top-8 right-8 p-3 hover:bg-gray-100 rounded-2xl transition-all"
                        >
                            <XCircle className="w-6 h-6 text-gray-400" />
                        </button>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Protocol Assignment Detail</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    Transaction ID: {selectedBooking.transactionId || `#${selectedBooking.id.slice(-8)}`}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Identity</p>
                                    <p className="font-black text-lg uppercase italic text-gray-900">{selectedBooking.memberName}</p>
                                    <p className="text-xs font-bold text-gray-500">{selectedBooking.memberEmail}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hub Location</p>
                                    <p className="font-black text-lg uppercase italic text-gray-900">{selectedBooking.gymName}</p>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Tier</p>
                                    <p className="font-black text-xl uppercase italic text-gray-900">{selectedBooking.planName}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Settlement</p>
                                    <p className="font-black text-3xl text-emerald-600">₹{selectedBooking.amount}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Booked On</p>
                                    <p className="text-xs font-black">{selectedBooking.bookingDate}</p>
                                </div>
                                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Activation</p>
                                    <p className="text-xs font-black">{selectedBooking.startDate}</p>
                                </div>
                                <div className="p-4 bg-white border border-gray-100 rounded-2xl">
                                    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Termination</p>
                                    <p className="text-xs font-black text-red-500">{selectedBooking.endDate}</p>
                                </div>
                            </div>

                            {selectedBooking.status.toLowerCase() === 'cancelled' && (
                                <div className="p-8 bg-red-50 border border-red-100 rounded-[32px] space-y-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Cancellation Insight</p>
                                        <span className="text-[10px] font-black bg-red-600 text-white px-3 py-1 rounded-full uppercase">
                                            {selectedBooking.refundStatus || 'Pending Refund'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[9px] font-bold text-red-300 uppercase">Reason</p>
                                            <p className="font-bold text-red-900 italic text-sm">"{selectedBooking.cancellationReason || 'Standard Termination'}"</p>
                                            <p className="text-[8px] font-black text-red-400 uppercase mt-2 tracking-widest">Initiated By: {selectedBooking.cancelledBy || 'System'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold text-red-300 uppercase">Termination Date</p>
                                            <p className="font-bold text-red-900 text-sm">{selectedBooking.cancellationDate || selectedBooking.endDate}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button className="flex-1 py-5 bg-black text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl">Contact Client</button>
                                <button className="flex-1 py-5 bg-gray-100 text-gray-900 rounded-[24px] font-black text-[10px] uppercase tracking-widest">Sync Permissions</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
