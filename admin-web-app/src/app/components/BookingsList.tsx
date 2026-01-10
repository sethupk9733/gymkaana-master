import { Clock, CheckCircle, XCircle, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

interface BookingsListProps {
  onBookingSelect: (bookingId: number) => void;
}

export function BookingsList({ onBookingSelect }: BookingsListProps) {
  const [activeFilter, setActiveFilter] = useState("upcoming");

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
  ];

  const filteredBookings = bookings.filter((booking) => {
    if (activeFilter === "upcoming") return booking.status === "Upcoming";
    if (activeFilter === "active") return booking.status === "Active";
    if (activeFilter === "cancelled") return booking.status === "Cancelled";
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-700";
      case "Active":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage member bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveFilter("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "upcoming"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilter("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "active"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter("cancelled")}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeFilter === "cancelled"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="px-6 py-6 max-w-4xl mx-auto">
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => onBookingSelect(booking.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* User Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                    {booking.user.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{booking.user}</h3>
                    <p className="text-sm text-gray-600">{booking.plan}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              {/* Booking Details */}
              <div className="space-y-2 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{booking.gym}</span>
                  <span className="text-gray-400">•</span>
                  <span>{booking.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{booking.date}</span>
                  <span className="text-gray-400">•</span>
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{booking.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
