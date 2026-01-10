import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { BookingCard } from "./ui/BookingCard";
import { bookings } from "../data/mockData";

export function BookingHistoryScreen({ onBack }: { onBack: () => void }) {
    const upcomingBookings = bookings.filter(b => b.status === "upcoming");
    const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full bg-white flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30">
                <div className="p-6">
                    {upcomingBookings.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Upcoming Sessions</h3>
                            <div className="space-y-4">
                                {upcomingBookings.map((booking) => (
                                    <BookingCard key={booking.id} booking={booking} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Booking History</h3>
                        <div className="space-y-4">
                            {pastBookings.map((booking) => (
                                <BookingCard key={booking.id} booking={booking} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
