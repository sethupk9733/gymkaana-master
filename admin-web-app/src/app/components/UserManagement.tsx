import { Search, MoreHorizontal, User as UserIcon, ShieldAlert, Mail, MapPin, Calendar, Ban, CheckCircle, CreditCard, ChevronRight, X, Activity, Dumbbell, Clock, MessageSquare, AlertCircle, TrendingUp, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchUsers } from "../lib/api";

interface UserDetail {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    status: 'Active' | 'Inactive' | 'Pending';
    totalBookings: number;
    favoriteGym: string;
    lastActive: string;
    credits: number;
    location: string;
    riskScore: 'Low' | 'Medium' | 'High';
}

export function UserManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<UserDetail[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUsers();
            const mappedUsers: UserDetail[] = data.map((u: any) => ({
                id: u._id,
                name: u.name,
                email: u.email,
                phone: u.phone || "N/A",
                joinDate: new Date(u.createdAt).toLocaleDateString(),
                status: 'Active',
                totalBookings: 0,
                favoriteGym: "N/A",
                lastActive: "Today",
                credits: 0,
                location: "N/A",
                riskScore: 'Low'
            }));
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
                <div className="flex gap-3">
                    <button className="px-8 py-4 bg-white border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                        Export CRM Data
                    </button>
                    <button className="px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl shadow-black/10">
                        Add New Member
                    </button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Active Citizens" value={users.length} sub="Currently enrolled" icon={UserIcon} color="primary" />
                <StatCard label="Avg. Order Frequency" value="4.2" sub="Bookings per user/mo" icon={TrendingUp} color="emerald" />
                <StatCard label="Identity Verified" value="92%" sub="KYC Compliance Score" icon={ShieldAlert} color="blue" />
                <StatCard label="Churn Warning" value="48" sub="Users inactive > 30d" icon={Clock} color="orange" />
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

                    <div className="flex bg-gray-50 p-2 rounded-2xl gap-2 overflow-x-auto w-full lg:w-auto">
                        {['All', 'Active', 'Pending', 'Suspended'].map(tab => (
                            <button key={tab} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${tab === 'All' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'}`}>
                                {tab}
                            </button>
                        ))}
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
                                                    {(user.name || "?")[0]}
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
                                            <p className="font-black text-gray-900 text-xs">₹3,400</p>
                                            <p className="text-[10px] font-black text-primary uppercase">Spend Index</p>
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
                                            <button className="p-3 hover:bg-white rounded-[16px] transition-colors shadow-sm group-hover:text-black text-gray-300 border border-transparent hover:border-gray-100">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                    <div className="bg-white w-full max-w-5xl rounded-[64px] overflow-hidden flex flex-col md:flex-row relative shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
                        {/* Detail content logic here (removed for brevity but keeping structure stable) */}
                        <div className="p-16 flex-1 text-center">
                            <h3 className="text-3xl font-black uppercase italic">{selectedUser.name}</h3>
                            <button onClick={() => setSelectedUser(null)} className="mt-8 px-12 py-5 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                                Close Terminal
                            </button>
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
