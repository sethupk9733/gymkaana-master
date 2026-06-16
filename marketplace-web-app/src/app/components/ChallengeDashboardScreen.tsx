import { useState, useEffect } from "react";
import { ArrowLeft, Trophy, Flame, Target, Award, Star, Activity, ChevronRight, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchGamificationDashboard } from "../lib/api";

export function ChallengeDashboardScreen({
    onBack,
}: {
    onBack: () => void;
}) {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const res = await fetchGamificationDashboard();
                if (res.success) {
                    setDashboardData(res.data);
                }
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="h-full bg-background flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Dashboard</p>
            </div>
        );
    }

    const { totalPoints = 0, currentRank = 'Unranked', joinedChallenges = [], rewardsEarned = [], activityHistory = [] } = dashboardData || {};

    const getProgressPercentage = (points: number) => {
        const nextLevel = Math.ceil(points / 500) * 500 || 500;
        return (points / nextLevel) * 100;
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
                    <h2 className="text-xl font-black italic uppercase tracking-tighter">My Challenges</h2>
                </div>
            </div>

            <div className="p-6 space-y-8 pb-24">
                {/* Stats Header (Duolingo Style) */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[32px] p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
                        <Flame className="w-16 h-16 absolute -right-4 -bottom-4 opacity-20" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Total Points</h3>
                        <p className="text-4xl font-black italic mt-1">{totalPoints}</p>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                        <Trophy className="w-16 h-16 absolute -right-4 -bottom-4 opacity-20" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Current Rank</h3>
                        <p className="text-4xl font-black italic mt-1">#{currentRank}</p>
                    </div>
                </div>

                {/* Next Level Progress */}
                <div className="bg-white rounded-[32px] p-6 border border-border/60 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-extrabold text-secondary tracking-tight">Level Progress</h3>
                        <span className="text-[11px] font-bold text-muted-foreground uppercase">{totalPoints} / {Math.ceil(totalPoints / 500) * 500 || 500} pts</span>
                    </div>
                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgressPercentage(totalPoints)}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                        />
                    </div>
                </div>

                {/* Joined Challenges */}
                <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 italic">Active Challenges</h3>
                    {joinedChallenges.length > 0 ? (
                        <div className="space-y-4">
                            {joinedChallenges.map((uc: any, idx: number) => {
                                const challenge = uc.challengeId;
                                const progressPct = Math.min(((uc.currentProgress || 0) / (challenge.target || 1)) * 100, 100);
                                return (
                                    <div key={idx} className="bg-white rounded-[32px] p-6 border border-border/60 shadow-sm flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                                <Target className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-extrabold text-secondary text-sm">{challenge.name}</h4>
                                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">{uc.currentProgress || 0} / {challenge.target}</p>
                                            </div>
                                            {uc.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${uc.status === 'completed' ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${progressPct}%` }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-border border-dashed rounded-[32px] p-8 text-center">
                            <Target className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">No Active Challenges</p>
                            <p className="text-xs text-slate-400 mt-2">Join a challenge to start earning points!</p>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 italic">Recent Activity</h3>
                    <div className="bg-white rounded-[32px] border border-border/60 shadow-sm overflow-hidden">
                        {activityHistory.length > 0 ? (
                            activityHistory.map((activity: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-5 border-b border-border/40 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-secondary text-sm">{activity.action.replace(/_/g, ' ')}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">{new Date(activity.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="font-black text-emerald-500">+{activity.points}</div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">No recent activity</div>
                        )}
                    </div>
                </div>

            </div>
        </motion.div>
    );
}
