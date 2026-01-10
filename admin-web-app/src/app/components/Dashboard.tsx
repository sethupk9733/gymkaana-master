import { Bell, Users, Activity, DollarSign, Clock, Plus, TrendingUp, Eye, Building, QrCode, IndianRupee } from "lucide-react";

interface DashboardProps {
  onNavigateToNotifications: () => void;
  onNavigateToPayouts: () => void;
  onNavigateToQR: () => void;
}

export function Dashboard({ onNavigateToNotifications, onNavigateToPayouts, onNavigateToQR }: DashboardProps) {
  const stats = [
    {
      label: 'Active Members',
      value: '770',
      icon: Users,
      change: '+12%',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Total Revenue',
      value: '₹4.3L',
      icon: IndianRupee,
      change: '+8%',
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Check-ins Today',
      value: '142',
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

  const activities = [
    { id: 1, text: 'New member joined Gold Plan', time: '2 mins ago', gym: 'Main Branch' },
    { id: 2, text: 'Payment received ₹2,500', time: '15 mins ago', gym: 'Downtown Gym' },
    { id: 3, text: 'New 5-star review received', time: '1 hour ago', gym: 'Main Branch' },
    { id: 4, text: 'Equipment maintenance due', time: '3 hours ago', gym: 'CrossFit Zone' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Welcome back, Owner!</p>
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

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-all">
              View All
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {activities.map((item, index) => (
              <div
                key={item.id}
                className={`p-4 flex flex-col space-y-1 hover:bg-gray-50 ${index !== activities.length - 1 && "border-b border-gray-100"}`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900">{item.text}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
                </div>
                <p className="text-xs text-blue-600 font-medium">{item.gym}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
