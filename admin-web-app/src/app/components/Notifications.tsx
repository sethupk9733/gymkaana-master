import { ArrowLeft, Calendar, DollarSign, AlertCircle, Bell, RefreshCw, Loader2, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchActivities } from "../lib/api";

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchActivities();
      // Filter for "Active Pass" only notifications for admin too
      const activeNotifications = data.filter((n: any) =>
        n.action?.toLowerCase().includes('check-in') ||
        n.action?.toLowerCase().includes('booking created') ||
        n.action?.toLowerCase().includes('verified')
      );
      setNotifications(activeNotifications);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getIcon = (action: string) => {
    if (action.toLowerCase().includes('check-in')) return QrCode;
    if (action.toLowerCase().includes('booking')) return Calendar;
    return Bell;
  };

  const getIconColor = (action: string) => {
    if (action.toLowerCase().includes('check-in')) return "bg-orange-100 text-orange-600 border-orange-200";
    if (action.toLowerCase().includes('booking')) return "bg-blue-100 text-blue-600 border-blue-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 mb-4 hover:text-black transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Support Intelligence</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">Active Pass Feed</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">REAL-TIME NETWORK TELEMETRY</p>
          </div>
          <div className="px-4 py-1 bg-gray-900 text-white rounded-lg">
            <p className="text-[10px] font-black uppercase tracking-widest">{notifications.length} Events</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-3xl mx-auto pb-24">
        <div className="space-y-4">
          {notifications.map((notification) => {
            const Icon = getIcon(notification.action);
            return (
              <div
                key={notification._id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-black transition-all group shadow-sm hover:shadow-xl"
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 ${getIconColor(
                      notification.action
                    )} group-hover:bg-black group-hover:text-white transition-all`}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-black italic uppercase tracking-tight text-gray-900">{notification.action}</h3>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{getTimeAgo(notification.createdAt)}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-3 leading-relaxed italic">{notification.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-black uppercase tracking-widest text-gray-500">
                        {notification.gymId?.name || 'Local Hub'}
                      </span>
                      {notification.userId?.name && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase tracking-widest border border-blue-100">
                          MEMBER: {notification.userId.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-white border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center mb-6">
              <QrCode size={40} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">No Network Activity</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Waiting for live pass events...</p>
          </div>
        )}
      </div>
    </div>
  );
}
