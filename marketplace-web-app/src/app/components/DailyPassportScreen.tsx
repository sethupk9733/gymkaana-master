import { useState, useEffect, useMemo, useRef } from "react";
import {
    ArrowLeft, Flame, Plus, Target, CheckCircle2, Clock, ChevronDown, Loader2,
    Dumbbell, Bike, PersonStanding, Waves, Zap, Activity, TrendingUp, Edit3, Check, X,
    CalendarDays, Award, Gauge, Trophy, Droplet, Minus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchDailyPassport, logWorkout, updateCalorieTarget, fetchMonthlyStats, logWater, updateWaterTarget, createCustomChallenge } from "../lib/api";

const WORKOUT_TYPES = [
    { type: "Running", icon: "🏃", baseCals: 10, color: "from-orange-400 to-red-500" },
    { type: "Cycling", icon: "🚴", baseCals: 8, color: "from-blue-400 to-cyan-500" },
    { type: "Weight Training", icon: "🏋️", baseCals: 6, color: "from-purple-400 to-indigo-500" },
    { type: "Swimming", icon: "🏊", baseCals: 9, color: "from-sky-400 to-blue-500" },
    { type: "Yoga", icon: "🧘", baseCals: 4, color: "from-green-400 to-emerald-500" },
    { type: "HIIT", icon: "⚡", baseCals: 12, color: "from-yellow-400 to-orange-500" },
    { type: "Boxing", icon: "🥊", baseCals: 11, color: "from-red-400 to-pink-500" },
    { type: "Pilates", icon: "🤸", baseCals: 5, color: "from-pink-400 to-rose-500" },
    { type: "Zumba", icon: "💃", baseCals: 7, color: "from-fuchsia-400 to-purple-500" },
    { type: "CrossFit", icon: "🔥", baseCals: 13, color: "from-amber-400 to-orange-500" },
    { type: "Walk", icon: "🚶", baseCals: 4, color: "from-teal-400 to-green-500" },
    { type: "Other", icon: "🏅", baseCals: 6, color: "from-slate-400 to-gray-500" },
];

