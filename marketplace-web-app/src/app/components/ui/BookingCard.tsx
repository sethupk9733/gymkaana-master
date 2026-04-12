import { Calendar, CheckCircle2, Clock, MapPin, ReceiptText, QrCode, X, Star as StarIcon, Settings2, Trash2, CalendarDays, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Booking } from "../../types";
import { ReviewModal } from "./ReviewModal";
import { cancelBooking, updateBookingDate } from "../../lib/api";

export function BookingCard({ booking }: { booking: Booking }) {
    const [showQR, setShowQR] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [showManage, setShowManage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newStartDate, setNewStartDate] = useState(booking.startDate);

    const statusConfig = {
        completed: { color: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Completed" },
        active: { color: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Completed" },
        cancelled: { color: "bg-red-50 text-red-700 border-red-100", label: "Cancelled" },
        upcoming: { color: "bg-black text-white border-black", label: "Active" },
    };

    const config = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.completed;

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        setLoading(true);
        try {
            await cancelBooking(booking.id);
            alert("Booking cancelled successfully");
            window.location.reload();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateDate = async () => {
        setLoading(true);
        try {
            // Simple logic: keep same duration
            const oldStart = new Date(booking.startDate);
            const oldEnd = new Date(booking.endDate);
            const diff = oldEnd.getTime() - oldStart.getTime();

            const newStart = new Date(newStartDate);
            const newEnd = new Date(newStart.getTime() + diff);

            await updateBookingDate(booking.id, {
                startDate: newStart.toISOString(),
                endDate: newEnd.toISOString()
            });
            alert("Dates updated successfully");
            window.location.reload();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                className="border-2 border-gray-100 rounded-[32px] p-6 bg-white shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
                {booking.status === 'upcoming' && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -mr-12 -mt-12" />
                )}

                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                            <ReceiptText className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 uppercase italic tracking-tighter text-lg leading-tight">{booking.gym}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{booking.plan}</p>
                        </div>
                    </div>
                    <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full border shadow-sm ${config.color}`}>
                        {config.label}
                    </div>
                </div>

                {booking.status === 'cancelled' && (
                    <div className="mb-6 p-4 bg-red-50 border-2 border-red-100 rounded-2xl">
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1 flex justify-between">
                            <span>Termination Ledger</span>
                            <span className="text-red-600 italic">BY {booking.cancelledBy?.toUpperCase() || 'SYSTEM'}</span>
                        </p>
                        <p className="text-xs font-bold text-red-900 italic leading-tight">
                            "{booking.cancellationReason || 'Standard Termination protocol applied.'}"
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between bg-gray-50 p-5 rounded-[24px] border border-gray-100 mb-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-bold text-gray-600 uppercase">{booking.startDate} - {booking.endDate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-bold text-gray-600 uppercase">Universal Access</span>
                        </div>
                    </div>
                    <div className="text-xl font-black text-gray-900 italic">
                        ₹{booking.amount}
                    </div>
                </div>

                {booking.status === 'upcoming' && (
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={() => setShowQR(true)}
                            className="flex-[2] py-4 bg-black text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-black/10 hover:scale-[1.02] transition-all"
                        >
                            <QrCode className="w-4 h-4 text-primary" />
                            View Pass
                        </button>
                        <button
                            onClick={() => setShowManage(true)}
                            className="flex-1 py-4 bg-gray-50 text-gray-400 border-2 border-gray-100 rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gray-100 hover:text-black transition-all"
                            title="Manage Protocol"
                        >
                            <Settings2 className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {booking.status === 'completed' && (
                    <button
                        onClick={() => setShowReview(true)}
                        className="w-full py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                    >
                        <StarIcon className="w-4 h-4 text-black fill-black" />
                        Review Hub Performance
                    </button>
                )}
            </motion.div>

            <AnimatePresence>
                {showQR && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-sm rounded-[48px] p-10 flex flex-col items-center text-center relative shadow-2xl"
                        >
                            <button
                                onClick={() => setShowQR(false)}
                                className="absolute top-6 right-6 p-3 bg-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all"
                                title="Close Pass"
                            >
                                <X size={20} />
                            </button>

                            <div className="w-full mb-8">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">{booking.gym}</h3>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1 italic">{booking.plan} Elite Member</p>
                            </div>

                            <div className="relative p-8 bg-gray-50 rounded-[40px] border-2 border-gray-100 mb-8 w-full flex flex-col items-center">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-black text-white text-[8px] font-black uppercase tracking-[0.4em] rounded-full">
                                    LIVE AUTHENTICATOR
                                </div>
                                <div className="w-48 h-48 bg-white p-4 rounded-3xl border border-gray-200 shadow-inner flex items-center justify-center relative overflow-hidden group">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`GYMKAANA-${booking.id || (booking as any)._id}`)}&t=${Date.now()}`}
                                        alt="QR Code"
                                        className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50" />
                                </div>
                                <p className="text-[8px] font-black mt-4 text-gray-300 uppercase tracking-widest">ID: {(booking.id || (booking as any)._id).slice(-8).toUpperCase()}</p>
                            </div>

                            <div className="w-full space-y-4">
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">VALID UNTIL</span>
                                    <span className="text-xs font-black text-gray-900 uppercase italic">{booking.endDate}</span>
                                </div>
                                <div className="flex gap-4">
                                    <button className="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-gray-100 transition-all">Support</button>
                                    <button className="flex-1 py-4 bg-primary/10 text-primary rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-primary/20 transition-all">Refresh</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showManage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-sm rounded-[48px] overflow-hidden shadow-2xl"
                        >
                            <div className="bg-black p-8 text-white relative">
                                <button
                                    onClick={() => setShowManage(false)}
                                    className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
                                    title="Close"
                                >
                                    <X size={18} />
                                </button>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Manage Booking</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">ID: {booking.id.slice(-8).toUpperCase()}</p>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Terminate Protocol</h4>
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="w-full py-4 bg-red-50 text-red-600 border-2 border-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-100 transition-all"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        Cancel Booking
                                    </button>
                                    <p className="text-[8px] font-black text-gray-400 uppercase text-center leading-relaxed">
                                        * Cancellation available within 1hr of booking or before check-in.
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowManage(false);
                                        // Navigate to help or open chat
                                        alert("Please visit Help & Support in your profile to chat with an agent for manual overrides.");
                                    }}
                                    className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:text-black transition-colors"
                                >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    Request Manual Override
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            <ReviewModal
                booking={booking}
                isOpen={showReview}
                onClose={() => setShowReview(false)}
                onSuccess={() => {
                    alert("Report filed successfully. Thank you for scanning. ");
                }}
            />
        </>
    );
}
