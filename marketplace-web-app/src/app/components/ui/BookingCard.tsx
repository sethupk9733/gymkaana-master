import { Calendar, CheckCircle2, Clock, MapPin, ReceiptText } from "lucide-react";
import { motion } from "motion/react";
import { Booking } from "../../types";

export function BookingCard({ booking }: { booking: Booking }) {
    const statusConfig = {
        completed: { color: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Completed" },
        cancelled: { color: "bg-red-50 text-red-700 border-red-100", label: "Cancelled" },
        upcoming: { color: "bg-indigo-50 text-indigo-700 border-indigo-100", label: "Scheduled" },
    };

    const config = statusConfig[booking.status];

    return (
        <motion.div
            whileHover={{ x: 5 }}
            className="border border-gray-100 rounded-[28px] p-5 bg-white shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ReceiptText className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 uppercase italic tracking-tight">{booking.gymName}</h4>
                        <p className="text-sm font-bold text-gray-400">{booking.planName}</p>
                    </div>
                </div>
                <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border ${config.color}`}>
                    {config.label}
                </div>
            </div>

            <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-gray-700">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-gray-700">10:30 AM</span>
                    </div>
                </div>
                <div className="text-lg font-black text-gray-900 italic">
                    {booking.amount}
                </div>
            </div>
        </motion.div>
    );
}
