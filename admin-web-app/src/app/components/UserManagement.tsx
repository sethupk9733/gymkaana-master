import { Search, MoreHorizontal, User as UserIcon, ShieldAlert, Mail, MapPin, Calendar, Ban, CheckCircle, CreditCard, ChevronRight, X, Activity, Dumbbell, Clock, MessageSquare, AlertCircle, TrendingUp, Loader2, History, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchUsers, getToken } from "../lib/api";

interface UserDetail {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    status: 'Active' | 'Inactive' | 'Pending';
    totalBookings: number;
    totalSpent: number;
    favoriteGym: string;
    lastActive: string;
    credits: number;
    location: string;
    riskScore: 'Low' | 'Medium' | 'High';
    age?: number;
    gender?: string;
    address?: string;
    activities?: any[];
}


export function UserManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<UserDetail[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (getToken()) {
                loadUsers();
                clearInterval(interval);
            }
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUsers();
            if (!Array.isArray(data)) throw new Error("Invalid user list received");
            
            const mappedUsers: UserDetail[] = data.map((u: any, index: number) => {
                // Determine address string from potential address object or string
                let fullAddress = "No address data";
                if (typeof u.address === 'string') {
                    fullAddress = u.address;
                } else if (u.address && typeof u.address === 'object') {
                    fullAddress = `${u.address.addressLine || ''} ${u.address.city || ''} ${u.address.state || ''}`.trim() || "No address data";
                }

                return {
                    id: u._id || u.id || `user-${index}`,
                    name: String(u.name || "Unknown Citizen"),
                    email: String(u.email || "N/A"),
                    phone: String(u.phoneNumber || u.phone || "N/A"),
                    joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A",
                    status: 'Active',
                    totalBookings: Number(u.bookingsCount || 0),
                    totalSpent: Number(u.totalSpent || 0),
                    favoriteGym: "Unknown Hub",
                    lastActive: u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "Today",
                    credits: 0,
                    location: fullAddress,
                    riskScore: (u.bookingsCount === 0) ? 'Medium' : 'Low',
                    age: u.age || u.profile?.age || 25,
                    gender: u.gender || u.profile?.gender || 'Not Specified',
                    address: fullAddress,
                    activities: u.recentActivities || []
                };
            });
            setUsers(mappedUsers);

        } catch (err: any) {
            setError(err.message || "Failed to load citizens.");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20 font-sans">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">User Collective</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1 italic flex items-center gap-2">
                        <Activity className="w-3 h-3 text-primary animate-pulse" /> Live membership stream & identity verification
                    </p>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Active Citizens" value={users.length} sub="Currently enrolled" icon={UserIcon} color="primary" />
                <StatCard label="Engagement Index" value={users.reduce((acc, u) => acc + (u.totalBookings || 0), 0)} sub="Total bookings processed" icon={TrendingUp} color="emerald" />
                <StatCard label="Platform Integrity" value="100%" sub="Identity Security Score" icon={ShieldAlert} color="blue" />
                <StatCard label="Live Stream" value="Active" sub="Server connected" icon={Clock} color="orange" />
            </div>

            {/* Main Interactive Table Section */}
            <div className="bg-white border border-gray-100 rounded-[48px] p-10 shadow-sm space-y-8">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="relative w-full lg:w-[450px] group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH BY IDENTITY OR CONTACT..."
                            className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-transparent rounded-[32px] text-[10px] font-black outline-none focus:ring-8 focus:ring-black/5 transition-all shadow-sm uppercase tracking-widest"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <Loader2 className="w-16 h-16 text-black animate-spin" />
                        <p className="font-black uppercase tracking-[0.4em] text-xs text-gray-400">Decrypting user collective...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 p-10 rounded-[40px] text-red-600 font-black uppercase text-xs text-center border-2 border-red-100 italic">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 rounded-2xl">
                                <tr>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Citizen Identity</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Enrolled At</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Engagement</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Risk Profile</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">State</th>
                                    <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Inquiry</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-all cursor-pointer" onClick={() => setSelectedUser(user)}>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-black text-primary flex items-center justify-center text-sm font-black italic shadow-lg group-hover:scale-110 transition-transform">
                                                    {String(user.name || "?").charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 uppercase italic tracking-tighter">{user.name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-bold text-gray-900 text-xs">{user.joinDate}</p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Legacy Date</p>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-gray-900 text-xs">₹{user.totalSpent?.toLocaleString() || '0'}</p>
                                            <p className="text-[10px] font-black text-primary uppercase">{user.totalBookings} Bookings</p>
                                        </td>

                                        <td className="p-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${user.riskScore === 'Low' ? 'bg-blue-50 text-blue-500 border-blue-100' : 'bg-red-50 text-red-500 border-red-100'
                                                }`}>
                                                {user.riskScore} RISK
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className="inline-flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Verified
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <button 
                                                className="p-3 hover:bg-white rounded-[16px] transition-colors shadow-sm group-hover:text-black text-gray-300 border border-transparent hover:border-gray-100"
                                                title={`Review Inquiry for ${user.name}`}
                                            >
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Detail Overlays */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-3xl overflow-hidden">
                    <div className="bg-white w-full max-w-5xl h-full md:h-[90vh] rounded-[64px] overflow-hidden flex flex-col relative shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/20">
                        <button title="Close User Details" onClick={() => setSelectedUser(null)} className="absolute top-10 right-10 p-5 bg-gray-50 hover:bg-black hover:text-white rounded-[24px] transition-all z-[110] shadow-sm">
                            <X className="w-8 h-8" />
                        </button>

                        <div className="flex-1 lg:grid lg:grid-cols-12 overflow-hidden h-full">
                            {/* Left Panel: Profile Context */}
                            <div className="lg:col-span-4 bg-gray-900 p-12 text-white flex flex-col justify-between relative h-full">
                                <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 blur-[130px] rounded-full" />
                                
                                <div className="relative z-10 text-center">
                                    <div className="w-32 h-32 bg-black text-primary rounded-[48px] flex items-center justify-center text-5xl font-black italic mx-auto border-4 border-white/5 shadow-2xl mb-8">
                                        {String(selectedUser.name || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{selectedUser.name}</h3>
                                    <span className="px-5 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Verified Citizen</span>

                                    <div className="mt-12 space-y-6 text-left">
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-3 bg-white/5 rounded-xl text-primary"><Mail className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Digital Address</p>
                                                <p className="text-sm font-bold truncate">{selectedUser.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-3 bg-white/5 rounded-xl text-primary"><Phone className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Emergency Line</p>
                                                <p className="text-sm font-bold">{selectedUser.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 group">
                                            <div className="p-3 bg-white/5 rounded-xl text-primary"><MapPin className="w-4 h-4" /></div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Base Coordinate</p>
                                                <p className="text-sm font-bold leading-tight">{selectedUser.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/10 relative z-10 grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Legacy Age</p>
                                        <p className="text-2xl font-black italic">{selectedUser.age || 25}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Gender Identity</p>
                                        <p className="text-2xl font-black italic">{selectedUser.gender || 'M'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Intelligence Data */}
                            <div className="lg:col-span-8 p-12 space-y-12 bg-white overflow-y-auto custom-scrollbar h-full relative">
                                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />

                                <div className="relative z-10 space-y-16">
                                    <section>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 flex items-center gap-3">
                                            <Activity className="w-4 h-4" /> Performance Metrics
                                        </h4>
                                        <div className="grid grid-cols-3 gap-8">
                                            <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Yield</p>
                                                <p className="text-3xl font-black italic">₹{selectedUser.totalSpent?.toLocaleString()}</p>
                                            </div>
                                            <div className="p-8 bg-black text-white rounded-[40px] border border-white/10">
                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Engagements</p>
                                                <p className="text-3xl font-black italic">{selectedUser.totalBookings}</p>
                                            </div>
                                            <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Risk Index</p>
                                                <p className={`text-3xl font-black italic uppercase ${selectedUser.riskScore === 'Low' ? 'text-blue-500' : 'text-red-500'}`}>{selectedUser.riskScore}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 flex items-center gap-3">
                                            <Clock className="w-4 h-4" /> Intelligence Logs (Recent Activities)
                                        </h4>
                                        <div className="space-y-4">
                                            {selectedUser.activities?.length ? selectedUser.activities.map((act: any, idx: number) => (
                                                <div key={idx} className="p-6 bg-gray-50 border border-gray-100 rounded-[32px] flex items-center justify-between group hover:border-black transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-white rounded-xl"><Calendar className="w-4 h-4" /></div>
                                                        <div>
                                                            <p className="font-black text-xs uppercase italic tracking-tight">{act.description}</p>
                                                            <p className="text-[9px] font-bold text-gray-400 uppercase">{act.date}</p>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                                                </div>
                                            )) : (
                                                <div className="p-16 text-center border-2 border-dashed border-gray-100 rounded-[48px]">
                                                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.3em]">No activity logs found in memory vault</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-8 flex items-center gap-3">
                                            <History className="w-4 h-4" /> Engagement History (History of Bookings)
                                        </h4>
                                        <div className="p-10 bg-black text-white rounded-[48px] border border-white/10 flex items-center justify-between">
                                            <div>
                                                <h5 className="text-2xl font-black italic uppercase italic tracking-tighter">Legacy Stream Sync</h5>
                                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Cross-referencing hub bookings...</p>
                                            </div>
                                            <div className="w-16 h-1 bg-white/10 rounded-full" />
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, sub, icon: Icon, color }: any) {
    const textColor = color === 'primary' ? 'text-primary' : color === 'emerald' ? 'text-emerald-500' : color === 'blue' ? 'text-blue-500' : 'text-orange-500';
    return (
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col group hover:shadow-2xl hover:border-black transition-all">
            <div className="flex justify-between items-start mb-10">
                <div className={`p-4 bg-gray-50 rounded-2xl ${textColor} group-hover:bg-black group-hover:text-white transition-all shadow-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2 italic">{label}</p>
                <h3 className={`text-4xl font-black italic tracking-tighter uppercase leading-none ${textColor}`}>{value}</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" /> {sub}
                </p>
            </div>
        </div>
    );
}