export function DailyPassportScreen({ onBack }: { onBack: () => void }) {
    const [loading, setLoading] = useState(true);
    const [passport, setPassport] = useState<any>(null);
    const [monthlyStats, setMonthlyStats] = useState<any>(null);
    const [viewMode, setViewMode] = useState<"today" | "monthly">("today");

    const [editTarget, setEditTarget] = useState(false);
    const [targetInput, setTargetInput] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [savingTarget, setSavingTarget] = useState(false);

    // Water Tracking State
    const [editWaterTarget, setEditWaterTarget] = useState(false);
    const [waterTargetInput, setWaterTargetInput] = useState("");
    const [savingWaterTarget, setSavingWaterTarget] = useState(false);
    const [loggingWater, setLoggingWater] = useState(false);

    // Challenge Creation State
    const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);
    const [creatingChallenge, setCreatingChallenge] = useState(false);
    const [selectedChallengePreset, setSelectedChallengePreset] = useState<number | null>(1);
    const [challengeForm, setChallengeForm] = useState({
        name: "",
        description: "",
        durationDays: 30,
        targetType: "WORKOUTS",
        target: 30,
    });

    const CHALLENGE_PRESETS = [
        { days: 7, label: "7-Day Spark", emoji: "⚡" },
        { days: 30, label: "30-Day Fire", emoji: "🔥" },
        { days: 60, label: "60-Day Elite", emoji: "🦅" },
        { days: 100, label: "100-Day Legend", emoji: "🏆" },
    ];

    const TARGET_TYPES = [
        { value: "WORKOUTS", label: "Total Workouts", icon: "🏋️", hint: "e.g. 30 sessions" },
        { value: "CALORIES", label: "Total Calories", icon: "🔥", hint: "e.g. 30,000 kcal" },
        { value: "WATER", label: "Water Intake (ml)", icon: "💧", hint: "e.g. 60,000 ml" },
        { value: "OTHER", label: "Custom Goal", icon: "🎯", hint: "Any custom target" },
    ];

    // Form State
    const [intensity, setIntensity] = useState<"Low" | "Medium" | "High">("Medium");
    const [formData, setFormData] = useState({
        workoutType: "",
        durationMinutes: "",
        caloriesBurned: "",
        notes: "",
    });

    // Monthly View State
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const formRef = useRef<HTMLDivElement>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [todayData, monthData] = await Promise.all([
                fetchDailyPassport().catch(() => null),
                fetchMonthlyStats().catch(() => null)
            ]);
            if (todayData) {
                setPassport(todayData);
                setTargetInput(String(todayData.dailyCalorieTarget || 2000));
                setWaterTargetInput(String(todayData.dailyWaterTarget || 2000));
            }
            if (monthData) {
                setMonthlyStats(monthData);
            }
        } catch (err) {
            console.error("Failed to load passport data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const calculateCalories = (type: string, duration: string, int: string) => {
        const wt = WORKOUT_TYPES.find((w) => w.type === type);
        if (!wt || !duration) return "";
        let multiplier = 1.0;
        if (int === "Low") multiplier = 0.8;
        if (int === "High") multiplier = 1.3;
        return Math.round(wt.baseCals * Number(duration) * multiplier);
    };

    const handleWorkoutTypeSelect = (type: string) => {
        setFormData((f) => ({
            ...f,
            workoutType: type,
            caloriesBurned: String(calculateCalories(type, f.durationMinutes, intensity)),
        }));
    };

    const handleDurationChange = (val: string) => {
        setFormData((f) => ({
            ...f,
            durationMinutes: val,
            caloriesBurned: String(calculateCalories(f.workoutType, val, intensity)),
        }));
    };

    const handleIntensityChange = (val: "Low" | "Medium" | "High") => {
        setIntensity(val);
        setFormData((f) => ({
            ...f,
            caloriesBurned: String(calculateCalories(f.workoutType, f.durationMinutes, val)),
        }));
    };

    const handleLogWorkout = async () => {
        if (!formData.workoutType || !formData.durationMinutes || !formData.caloriesBurned) {
            alert("Please fill in all required fields.");
            return;
        }
        setSubmitting(true);
        try {
            await logWorkout({
                workoutType: formData.workoutType,
                durationMinutes: Number(formData.durationMinutes),
                intensity,
                caloriesBurned: Number(formData.caloriesBurned),
                notes: formData.notes,
            });
            setFormData({ workoutType: "", durationMinutes: "", caloriesBurned: "", notes: "" });
            setIntensity("Medium");
            await loadData();
        } catch (err) {
            console.error("Failed to log workout:", err);
            alert("Failed to log workout. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveTarget = async () => {
        if (!targetInput || isNaN(Number(targetInput))) return;
        setSavingTarget(true);
        try {
            await updateCalorieTarget(Number(targetInput));
            setEditTarget(false);
            await loadData();
        } catch (err) {
            console.error("Failed to save target:", err);
        } finally {
            setSavingTarget(false);
        }
    };

    const handleLogWater = async (amount: number) => {
        setLoggingWater(true);
        try {
            await logWater(amount);
            await loadData();
        } catch (err) {
            console.error("Failed to log water:", err);
            alert("Failed to log water. Please try again.");
        } finally {
            setLoggingWater(false);
        }
    };

    const handleSaveWaterTarget = async () => {
        if (!waterTargetInput || isNaN(Number(waterTargetInput))) return;
        setSavingWaterTarget(true);
        try {
            await updateWaterTarget(Number(waterTargetInput));
            setEditWaterTarget(false);
            await loadData();
        } catch (err) {
            console.error("Failed to save water target:", err);
        } finally {
            setSavingWaterTarget(false);
        }
    };

    const handleCreateChallenge = async () => {
        if (!challengeForm.name || !challengeForm.target || !challengeForm.durationDays) {
            alert("Please fill in the challenge name and targets.");
            return;
        }
        setCreatingChallenge(true);
        try {
            await createCustomChallenge(challengeForm);
            setChallengeForm({
                name: "",
                description: "",
                durationDays: 30,
                targetType: "WORKOUTS",
                target: 30,
            });
            setSelectedChallengePreset(1);
            setShowCreateChallengeModal(false);
            alert("Challenge created successfully!");
        } catch (err: any) {
            console.error("Failed to create challenge:", err);
            alert(err.message || "Failed to create challenge.");
        } finally {
            setCreatingChallenge(false);
        }
    };

    const scrollToForm = () => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const generateCalendarDays = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    if (loading) {
        return (
            <div className="h-full bg-background flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                <p className="mt-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Loading Passport</p>
            </div>
        );
    }

    const { dailyCalorieTarget = 2000, totalCaloriesBurnedToday = 0, workouts = [], totalWaterToday = 0, dailyWaterTarget = 2000, workoutStreak = 0 } = passport || {};
    const progressPct = Math.min((totalCaloriesBurnedToday / dailyCalorieTarget) * 100, 100);
    const isGoalMet = totalCaloriesBurnedToday >= dailyCalorieTarget;

    const waterProgressPct = Math.min((totalWaterToday / dailyWaterTarget) * 100, 100);
    const isWaterGoalMet = totalWaterToday >= dailyWaterTarget;

    const calendarGrid = generateCalendarDays();
    const selectedDayData = selectedDate ? monthlyStats?.days?.find((d: any) => d.date === selectedDate) : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="h-full bg-background flex flex-col overflow-y-auto"
        >
            {/* Header */}
            <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-xl font-black italic uppercase tracking-tighter">My Passport</h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    {viewMode === "today" && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowCreateChallengeModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all shadow-lg shadow-slate-950/10"
                            >
                                <Trophy className="w-4 h-4 text-primary" />
                                Create Challenge
                            </button>
                            <button
                                onClick={scrollToForm}
                                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-full text-[11px] font-black uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-primary/30"
                            >
                                <Plus className="w-4 h-4" />
                                Add Log
                            </button>
                        </div>
                    )}
                </div>

                {/* View Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-full">
                    <button
                        onClick={() => setViewMode("today")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${viewMode === "today" ? 'bg-white shadow-sm text-secondary' : 'text-slate-500 hover:text-secondary'}`}
                    >
                        <Flame className="w-4 h-4" /> Today
                    </button>
                    <button
                        onClick={() => setViewMode("monthly")}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${viewMode === "monthly" ? 'bg-white shadow-sm text-secondary' : 'text-slate-500 hover:text-secondary'}`}
                    >
                        <CalendarDays className="w-4 h-4" /> Monthly
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-8 pb-32 max-w-2xl mx-auto w-full">
                
                <AnimatePresence mode="wait">
                    {viewMode === "today" ? (
                        <motion.div key="today" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                            
                            {/* NEW: Inline Log Workout Form */}
                            <div ref={formRef} className="bg-white border-2 border-primary/20 rounded-[32px] p-6 shadow-xl shadow-primary/5">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black italic uppercase tracking-tight text-secondary">Log A Workout</h3>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Record your activity</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-5">
                                    {/* Workout Type Grid */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Select Type</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {WORKOUT_TYPES.map((wt) => (
                                                <button
                                                    key={wt.type}
                                                    onClick={() => handleWorkoutTypeSelect(wt.type)}
                                                    className={`flex flex-col items-center gap-1 p-2 rounded-2xl border-2 transition-all ${formData.workoutType === wt.type
                                                        ? 'border-primary bg-primary/10 shadow-sm scale-[1.02]'
                                                        : 'border-border/60 hover:border-primary/40 bg-slate-50'
                                                        }`}
                                                >
                                                    <span className="text-xl">{wt.icon}</span>
                                                    <span className="text-[8px] font-black uppercase tracking-wider text-center leading-tight truncate w-full px-1">{wt.type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Duration */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Duration</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={formData.durationMinutes}
                                                    onChange={(e) => handleDurationChange(e.target.value)}
                                                    className="w-full p-4 bg-slate-50 border border-border/60 rounded-2xl font-extrabold text-secondary outline-none focus:border-primary transition-all text-sm pr-12"
                                                    placeholder="30"
                                                    min="1"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-muted-foreground uppercase">min</span>
                                            </div>
                                        </div>

                                        {/* Intensity */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1">
                                                <Gauge className="w-3 h-3" /> Intensity
                                            </label>
                                            <div className="flex bg-slate-50 border border-border/60 rounded-2xl p-1 h-[54px]">
                                                {(["Low", "Medium", "High"] as const).map((lvl) => (
                                                    <button
                                                        key={lvl}
                                                        onClick={() => handleIntensityChange(lvl)}
                                                        className={`flex-1 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${intensity === lvl ? (lvl === 'High' ? 'bg-red-500 text-white shadow-sm' : lvl === 'Medium' ? 'bg-orange-500 text-white shadow-sm' : 'bg-green-500 text-white shadow-sm') : 'text-slate-400 hover:text-secondary'}`}
                                                    >
                                                        {lvl}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Calories & Notes */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Est. Calories</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={formData.caloriesBurned}
                                                    onChange={(e) => setFormData((f) => ({ ...f, caloriesBurned: e.target.value }))}
                                                    className="w-full p-4 bg-orange-50 border border-orange-200 rounded-2xl font-extrabold text-orange-600 outline-none focus:border-orange-400 transition-all text-sm pr-12"
                                                    placeholder="0"
                                                    min="1"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-orange-400 uppercase">kcal</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Notes</label>
                                            <input
                                                type="text"
                                                value={formData.notes}
                                                onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))}
                                                className="w-full p-4 bg-slate-50 border border-border/60 rounded-2xl font-extrabold text-secondary outline-none focus:border-primary transition-all text-sm"
                                                placeholder="e.g. Leg day"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogWorkout}
                                        disabled={submitting || !formData.workoutType || !formData.durationMinutes || !formData.caloriesBurned}
                                        className="w-full py-4 bg-gradient-to-r from-primary to-green-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                                    >
                                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                                        {submitting ? "Saving..." : "Save Workout"}
                                    </button>
                                </div>
                            </div>

                            {/* Calories Ring / Hero Card */}
                            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] p-8 text-white overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-4 right-4 w-48 h-48 rounded-full bg-primary blur-3xl" />
                                    <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-orange-500 blur-2xl" />
                                </div>
                                
                                {/* Streak Badge */}
                                {workoutStreak > 0 && (
                                    <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg shadow-red-500/25 border border-red-400/25">
                                        <Flame className="w-3.5 h-3.5 text-white animate-bounce" fill="white" />
                                        <span className="text-[9px] font-black uppercase tracking-wider text-white">{workoutStreak} Day Streak</span>
                                    </div>
                                )}

                                <div className="relative flex items-center gap-8">
                                    {/* Circular Progress */}
                                    <div className="relative w-28 h-28 shrink-0">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                            <motion.circle
                                                cx="50" cy="50" r="42" fill="none"
                                                stroke={isGoalMet ? "#4ade80" : "#a3e635"}
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 42}`}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                                animate={{ strokeDashoffset: (1 - progressPct / 100) * 2 * Math.PI * 42 }}
                                                transition={{ duration: 1.2, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-2xl font-black">{Math.round(progressPct)}%</span>
                                            {isGoalMet && <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 mb-1">Total Burned</h3>
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-5xl font-black italic">{totalCaloriesBurnedToday.toLocaleString()}</span>
                                            <span className="text-sm font-bold opacity-50">kcal</span>
                                        </div>

                                        {/* Target Row */}
                                        <div className="flex items-center gap-2">
                                            {editTarget ? (
                                                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                                                    <Target className="w-3.5 h-3.5 opacity-60" />
                                                    <input
                                                        type="number"
                                                        value={targetInput}
                                                        onChange={(e) => setTargetInput(e.target.value)}
                                                        className="w-20 bg-transparent text-sm font-black outline-none"
                                                        autoFocus
                                                    />
                                                    <button onClick={handleSaveTarget} disabled={savingTarget} className="text-green-400">
                                                        {savingTarget ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button onClick={() => setEditTarget(false)} className="text-red-400">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setEditTarget(true)}
                                                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-1.5 transition-all"
                                                >
                                                    <Target className="w-3.5 h-3.5 opacity-60" />
                                                    <span className="text-sm font-bold">Target: {dailyCalorieTarget.toLocaleString()} kcal</span>
                                                    <Edit3 className="w-3 h-3 opacity-40" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="relative mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className={`h-full rounded-full ${isGoalMet ? 'bg-green-400' : 'bg-primary'}`}
                                    />
                                </div>
                            </div>

                            {/* Water Intake / Hydration Card */}
                            <div className="relative bg-gradient-to-br from-blue-900 to-indigo-950 rounded-[40px] p-8 text-white overflow-hidden shadow-2xl">
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-4 right-4 w-48 h-48 rounded-full bg-cyan-400 blur-3xl" />
                                    <div className="absolute bottom-4 left-4 w-32 h-32 rounded-full bg-blue-500 blur-2xl" />
                                </div>
                                <div className="relative flex items-center gap-8">
                                    {/* Circular Progress */}
                                    <div className="relative w-28 h-28 shrink-0">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                                            <motion.circle
                                                cx="50" cy="50" r="42" fill="none"
                                                stroke={isWaterGoalMet ? "#38bdf8" : "#60a5fa"}
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 42}`}
                                                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                                animate={{ strokeDashoffset: (1 - waterProgressPct / 100) * 2 * Math.PI * 42 }}
                                                transition={{ duration: 1.2, ease: "easeOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-2xl font-black">{Math.round(waterProgressPct)}%</span>
                                            {isWaterGoalMet && <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5" />}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] opacity-60 mb-1 flex items-center gap-1">
                                            <Droplet className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> Water Intake
                                        </h3>
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-5xl font-black italic">{totalWaterToday.toLocaleString()}</span>
                                            <span className="text-sm font-bold opacity-50">ml</span>
                                        </div>

                                        {/* Target & Increment Row */}
                                        <div className="flex flex-col gap-3">
                                            {/* Target Input */}
                                            <div className="flex items-center gap-2">
                                                {editWaterTarget ? (
                                                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                                                        <Target className="w-3.5 h-3.5 opacity-60" />
                                                        <input
                                                            type="number"
                                                            value={waterTargetInput}
                                                            onChange={(e) => setWaterTargetInput(e.target.value)}
                                                            className="w-20 bg-transparent text-sm font-black outline-none"
                                                            autoFocus
                                                        />
                                                        <button onClick={handleSaveWaterTarget} disabled={savingWaterTarget} className="text-sky-400">
                                                            {savingWaterTarget ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <button onClick={() => setEditWaterTarget(false)} className="text-red-400">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setEditWaterTarget(true)}
                                                        className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-xl px-3 py-1.5 transition-all text-xs font-bold"
                                                    >
                                                        <Target className="w-3.5 h-3.5 opacity-60" />
                                                        <span>Target: {dailyWaterTarget.toLocaleString()} ml</span>
                                                        <Edit3 className="w-3 h-3 opacity-40" />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Glass Controls (+ / - 250ml) */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleLogWater(-250)}
                                                    disabled={loggingWater || totalWaterToday <= 0}
                                                    className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-red-500/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-30"
                                                >
                                                    <Minus className="w-3 h-3" /> -250ml
                                                </button>
                                                <button
                                                    onClick={() => handleLogWater(250)}
                                                    disabled={loggingWater}
                                                    className="flex items-center justify-center gap-1 px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20"
                                                >
                                                    <Plus className="w-3 h-3" /> +250ml
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Progress bar */}
                                <div className="relative mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${waterProgressPct}%` }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className={`h-full rounded-full ${isWaterGoalMet ? 'bg-sky-400' : 'bg-blue-500'}`}
                                    />
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: "Workouts", value: workouts.length, icon: "🏅", color: "bg-orange-50 text-orange-600" },
                                    { label: "Minutes", value: workouts.reduce((s: number, w: any) => s + w.durationMinutes, 0), icon: "⏱️", color: "bg-blue-50 text-blue-600" },
                                    { label: "Remaining", value: Math.max(0, dailyCalorieTarget - totalCaloriesBurnedToday), icon: "🎯", color: "bg-green-50 text-green-600" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-white border border-border/60 rounded-[24px] p-4 text-center shadow-sm">
                                        <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center text-lg mx-auto mb-2`}>{stat.icon}</div>
                                        <p className="text-2xl font-black text-secondary">{stat.value}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-0.5">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Today's Workouts */}
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 italic">Workout Log</h3>
                                {workouts.length > 0 ? (
                                    <div className="space-y-3">
                                        {workouts.map((w: any, idx: number) => {
                                            const wt = WORKOUT_TYPES.find((t) => t.type === w.workoutType) || WORKOUT_TYPES[WORKOUT_TYPES.length - 1];
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="bg-white border border-border/60 rounded-[28px] p-5 shadow-sm flex items-center gap-4"
                                                >
                                                    <div className={`w-14 h-14 rounded-[18px] bg-gradient-to-br ${wt.color} flex items-center justify-center text-2xl shadow-lg`}>
                                                        {wt.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-extrabold text-secondary text-sm uppercase tracking-tight flex items-center gap-2">
                                                            {w.workoutType}
                                                            {w.intensity && (
                                                                <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider ${w.intensity === 'High' ? 'bg-red-100 text-red-600' : w.intensity === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                                                    {w.intensity}
                                                                </span>
                                                            )}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />{w.durationMinutes} min
                                                            </span>
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">•</span>
                                                            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide flex items-center gap-1">
                                                                <Flame className="w-3 h-3" />{w.caloriesBurned} kcal
                                                            </span>
                                                        </div>
                                                        {w.notes && <p className="text-[10px] text-slate-400 mt-1 italic">{w.notes}</p>}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                                            {new Date(w.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 border border-dashed border-border/80 rounded-[32px] p-10 text-center">
                                        <div className="text-4xl mb-3">🏃</div>
                                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">No workouts yet today</p>
                                        <p className="text-xs text-slate-400 mt-2">Log a workout above to see it here!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="monthly" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            {/* Monthly Summary Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
                                    <Flame className="w-16 h-16 absolute -right-4 -bottom-4 opacity-20" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Total Calories</h3>
                                    <p className="text-4xl font-black italic mt-1">{(monthlyStats?.monthlyTotalCalories || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-[32px] p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                                    <Activity className="w-16 h-16 absolute -right-4 -bottom-4 opacity-20" />
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">Active Days</h3>
                                    <p className="text-4xl font-black italic mt-1">{monthlyStats?.activeDays || 0}</p>
                                </div>
                            </div>

                            {/* Calendar Heatmap */}
                            <div className="bg-white border border-border/60 rounded-[32px] p-6 shadow-sm">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic mb-4">Activity Heatmap</h3>
                                
                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                        <div key={d} className="text-center text-[10px] font-black text-slate-400">{d}</div>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-7 gap-2">
                                    {calendarGrid.map((dayNum, i) => {
                                        if (!dayNum) return <div key={i} className="aspect-square" />;
                                        
                                        const now = new Date();
                                        const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                                        const dayData = monthlyStats?.days?.find((d: any) => d.date === dateKey);
                                        
                                        let bgClass = "bg-slate-50";
                                        let textClass = "text-slate-400";
                                        
                                        if (dayData) {
                                            const pct = dayData.totalCalories / (dailyCalorieTarget || 2000);
                                            if (pct >= 1) { bgClass = "bg-green-500 shadow-md shadow-green-500/30"; textClass = "text-white"; }
                                            else if (pct >= 0.5) { bgClass = "bg-primary"; textClass = "text-white"; }
                                            else { bgClass = "bg-primary/40"; textClass = "text-white"; }
                                        } else if (dayNum === now.getDate()) {
                                            bgClass = "border-2 border-primary/50 text-secondary font-black";
                                        }

                                        const isSelected = selectedDate === dateKey;

                                        return (
                                            <button 
                                                key={i} 
                                                onClick={() => setSelectedDate(dateKey)}
                                                className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all ${bgClass} ${textClass} ${isSelected ? 'ring-2 ring-offset-2 ring-secondary scale-110 z-10' : 'hover:scale-105'}`}
                                            >
                                                {dayNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="flex items-center justify-end gap-3 mt-4 text-[10px] font-bold text-slate-500 uppercase">
                                    <span>Less</span>
                                    <div className="flex gap-1">
                                        <div className="w-3 h-3 rounded-sm bg-slate-50" />
                                        <div className="w-3 h-3 rounded-sm bg-primary/40" />
                                        <div className="w-3 h-3 rounded-sm bg-primary" />
                                        <div className="w-3 h-3 rounded-sm bg-green-500" />
                                    </div>
                                    <span>Goal Met</span>
                                </div>
                            </div>

                            {/* Selected Date Details */}
                            <AnimatePresence>
                                {selectedDate && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <div className="bg-slate-50 border border-border/80 rounded-[32px] p-6 mt-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-sm font-black italic uppercase text-secondary">
                                                    {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                                                </h3>
                                                <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-slate-200 rounded-full"><X className="w-4 h-4" /></button>
                                            </div>
                                            {selectedDayData ? (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Calories Burned</p>
                                                        <p className="text-xl font-black text-orange-500">{selectedDayData.totalCalories} <span className="text-xs">kcal</span></p>
                                                    </div>
                                                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Workouts</p>
                                                        <p className="text-xl font-black text-blue-500">{selectedDayData.workoutCount} <span className="text-xs">sessions</span></p>
                                                    </div>
                                                    <div className="col-span-2 bg-white rounded-2xl p-4 shadow-sm">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">Activities</p>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {selectedDayData.workoutTypes.map((t: string) => (
                                                                <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">{t}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 text-slate-400">
                                                    <p className="text-[10px] font-black uppercase tracking-widest">No activity recorded for this day</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Monthly Highlights */}
                            {(monthlyStats?.bestDay || monthlyStats?.favouriteType) && (
                                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-[32px] p-6 border border-orange-200/50">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-600 italic mb-4">Highlights</h3>
                                    <div className="space-y-4">
                                        {monthlyStats?.bestDay && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">🏆</div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-wide">Best Day</p>
                                                    <p className="font-extrabold text-orange-950 text-sm">
                                                        {new Date(monthlyStats.bestDay.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                                    </p>
                                                    <p className="text-xs font-bold text-orange-700">{monthlyStats.bestDay.totalCalories} kcal burned</p>
                                                </div>
                                            </div>
                                        )}
                                        {monthlyStats?.favouriteType && (
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">❤️</div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-wide">Top Workout Type</p>
                                                    <p className="font-extrabold text-orange-950 text-sm">{monthlyStats.favouriteType}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Create Challenge Modal */}
            <AnimatePresence>
                {showCreateChallengeModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateChallengeModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowCreateChallengeModal(false)}
                                className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                                    <Trophy className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black italic uppercase tracking-tight text-secondary">Create A Challenge</h3>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Set your personalized target</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Presets */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Select Preset</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {CHALLENGE_PRESETS.map((preset, idx) => (
                                            <button
                                                key={preset.days}
                                                onClick={() => {
                                                    setSelectedChallengePreset(idx);
                                                    setChallengeForm(f => ({
                                                        ...f,
                                                        name: f.name || preset.label,
                                                        durationDays: preset.days
                                                    }));
                                                }}
                                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                                                    selectedChallengePreset === idx
                                                        ? 'border-orange-500 bg-orange-50/50 scale-[1.02]'
                                                        : 'border-border/60 hover:border-orange-400/40 bg-slate-50'
                                                }`}
                                            >
                                                <span className="text-xl mb-1">{preset.emoji}</span>
                                                <span className="text-[9px] font-black text-secondary leading-tight text-center truncate w-full">{preset.days} Days</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Inputs */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 ml-1">Challenge Name</label>
                                        <input
                                            type="text"
                                            value={challengeForm.name}
                                            onChange={(e) => setChallengeForm(f => ({ ...f, name: e.target.value }))}
                                            className="w-full p-4 bg-slate-50 border border-border/60 rounded-2xl font-extrabold text-secondary outline-none focus:border-orange-500 transition-all text-sm"
                                            placeholder="e.g. My 30-Day Fire"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 ml-1">Description (Optional)</label>
                                        <input
                                            type="text"
                                            value={challengeForm.description}
                                            onChange={(e) => setChallengeForm(f => ({ ...f, description: e.target.value }))}
                                            className="w-full p-4 bg-slate-50 border border-border/60 rounded-2xl font-extrabold text-secondary outline-none focus:border-orange-500 transition-all text-sm"
                                            placeholder="e.g. Building daily consistency"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Target Type */}
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 ml-1">Target Type</label>
                                            <select
                                                value={challengeForm.targetType}
                                                onChange={(e) => setChallengeForm(f => ({ ...f, targetType: e.target.value, target: e.target.value === 'CALORIES' ? 10000 : e.target.value === 'WATER' ? 60000 : 30 }))}
                                                className="w-full p-4 bg-slate-50 border border-border/60 rounded-2xl font-extrabold text-secondary outline-none focus:border-orange-500 transition-all text-sm"
                                            >
                                                {TARGET_TYPES.map(t => (
                                                    <option key={t.value} value={t.value}>{t.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Target Goal Value */}
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5 ml-1">Target Value</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={challengeForm.target}
                                                    onChange={(e) => setChallengeForm(f => ({ ...f, target: Number(e.target.value) }))}
                                                    className="w-full p-4 bg-slate-50 border border-border/60 rounded-2xl font-extrabold text-secondary outline-none focus:border-orange-500 transition-all text-sm pr-12"
                                                    min="1"
                                                    required
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase">
                                                    {challengeForm.targetType === 'CALORIES' ? 'kcal' : challengeForm.targetType === 'WATER' ? 'ml' : 'count'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateChallenge}
                                    disabled={creatingChallenge || !challengeForm.name || !challengeForm.target}
                                    className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] italic text-sm shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all mt-4"
                                >
                                    {creatingChallenge ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
                                    {creatingChallenge ? "Creating..." : "Launch Challenge"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}
