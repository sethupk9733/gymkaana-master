import { Search, MoreHorizontal, User, ShieldAlert, Mail, MapPin, Calendar, Ban, CheckCircle, CreditCard, ChevronRight, X, Activity, Dumbbell, Clock, MessageSquare, AlertCircle, TrendingUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface UserDetail {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: "Customer" | "Gym Owner";
    status: "Active" | "Blocked" | "Pending";
    joined: string;
    location: string;
    totalSpent: string;
    bookingsCount: number;
    lastActive: string;
    frequency: string;
    favoriteGym: string;
    activePasses: string[];
    interactionLogs: { date: string, action: string, type: 'info' | 'warning' | 'success' }[];
}

export function UserManagement() {
    const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
    const [auditLogUser, setAuditLogUser] = useState<UserDetail | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<UserDetail[]>([
        {
            id: 1,
            name: "Alice Johnson",
            email: "alice@example.com",
            phone: "+91 99999 11111",
            role: "Customer",
            status: "Active",
            joined: "Jan 2, 2026",
            location: "Indiranagar, Bangalore",
            totalSpent: "₹4,500",
            bookingsCount: 12,
            lastActive: "2 hours ago",
            frequency: "4x/week",
            favoriteGym: "Iron Pump Gym",
            activePasses: ["Monthly Pro Pass", "Yoga Trial"],
            interactionLogs: [
                { date: "Jan 5, 2026", action: "Booked Session at Iron Pump", type: "success" },
                { date: "Jan 2, 2026", action: "Subscription Renewed", type: "info" },
                { date: "Dec 28, 2025", action: "Support: Refund Requested", type: "warning" }
            ]
        },
        {
            id: 2,
            name: "Bob Smith",
            email: "bob@gym.com",
            phone: "+91 88888 22222",
            role: "Gym Owner",
            status: "Active",
            joined: "Dec 15, 2025",
            location: "Koramangala, Bangalore",
            totalSpent: "₹0 (Owner)",
            bookingsCount: 0,
            lastActive: "5 mins ago",
            frequency: "Daily",
            favoriteGym: "Elite CrossFit",
            activePasses: ["Partner Access"],
            interactionLogs: [
                { date: "Jan 6, 2026", action: "New Plan Added: Power Blast", type: "success" },
                { date: "Jan 5, 2026", action: "Payout Processed: ₹24,000", type: "info" }
            ]
        },
        {
            id: 3,
            name: "Charlie Brown",
            email: "charlie@fit.com",
            phone: "+91 77777 33333",
            role: "Customer",
            status: "Blocked",
            joined: "Nov 20, 2025",
            location: "Whitefield, Bangalore",
            totalSpent: "₹1,200",
            bookingsCount: 3,
            lastActive: "1 month ago",
            frequency: "Rarely",
            favoriteGym: "Yoga Zen Center",
            activePasses: [],
            interactionLogs: [
                { date: "Dec 20, 2025", action: "Account Blocked: Unpaid Dues", type: "warning" },
                { date: "Dec 18, 2025", action: "Missed 3 Bookings consecutively", type: "warning" }
            ]
        },
    ]);

    const handleBlockUnblock = (id: number) => {
        setUsers(users.map(u =>
            u.id === id
                ? { ...u, status: u.status === 'Blocked' ? 'Active' : 'Blocked' }
                : u
        ));
        if (selectedUser?.id === id) {
            setSelectedUser({ ...selectedUser, status: selectedUser.status === 'Blocked' ? 'Active' : 'Blocked' });
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">User Ecology</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Deep analytics on client behavior & account standing</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME OR EMAIL..."
                            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[28px] text-[10px] font-black outline-none focus:ring-4 focus:ring-black/5 shadow-sm transition-all uppercase tracking-widest"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <UserInsight label="Total Active Clients" value="4,281" change="+12%" icon={Activity} />
                <UserInsight label="Churn Risk Level" value="low (2%)" change="-0.5%" icon={ShieldAlert} />
                <UserInsight label="Avg. Order Value" value="₹1,840" change="+4%" icon={TrendingUp} />
            </div>

            <div className="bg-white border border-gray-100 rounded-[48px] shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 italic">
                            <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Identity HUB</th>
                            <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Activity Level</th>
                            <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Account status</th>
                            <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Ledger Detail</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/30 transition-all cursor-pointer group" onClick={() => setSelectedUser(user)}>
                                <td className="p-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-[24px] bg-black text-white flex items-center justify-center text-xl font-black italic shadow-lg group-hover:bg-primary transition-colors">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900 uppercase italic tracking-tighter text-lg">{user.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <Dumbbell className="w-4 h-4 text-gray-900" />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest">{user.frequency}</span>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 px-1">{user.bookingsCount} TOTAL BOOKINGS</p>
                                </td>
                                <td className="p-10">
                                    <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        user.status === 'Blocked' ? 'bg-red-50 text-red-600 border-red-100' :
                                            'bg-yellow-50 text-yellow-600 border-yellow-100'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-10 text-right">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                                        className="p-4 bg-gray-50 hover:bg-black hover:text-white rounded-[20px] transition-all"
                                        title="View Detailed Dossier"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Detailed User Dossier Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 100 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 100 }}
                            className="bg-white w-full max-w-4xl rounded-[56px] overflow-hidden flex flex-col lg:flex-row relative shadow-[0_32px_64px_rgba(0,0,0,0.5)] h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="absolute top-8 right-8 p-3 bg-white/80 hover:bg-white rounded-2xl transition-all z-20 shadow-lg"
                                title="Close"
                            >
                                <X className="w-6 h-6 text-gray-900" />
                            </button>

                            {/* Sidebar Detail */}
                            <div className="w-full lg:w-96 bg-gray-900 text-white p-12 flex flex-col shrink-0 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[60px] rounded-full" />

                                <div className="relative z-10 space-y-12">
                                    <div className="text-center">
                                        <div className="w-32 h-32 rounded-[40px] bg-white text-black flex items-center justify-center text-5xl font-black italic mx-auto shadow-2xl mb-6">
                                            {selectedUser.name.charAt(0)}
                                        </div>
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter">{selectedUser.name}</h3>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mt-2">Dossier ID: #G-USR-{selectedUser.id}29</p>
                                    </div>

                                    <div className="space-y-6">
                                        <SidebarInfo label="Personal Email" value={selectedUser.email} icon={Mail} />
                                        <SidebarInfo label="Primary Contact" value={selectedUser.phone} icon={Clock} />
                                        <SidebarInfo label="Home Location" value={selectedUser.location} icon={MapPin} />
                                    </div>

                                    <div className="pt-8 border-t border-white/10">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">PLATFORM REVENUE</p>
                                        <p className="text-5xl font-black italic tracking-tighter text-primary">{selectedUser.totalSpent}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Main Activity Detail */}
                            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-white">
                                <section className="space-y-12">
                                    {/* Behavioral Stats */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                                            <Activity className="w-3 h-3" /> Behavioral Insights
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <ActivityCard label="Active Plan" value={selectedUser.activePasses[0] || "No Active Plan"} icon={CheckCircle} color="emerald" />
                                            <ActivityCard label="Preferred Hub" value={selectedUser.favoriteGym} icon={Dumbbell} color="blue" />
                                            <ActivityCard label="Visit Frequency" value={selectedUser.frequency} icon={TrendingUp} color="primary" />
                                            <ActivityCard label="Last Seen" value={selectedUser.lastActive} icon={Clock} color="orange" />
                                        </div>
                                    </div>

                                    {/* Interaction Logs */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" /> System Interaction Logs
                                        </h4>
                                        <div className="space-y-3">
                                            {selectedUser.interactionLogs.map((log, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[28px] border border-gray-100">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-3 h-3 rounded-full ${log.type === 'success' ? 'bg-emerald-500' :
                                                            log.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                                                            }`} />
                                                        <div>
                                                            <p className="text-xs font-black uppercase tracking-tight text-gray-900">{log.action}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 tracking-widest">{log.date}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setAuditLogUser(selectedUser);
                                                            setSelectedUser(null);
                                                        }}
                                                        className="p-2 hover:bg-white rounded-lg transition-colors"
                                                        title="View log details"
                                                    >
                                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Zone */}
                                    <div className="pt-12 border-t border-gray-100">
                                        <div className="bg-red-50 rounded-[40px] p-8 border border-red-100">
                                            <div className="flex items-center gap-3 text-red-600 mb-4">
                                                <AlertCircle className="w-6 h-6" />
                                                <h4 className="font-black uppercase italic tracking-tighter text-lg">System Suspension Zone</h4>
                                            </div>
                                            <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-10 leading-relaxed max-w-md">
                                                Suspending this user will terminate biometric access at all hubs and pause billing cycles.
                                            </p>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleBlockUnblock(selectedUser.id)}
                                                    className={`flex-1 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${selectedUser.status === 'Blocked'
                                                        ? 'bg-emerald-600 text-white shadow-emerald-200'
                                                        : 'bg-red-600 text-white shadow-red-200'
                                                        }`}
                                                >
                                                    {selectedUser.status === 'Blocked' ? 'REACTIVE ACCOUNT ACCESS' : 'PERMANENT SUSPENSION'}
                                                </button>
                                                <button className="px-10 py-5 bg-white border border-red-100 text-red-600 rounded-[24px] font-black text-xs uppercase tracking-[0.2em]">FLAG USER</button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Audit History View Overlay */}
            <AnimatePresence>
                {auditLogUser && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="w-full max-w-2xl bg-white h-full shadow-2xl p-16 overflow-y-auto font-sans"
                        >
                            <header className="flex justify-between items-center mb-12">
                                <button onClick={() => setAuditLogUser(null)} className="flex items-center gap-3 text-gray-400 hover:text-black transition-colors" title="Back to base">
                                    <X className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest font-sans">Exit Audit Mode</span>
                                </button>
                                <div className="text-right">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">System Audit</h2>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Protocol: Chronos-V4</p>
                                </div>
                            </header>

                            <div className="flex items-center gap-4 mb-16 p-8 bg-gray-50 rounded-[32px] border border-gray-100">
                                <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center text-2xl font-black italic">
                                    {auditLogUser.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xl font-black italic uppercase text-gray-900 tracking-tighter">{auditLogUser.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{auditLogUser.email}</p>
                                </div>
                            </div>

                            <div className="space-y-10 relative">
                                <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-100" />
                                {auditLogUser.interactionLogs.map((log, i) => (
                                    <div key={i} className="relative pl-16 group">
                                        <div className={`absolute left-4 top-1 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 transition-transform group-hover:scale-125 ${log.type === 'success' ? 'bg-emerald-500' : log.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                                            }`} />
                                        <div className="bg-white border border-gray-100 p-8 rounded-[32px] hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-start mb-4">
                                                <h5 className="font-black italic uppercase tracking-tighter text-gray-900">{log.action}</h5>
                                                <span className="text-[9px] font-black text-gray-300 uppercase">{log.date}</span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                                Interaction recorded via {log.type === 'success' ? 'Automated Gateway' : 'Support Console'}. Meta-tag: #USR-LOG-{i}48.
                                            </p>
                                            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-4">
                                                <span className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black text-gray-400 uppercase">IP: 192.168.1.1</span>
                                                <span className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] font-black text-gray-400 uppercase">Device: Chrome/OSX</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-20">
                                <button className="w-full py-6 bg-black text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/20">Download Full Log Report</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function UserInsight({ label, value, change, icon: Icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {change}
                </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-3xl font-black italic text-gray-900 tracking-tighter uppercase">{value}</h3>
        </div>
    )
}

function SidebarInfo({ label, value, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{label}</p>
                <p className="font-bold text-sm text-white/80">{value}</p>
            </div>
        </div>
    )
}

function ActivityCard({ label, value, icon: Icon, color }: any) {
    const bg = color === 'emerald' ? 'bg-emerald-50' : color === 'blue' ? 'bg-blue-50' : color === 'orange' ? 'bg-orange-50' : 'bg-primary/10';
    const text = color === 'emerald' ? 'text-emerald-600' : color === 'blue' ? 'text-blue-600' : color === 'orange' ? 'text-orange-600' : 'text-primary';

    return (
        <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex flex-col justify-between h-32 hover:bg-white hover:shadow-xl transition-all cursor-default group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} ${text} group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="font-black text-gray-900 text-sm uppercase italic leading-none">{value}</p>
            </div>
        </div>
    )
}
