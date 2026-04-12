import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { BookingCard } from "./ui/BookingCard";
import { useState, useEffect } from "react";
import { fetchMyBookings } from "../lib/api";

export function BookingHistoryScreen({ onBack }: { onBack: () => void }) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetchMyBookings();
                setBookings(data);
            } catch (error) {
                console.error("Failed to load bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    // Filter bookings based on search query
    const filteredBookings = bookings.filter(b => {
        const searchLower = searchQuery.toLowerCase();
        return (
            b.gymId?.name?.toLowerCase().includes(searchLower) ||
            b.planId?.name?.toLowerCase().includes(searchLower) ||
            b.status?.toLowerCase().includes(searchLower) ||
            b._id?.toLowerCase().includes(searchLower)
        );
    });

    // Sort by date (latest first) and categorize
    const sortedBookings = [...filteredBookings].sort((a, b) =>
        new Date(b.createdAt || b.bookingDate).getTime() - new Date(a.createdAt || a.bookingDate).getTime()
    );

    const upcomingBookings = sortedBookings.filter(b => b.status === "upcoming" || b.status === "active");
    const pastBookings = sortedBookings.filter(b => b.status === "completed" || b.status === "cancelled");

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full bg-white flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-900">My Bookings</h2>
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by gym, plan, status, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="p-6">
                        {upcomingBookings.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Active Memberships ({upcomingBookings.length})</h3>
                                <div className="space-y-4">
                                    {upcomingBookings.map((booking) => (
                                        <BookingCard key={booking._id} booking={{
                                            id: booking._id,
                                            gym: booking.gymId?.name || "Gym",
                                            gymName: booking.gymId?.name || "Gym",
                                            plan: booking.planId?.name || "Plan",
                                            planName: booking.planId?.name || "Plan",
                                            date: new Date(booking.startDate).toLocaleDateString(),
                                            startDate: new Date(booking.startDate).toLocaleDateString(),
                                            endDate: new Date(booking.endDate).toLocaleDateString(),
                                            amount: booking.amount,
                                            gymId: booking.gymId?._id || booking.gymId,
                                            planId: booking.planId?._id || booking.planId,
                                            status: "upcoming"
                                        }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {pastBookings.length > 0 ? (
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Booking History ({pastBookings.length})</h3>
                                <div className="space-y-4">
                                    {pastBookings.map((booking) => (
                                        <BookingCard key={booking._id} booking={{
                                            id: booking._id,
                                            gym: booking.gymId?.name || "Gym",
                                            gymName: booking.gymId?.name || "Gym",
                                            plan: booking.planId?.name || "Plan",
                                            planName: booking.planId?.name || "Plan",
                                            date: new Date(booking.startDate).toLocaleDateString(),
                                            startDate: new Date(booking.startDate).toLocaleDateString(),
                                            endDate: new Date(booking.endDate).toLocaleDateString(),
                                            amount: booking.amount,
                                            gymId: booking.gymId?._id || booking.gymId,
                                            planId: booking.planId?._id || booking.planId,
                                            status: booking.status,
                                            cancellationReason: booking.cancellationReason,
                                            cancelledBy: booking.cancelledBy
                                        }} />
                                    ))}
                                </div>
                            </div>
                        ) : upcomingBookings.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-sm">No bookings found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
