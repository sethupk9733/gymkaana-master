import { User, Building2, CreditCard, HelpCircle, Settings, LogOut, ChevronRight, Mail, Phone, MapPin, Shield, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../lib/api';

interface ProfileProps {
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', phoneNumber: '' });
  const [submitting, setSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  interface MenuItem {
    icon: any;
    label: string;
    badge: string | null;
    onClick?: () => void;
  }

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: "Administration",
      items: [
        { icon: Building2, label: "Platform Overview", badge: "Live" },
        { icon: Shield, label: "Create Admin Account", badge: "Secure", onClick: () => { setCreateError(null); setShowCreateAdmin(true); } },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Admin Documentation", badge: null },
        { icon: Settings, label: "Global Settings", badge: null },
      ],
    },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('gymkaana_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dashboardData = await fetchDashboardStats('all');
      setStats(dashboardData);
    } catch (err) {
      console.error('Failed to load profile stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Profile Info */}
      <div className="md:w-96 bg-black text-white p-12 flex flex-col justify-between">
        <div>
           <div className="w-32 h-32 bg-primary/20 rounded-[48px] border-4 border-white/10 flex items-center justify-center mb-10 shadow-2xl">
              <User size={64} className="text-primary" />
           </div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{user?.name || "System Admin"}</h2>
           <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-12">Platform Superuser</p>
           
           <div className="space-y-6">
              <ProfileItem icon={Mail} label="Institutional Mail" value={user?.email || "admin@gymkaana.com"} />
              <ProfileItem icon={Phone} label="Emergency Line" value="+91 88000 XXXXX" />
              <ProfileItem icon={MapPin} label="Command Center" value="Delhi HQ, India" />
           </div>
        </div>

        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-16 border-2 border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-widest mt-12 rounded-3xl"
        >
          <LogOut size={18} className="mr-3 text-red-500" />
          Terminate Session
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-12 space-y-12 overflow-y-auto">
        <header>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Intelligence Profile</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-4">Manage your administrative footprint and network access</p>
        </header>

        {/* Network Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatBox label="Total Network Hubs" value={stats?.activeGyms || "0"} sub="Operational" />
            <StatBox label="Active User Base" value={stats?.totalUsers || "0"} sub="Platform Wide" />
            <StatBox label="System Health" value="99.9%" sub="Uptime" />
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {menuSections.map((section, idx) => (
                <div key={idx} className="space-y-6">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-2">{section.title}</h3>
                    <div className="bg-white rounded-[40px] border border-gray-100 divide-y divide-gray-50 overflow-hidden shadow-sm">
                        {section.items.map((item, i) => (
                            <button 
                                key={i} 
                                onClick={item.onClick}
                                className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-all group"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                        <item.icon size={24} />
                                    </div>
                                    <span className="font-black italic uppercase tracking-tighter text-gray-900 text-lg">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    {item.badge && (
                                        <span className="px-3 py-1 bg-[#A3E635] text-black rounded-lg text-[9px] font-black uppercase tracking-widest">
                                            {item.badge}
                                        </span>
                                    )}
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Create Admin Modal */}
        {showCreateAdmin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                <div className="bg-white w-full max-w-xl rounded-[48px] overflow-hidden p-12 shadow-2xl space-y-8">
                    <div className="text-center space-y-2">
                        <div className="w-20 h-20 bg-black rounded-3xl mx-auto flex items-center justify-center mb-6">
                             <Shield size={40} className="text-primary" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Grant Administrative Power</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Identity creation for system operators</p>
                    </div>

                    {createError && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                            {createError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="FULL NAME" 
                            className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/20"
                            value={newAdmin.name}
                            onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                        />
                        <input 
                            type="email" 
                            placeholder="INSTITUTIONAL EMAIL" 
                            className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/20"
                            value={newAdmin.email}
                            onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                        />
                        <input 
                            type="tel" 
                            placeholder="CONTACT LINE (PH)" 
                            className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/20"
                            value={newAdmin.phoneNumber}
                            onChange={(e) => setNewAdmin({...newAdmin, phoneNumber: e.target.value})}
                        />
                        <input 
                            type="password" 
                            placeholder="ACCESS KEY (PASSWORD)" 
                            className="w-full p-5 bg-gray-50 border-none rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/20"
                            value={newAdmin.password}
                            onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                        />
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => setShowCreateAdmin(false)}
                            className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all"
                        >
                            Abort
                        </button>
                        <button 
                            disabled={submitting}
                            onClick={async () => {
                                if (!newAdmin.email || !newAdmin.password) {
                                    setCreateError("Institutional email and access key are mandatory.");
                                    return;
                                }
                                setSubmitting(true);
                                setCreateError(null);
                                try {
                                    const { createAdmin } = await import('../lib/api');
                                    await createAdmin(newAdmin);
                                    alert("ADMINISTRATOR AUTHORIZED: The new operator has been granted system access.");
                                    setShowCreateAdmin(false);
                                    setNewAdmin({ name: '', email: '', password: '', phoneNumber: '' });
                                } catch (err: any) {
                                    setCreateError(err.message || "Authorization sequence failed.");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                            className="flex-[2] py-5 bg-black text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Shield size={16} className="text-primary" /> Authorize Admin</>}
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

function ProfileItem({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary group-hover:text-black transition-all">
                <Icon size={16} />
            </div>
            <div>
                <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">{label}</p>
                <p className="text-sm font-bold text-white/80">{value}</p>
            </div>
        </div>
    )
}

function StatBox({ label, value, sub }: any) {
    return (
        <div className="bg-white p-10 rounded-[48px] border border-gray-100 hover:border-black transition-all shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
            <h3 className="text-4xl font-black italic tracking-tighter uppercase text-gray-900 leading-none">{value}</h3>
            <p className="text-[9px] font-bold text-primary uppercase tracking-widest mt-4">{sub}</p>
        </div>
    )
}
