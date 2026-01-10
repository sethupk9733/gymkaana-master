import { ArrowLeft, Calendar, DollarSign, AlertCircle, Bell } from "lucide-react";
import { Button } from "./ui/button";

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  const notifications = [
    {
      id: 1,
      type: "booking",
      icon: Calendar,
      title: "New Booking Request",
      message: "Rahul Sharma requested a Monthly Plan booking",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "payment",
      icon: DollarSign,
      title: "Payment Received",
      message: "₹2,500 received from Priya Singh for Monthly Plan",
      time: "12 min ago",
      unread: true,
    },
    {
      id: 3,
      type: "booking",
      icon: Calendar,
      title: "Booking Confirmed",
      message: "Amit Kumar's Quarterly plan booking confirmed",
      time: "25 min ago",
      unread: true,
    },
    {
      id: 4,
      type: "alert",
      icon: AlertCircle,
      title: "Membership Expiring Soon",
      message: "5 memberships will expire in the next 7 days",
      time: "1 hour ago",
      unread: false,
    },
    {
      id: 5,
      type: "payment",
      icon: DollarSign,
      title: "Payment Received",
      message: "₹150 received from Vikram Joshi for Daily Pass",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: 6,
      type: "booking",
      icon: Calendar,
      title: "New Booking Request",
      message: "Neha Patel requested a Weekly Plan booking",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 7,
      type: "alert",
      icon: AlertCircle,
      title: "Low Check-in Rate",
      message: "Only 15 check-ins today. Average is 35",
      time: "5 hours ago",
      unread: false,
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-gray-900 text-white";
      case "payment":
        return "bg-gray-700 text-white";
      case "alert":
        return "bg-gray-300 text-gray-700";
      default:
        return "bg-gray-200 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 mb-4">
          <ArrowLeft size={20} />
          <span>Notifications</span>
        </button>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">You have 3 unread notifications</p>
          <button className="text-sm text-gray-600 underline">Mark all as read</button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white border-2 rounded-lg p-4 ${
                notification.unread
                  ? "border-gray-900"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(
                    notification.type
                  )}`}
                >
                  <notification.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm">{notification.title}</h3>
                    {notification.unread && (
                      <span className="w-2 h-2 bg-gray-900 rounded-full flex-shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (hidden when there are notifications) */}
        {/* <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Bell size={32} className="text-gray-400" />
          </div>
          <h3 className="text-base mb-2">No notifications</h3>
          <p className="text-sm text-gray-500 text-center">
            You're all caught up! New notifications will appear here.
          </p>
        </div> */}
      </div>
    </div>
  );
}
