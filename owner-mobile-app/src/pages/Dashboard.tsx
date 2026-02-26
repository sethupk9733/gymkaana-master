import { useNavigate } from 'react-router-dom';
import { Users, IndianRupee, QrCode, Building, TrendingUp, History, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchActivities, logout } from '../lib/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [stats, act] = await Promise.all([
                    fetchDashboardStats(),
                    fetchActivities()
                ]);
                setStatsData(stats);
                setActivities(act.slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Waking up Engine...</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Daily Entry',
            value: statsData?.dailyCheckins?.toString() || '0',
            icon: QrCode,
            change: '+0%',
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            label: 'Total Bookings',
            value: statsData?.totalBookingCount?.toLocaleString() || '0',
            icon: Users,
            change: '+0%',
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Total Revenue',
            value: statsData?.totalRevenue ? `₹${(statsData.totalRevenue / 1000).toFixed(1)}K` : '₹0',
            icon: IndianRupee,
            change: '+0%',
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Member Rating',
            value: statsData?.averageRating || '0.0',
            icon: Star,
            change: '+0.0',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
        },
    ];

    const quickActions = [
        { label: 'Add Gym', icon: Building, path: '/gyms/add', color: 'bg-primary' },
        { label: 'Scan QR', icon: QrCode, path: '/check-in', color: 'bg-orange-500' },
        { label: 'Earnings', icon: TrendingUp, path: '/earnings', color: 'bg-emerald-600' },
        { label: 'Accounting', icon: History, path: '/accounting', color: 'bg-black' },
        { label: 'Reviews', icon: Star, path: '/reviews', color: 'bg-purple-600' },
    ];

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto pb-24">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-[1000] tracking-[-0.08em] uppercase flex items-center -skew-x-12">
                        <span className="text-secondary">GYM</span>
                        <span className="text-primary italic mx-0.5">KAA</span>
                        <span className="text-secondary">NA</span>
                    </h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Status: Operational</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => {
                            await logout();
                            navigate('/login');
                        }}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-red-100 active:scale-95 transition-all"
                        title="Emergency Logout"
                    >
                        Reset Session
                    </button>
                    <button
                        onClick={() => navigate('/history')}
                        className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all active:scale-95"
                        title="View History"
                        aria-label="View History"
                    >
                        <History className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-gray-50 flex flex-col justify-between group hover:border-primary/20 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", stat.bg)}>
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <span className="text-[9px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{stat.change}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-3xl font-black italic tracking-tighter text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 px-1 italic">Tactical Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(action.path)}
                            className="group flex flex-col items-center justify-center p-6 bg-white rounded-[32px] shadow-sm border-2 border-gray-50 hover:border-black transition-all"
                        >
                            <div className={cn("p-4 rounded-2xl mb-4 text-white shadow-xl group-hover:rotate-6 transition-all", action.color)}>
                                <action.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-none">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Live Intelligence</h2>
                    <button
                        onClick={() => navigate('/history')}
                        className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline px-2 py-1 bg-primary/10 rounded-lg"
                    >
                        Historical Feed
                    </button>
                </div>
                <div className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden divide-y-2 divide-gray-50">
                    {activities.length > 0 ? activities.map((item) => (
                        <div key={item._id} className="p-6 flex flex-col space-y-2 hover:bg-gray-50 transition-colors group">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors">{item.description}</p>
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap ml-4">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Building size={10} className="text-gray-300" />
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.gymId?.name || 'Hub Asset'}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest italic">No Live Intelligence Available</div>
                    )}
                </div>
            </div>
        </div>
    );
}
