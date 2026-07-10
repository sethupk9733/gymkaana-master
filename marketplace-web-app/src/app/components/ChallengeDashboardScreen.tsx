import { useState, useEffect } from "react";
import {
    ArrowLeft, Trophy, Flame, Target, Award, Star, Activity, CheckCircle2,
    Plus, Calendar, Zap, X, Loader2, TrendingUp, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchGamificationDashboard, fetchActiveChallenges, joinChallenge, createCustomChallenge, fetchUserCustomChallenges } from "../lib/api";

const CHALLENGE_PRESETS = [
    { days: 7, label: "7-Day Spark", emoji: "⚡", desc: "A quick week to build momentum" },
    { days: 30, label: "30-Day Fire", emoji: "🔥", desc: "The classic month-long challenge" },
    { days: 60, label: "60-Day Elite", emoji: "🦅", desc: "Two months of discipline" },
    { days: 100, label: "100-Day Legend", emoji: "🏆", desc: "The ultimate commitment" },
];

const TARGET_TYPES = [
    { value: "WORKOUTS", label: "Total Workouts", icon: "🏋️", hint: "e.g. 30 sessions in 30 days" },
    { value: "CALORIES", label: "Total Calories", icon: "🔥", hint: "e.g. 30,000 kcal burned" },
    { value: "OTHER", label: "Custom Goal", icon: "🎯", hint: "Any other measurable target" },
];

type Tab = "my_challenges" | "global" | "create";

