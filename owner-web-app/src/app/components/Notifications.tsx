import { ArrowLeft, Calendar, DollarSign, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useState } from "react";

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  // Mock data with relative days for grouping logic (0 = today, 1 = yesterday)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      icon: Calendar,
      title: "New Booking Request",
      message: "Rahul Sharma requested a Monthly Plan booking",
      time: "5 min ago",
      unread: true,
      dayOffset: 0,
    },
    {
      id: 2,
      type: "payment",
      icon: DollarSign,
      title: "Payment Received",
      message: "₹2,500 received from Priya Singh",
      time: "12 min ago",
      unread: true,
      dayOffset: 0,
    },
    {
      id: 3,
      type: "booking",
      icon: CheckCircle2,
      title: "Booking Confirmed",
      message: "Amit Kumar's Quarterly plan booking confirmed",
      time: "2 hours ago",
      unread: true,
      dayOffset: 0,
    },
    {
      id: 4,
      type: "alert",
      icon: AlertCircle,
      title: "Membership Expiring Soon",
      message: "5 memberships will expire in the next 7 days",
      time: "Yesterday",
      unread: false,
      dayOffset: 1,
    },
    {
      id: 5,
      type: "payment",
      icon: DollarSign,
      title: "Payment Received",
      message: "₹150 received from Vikram Joshi",
      time: "Yesterday",
      unread: false,
      dayOffset: 1,
    },
    {
      id: 6,
      type: "alert",
      icon: AlertCircle,
      title: "Low Check-in Rate",
      message: "Only 15 check-ins on Sunday. Average is 35",
      time: "2 days ago",
      unread: false,
      dayOffset: 2,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "payment":
        return "bg-green-100 text-green-600 border-green-200";
      case "alert":
        return "bg-orange-100 text-orange-600 border-orange-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  // Grouping logic
  const groupedNotifications = {
    Today: notifications.filter(n => n.dayOffset === 0),
    Yesterday: notifications.filter(n => n.dayOffset === 1),
    Older: notifications.filter(n => n.dayOffset > 1),
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-100 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Back">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            You have <span className="text-gray-900 font-bold">{unreadCount} unread</span> notifications
          </p>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-20 max-w-3xl mx-auto space-y-8">
        {Object.entries(groupedNotifications).map(([group, items]) => (
          items.length > 0 && (
            <div key={group}>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">{group}</h2>
              <div className="space-y-3">
                {items.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative bg-white border rounded-xl p-4 transition-all hover:shadow-md group ${notification.unread
                        ? "border-l-4 border-l-blue-600 border-y-gray-100 border-r-gray-100 bg-blue-50/30"
                        : "border-gray-100"
                      }`}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                      className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      title="Remove notification"
                    >
                      <X size={14} />
                    </button>

                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${getIconColor(
                          notification.type
                        )}`}
                      >
                        <notification.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between mb-1 pr-6">
                          <h3 className={`text-sm ${notification.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {notification.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">{notification.message}</p>
                        <p className="text-xs font-medium text-gray-400">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-gray-400" size={32} />
            </div>
            <h3 className="text-gray-900 font-medium">No notifications</h3>
            <p className="text-gray-500 text-sm mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
