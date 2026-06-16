import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Crown, Medal, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchLeaderboard } from "../lib/api";

export function LeaderboardScreen({
    onBack,
}: {
    onBack: () => void;
}) {
    const [loading, setLoading] = useState(true);
    const [leaderboardData, setLeaderboardData] = useState<{ users: any[], gyms: any[] }>({ users: [], gyms: [] });
    const [activeTab, setActiveTab] = useState<'users' | 'gyms'>('users');

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchLeaderboard();
                if (res.success) {
                    setLeaderboardData(res.data);
                }
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="h-full bg-background flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Leaderboard</p>
            </div>
        );
    }

    const { users, gyms } = leaderboardData;
    const currentList = activeTab === 'users' ? users : gyms;

    const getRankIcon = (index: number) => {
        if (index === 0) return <Crown className="w-5 h-5 text-amber-500" />;
        if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
        if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
        return <span className="text-sm font-black text-muted-foreground w-5 text-center">{index + 1}</span>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full bg-background flex flex-col overflow-y-auto"
        >
            <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-amber-500" /> Leaderboard
                    </h2>
                </div>
            </div>

            <div className="p-6 space-y-6 pb-24">
                {/* Tabs */}
                <div className="flex bg-slate-100 rounded-full p-1 border border-border/40">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-full transition-all ${
                            activeTab === 'users' ? 'bg-white shadow-sm text-secondary' : 'text-muted-foreground'
                        }`}
                    >
                        Top Users
                    </button>
                    <button
                        onClick={() => setActiveTab('gyms')}
                        className={`flex-1 py-3 text-[11px] font-black uppercase tracking-widest rounded-full transition-all ${
                            activeTab === 'gyms' ? 'bg-white shadow-sm text-secondary' : 'text-muted-foreground'
                        }`}
                    >
                        Top Gyms
                    </button>
                </div>

                {/* List */}
                <div className="bg-white rounded-[32px] border border-border/60 shadow-sm overflow-hidden">
                    {currentList.length > 0 ? (
                        currentList.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center p-4 border-b border-border/40 last:border-0 hover:bg-slate-50 transition-colors">
                                <div className="w-10 flex justify-center shrink-0">
                                    {getRankIcon(idx)}
                                </div>
                                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden ml-2 flex items-center justify-center border-2 border-white shadow-sm">
                                    {(activeTab === 'users' ? item.profileImage : item.logo) ? (
                                        <img src={activeTab === 'users' ? item.profileImage : item.logo} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-5 h-5 text-slate-300" />
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="font-extrabold text-secondary text-sm">{item.name || 'Anonymous'}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                        {activeTab === 'users' ? 'Fitness Enthusiast' : 'Partner Gym'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-emerald-500">{activeTab === 'users' ? item.totalPoints : item.popularityScore}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">{activeTab === 'users' ? 'Pts' : 'Visits'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">No data available</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