export function ChallengeDashboardScreen({ onBack }: { onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<Tab>("my_challenges");
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [globalChallenges, setGlobalChallenges] = useState<any[]>([]);
    const [customChallenges, setCustomChallenges] = useState<any[]>([]);

    // Create challenge form
    const [form, setForm] = useState({
        name: "",
        description: "",
        durationDays: 30,
        targetType: "WORKOUTS",
        target: 30,
    });
    const [selectedPreset, setSelectedPreset] = useState<number | null>(1); // default 30-day
    const [creating, setCreating] = useState(false);
    const [joiningId, setJoiningId] = useState<string | null>(null);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [dashRes, globalRes, customRes] = await Promise.all([
                fetchGamificationDashboard().catch(() => null),
                fetchActiveChallenges().catch(() => ({ data: [] })),
                fetchUserCustomChallenges().catch(() => ({ data: [] })),
            ]);
            if (dashRes?.success) setDashboardData(dashRes.data);
            setGlobalChallenges(globalRes?.data || []);
            setCustomChallenges(customRes?.data || []);
        } catch (err) {
            console.error("Failed to load challenge data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadAll(); }, []);

    const handlePresetSelect = (preset: typeof CHALLENGE_PRESETS[0], idx: number) => {
        setSelectedPreset(idx);
        setForm((f) => ({
            ...f,
            name: f.name || preset.label,
            durationDays: preset.days,
        }));
    };

    const handleCreateChallenge = async () => {
        if (!form.name || !form.target || !form.durationDays) {
            alert("Please fill in the challenge name and targets.");
            return;
        }
        setCreating(true);
        try {
            await createCustomChallenge(form);
            setForm({ name: "", description: "", durationDays: 30, targetType: "WORKOUTS", target: 30 });
            setSelectedPreset(1);
            await loadAll();
            setActiveTab("my_challenges");
        } catch (err: any) {
            console.error("Failed to create challenge:", err);
            alert(err.message || "Failed to create challenge.");
        } finally {
            setCreating(false);
        }
    };

    const handleJoinGlobal = async (challengeId: string) => {
        setJoiningId(challengeId);
        try {
            await joinChallenge(challengeId);
            await loadAll();
        } catch (err: any) {
            alert(err.message || "Failed to join challenge.");
        } finally {
            setJoiningId(null);
        }
    };

    if (loading) {
        return (
            <div className="h-full bg-background flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <p className="mt-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Challenges</p>
            </div>
        );
    }

    const { totalPoints = 0, currentRank = "Unranked", joinedChallenges = [], rewardsEarned = [] } = dashboardData || {};

    const getProgressPct = (cur: number, tgt: number) => Math.min(((cur || 0) / (tgt || 1)) * 100, 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full bg-background flex flex-col"
        >
            {/* Header */}
            <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black italic uppercase tracking-tighter">Challenges Hub</h2>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4 bg-slate-100 p-1 rounded-2xl">
                    {([
                        { id: "my_challenges" as Tab, label: "My Challenges" },
                        { id: "global" as Tab, label: "Explore" },
                        { id: "create" as Tab, label: "+ Create" },
                    ]).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2 px-3 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all ${activeTab === tab.id
                                ? "bg-white text-secondary shadow-sm"
                                : "text-muted-foreground hover:text-secondary"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {/* ── MY CHALLENGES TAB ── */}
                    {activeTab === "my_challenges" && (
                        <motion.div key="my" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            className="p-6 space-y-8 pb-32 max-w-2xl mx-auto w-full"
                        >
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[32px] p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
                                    <Flame className="w-16 h-16 absolute -right-4 -bottom-4 opacity-20" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Total Points</h3>
                                    <p className="text-4xl font-black italic mt-1">{totalPoints}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[32px] p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                                    <Trophy className="w-16 h-16 absolute -right-4 -bottom-4 opacity-20" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Global Rank</h3>
                                    <p className="text-4xl font-black italic mt-1">#{currentRank}</p>
                                </div>
                            </div>

                            {/* Active Joined Challenges */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 italic">Active Challenges</h3>
                                {joinedChallenges.length > 0 ? (
                                    <div className="space-y-4">
                                        {joinedChallenges.map((uc: any, idx: number) => {
                                            const ch = uc.challengeId;
                                            const pct = getProgressPct(uc.currentProgress, ch?.target);
                                            const done = uc.status === "COMPLETED";
                                            return (
                                                <div key={idx} className="bg-white rounded-[32px] p-6 border border-border/60 shadow-sm space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl ${done ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'} flex items-center justify-center shrink-0`}>
                                                            {done ? <CheckCircle2 className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-extrabold text-secondary text-sm">{ch?.name}</h4>
                                                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
                                                                {uc.currentProgress || 0} / {ch?.target} {ch?.targetType === 'CALORIES' ? 'kcal' : ch?.targetType === 'WORKOUTS' ? 'sessions' : 'units'}
                                                            </p>
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full ${done ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                            {done ? "Done!" : `${Math.round(pct)}%`}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                                            className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-indigo-500'}`}
                                                        />
                                                    </div>
                                                    {ch?.endDate && (
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Ends {new Date(ch.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-dashed border-border/80 rounded-[32px] p-10 text-center">
                                        <div className="text-5xl mb-3">🏆</div>
                                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">No Active Challenges</p>
                                        <p className="text-xs text-slate-400 mt-2">Create your own or join a global challenge!</p>
                                        <button onClick={() => setActiveTab("create")}
                                            className="mt-4 px-6 py-2.5 bg-primary text-white rounded-full text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all"
                                        >
                                            + Create Challenge
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Custom Challenges */}
                            {customChallenges.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 italic">My Custom Challenges</h3>
                                    <div className="space-y-3">
                                        {customChallenges.map((ch: any, idx: number) => {
                                            const joined = joinedChallenges.find((jc: any) => jc.challengeId?._id === ch._id || jc.challengeId === ch._id);
                                            const pct = joined ? getProgressPct(joined.currentProgress, ch.target) : 0;
                                            return (
                                                <div key={idx} className="bg-white border border-primary/20 rounded-[28px] p-5 shadow-sm space-y-3">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xl">🎯</div>
                                                        <div className="flex-1">
                                                            <h4 className="font-extrabold text-secondary text-sm">{ch.name}</h4>
                                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-0.5">
                                                                {ch.durationDays} Days · {ch.target} {ch.targetType === 'CALORIES' ? 'kcal' : ch.targetType === 'WORKOUTS' ? 'sessions' : 'units'}
                                                            </p>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">Custom</span>
                                                    </div>
                                                    {joined && (
                                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Badges */}
                            {rewardsEarned.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 italic">Badges Earned</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {rewardsEarned.map((badge: any, idx: number) => (
                                            <div key={idx} className="bg-white border border-border/60 rounded-[20px] px-4 py-3 flex items-center gap-2 shadow-sm">
                                                <span className="text-xl">{badge.icon}</span>
                                                <span className="text-[11px] font-black text-secondary uppercase tracking-wide">{badge.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── GLOBAL / EXPLORE TAB ── */}
                    {activeTab === "global" && (
                        <motion.div key="global" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="p-6 space-y-6 pb-32 max-w-2xl mx-auto w-full"
                        >
                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 italic">Global Challenges</h3>
                            {globalChallenges.length > 0 ? globalChallenges.map((ch: any, idx: number) => {
                                const isJoined = joinedChallenges.some((jc: any) => jc.challengeId?._id === ch._id || jc.challengeId === ch._id);
                                return (
                                    <div key={idx} className="bg-white border border-border/60 rounded-[32px] p-6 shadow-sm space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-[20px] bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-2xl shadow-lg">🏆</div>
                                            <div className="flex-1">
                                                <h4 className="font-extrabold text-secondary">{ch.name}</h4>
                                                {ch.description && <p className="text-xs text-muted-foreground mt-0.5">{ch.description}</p>}
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mt-1">
                                                    Target: {ch.target} {ch.targetType === 'CALORIES' ? 'kcal' : ch.targetType === 'WORKOUTS' ? 'sessions' : 'pts'}
                                                    {ch.rewardPoints > 0 && ` · ${ch.rewardPoints} pts reward`}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => !isJoined && handleJoinGlobal(ch._id)}
                                            disabled={isJoined || joiningId === ch._id}
                                            className={`w-full py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${isJoined
                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                                                : 'bg-secondary text-white hover:opacity-90 shadow-lg'
                                                }`}
                                        >
                                            {joiningId === ch._id ? <Loader2 className="w-4 h-4 animate-spin" /> : isJoined ? <><CheckCircle2 className="w-4 h-4" /> Joined!</> : <>Join Challenge</>}
                                        </button>
                                    </div>
                                );
                            }) : (
                                <div className="bg-slate-50 border border-dashed border-border rounded-[32px] p-10 text-center">
                                    <div className="text-4xl mb-3">🌍</div>
                                    <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">No Global Challenges Yet</p>
                                    <p className="text-xs text-slate-400 mt-2">The admin hasn't published any yet. Check back soon!</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ── CREATE CHALLENGE TAB ── */}
                    {activeTab === "create" && (
                        <motion.div key="create" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="p-6 space-y-8 pb-32 max-w-2xl mx-auto w-full"
                        >
                            {/* Hero prompt */}
                            <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-[40px] p-8 text-white relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-6xl opacity-10">🏆</div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-2">Build Your Own</p>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">Create a<br />Challenge</h3>
                                <p className="text-sm text-slate-400 mt-3">Set your own duration, target, and goal type. Track progress as you log workouts.</p>
                            </div>

                            {/* Preset Duration Picker */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Duration Preset</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {CHALLENGE_PRESETS.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handlePresetSelect(preset, idx)}
                                            className={`p-4 rounded-[24px] border-2 text-left transition-all ${selectedPreset === idx
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-border/60 bg-white hover:border-primary/40'
                                                }`}
                                        >
                                            <span className="text-2xl">{preset.emoji}</span>
                                            <p className="font-extrabold text-secondary text-sm mt-2">{preset.label}</p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5">{preset.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Challenge Name */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Challenge Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    className="w-full p-4 bg-white border border-border/60 rounded-[20px] font-extrabold text-secondary outline-none focus:border-primary transition-all shadow-sm"
                                    placeholder="e.g. My Summer Shred 🔥"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Description (optional)</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                    className="w-full p-4 bg-white border border-border/60 rounded-[20px] font-extrabold text-secondary outline-none focus:border-primary transition-all resize-none shadow-sm"
                                    placeholder="What's your goal?"
                                    rows={2}
                                />
                            </div>

                            {/* Custom duration */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Duration (days) <span className="normal-case font-bold text-muted-foreground/60">— customize if needed</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.durationDays}
                                    onChange={(e) => { setSelectedPreset(null); setForm((f) => ({ ...f, durationDays: Number(e.target.value) })); }}
                                    className="w-full p-4 bg-white border border-border/60 rounded-[20px] font-extrabold text-secondary outline-none focus:border-primary transition-all shadow-sm"
                                    min="1"
                                />
                            </div>

                            {/* Target Type */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Goal Type</label>
                                <div className="space-y-2">
                                    {TARGET_TYPES.map((tt) => (
                                        <button
                                            key={tt.value}
                                            onClick={() => setForm((f) => ({ ...f, targetType: tt.value }))}
                                            className={`w-full flex items-center gap-4 p-4 rounded-[20px] border-2 text-left transition-all ${form.targetType === tt.value
                                                ? 'border-primary bg-primary/5 shadow-sm'
                                                : 'border-border/60 bg-white hover:border-primary/40'
                                                }`}
                                        >
                                            <span className="text-2xl">{tt.icon}</span>
                                            <div className="flex-1">
                                                <p className="font-extrabold text-secondary text-sm">{tt.label}</p>
                                                <p className="text-[10px] text-muted-foreground">{tt.hint}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${form.targetType === tt.value ? 'border-primary bg-primary' : 'border-border'}`}>
                                                {form.targetType === tt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Target Value */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                    Target Value ({form.targetType === "CALORIES" ? "kcal" : form.targetType === "WORKOUTS" ? "sessions" : "units"})
                                </label>
                                <input
                                    type="number"
                                    value={form.target}
                                    onChange={(e) => setForm((f) => ({ ...f, target: Number(e.target.value) }))}
                                    className="w-full p-4 bg-white border border-border/60 rounded-[20px] font-extrabold text-secondary outline-none focus:border-primary transition-all shadow-sm"
                                    min="1"
                                    placeholder={form.targetType === "CALORIES" ? "e.g. 30000" : "e.g. 30"}
                                />
                            </div>

                            {/* Summary Preview */}
                            {form.name && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-primary/20 rounded-[28px] p-6"
                                >
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">Challenge Preview</p>
                                    <p className="font-extrabold text-secondary text-lg">{form.name}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="text-[10px] font-black bg-white border border-border/60 rounded-full px-3 py-1.5 uppercase tracking-wide">
                                            📅 {form.durationDays} Days
                                        </span>
                                        <span className="text-[10px] font-black bg-white border border-border/60 rounded-full px-3 py-1.5 uppercase tracking-wide">
                                            🎯 {form.target} {form.targetType === "CALORIES" ? "kcal" : form.targetType === "WORKOUTS" ? "sessions" : "units"}
                                        </span>
                                        <span className="text-[10px] font-black bg-white border border-border/60 rounded-full px-3 py-1.5 uppercase tracking-wide">
                                            {TARGET_TYPES.find(t => t.value === form.targetType)?.icon} {TARGET_TYPES.find(t => t.value === form.targetType)?.label}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            <button
                                onClick={handleCreateChallenge}
                                disabled={creating || !form.name || !form.target || !form.durationDays}
                                className="w-full py-5 bg-gradient-to-r from-indigo-500 to-primary text-white rounded-[24px] font-black uppercase tracking-[0.3em] italic text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                            >
                                {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5" />}
                                {creating ? "Creating..." : "Launch Challenge!"}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
