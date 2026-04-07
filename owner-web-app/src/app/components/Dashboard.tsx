import { Bell, Users, Activity, DollarSign, Clock, Plus, TrendingUp, Eye, Building, QrCode, IndianRupee, ArrowUpRight, Target, Zap, ShieldCheck, ChevronRight, Filter, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDashboardStats, fetchBookings, fetchGyms } from "../lib/api";
import { motion } from "motion/react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  onNavigateToNotifications: () => void;
  onNavigateToPayouts: () => void;
  onNavigateToQR: () => void;
  onNavigateToAccounting: () => void;
  onNavigateToBookings: () => void;
  onAddGym: () => void;
  onAddPlan: () => void;
  onManagePlans: (gymId: string) => void;
}

export function Dashboard({ onNavigateToNotifications, onNavigateToPayouts, onNavigateToQR, onNavigateToAccounting, onNavigateToBookings, onAddGym, onAddPlan, onManagePlans }: DashboardProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [gymPerformance, setGymPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rawStats, setRawStats] = useState<any>(null);
  const [selectedGymId, setSelectedGymId] = useState<string>('all');
  const [myGyms, setMyGyms] = useState<any[]>([]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsData, bookingsData, gymsData] = await Promise.all([
        fetchDashboardStats(selectedGymId),
        fetchBookings(),
        fetchGyms()
      ]);

      if (gymsData) setMyGyms(gymsData);

      if (statsData) {
        setRawStats(statsData);
        if (statsData.gymPerformance) {
          setGymPerformance(statsData.gymPerformance);
        }
        setStats([
          {
            label: 'Daily Entry',
            value: statsData.dailyCheckins || '0',
            icon: QrCode,
            change: '+0%',
            color: 'text-orange-600',
            bg: 'bg-orange-50'
          },
          {
            label: 'Total Bookings',
            value: statsData.totalBookingCount || '0',
            icon: Users,
            change: '+0%',
            color: 'text-blue-600',
            bg: 'bg-blue-50'
          },
          {
            label: 'Total Revenue',
            value: `₹${((statsData.totalRevenue || 0) / 1000).toFixed(1)}K`,
            icon: IndianRupee,
            change: statsData.revenueTrend || '+0%',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
          },
          {
            label: 'Member Rating',
            value: statsData.averageRating || '0.0',
            icon: Star,
            change: '+0.0',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50'
          },
        ]);
      }

      if (bookingsData) {
        setActivities(bookingsData.slice(0, 5).map((b: any) => ({
          id: b._id,
          text: `${b.userId?.name || b.memberName || 'Member'} booked ${b.planId?.name || 'Membership'}`,
          time: new Date(b.bookingDate || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          gym: b.gymId?.name || 'Venue',
          amount: b.amount,
          status: b.status
        })));
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [selectedGymId]);

  const chartData = gymPerformance.map(g => ({
    name: g.name,
    value: g.revenue
  }));

  const quickActions = [
    { label: 'Register Gym', icon: Building, color: 'bg-gray-900', onClick: onAddGym, desc: 'Add new venue' },
    {
      label: 'Configure Pricing', icon: DollarSign, color: 'bg-indigo-600', onClick: () => {
        if (selectedGymId === 'all') {
          if (myGyms.length > 0) {
            onManagePlans(myGyms[0]._id);
          } else {
            onAddGym();
          }
        } else {
          onManagePlans(selectedGymId);
        }
      }, desc: 'Manage Tiers'
    },
    { label: 'Accounting', icon: DollarSign, color: 'bg-blue-600', onClick: onNavigateToAccounting, desc: 'Ledger & Reports' },
    { label: 'Earnings', icon: IndianRupee, color: 'bg-emerald-600', onClick: onNavigateToPayouts, desc: 'Track revenue' },
    { label: 'Scan QR', icon: QrCode, color: 'bg-orange-500', onClick: onNavigateToQR, desc: 'Member entry' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="rounded-full h-10 w-10 border-b-2 border-primary"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-10">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase text-gray-900">Partner Command</h1>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
              <Target className="w-3 h-3 text-primary" /> REAL-TIME VENUE PERFORMANCE
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Hub Selector */}
            <div className="hidden md:flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedGymId}
                onChange={(e) => setSelectedGymId(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                title="Select Hub"
              >
                <option value="all">All Channels</option>
                {myGyms.map(gym => (
                  <option key={gym._id} value={gym._id}>{gym.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={onNavigateToNotifications}
              className="relative p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group"
              title="Notifications"
            >
              <Bell size={20} className="text-gray-600 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white font-black italic shadow-lg shadow-black/10">O</div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-10 max-w-6xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-xl hover:border-black transition-all"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:bg-black group-hover:text-white transition-all`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest">
                  <TrendingUp className="w-3 h-3" /> {stat.change}
                </div>
              </div>
              <div>
                <p className="text-4xl font-black italic tracking-tighter text-gray-900 mb-1">{stat.value}</p>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-400 italic">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Revenue Performance */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black italic tracking-tighter uppercase text-gray-900">Revenue Velocity</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional yield across hubs</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">Month</button>
                  <button className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Year</button>
                </div>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'Hub A', value: 4000 }, { name: 'Hub B', value: 3000 }]}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#000" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#000" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-50">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Hubs</p>
                  <p className="font-black italic text-lg uppercase tracking-tight">{gymPerformance.length}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Ticket</p>
                  <p className="font-black italic text-lg uppercase tracking-tight">₹{Math.round((rawStats?.totalRevenue || 0) / (rawStats?.totalMembers || 1))}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Payouts</p>
                  <p className="font-black italic text-lg uppercase tracking-tight text-emerald-600">YES</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">System Health</p>
                  <div className="flex items-center gap-1.5 font-black italic text-lg uppercase tracking-tight">
                    <Zap className="w-4 h-4 text-primary" /> 100%
                  </div>
                </div>
              </div>
            </div>

            {/* Venue List */}
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black italic tracking-tighter uppercase text-gray-900">Asset Distribution</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Live metrics per venue</p>
                </div>
                <button onClick={onAddGym} className="p-3 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all" title="Add New Gym">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {gymPerformance.map((gym: any) => (
                  <div key={gym._id} className="flex items-center justify-between p-6 bg-gray-50/50 rounded-[28px] hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200 group">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black italic text-xl shadow-sm group-hover:bg-black group-hover:text-white transition-all">
                        {gym.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black italic text-gray-900 uppercase tracking-tight">{gym.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{gym.members} USERS</span>
                          <div className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{gym.bookingCount} BOOKINGS</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-lg font-black italic tracking-tighter">₹{gym.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-lg border border-gray-100">
                        <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                        <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest">{gym.status.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel: Actions & Activity */}
          <div className="lg:col-span-4 space-y-10">
            {/* Modern Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-4">Global Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="group flex flex-col p-6 bg-white rounded-[32px] border border-gray-100 hover:border-black shadow-sm transition-all text-left space-y-4"
                    title={action.label}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${action.color}`}>
                      <action.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-tight text-gray-900 leading-tight">{action.label}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feed (Activities) */}
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-black italic uppercase tracking-tighter">Event Feed</h2>
                <Clock className="w-4 h-4 text-gray-300" />
              </div>
              <div className="space-y-8">
                {activities.map((item, index) => (
                  <div key={item.id} className="relative pl-6 space-y-1 group">
                    {index !== activities.length - 1 && (
                      <div className="absolute left-1.5 top-6 bottom-[-32px] w-px bg-gray-100" />
                    )}
                    <div className="absolute left-0 top-1.5 w-3 h-3 bg-white border-2 border-primary rounded-full z-10 group-hover:bg-primary transition-colors" />
                    <div className="flex justify-between items-start">
                      <p className="text-[11px] font-black uppercase italic tracking-tight text-gray-900">{item.text}</p>
                      <span className="text-[8px] text-gray-400 font-bold uppercase whitespace-nowrap ml-2">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[8px] text-primary font-black uppercase tracking-widest">{item.gym}</p>
                      <div className="w-1 h-1 bg-gray-200 rounded-full" />
                      <p className="text-[8px] text-gray-400 font-black tracking-widest">₹{item.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={onNavigateToBookings}
                className="w-full py-4 bg-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                title="View Full Matrix"
              >
                View Matrix <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
