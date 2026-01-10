import { TrendingUp, Users, Building2, AlertCircle, DollarSign, ArrowUpRight, ArrowDownRight, Activity, Calendar, MoreVertical, Ban, MoreHorizontal, Search, Info, Target, MousePointer2, BarChart3, PieChart, LineChart, Inbox, HelpCircle, Briefcase, Zap, Globe, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface GymMetric {
    id: string;
    name: string;
    logo: string;
    revenue: string;           // Total money gym MADE from users
    platformIncome: string;    // Total money Gymkaana MADE from this gym (15% commission)
    contributionScore: number; // Percentage of total platform revenue
    growth: string;
    members: number;
    retention: string;
    status: 'High' | 'Solid' | 'Critical';
    dailyActive: number;
    marketCategory: 'Premium' | 'Budget' | 'Boutique';
    yieldPerMember: string;
}

export function AdminDashboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPerfGym, setSelectedPerfGym] = useState<GymMetric | null>(null);
    const [activeView, setActiveView] = useState<'performance' | 'insights' | 'economics' | 'market_analysis'>('performance');

    const gymsPerformance: GymMetric[] = [
        { id: "gym1", name: "PowerHouse Fitness", logo: "P", revenue: "₹3,82,000", platformIncome: "₹57,300", contributionScore: 28, growth: "+15.4%", members: 420, retention: "88%", status: "High", dailyActive: 156, marketCategory: 'Premium', yieldPerMember: "₹910" },
        { id: "gym2", name: "Elite CrossFit", logo: "E", revenue: "₹95,000", platformIncome: "₹14,250", contributionScore: 7, growth: "-2.1%", members: 156, retention: "65%", status: "Critical", dailyActive: 42, marketCategory: 'Boutique', yieldPerMember: "₹610" },
        { id: "gym3", name: "Yoga Zen Center", logo: "Y", revenue: "₹1,50,000", platformIncome: "₹22,500", contributionScore: 11, growth: "+8.7%", members: 210, retention: "72%", status: "Solid", dailyActive: 89, marketCategory: 'Boutique', yieldPerMember: "₹714" },
        { id: "gym4", name: "Iron Pump Gym", logo: "I", revenue: "₹5,12,000", platformIncome: "₹76,800", contributionScore: 37, growth: "+22.5%", members: 580, retention: "92%", status: "High", dailyActive: 310, marketCategory: 'Premium', yieldPerMember: "₹882" },
        { id: "gym5", name: "Muscle Factory", logo: "M", revenue: "₹2,10,000", platformIncome: "₹31,500", contributionScore: 17, growth: "+5.5%", members: 310, retention: "80%", status: "Solid", dailyActive: 120, marketCategory: 'Budget', yieldPerMember: "₹677" },
    ];

    const filteredGyms = gymsPerformance.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20 font-sans">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-black text-primary rounded-2xl shadow-xl shadow-black/10">
                            <BarChart3 className="w-6 h-6" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Institutional Command</h2>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] flex items-center gap-2">
                        <Zap className="w-3 h-3 text-primary" /> REAL-TIME MARKET INTELLIGENCE & REVENUE ATTRIBUTION
                    </p>
                </div>

                <div className="flex bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm gap-2">
                    <TabButton active={activeView === 'performance'} onClick={() => setActiveView('performance')} label="Yield Analysis" icon={TrendingUp} />
                    <TabButton active={activeView === 'insights'} onClick={() => setActiveView('insights')} label="Market Research" icon={Globe} />
                    <TabButton active={activeView === 'economics'} onClick={() => setActiveView('economics')} label="Network Economics" icon={Landmark} />
                </div>
            </header>

            {/* EDUCATIONAL TOP BAR FOR NEWCOMERS */}
            <div className="bg-primary/5 border border-primary/20 rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shrink-0 shadow-xl shadow-primary/10">
                    <HelpCircle className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                    <h4 className="font-black italic uppercase tracking-tighter text-gray-900 text-lg">Newcomer Guide: How to read this data?</h4>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-2xl mt-1">
                        We track <b>Gross Partner Revenue</b> (Total money gym makes) vs <b>Platform Yield</b> (Gymkaana's 15% cut).
                        A high "Contribution Score" means that gym is a pillar of our current revenue ecosystem.
                    </p>
                </div>
                <button className="px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                    Generate Insights
                </button>
            </div>

            {activeView === 'performance' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    {/* PLATFORM WIDE STATS - DETAILED */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <YieldCard label="Total Network GMV" value="₹44.82L" sub="Gross flow through platform" icon={Inbox} color="black" help="Combined revenue of all gyms" />
                        <YieldCard label="Gymkaana Income" value="₹6.72L" sub="15% Transactional Yield" icon={Target} color="primary" help="Our net platform revenue" />
                        <YieldCard label="Pending Onboarding" value="08" sub="Vetting Requests" icon={CheckSquare} color="red" help="New gyms awaiting verification" />
                        <YieldCard label="Active User Reach" value="12,450" sub="Individual monthly visits" icon={Users} color="emerald" help="Total reach across all hubs" />
                        <YieldCard label="Yield per Member" value="₹892" sub="Avg. contribution/user" icon={Zap} color="orange" help="Revenue health per customer" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* DETAILED GYM CONTRIBUTION TABLE */}
                        <div className="lg:col-span-12 bg-white border border-gray-100 rounded-[48px] p-10 shadow-sm space-y-10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Partner Contribution Index</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gym Revenue vs Platform Net Income</p>
                                </div>
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="FILTER BY PARTNER HUB..."
                                        className="pl-14 pr-8 py-4 bg-gray-50 border border-transparent rounded-[24px] text-[10px] font-black outline-none focus:ring-4 focus:ring-black/5 w-80 shadow-sm transition-all uppercase tracking-widest"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 rounded-2xl">
                                        <tr>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Partner Hub</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Market Cat</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Gross GMV</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Our Income (15%)</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Contribution</th>
                                            <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Yield Health</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredGyms.map((gym) => (
                                            <tr
                                                key={gym.id}
                                                className="hover:bg-gray-50/50 transition-all cursor-pointer group"
                                                onClick={() => setSelectedPerfGym(gym)}
                                            >
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-[16px] bg-black text-white flex items-center justify-center font-black italic text-sm group-hover:bg-primary transition-colors">
                                                            {gym.logo}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900 uppercase italic tracking-tight">{gym.name}</p>
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{gym.members} ACTIVE</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${gym.marketCategory === 'Premium' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                        gym.marketCategory === 'Boutique' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-600 border-gray-100'
                                                        }`}>
                                                        {gym.marketCategory}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-center font-black text-gray-900">{gym.revenue}</td>
                                                <td className="p-6 text-center font-black text-primary">{gym.platformIncome}</td>
                                                <td className="p-6 text-center">
                                                    <div className="w-full max-w-[100px] mx-auto space-y-2">
                                                        <div className="flex justify-between text-[8px] font-black text-gray-500 uppercase">
                                                            <span>Impact</span>
                                                            <span>{gym.contributionScore}%</span>
                                                        </div>
                                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${gym.contributionScore}%` }}
                                                                className="h-full bg-black rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${gym.status === 'High' ? 'bg-emerald-100 text-emerald-600' :
                                                        gym.status === 'Solid' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                                        }`}>
                                                        {gym.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* MARKET RESEARCH VIEW */}
            {activeView === 'insights' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-gray-900 rounded-[48px] p-10 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-8">Hub Demand Forecasting</h3>
                                    <div className="flex items-end justify-between h-48 gap-4 px-2 mb-8">
                                        {[65, 40, 85, 95, 60, 70, 80, 55, 90, 75].map((h, i) => (
                                            <div key={i} className="flex-1 bg-white/10 rounded-t-xl relative group">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${h}%` }}
                                                    className="w-full bg-primary rounded-t-xl"
                                                />
                                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-white/40">MAR 0{i + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">Projected visit surges based on historical regional velocity</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ResearchStat label="Regional Dominance" value="84%" sub="Bangalore Central Hub" icon={Target} />
                                <ResearchStat label="Avg. Order Surge" value="+18%" sub="Weekend Pass Velocity" icon={Zap} />
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[48px] p-10 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 px-2">Competitive Tiering Analysis</h4>
                            <div className="space-y-6">
                                <TierRow label="Premium Hubs" count={12} growth="+5%" impact={42} color="bg-purple-500" />
                                <TierRow label="Boutique Studios" count={8} growth="+12%" impact={28} color="bg-blue-500" />
                                <TierRow label="Budget Mass" count={15} growth="-2%" impact={30} color="bg-gray-900" />
                                <TierRow label="Yoga & Wellness" count={6} growth="+18%" impact={15} color="bg-emerald-500" />
                            </div>
                            <button
                                onClick={() => setActiveView('market_analysis')}
                                className="w-full mt-10 py-5 bg-gray-50 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                            >
                                Deep-Dive Geo-Spatial Map
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* NETWORK ECONOMICS VIEW */}
            {activeView === 'economics' && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <YieldCard label="Platform Reserve" value="₹1.24Cr" sub="Liquidity Pool Balance" icon={Inbox} color="black" help="Platform's treasury for gym payouts" />
                        <YieldCard label="Net Yield Projection" value="₹18.5L" sub="Expected Next Month" icon={TrendingUp} color="emerald" help="Projected 15% revenue" />
                        <YieldCard label="Network Liability" value="₹42.1L" sub="Awaiting Partner Payout" icon={AlertCircle} color="orange" help="Total outstanding to gyms" />
                    </div>

                    <div className="bg-white border border-gray-100 rounded-[48px] p-10 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Partner Payout Telemetry</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time liquidity attribution per active hub</p>
                            </div>
                            <button className="px-6 py-3 bg-primary/10 text-primary rounded-xl font-black text-[10px] uppercase tracking-widest">Recalculate Yield</button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { name: "PowerHouse", revenue: "₹3.82L", payout: "₹3.24L", tax: "₹19k", status: "Processed" },
                                { name: "Iron Pump", revenue: "₹5.12L", payout: "₹4.35L", tax: "₹25k", status: "Pending" },
                                { name: "Yoga Zen", revenue: "₹1.50L", payout: "₹1.27L", tax: "₹7k", status: "Hold" },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-black italic text-xs">{row.name[0]}</div>
                                        <div>
                                            <p className="font-black text-sm uppercase italic">{row.name}</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase">Gross: {row.revenue}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-12 text-right">
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase">Partner Payout</p>
                                            <p className="text-sm font-black italic">{row.payout}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase">Platform Tax</p>
                                            <p className="text-sm font-black italic text-primary">{row.tax}</p>
                                        </div>
                                        <div className="w-24">
                                            <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${row.status === 'Processed' ? 'bg-emerald-100 text-emerald-600' :
                                                row.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'
                                                }`}>{row.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ADVANCED GYM ANALYTICS MODAL - DETAILED FOR MARKET RESEARCH */}
            {activeView === 'market_analysis' && (
                <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                    <header className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setActiveView('performance')}
                                title="Back to performance"
                                className="p-3 bg-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all"
                            >
                                <Search className="w-6 h-6 rotate-180" />
                            </button>
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Market Analysis Centre</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Deep-dive regional metrics & demand tiering</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20">Generate Report</button>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ResearchStat label="Regional Dominance" value="84%" sub="Bangalore Central Hub" icon={Target} />
                        <ResearchStat label="Avg. Order Surge" value="+18%" sub="Weekend Pass Velocity" icon={Zap} />
                        <ResearchStat label="Churn Resistance" value="Low" sub="Institutional Stickiness" icon={Briefcase} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-gray-900 rounded-[56px] p-12 text-white relative overflow-hidden h-[500px] flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[120px] rounded-full" />
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-2 italic">Demand Heatmap</h4>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Geo-Spatial Density</h3>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="relative w-64 h-64">
                                    <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                                    <div className="absolute inset-4 border-2 border-white/10 rounded-full" />
                                    <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary/80 blur-xl rounded-full animate-pulse" />
                                    <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-emerald-400/80 blur-lg rounded-full animate-bounce" />
                                    <div className="absolute top-1/2 right-1/2 w-16 h-16 bg-blue-500/30 blur-2xl rounded-full" />
                                </div>
                            </div>
                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest text-center">Data refreshed 12 minutes ago from global Hub API</p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-[56px] p-12 shadow-sm space-y-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Competitive Tiering Analysis</h4>
                            <div className="space-y-6">
                                <TierRow label="Premium Hubs" count={12} growth="+5%" impact={42} color="bg-purple-500" />
                                <TierRow label="Boutique Studios" count={8} growth="+12%" impact={28} color="bg-blue-500" />
                                <TierRow label="Budget Mass" count={15} growth="-2%" impact={30} color="bg-gray-900" />
                            </div>
                            <div className="pt-8 border-t border-gray-50 flex justify-between items-center px-4">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Market Saturation</p>
                                    <p className="text-2xl font-black italic uppercase">Moderate</p>
                                </div>
                                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                                    View Expansion Roadmap <ArrowUpRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {selectedPerfGym && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            className="bg-white w-full max-w-6xl h-[90vh] rounded-[64px] overflow-hidden flex flex-col relative shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/20"
                        >
                            <button
                                onClick={() => setSelectedPerfGym(null)}
                                className="absolute top-10 right-10 p-4 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-all z-20 shadow-sm"
                                title="Close Intelligence Report"
                            >
                                <X className="w-8 h-8 text-black" />
                            </button>

                            <div className="p-16 overflow-y-auto custom-scrollbar">
                                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 px-4">
                                    <div className="flex items-center gap-8">
                                        <div className="w-24 h-24 bg-black text-white rounded-[40px] flex items-center justify-center text-4xl font-black italic shadow-2xl group hover:bg-primary hover:text-black transition-all">
                                            {selectedPerfGym.logo}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">{selectedPerfGym.name}</h3>
                                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400">Hub ID: #KNA-{selectedPerfGym.id}</span>
                                            </div>
                                            <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
                                                Market Insight Report <MousePointer2 className="w-3 h-3" />
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900 px-8 py-6 rounded-[32px] text-white flex gap-12">
                                        <div>
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">PLATFORM REVENUE PILLAR</p>
                                            <p className="text-2xl font-black italic text-primary">{selectedPerfGym.contributionScore}% <span className="text-[10px] text-white/60">OF TOTAL</span></p>
                                        </div>
                                        <div className="w-px h-10 bg-white/10 self-center" />
                                        <div>
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">MEMBER YIELD</p>
                                            <p className="text-2xl font-black italic">{selectedPerfGym.yieldPerMember} <span className="text-[10px] text-white/60">/CAPITA</span></p>
                                        </div>
                                    </div>
                                </header>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                                    {/* DETAILED STAT CARDS */}
                                    <InsightCard label="Market Position" value={selectedPerfGym.marketCategory} sub="Facility categorization" icon={Landmark} type="info" />
                                    <InsightCard label="Member Retention" value={selectedPerfGym.retention} sub="Monthly stickiness rate" icon={TrendingUp} type="success" />
                                    <InsightCard label="Platform Yield" value={selectedPerfGym.platformIncome} sub="Our net commission revenue" icon={DollarSign} type="primary" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="bg-gray-900 rounded-[48px] p-12 text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
                                        <div className="relative z-10 space-y-12">
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Usage Heatmap Analysis</h4>
                                                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Peak Traffic Distribution</h3>
                                            </div>

                                            <div className="flex items-end justify-between h-48 gap-4 px-2">
                                                {[45, 30, 85, 95, 60, 40, 75, 55, 90, 80, 65, 50].map((h, i) => (
                                                    <div key={i} className="flex-1 group relative">
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${h}%` }}
                                                            transition={{ duration: 1, delay: i * 0.05 }}
                                                            className={`rounded-t-xl transition-all group-hover:bg-white ${i % 3 === 0 ? 'bg-primary' : 'bg-primary/30'}`}
                                                        />
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black p-2 rounded-lg text-[8px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                                                            {h}% Load
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center bg-white/5 p-6 rounded-[28px] border border-white/10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                                        <Activity className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Optimal Throughput</p>
                                                        <p className="font-bold text-sm">82% Operational Efficiency</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Trend</p>
                                                    <p className="font-bold text-sm text-emerald-400">UPWARD</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="bg-gray-50 p-10 rounded-[48px] border border-gray-100">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" /> Market Research Summary
                                            </h4>
                                            <div className="space-y-6">
                                                <InsightPoint label="Growth Opportunity" text="Membership yield is 12% above platform average. Possible upsell for premium tiering." />
                                                <InsightPoint label="Retention Risk" text="Morning slot retention is dropping. Recommend gym owner to add more cardio classes." />
                                                <InsightPoint label="Competitor Data" text="This hub is currently the dominant player in its specific 5km radius." />
                                            </div>
                                        </div>

                                        <div className="pt-10 border-t border-gray-100 mb-10">
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-8">Operational Actions</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <button className="py-5 bg-black text-white rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-2xl transition-all">
                                                    <Activity className="w-4 h-4 text-primary" /> Sync Hub State
                                                </button>
                                                <button className="py-5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 hover:text-white transition-all">
                                                    <Target className="w-4 h-4" /> Optimization Pulse
                                                </button>
                                                <button className="py-5 bg-red-50 text-red-600 border border-red-100 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all">
                                                    <AlertCircle className="w-4 h-4" /> Force Suspension
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedPerfGym(null);
                                                    setActiveView('market_analysis');
                                                }}
                                                className="flex-1 py-6 bg-gray-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-black transition-all"
                                            >
                                                <PieChart className="w-5 h-5 text-primary" /> Full Market Analysis
                                            </button>
                                            <button
                                                onClick={() => setSelectedPerfGym(null)}
                                                className="px-12 py-6 bg-gray-100 rounded-[32px] font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function InsightCard({ label, value, sub, icon: Icon, type }: any) {
    const colors: any = {
        primary: 'bg-primary/10 text-primary',
        success: 'bg-emerald-50 text-emerald-600',
        info: 'bg-blue-50 text-blue-600',
    };
    return (
        <div className="p-8 bg-white border border-gray-200 rounded-[40px] hover:bg-white hover:border-black hover:shadow-2xl transition-all group shadow-sm">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${colors[type]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 italic">{label}</p>
            <h3 className="text-3xl font-black italic text-gray-900 tracking-tighter uppercase leading-none mb-3">{value}</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{sub}</p>
        </div>
    );
}

