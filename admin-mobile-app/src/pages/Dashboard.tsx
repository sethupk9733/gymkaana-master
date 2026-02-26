import { useNavigate } from 'react-router-dom';
import { Users, IndianRupee, QrCode, Building, TrendingUp, History, Dumbbell } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../lib/api';
import { API_URL } from '../config/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await fetchDashboardStats();
                setStatsData(data);

                // Fetch recent bookings as activities
                const response = await fetch(`${API_URL}/bookings`);
                if (response.ok) {
                    const bookings = await response.json();
                    setActivities(bookings.slice(0, 5).map((b: any) => ({
                        id: b._id,
                        text: `New booking: ${b.planName || 'Plan'} by ${b.user || 'Member'}`,
                        time: 'Just now',
                        gym: b.gym || 'Venue'
                    })));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return <div className="p-4 text-center">Loading dashboard...</div>;
    }

    const stats = [
        {
            label: 'Active Members',
            value: statsData?.totalMembers?.toLocaleString() || '0',
            icon: Users,
            change: '+12%',
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Total Revenue',
            value: `₹${((statsData?.totalRevenue || 0) / 100000).toFixed(1)}L`,
            icon: IndianRupee,
            change: '+8%',
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Check-ins Today',
            value: statsData?.dailyCheckins?.toString() || '0',
            icon: QrCode,
            change: '+24%',
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
    ];

    const quickActions = [
        { label: 'Add Gym', icon: Building, path: '/gyms/add', color: 'bg-primary' },
        { label: 'Add Plan', icon: Dumbbell, path: '/plans/add', color: 'bg-indigo-600' }, // Requires select gym first
        { label: 'View Earnings', icon: TrendingUp, path: '/earnings', color: 'bg-emerald-600' }, // Default to all
        { label: 'QR Check-in', icon: QrCode, path: '/check-in', color: 'bg-orange-600' },
    ];

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 text-sm">Welcome back, Owner!</p>
                </div>
                <button
                    onClick={() => navigate('/history')}
                    className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors active:scale-95"
                    title="View History"
                    aria-label="View History"
                >
                    <History className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                            <div className={cn("p-2 rounded-lg", stat.bg)}>
                                <stat.icon className={cn("w-5 h-5", stat.color)} />
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
                            onClick={() => navigate(action.path)}
                            className="group flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-300 transition-all"
                        >
                            <div className={cn("p-3 rounded-full mb-2 text-white shadow-md group-hover:scale-110 transition-transform", action.color)}>
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
                    <button
                        onClick={() => navigate('/history')}
                        className="text-sm font-bold text-primary hover:text-secondary active:scale-95 transition-all"
                    >
                        View All
                    </button>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {activities.map((item, index) => (
                        <div key={item.id} className={cn("p-4 flex flex-col space-y-1 hover:bg-gray-50", index !== activities.length - 1 && "border-b border-gray-100")}>
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-gray-900">{item.text}</p>
                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
                            </div>
                            <p className="text-xs text-primary font-medium">{item.gym}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
