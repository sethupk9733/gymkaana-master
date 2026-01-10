import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, DollarSign, Settings as SettingsIcon, Search, X, Check, Eye, Ban, Award, AlertCircle, Globe, Inbox, MapPin, User as UserIcon, FileText, ShieldCheck, Landmark, Shield, Calendar, Megaphone, CheckSquare, Star, ArrowLeft, ChevronRight, PieChart, Target, Zap, Server, Database, LogOut, TrendingUp, Activity, Plus, ShieldAlert, CreditCard, MessageSquare, BarChart3, HelpCircle, Dumbbell } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Detailed Admin Dashboard for Mobile
function AdminDashboard() {
  const [selectedPerfGym, setSelectedPerfGym] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [showMarketAnalysis, setShowMarketAnalysis] = useState(false);

  const topPerformers = [
    { name: "PowerHouse", revenue: "₹3,82,000", platformIncome: "₹57,300", growth: "+15%", logo: "P", members: 420, category: 'Premium', yield: '₹910/c', impact: 28 },
    { name: "Iron Pump", revenue: "₹5,12,000", platformIncome: "₹76,800", growth: "+22%", logo: "I", members: 580, category: 'Premium', yield: '₹882/c', impact: 37 },
    { name: "Yoga Zen", revenue: "₹1,50,000", platformIncome: "₹22,500", growth: "+8%", logo: "Y", members: 210, category: 'Boutique', yield: '₹714/c', impact: 11 },
  ];

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8 font-sans">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 border-b-4 border-primary inline-block pb-2">Institutional</h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2 italic flex items-center gap-1">
          <Zap className="w-3 h-3 text-primary" /> Market Intel & Yield Hub
        </p>
      </header>

      {/* NEWCOMER GUIDE CARD */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="bg-black text-white p-6 rounded-[32px] mb-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2 bg-white/10 rounded-xl">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <button onClick={() => setShowGuide(false)} title="Dismiss Guide"><X className="w-4 h-4 text-white/40" /></button>
            </div>
            <h4 className="font-black italic uppercase tracking-tighter text-lg leading-none mb-2">Market 101</h4>
            <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest leading-relaxed">
              We track <span className="text-white">Partner Gross</span> vs <span className="text-primary">Platform Yield (15%)</span>. Higher Impact % indicates ecosystem dominance.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col justify-between h-34">
          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Network GMV</p>
          <h3 className="text-xl font-black text-gray-900 italic">₹44.8L</h3>
          <div className="mt-4 flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase">
            <TrendingUp className="w-3 h-3" /> Healthy Flow
          </div>
        </div>
        <div className="bg-primary p-6 rounded-[32px] shadow-xl shadow-primary/20 flex flex-col justify-between h-34 text-white">
          <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Vetting Requests</p>
          <h3 className="text-xl font-black italic tracking-tighter">08</h3>
          <div className="mt-4 flex items-center gap-1 text-[9px] font-black text-black/40 uppercase tracking-widest">
            Awaiting Approval
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-4 px-2 italic">Yield Rankings</h3>
          <div className="space-y-3">
            {topPerformers.map((gym, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-[28px] border border-gray-100 flex items-center justify-between shadow-sm active:scale-95 transition-transform"
                onClick={() => setSelectedPerfGym(gym)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black italic text-sm">
                    {gym.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black text-gray-900 text-sm uppercase italic tracking-tight">{gym.name}</p>
                      <span className="text-[8px] font-black underline decoration-primary/50 text-gray-400">{gym.impact}% IMPACT</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Yield: {gym.yield}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-primary italic uppercase tracking-tight">{gym.platformIncome}</p>
                  <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">OUR CUT</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={() => setShowMarketAnalysis(true)}
              className="w-full py-6 bg-black text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <PieChart className="w-5 h-5 text-primary" /> Dive into Market Data
            </button>
          </div>
        </div>

        <div className="bg-black text-white p-8 rounded-[40px] relative overflow-hidden shadow-2xl">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 blur-[60px] rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="text-xl font-black italic uppercase tracking-tighter">Market Depth</h3>
            </div>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-6">Aggregate Monthly Penetration</p>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-primary" />
            </div>
            <button className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2 group">
              DIVE INTO MARKET DATA <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMarketAnalysis && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[70] bg-white h-full"
          >
            <div className="p-8 pt-12 font-sans overflow-y-auto h-full pb-32">
              <header className="flex justify-between items-center mb-10">
                <button onClick={() => setShowMarketAnalysis(false)} title="Back to Dashboard" className="p-4 bg-gray-50 rounded-2xl active:bg-black active:text-white transition-all">
                  <X className="w-6 h-6" />
                </button>
                <div className="text-right">
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Market Intel</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Geo-Spatial V2.4</p>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-6 bg-gray-900 rounded-[32px] text-white">
                  <Target className="w-6 h-6 text-primary mb-2" />
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Dominance</p>
                  <h4 className="text-xl font-black italic tracking-tighter">84.2%</h4>
                </div>
                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                  <Zap className="w-6 h-6 text-primary mb-2" />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Hub Flow</p>
                  <h4 className="text-xl font-black italic tracking-tighter">+12.4%</h4>
                </div>
              </div>

              <div className="p-8 bg-gray-50 rounded-[40px] border border-gray-100 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6">Peak Traffic Heatmap</h5>
                <div className="flex items-end gap-2 h-32">
                  {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                    <motion.div key={i} animate={{ height: `${h}% ` }} className="flex-1 rounded-t-lg bg-primary" style={{ opacity: h / 100 }} />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                  <span>06:00 AM</span>
                  <span>12:00 PM</span>
                  <span>09:00 PM</span>
                </div>
              </div>

              <div className="space-y-6">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-4">Institutional Rankings</h5>
                <RankingRow label="PowerHouse" impact={42} color="bg-primary" />
                <RankingRow label="Iron Pump" impact={37} color="bg-gray-900" />
                <RankingRow label="Yoga Zen" impact={11} color="bg-gray-400" />
              </div>
            </div>

            <div className="absolute bottom-10 left-8 right-8">
              <button
                onClick={() => setShowMarketAnalysis(false)}
                className="w-full py-6 bg-black text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/30"
              >
                Close Data Hub
              </button>
            </div>
          </motion.div>
        )}
        {selectedPerfGym && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full rounded-[48px] p-10 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center text-2xl font-black italic">
                    {selectedPerfGym.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">{selectedPerfGym.name}</h2>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">Market Position: {selectedPerfGym.category}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPerfGym(null)} title="Close Report"><X className="w-8 h-8 text-gray-300" /></button>
              </div>

              <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 mb-8 flex justify-between items-center">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1 italic">Contribution to Platform</p>
                  <p className="text-4xl font-black italic tracking-tighter text-gray-900">{selectedPerfGym.impact}%</p>
                </div>
                <div className="w-20 h-20 relative">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <path className="text-gray-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-primary" strokeWidth="3" strokeDasharray={`${selectedPerfGym.impact}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <MobileMetric label="Gross GMV" value={selectedPerfGym.revenue} color="black" />
                <MobileMetric label="Our Income" value={selectedPerfGym.platformIncome} color="primary" />
                <MobileMetric label="Member Yield" value={selectedPerfGym.yield} color="blue" />
                <MobileMetric label="Retention" value="88%" color="emerald" />
              </div>

              <div className="bg-gray-900 rounded-[40px] p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-6 italic">Usage Velocity Heatmap</h4>
                <div className="h-24 flex items-end gap-1.5 px-2">
                  {[40, 60, 30, 80, 50, 90, 40, 70, 55, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}% ` }}
                      className="flex-1 bg-primary/20 rounded-t-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="mb-10 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2">Market Research Note</h4>
                <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                    {selectedPerfGym.name} is a high-yield {selectedPerfGym.category.toLowerCase()} hub. Recommend launching targeted local ads for "Early Bird" passes to utilize the low heatmap morning slots.
                  </p>
                </div>
              </div>

              <button className="w-full py-6 bg-black text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20">OPERATIONAL DEPLOYMENT</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileMetric({ label, value, color }: any) {
  const text = color === 'emerald' ? 'text-emerald-500' : color === 'blue' ? 'text-blue-500' : color === 'primary' ? 'text-primary' : 'text-gray-900';
  return (
    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 h-28 flex flex-col justify-between">
      <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest leading-none">{label}</p>
      <p className={`font - black text - xl ${text} italic tracking - tighter leading - none`}>{value}</p>
    </div>
  )
}

function RankingRow({ label, impact, color }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[28px] border border-gray-100">
      <div className="flex items-center gap-4">
        <div className={`w - 3 h - 3 rounded - full ${color} `} />
        <span className="font-black uppercase italic tracking-tighter text-gray-900">{label}</span>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black text-gray-900">{impact}%</p>
        <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">IMPACT SCORE</p>
      </div>
    </div>
  )
}

function PartnerNetwork() {
  const [activeTab, setActiveTab] = useState<'vetting' | 'directory'>('vetting');
  const [selectedGym, setSelectedGym] = useState<any>(null);

  const pendingGyms = [
    {
      id: 1,
      name: "Powerhouse Gym",
      owner: "John Doe",
      gst: "29AAAAA0000A1Z5",
      pan: "ABCDE1234F",
      location: "Indiranagar",
      phone: "+91 98765 43210",
      license: "LIC-882910-X",
      safety: "FIRE-2900-B",
      established: "2018",
      staff: "14 People"
    },
    {
      id: 2,
      name: "Zen Yoga",
      owner: "Sarah Smith",
      gst: "29BBBBB1111B1Z6",
      pan: "FGHIJ5678K",
      location: "Koramangala",
      phone: "+91 88888 22222",
      license: "LIC-112233-Y",
      safety: "FIRE-3322-Z",
      established: "2021",
      staff: "8 People"
    },
  ];

  const activeHubs = [
    { id: 101, name: "Iron Pump", location: "Downtown", tier: "Premium", rating: 4.8, revenue: "₹2.4L" },
    { id: 102, name: "Muscle Factory", location: "Westside", tier: "Gold", rating: 4.5, revenue: "₹1.8L" },
    { id: 103, name: "Flex Studio", location: "HSR Layout", tier: "Boutique", rating: 4.9, revenue: "₹3.1L" },
  ];

  return (
    <div className="p-6 pb-24 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Hub <span className="text-primary">Ecosystem</span></h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Lifecycle Management & Vetting</p>
      </header>

      <div className="flex bg-gray-50 p-2 rounded-[28px] mb-8 border border-gray-100">
        <button
          onClick={() => setActiveTab('vetting')}
          className={`flex - 1 py - 4 rounded - [22px] font - black text - [10px] uppercase tracking - widest transition - all ${activeTab === 'vetting' ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-gray-400'} `}
        >
          Onboarding ({pendingGyms.length})
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex - 1 py - 4 rounded - [22px] font - black text - [10px] uppercase tracking - widest transition - all ${activeTab === 'directory' ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-gray-400'} `}
        >
          Directory ({activeHubs.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'vetting' ? (
          <motion.div key="vetting" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            {pendingGyms.map(gym => (
              <div key={gym.id} className="p-6 border border-gray-100 rounded-[32px] bg-white shadow-xl shadow-gray-100" onClick={() => setSelectedGym(gym)}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-xl italic uppercase tracking-tight">{gym.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{gym.location}</p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">Vetting</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="py-4 bg-gray-50 rounded-2xl font-black text-[10px] uppercase tracking-wider text-gray-900 border border-gray-100 shadow-sm active:scale-95 transition-all">Audit Docs</button>
                  <button className="py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/10 active:scale-95 transition-all">Approve</button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="directory" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {activeHubs.map(hub => (
              <div key={hub.id} className="p-6 border border-gray-50 rounded-[32px] bg-white shadow-sm flex items-center justify-between group active:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-xl font-black italic">
                    {hub.name[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-lg italic uppercase tracking-tight">{hub.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">{hub.tier}</span>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{hub.location}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black italic text-gray-900">{hub.revenue}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[10px] font-black">{hub.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedGym && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full rounded-[48px] p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">Business Audit</h2>
                <button onClick={() => setSelectedGym(null)} title="Close"><X className="w-6 h-6 text-gray-400" /></button>
              </div>

              <div className="space-y-4 mb-10">
                <DetailItem icon={UserIcon} label="Owner" value={selectedGym.owner} />
                <DetailItem icon={FileText} label="GST ID" value={selectedGym.gst} />
                <DetailItem icon={ShieldCheck} label="PAN Account" value={selectedGym.pan} />
                <DetailItem icon={Landmark} label="Trading License" value={selectedGym.license} />
                <DetailItem icon={Shield} label="Fire Safety NoC" value={selectedGym.safety} />
                <DetailItem icon={Users} label="Total Staff" value={selectedGym.staff} />
                <DetailItem icon={Calendar} label="Est. Year" value={selectedGym.established} />
                <DetailItem icon={MapPin} label="Location" value={selectedGym.location} />
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-5 bg-red-50 text-red-500 rounded-3xl font-black text-xs uppercase tracking-[0.2em]">Reject</button>
                <button className="flex-1 py-5 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em]">Launch Hub</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-3xl border border-gray-100">
      <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

function AdminUsers() {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active", spend: "₹4,500", frequency: "4x/week", favorite: "Iron Pump" },
    { id: 2, name: "Bob Smith", email: "bob@gym.com", status: "Active", spend: "₹0", frequency: "Owner", favorite: "Elite CrossFit" },
    { id: 3, name: "Charlie Brown", email: "charlie@fit.com", status: "Blocked", spend: "₹1,200", frequency: "Rarely", favorite: "Yoga Zen" },
  ];

  return (
    <div className="p-6 pb-24 bg-gray-50 min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 italic">User <span className="text-primary italic">Base</span></h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Manage Marketplace Clients</p>
      </header>

      <div className="bg-white rounded-3xl p-3 flex items-center gap-3 mb-8 shadow-sm border border-gray-100">
        <input type="text" placeholder="Search users..." className="flex-1 bg-transparent p-2 text-xs font-bold outline-none uppercase" />
      </div>

      <div className="space-y-4">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm active:scale-95 transition-transform" onClick={() => setSelectedUser(user)}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center font-black italic text-sm">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-gray-900 text-sm uppercase italic tracking-tight">{user.name}</p>
                <p className="text-[10px] text-gray-400 font-bold">{user.email}</p>
              </div>
            </div>
            <div className={`w - 3 h - 3 rounded - full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'} `} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full rounded-[48px] p-8 max-h-[85vh] overflow-y-auto font-sans"
            >
              <div className="flex justify-between items-center mb-8 font-sans">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center text-3xl font-black italic">
                    {selectedUser.name.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">{selectedUser.name}</h2>
                </div>
                <button onClick={() => setSelectedUser(null)} title="Close"><X className="w-6 h-6 text-gray-400" /></button>
              </div>

              <div className="space-y-4 mb-10">
                <ActivityInfo label="Lifetime Spend" value={selectedUser.spend} icon={DollarSign} />
                <ActivityInfo label="Workout Frequency" value={selectedUser.frequency} icon={Activity} />
                <ActivityInfo label="Top Venue" value={selectedUser.favorite} icon={Dumbbell} />
                <ActivityInfo label="Account Status" value={selectedUser.status} icon={ShieldAlert} />
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-5 bg-red-50 text-red-500 rounded-3xl font-black text-xs uppercase tracking-[0.2em]">Block Account</button>
                <button className="flex-1 py-5 bg-gray-50 text-gray-900 rounded-3xl font-black text-xs uppercase tracking-[0.2em]" onClick={() => setSelectedUser(null)}>Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ActivityInfo({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl border border-gray-100">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-gray-400" />
        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
      </div>
      <p className="font-black text-gray-900 text-sm uppercase italic">{value}</p>
    </div>
  )
}

function SettingsPage() {
  const [activeSubView, setActiveSubView] = useState<string | null>(null);

  const menuItems = [
    { id: 'ecosystem', label: 'Ecosystem', sub: 'Hub identity & public info', icon: Globe },
    { id: 'treasury', label: 'Treasury', sub: 'Commission & payouts', icon: CreditCard },
    { id: 'vault', label: 'Vault', sub: '2FA & Access protocols', icon: ShieldCheck },
    { id: 'network', label: 'Network', icon: Server, sub: 'API Sync & CDNs' },
    { id: 'telemetry', label: 'Telemetry', icon: Database, sub: 'Live system logs' },
  ];

  return (
    <div className="bg-white min-h-screen relative font-sans">
      <div className="p-6 pb-24">
        <header className="mb-8 font-sans">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 italic">Central <span className="text-primary italic">Command</span></h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Institutional Platform Control</p>
        </header>

        <div className="space-y-4 font-sans">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSubView(item.id)}
              className="w-full p-6 bg-gray-50 rounded-[32px] border border-gray-50 flex items-center justify-between active:bg-gray-100 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-left font-sans">
                  <span className="font-black uppercase italic tracking-tighter text-gray-900 block">{item.label}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.sub}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          ))}

          <div className="pt-8">
            <button className="w-full py-6 bg-red-50 text-red-500 rounded-[32px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              <LogOut className="w-5 h-5" /> Terminate Session
            </button>
          </div>
        </div>
      </div>

      {/* Sub-View Overlay */}
      <AnimatePresence>
        {activeSubView && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[70] bg-white h-full"
          >
            <div className="p-6 pt-12">
              <button
                onClick={() => setActiveSubView(null)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8"
              >
                <X className="w-4 h-4 rotate-180" /> Back to command
              </button>

              {activeSubView === 'ecosystem' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Ecosystem</h2>
                  <div className="space-y-6">
                    <MobileInput label="Platform Name" value="Gymkaana" />
                    <MobileInput label="Support Gateway" value="admin-ops@gymkaana.com" />
                    <MobileInput label="Deployment" value="Production (Stable)" />
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-3">Institutional Address</p>
                      <p className="text-xs font-bold text-gray-700 leading-relaxed uppercase">Building 45, 100ft Road, Indiranagar, Bangalore - 560038</p>
                    </div>
                  </div>
                </div>
              )}

              {activeSubView === 'treasury' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Treasury</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <TreasuryStat label="Commission" value="15%" />
                    <TreasuryStat label="GST Protocol" value="18%" />
                    <TreasuryStat label="Settlement" value="7 Days" />
                    <TreasuryStat label="Min Payout" value="₹5k" />
                  </div>
                  <div className="p-8 bg-black text-white rounded-[40px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                    <h4 className="text-lg font-black italic uppercase tracking-tighter mb-2 relative z-10">ACH Protocol</h4>
                    <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest leading-relaxed relative z-10">All settlements are automated via the platform clearing house every Monday.</p>
                  </div>
                </div>
              )}

              {activeSubView === 'vault' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">The Vault</h2>
                  <div className="space-y-4">
                    <MobileToggle label="Auth Factor (MFA)" desc="Force 2FA for all admin roles" active={true} />
                    <MobileToggle label="IP Whitelist" desc="Restrict by corporate VPN" active={false} />
                    <MobileToggle label="Session Kill" desc="Terminate after 30m idle" active={true} />
                  </div>
                </div>
              )}

              {activeSubView === 'telemetry' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">Telemetry</h2>
                  <div className="bg-gray-50 rounded-[32px] p-4 max-h-[60vh] overflow-y-auto font-mono text-[10px]">
                    <p className="mb-3 text-emerald-500 font-black tracking-widest">[SUCCESS] DB SNAPSHOT CAPTURED</p>
                    <p className="mb-3 text-blue-500 font-black tracking-widest">[INFO] CACHE PURGED FOR /ASSETS</p>
                    <p className="mb-3 text-orange-500 font-black tracking-widest">[WARN] SURGE IN BIOMETRIC SYNC (HUB #42)</p>
                    <p className="mb-3 text-emerald-500 font-black tracking-widest">[SUCCESS] PAYOUT BATCH #99 CLEARED</p>
                    <p className="text-gray-400">--- END OF LOGS (LAST 1H) ---</p>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute bottom-10 left-6 right-6">
              <button
                onClick={() => setActiveSubView(null)}
                className="w-full py-6 bg-black text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/30"
              >
                Apply Hub Sync
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileInput({ label, value }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3">{label}</label>
      <input
        type="text"
        title={label}
        placeholder={`Enter ${label}...`}
        defaultValue={value}
        className="w-full p-5 bg-gray-50 border border-gray-100 rounded-[24px] text-sm font-bold text-gray-900 outline-none focus:bg-white transition-all uppercase"
      />
    </div>
  )
}

function TreasuryStat({ label, value }: any) {
  return (
    <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100">
      <p className="text-[9px] font-black uppercase text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-black italic tracking-tighter text-gray-900">{value}</p>
    </div>
  )
}

function MobileToggle({ label, desc, active }: any) {
  return (
    <div className="p-6 bg-gray-50 rounded-[32px] flex items-center justify-between border border-gray-50">
      <div className="flex-1 pr-4">
        <p className="font-black text-gray-900 uppercase italic tracking-tighter text-sm mb-1">{label}</p>
        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{desc}</p>
      </div>
      <div className={`w - 12 h - 7 rounded - full p - 1 transition - colors ${active ? 'bg-black' : 'bg-gray-200'} `}>
        <div className={`w - 5 h - 5 bg - white rounded - full ${active ? 'translate-x-5' : ''} transition - transform`} />
      </div>
    </div>
  )
}


function Promotions() {
  return (
    <div className="p-6 pb-24 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 italic">Market <span className="text-primary italic">Promos</span></h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global Marketplace Banners</p>
      </header>

      <div className="space-y-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-gray-100 rounded-[32px] overflow-hidden shadow-sm">
            <div className="h-40 bg-gray-200" />
            <div className="p-6">
              <h3 className="font-black uppercase italic tracking-tighter text-lg">New Year Promo {i}</h3>
              <div className="flex justify-between items-center mt-6">
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100">Active</span>
                <button className="text-[10px] font-black uppercase tracking-widest text-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}

        <button className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-black/20">
          <Plus className="w-5 h-5 text-primary" /> Create Campaign
        </button>
      </div>
    </div>
  )
}

function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'approvals' && <PartnerNetwork />}
        {activeTab === 'promotions' && <Promotions />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around p-4 z-50">
        <NavButton icon={LayoutDashboard} label="Pulse" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavButton icon={Building2} label="Approvals" active={activeTab === 'approvals'} onClick={() => setActiveTab('approvals')} />
        <NavButton icon={Megaphone} label="Campaigns" active={activeTab === 'promotions'} onClick={() => setActiveTab('promotions')} />
        <NavButton icon={SettingsIcon} label="System" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
      </nav>
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex - col items - center gap - 1.5 transition - all ${active ? 'text-primary scale-110' : 'text-gray-300'} `}>
      <Icon className={`w - 6 h - 6 ${active ? 'stroke-[2.5px]' : 'stroke-[2px]'} `} />
      <span className={`text - [8px] font - black uppercase tracking - [0.2em] ${active ? 'opacity-100' : 'opacity-40'} `}>{label}</span>
    </button>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/gyms" element={<PartnerNetwork />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