function InsightPoint({ label, text }: { label: string, text: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[9px] font-black uppercase text-primary tracking-widest">{label}</p>
            <p className="text-xs font-bold text-gray-700 leading-relaxed uppercase">{text}</p>
        </div>
    );
}

function YieldCard({ label, value, sub, icon: Icon, color, help }: any) {
    const textColor = color === 'primary' ? 'text-primary' : color === 'emerald' ? 'text-emerald-500' : color === 'orange' ? 'text-orange-500' : 'text-gray-900';
    const bg = color === 'primary' ? 'bg-primary/10' : color === 'emerald' ? 'bg-emerald-50' : color === 'orange' ? 'bg-orange-50' : 'bg-gray-50';

    return (
        <div className="bg-white p-8 rounded-[40px] border border-gray-200 shadow-sm flex flex-col group hover:shadow-2xl hover:border-black transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-10">
                <div className={`p-4 rounded-2xl ${bg} ${textColor} group-hover:bg-black group-hover:text-white transition-all`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="relative group/tooltip">
                    <HelpCircle className="w-4 h-4 text-gray-300 cursor-help hover:text-gray-400" />
                    <div className="absolute right-0 top-full mt-2 w-48 p-3 bg-black text-white text-[9px] font-bold uppercase rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 shadow-2xl">
                        {help}
                    </div>
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2 italic">{label}</p>
                <h3 className={`text-4xl font-black italic tracking-tighter uppercase leading-none ${textColor}`}>{value}</h3>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-4 flex items-center gap-2">
                    <ArrowUpRight className="w-3 h-3 text-emerald-500" /> {sub}
                </p>
            </div>
        </div>
    )
}

function TabButton({ active, onClick, label, icon: Icon }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    )
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}

function ResearchStat({ label, value, sub, icon: Icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-gray-200 shadow-sm flex flex-col justify-between h-40 hover:border-black transition-all">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-gray-50 rounded-xl text-primary">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+4.2%</span>
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black italic tracking-tighter text-gray-900">{value}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{sub}</p>
            </div>
        </div>
    )
}

function TierRow({ label, count, growth, impact, color }: any) {
    return (
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-50">
            <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <div>
                    <p className="text-xs font-black uppercase text-gray-900">{label}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{count} HUBS ACROSS NETWORK</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs font-black text-gray-900 italic">{impact}% IMPACT</p>
                <p className={`text-[9px] font-black uppercase ${growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{growth} GROWTH</p>
            </div>
        </div>
    )
}

function Landmark({ className }: { className?: string }) {
    return <Building2 className={className} />
}
