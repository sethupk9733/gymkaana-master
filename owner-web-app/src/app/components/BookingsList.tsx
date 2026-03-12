import { Clock, CheckCircle, XCircle, Calendar, MapPin, Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { fetchBookings } from "../lib/api";

interface BookingsListProps {
  onBookingSelect: (bookingId: number) => void;
}

export function BookingsList({ onBookingSelect }: BookingsListProps) {
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await fetchBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    // 1. Text Search Filter
    const matchesSearch =
      (booking.userId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.gymId?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking._id.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    // 2. Status Tab Filter
    const status = booking.status.toLowerCase();
    if (activeFilter === "upcoming") return status === "upcoming";
    if (activeFilter === "active") return status === "active" || status === "checked-in";
    if (activeFilter === "completed") return status === "completed";
    if (activeFilter === "cancelled") return status === "cancelled" || status === "rejected";

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "active":
      case "checked-in":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black uppercase italic tracking-tighter">Client Deployments</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="SEARCH BY IDENTITY, FACILITY, OR ID..."
              className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors font-bold text-xs tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b-2 border-gray-100 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['upcoming', 'active', 'completed', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeFilter === filter
                ? "bg-black text-white shadow-lg"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-6 py-6 max-w-4xl mx-auto min-h-[50vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-black mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Network...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <p className="font-bold uppercase tracking-widest text-xs">No {activeFilter} entities found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                onClick={() => onBookingSelect(booking._id)}
                className="bg-white rounded-xl shadow-sm border-2 border-gray-100 p-5 hover:border-black transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Status Indicator */}
                <div className={getStatusColor(booking.status).split(' ')[0] + " absolute top-0 left-0 w-1.5 h-full"}></div>

                {/* User Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black text-xl shadow-lg border-2 border-white overflow-hidden">
                      {booking.userId?.profileImage ? (
                        <img src={booking.userId.profileImage} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        (booking.userId?.name || "U").charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter transition-colors">{booking.userId?.name || 'Anonymous Client'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase tracking-widest border border-blue-100">
                          {booking.planId?.name || "Tier: Standard"}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">#{booking._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-md text-[9px] font-black border-2 ${getStatusColor(booking.status).replace('bg-', 'border-').replace('text-', 'text-')} bg-white shadow-sm uppercase tracking-[0.2em]`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <p className="text-sm font-black text-black">₹{booking.amount || 0}</p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 pt-4 border-t-2 border-gray-50 mt-2">
                  <div className="flex items-center gap-3 text-xs">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-black uppercase tracking-widest text-gray-900">{booking.gymId?.name || "Unknown Facility"}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase truncate max-w-[200px]">{booking.gymId?.address || "Address Requested"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs md:justify-end">
                    <div className="text-right">
                      <p className="font-black uppercase tracking-widest text-gray-900">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">{booking.bookingTime || "SCHEDULE TBD"}</p>
                    </div>
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
