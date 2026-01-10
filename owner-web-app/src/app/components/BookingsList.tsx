import { Clock, CheckCircle, XCircle, Calendar, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

interface BookingsListProps {
  onBookingSelect: (bookingId: number) => void;
}

export function BookingsList({ onBookingSelect }: BookingsListProps) {
  const [activeFilter, setActiveFilter] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const bookings = [
    {
      id: 1,
      user: "Rahul Sharma",
      gym: "Main Branch",
      location: "Koramangala",
      date: "Dec 05, 2023",
      time: "07:00 AM",
      status: "Upcoming",
      plan: "Gold Membership",
    },
    {
      id: 2,
      user: "Priya Singh",
      gym: "Downtown Gym",
      location: "Indiranagar",
      date: "Dec 06, 2023",
      time: "06:00 PM",
      status: "Upcoming",
      plan: "Silver Membership",
    },
    {
      id: 3,
      user: "Amit Kumar",
      gym: "Main Branch",
      location: "Koramangala",
      date: "Dec 03, 2023",
      time: "08:00 AM",
      status: "Active",
      plan: "Platinum Membership",
    },
    {
      id: 4,
      user: "Neha Patel",
      gym: "Downtown Gym",
      location: "Indiranagar",
      date: "Nov 28, 2023",
      time: "07:30 AM",
      status: "Cancelled",
      plan: "Gold Membership",
    },
    {
      id: 5,
      user: "Suresh Raina",
      gym: "Main Branch",
      location: "Koramangala",
      date: "Nov 20, 2023",
      time: "06:00 AM",
      status: "Completed",
      plan: "Daily Pass",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    // 1. Text Search Filter
    const matchesSearch =
      booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.gym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toString().includes(searchQuery);

    if (!matchesSearch) return false;

    // 2. Status Tab Filter
    if (activeFilter === "upcoming") return booking.status === "Upcoming";
    if (activeFilter === "active") return booking.status === "Active";
    if (activeFilter === "completed") return booking.status === "Completed";
    if (activeFilter === "cancelled") return booking.status === "Cancelled";

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Active":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-gray-100 text-gray-700";
      case "Cancelled":
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
              <p className="text-gray-500 text-sm mt-1">Manage member bookings</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by member name, gym, or ID..."
              className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
          {['upcoming', 'active', 'completed', 'cancelled'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize ${activeFilter === filter
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-6 py-6 max-w-4xl mx-auto min-h-[50vh]">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
            <p>No {activeFilter} bookings found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => onBookingSelect(booking.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer group"
              >
                {/* User Info */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-sm">
                      {booking.user.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{booking.user}</h3>
                      <p className="text-sm text-gray-500 font-medium">{booking.plan || "N/A"}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status).replace('bg-', 'border-').replace('text-', 'text-')} bg-opacity-10`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 pt-3 border-t border-gray-50 mt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium truncate">{booking.gym}</span>
                    <span className="text-gray-300 hidden md:inline">•</span>
                    <span className="truncate text-gray-500 hidden md:inline">{booking.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 md:justify-end">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-medium">{booking.date}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-medium">{booking.time}</span>
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
