import { useState, useEffect } from "react";
import {
    TrendingUp, Users, Trophy, Target, Activity, Award, Flame, BarChart3,
    ArrowUpRight, ArrowDownRight, Loader2, Star, Zap
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getAuthHeaders = () => {
    const token = localStorage.getItem('gymkaana_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const ACTION_LABELS: Record<string, string> = {
    LOGIN: 'Daily Login',
    VIEW_GYM: 'Gym Profile View',
    SAVE_GYM: 'Saved a Gym',
    BOOK_TRIAL: 'Trial Booked',
    PURCHASE_MEMBERSHIP: 'Membership Purchased',
    REFERRAL_SIGNUP: 'Referral Signup',
    REFERRAL_TRIAL: 'Referral Trial',
    REFERRAL_MEMBERSHIP: 'Referral Membership',
    COMPLETE_CHALLENGE: 'Challenge Completed',
    REACH_MILESTONE: 'Milestone Reached',
    GYM_VISIT: 'Gym Visit'
};

const ACTION_COLORS: Record<string, string> = {
    LOGIN: '#6366f1',
    VIEW_GYM: '#8b5cf6',
    SAVE_GYM: '#ec4899',
    BOOK_TRIAL: '#f59e0b',
    PURCHASE_MEMBERSHIP: '#10b981',
    REFERRAL_SIGNUP: '#3b82f6',
    REFERRAL_TRIAL: '#06b6d4',
    REFERRAL_MEMBERSHIP: '#14b8a6',
    COMPLETE_CHALLENGE: '#f97316',
    REACH_MILESTONE: '#a855f7',
    GYM_VISIT: '#84cc16'
};

function StatCard({ label, value, subValue, icon: Icon, color, trend }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0`} style={{ backgroundColor: color + '20' }}>
                <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">{label}</p>
                <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
                {subValue && <p className="text-xs font-bold text-gray-400 mt-1">{subValue}</p>}
            </div>
            {trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-black ${trend >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                    {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
    );
}

function ActionBreakdownBar({ action, count, total }: any) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    const color = ACTION_COLORS[action] || '#6b7280';
    const label = ACTION_LABELS[action] || action;
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700">{label}</span>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-500">{count.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-gray-300">{pct}%</span>
                </div>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}

export function GamificationAnalytics() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<{ users: any[], gyms: any[] }>({ users: [], gyms: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'users' | 'gyms'>('users');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [analyticsRes, leaderboardRes] = await Promise.all([
                    fetch(`${BASE_URL}/gamification/admin/analytics`, { headers: getAuthHeaders() }),
                    fetch(`${BASE_URL}/gamification/leaderboard`)
                ]);
                const analyticsData = await analyticsRes.json();
                const leaderboardData = await leaderboardRes.json();

                if (analyticsData.success) setAnalytics(analyticsData.data);
                if (leaderboardData.success) setLeaderboard(leaderboardData.data);
            } catch (err) {
                console.error('Failed to load analytics', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-300 mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    const {
        totalPoints = 0,
        totalTransactions = 0,
        uniqueUsers = 0,
        actionBreakdown = [],
        topActions = [],
        recentActivity = []
    } = analytics || {};

    const totalActions = actionBreakdown.reduce((sum: number, a: any) => sum + a.count, 0);
    const avgPointsPerUser = uniqueUsers > 0 ? Math.round(totalPoints / uniqueUsers) : 0;

    const getRankEmoji = (idx: number) => {
        if (idx === 0) return '🥇';
        if (idx === 1) return '🥈';
        if (idx === 2) return '🥉';
        return `#${idx + 1}`;
    };

    return (
        <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Gamification Analytics</h1>
                <p className="text-sm font-medium text-gray-500 mt-1">Real-time insights on user engagement and point economy</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Points Awarded" value={totalPoints.toLocaleString()} icon={Zap} color="#f59e0b" subValue="Across all users" />
                <StatCard label="Active Users" value={uniqueUsers.toLocaleString()} icon={Users} color="#6366f1" subValue="With ≥1 transaction" />
                <StatCard label="Total Transactions" value={totalTransactions.toLocaleString()} icon={Activity} color="#10b981" subValue="Point events logged" />
                <StatCard label="Avg Points/User" value={avgPointsPerUser.toLocaleString()} icon={TrendingUp} color="#ec4899" subValue="Engagement depth" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Action Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900 uppercase italic tracking-tight">Action Breakdown</h2>
                            <p className="text-xs font-bold text-gray-400">{totalActions.toLocaleString()} total actions tracked</p>
                        </div>
                    </div>
                    {actionBreakdown.length > 0 ? (
                        <div className="space-y-4">
                            {actionBreakdown
                                .sort((a: any, b: any) => b.count - a.count)
                                .map((item: any) => (
                                    <ActionBreakdownBar
                                        key={item.action}
                                        action={item.action}
                                        count={item.count}
                                        total={totalActions}
                                    />
                                ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-xs font-black text-gray-300 uppercase tracking-widest">
                            No action data yet
                        </div>
                    )}
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                            <Flame className="w-5 h-5 text-orange-500" />
                        </div>
                        <h2 className="font-black text-gray-900 uppercase italic tracking-tight">Live Feed</h2>
                    </div>
                    {recentActivity.length > 0 ? (
                        <div className="space-y-3 overflow-y-auto flex-1" style={{ maxHeight: '380px' }}>
                            {recentActivity.map((activity: any, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-black"
                                        style={{ backgroundColor: ACTION_COLORS[activity.action] || '#6b7280' }}
                                    >
                                        {(activity.userName || 'U')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">{activity.userName || 'User'}</p>
                                        <p className="text-[10px] font-bold text-gray-400">{ACTION_LABELS[activity.action] || activity.action}</p>
                                        <p className="text-[9px] text-gray-300 mt-0.5">{new Date(activity.createdAt).toLocaleString()}</p>
                                    </div>
                                    <span className="text-xs font-black text-emerald-500 shrink-0">+{activity.points}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-xs font-black text-gray-300 uppercase tracking-widest">
                            No recent activity
                        </div>
                    )}
                </div>
            </div>

            {/* Leaderboard Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-amber-500" />
                        </div>
                        <h2 className="font-black text-gray-900 uppercase italic tracking-tight">Leaderboard</h2>
                    </div>
                    <div className="flex bg-gray-100 rounded-full p-1 gap-1">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('gyms')}
                            className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${activeTab === 'gyms' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                        >
                            Gyms
                        </button>
                    </div>
                </div>

                {(activeTab === 'users' ? leaderboard.users : leaderboard.gyms).length === 0 ? (
                    <div className="py-12 text-center text-xs font-black text-gray-300 uppercase tracking-widest">
                        No leaderboard data yet
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-3 px-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Rank</th>
                                    <th className="text-left py-3 px-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                                    {activeTab === 'users' ? (
                                        <th className="text-right py-3 px-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Total Points</th>
                                    ) : (
                                        <th className="text-right py-3 px-2 text-[10px] font-black uppercase tracking-widest text-gray-400">Popularity</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {(activeTab === 'users' ? leaderboard.users : leaderboard.gyms).map((item: any, idx: number) => (
                                    <tr key={idx} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${idx < 3 ? 'bg-amber-50/30' : ''}`}>
                                        <td className="py-3 px-2">
                                            <span className="text-lg">{getRankEmoji(idx)}</span>
                                        </td>
                                        <td className="py-3 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-black overflow-hidden">
                                                    {(item.profileImage || item.logo) ? (
                                                        <img src={item.profileImage || item.logo} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        (item.name || 'U')[0].toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{item.name || 'Anonymous'}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">{activeTab === 'users' ? 'Member' : 'Partner Gym'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2 text-right">
                                            <span className="font-black text-emerald-500">
                                                {(activeTab === 'users' ? item.totalPoints : item.popularityScore)?.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 ml-1">{activeTab === 'users' ? 'pts' : 'visits'}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Top Earning Actions */}
            {topActions.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                            <Star className="w-5 h-5 text-purple-500" />
                        </div>
                        <h2 className="font-black text-gray-900 uppercase italic tracking-tight">Top Earning Actions</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {topActions.slice(0, 4).map((action: any, idx: number) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div
                                    className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                                    style={{ backgroundColor: (ACTION_COLORS[action.action] || '#6b7280') + '20' }}
                                >
                                    <Award className="w-4 h-4" style={{ color: ACTION_COLORS[action.action] || '#6b7280' }} />
                                </div>
                                <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-1">
                                    {ACTION_LABELS[action.action] || action.action}
                                </p>
                                <p className="text-xl font-black text-gray-900">{action.totalPoints?.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-gray-400">total pts</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
