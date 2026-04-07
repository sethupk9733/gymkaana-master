import { Bell, Users, Activity, DollarSign, Clock, Plus, TrendingUp, Eye, Building, QrCode, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardProps {
  onNavigateToNotifications: () => void;
  onNavigateToPayouts: () => void;
  onNavigateToQR: () => void;
}

export function Dashboard({ onNavigateToNotifications, onNavigateToPayouts, onNavigateToQR }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('gymkaana_token');
        const response = await fetch('http://localhost:5000/api/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 Dashboard data received:', data);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const stats = [
    {
      label: 'Active Members',
      value: loading ? '...' : (dashboardData?.activeMembers || 0).toString(),
      icon: Users,
      change: '+12%',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Total Revenue',
      value: loading ? '...' : `₹${(dashboardData?.totalRevenue || 0) / 100000}L`,
      icon: IndianRupee,
      change: '+8%',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Check-ins Today',
      value: loading ? '...' : (dashboardData?.checkInsToday || 0).toString(),
      icon: QrCode,
      change: '+24%',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
  ];

  const quickActions = [
    { label: 'Add Gym', icon: Building, color: 'bg-blue-600' },
    { label: 'Add Plan', icon: Plus, color: 'bg-indigo-600' },
    { label: 'View Earnings', icon: TrendingUp, color: 'bg-emerald-600', onClick: onNavigateToPayouts },
    { label: 'QR Check-in', icon: QrCode, color: 'bg-orange-600', onClick: onNavigateToQR },
  ];

  // Display gym performance or owner performance based on role
  const performanceData = dashboardData?.gymPerformance || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, Admin! Viewing data from all gym owners</p>
            </div>
            <button
              onClick={onNavigateToNotifications}
              className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              title="Notifications"
            >
              <Bell size={20} className="text-gray-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            Error loading dashboard: {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.change}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-all"
              >
                <div className={`p-3 rounded-full mb-2 text-white shadow-md group-hover:scale-110 transition-transform ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Gym Performance (All Gyms) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Gyms</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-all">
              View All
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-6 text-center text-gray-500">Loading gym performance data...</div>
            ) : performanceData.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No gym data available</div>
            ) : (
              performanceData.slice(0, 5).map((gym, index) => (
                <div
                  key={gym._id}
                  className={`p-4 flex justify-between items-center hover:bg-gray-50 ${
                    index !== performanceData.slice(0, 5).length - 1 && "border-b border-gray-100"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{gym.name || 'Unknown Gym'}</p>
                    <p className="text-xs text-gray-500 mt-1">{gym.bookingCount || 0} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{(gym.revenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{gym.members || 0} members</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
