import { ArrowLeft, Calendar, DollarSign, AlertCircle, CheckCircle2, X, RefreshCw, Loader2, QrCode } from "lucide-react";
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
      // Filter for "Active Pass" only notifications
      // This includes Check-ins and successful Bookings
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
    return BellIcon;
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Network Feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all group"
              title="Back to Command Center"
            >
              <ArrowLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase text-gray-900 leading-none mb-1">Pass Intelligence</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <RefreshCw className="w-3 h-3 text-primary" /> REAL-TIME ACTIVE PASS FEED
              </p>
            </div>
          </div>
          <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <div className="px-4 py-1 bg-white rounded-lg shadow-sm">
              <p className="text-[10px] font-black text-black uppercase tracking-tighter">{notifications.length} EVENTS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-10 max-w-3xl mx-auto space-y-6 pb-24">
        {notifications.map((notification, index) => {
          const Icon = getIcon(notification.action);
          return (
            <div
              key={notification._id}
              className="relative bg-white border border-gray-100 rounded-[32px] p-6 transition-all hover:shadow-xl hover:border-black group"
            >
              <div className="flex items-start gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border ${getIconColor(notification.action)} group-hover:bg-black group-hover:text-white group-hover:border-black transition-all`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-black italic uppercase tracking-tighter text-gray-900">
                      {notification.action}
                    </h3>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-relaxed max-w-lg italic">
                    {notification.description}
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{notification.gymId?.name || 'Local Hub'}</p>
                    </div>
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">LIVE EVENT</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-32 bg-gray-50/50 rounded-[48px] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-white shadow-lg rounded-3xl flex items-center justify-center mx-auto mb-6">
              <QrCode className="text-gray-200" size={40} />
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">No Pass Activity Detected</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2 max-w-[200px] mx-auto">Active pass events will appear here in real-time</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BellIcon(props: any) {
  return <RefreshCw {...props} />
}
