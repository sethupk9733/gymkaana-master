import { useState, useEffect } from "react";
import {
    Plus, Edit2, Power, PowerOff, Target, Trophy, Clock, Users,
    ChevronDown, ChevronUp, Loader2, CheckCircle, XCircle, AlertTriangle
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getAuthHeaders = () => {
    const token = localStorage.getItem('gymkaana_token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

const CHALLENGE_TYPES = ['GYM_EXPLORER', '7_DAY_PASSPORT', 'BRING_A_FRIEND', 'MONTHLY_WARRIOR', 'STREAK_MASTER', 'CUSTOM'];

const defaultForm = {
    name: '',
    description: '',
    type: 'GYM_EXPLORER',
    startDate: '',
    endDate: '',
    target: 100,
    rewardPoints: 200,
    rewardBadge: '',
    milestones: [{ target: 50, rewardPoints: 50, description: 'First Milestone' }]
};

export function ChallengeManager() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<any>(defaultForm);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    const loadChallenges = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/gamification/admin/challenges`, { headers: getAuthHeaders() });
            const data = await res.json();
            setChallenges(data.success ? data.data : []);
        } catch {
            showToast('error', 'Failed to load challenges');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadChallenges(); }, []);

    const handleSubmit = async () => {
        if (!form.name || !form.startDate || !form.endDate) {
            showToast('error', 'Please fill in all required fields');
            return;
        }
        setSaving(true);
        try {
            const url = editingId
                ? `${BASE_URL}/gamification/admin/challenges/${editingId}`
                : `${BASE_URL}/gamification/admin/challenges`;
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(form) });
            const data = await res.json();
            if (data.success) {
                showToast('success', editingId ? 'Challenge updated!' : 'Challenge created!');
                setShowForm(false);
                setEditingId(null);
                setForm(defaultForm);
                loadChallenges();
            } else {
                showToast('error', data.message || 'Failed to save challenge');
            }
        } catch {
            showToast('error', 'Server error');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (challenge: any) => {
        try {
            const res = await fetch(`${BASE_URL}/gamification/admin/challenges/${challenge._id}/end`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isActive: !challenge.isActive })
            });
            const data = await res.json();
            if (data.success) {
                showToast('success', `Challenge ${challenge.isActive ? 'deactivated' : 'activated'}!`);
                loadChallenges();
            }
        } catch {
            showToast('error', 'Failed to update status');
        }
    };

    const openEdit = (challenge: any) => {
        setForm({
            name: challenge.name,
            description: challenge.description || '',
            type: challenge.type || 'CUSTOM',
            startDate: challenge.startDate?.split('T')[0] || '',
            endDate: challenge.endDate?.split('T')[0] || '',
            target: challenge.target || 100,
            rewardPoints: challenge.rewardPoints || 200,
            rewardBadge: challenge.rewardBadge || '',
            milestones: challenge.milestones || []
        });
        setEditingId(challenge._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const addMilestone = () => {
        setForm((prev: any) => ({
            ...prev,
            milestones: [...(prev.milestones || []), { target: 0, rewardPoints: 0, description: '' }]
        }));
    };

    const removeMilestone = (idx: number) => {
        setForm((prev: any) => ({
            ...prev,
            milestones: prev.milestones.filter((_: any, i: number) => i !== idx)
        }));
    };

    const updateMilestone = (idx: number, field: string, value: any) => {
        setForm((prev: any) => ({
            ...prev,
            milestones: prev.milestones.map((m: any, i: number) => i === idx ? { ...m, [field]: value } : m)
        }));
    };

    const activeCount = challenges.filter(c => c.isActive).length;
    const totalParticipants = challenges.reduce((sum, c) => sum + (c.participantCount || 0), 0);

    return (
        <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm transition-all ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Challenge Manager</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Create and manage gamification challenges for users</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(defaultForm); }}
                    className="flex items-center gap-2 px-5 py-3 bg-black text-[#A3E635] rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    New Challenge
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Challenges', value: challenges.length, icon: Target, color: 'bg-indigo-500' },
                    { label: 'Active Now', value: activeCount, icon: Trophy, color: 'bg-emerald-500' },
                    { label: 'Total Participants', value: totalParticipants, icon: Users, color: 'bg-amber-500' }
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white`}>
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-gray-900">{value}</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Form */}
            {showForm && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 space-y-6">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">
                        {editingId ? '✏️ Edit Challenge' : '✨ New Challenge'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Challenge Name *</label>
                            <input
                                value={form.name}
                                onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))}
                                placeholder="e.g. Gym Explorer Challenge"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-black transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Challenge Type *</label>
                            <select
                                title="Challenge Type"
                                value={form.type}
                                onChange={e => setForm((p: any) => ({ ...p, type: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-black transition-all"
                            >
                                {CHALLENGE_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Description</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))}
                                placeholder="Describe what users need to do to complete this challenge..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-black transition-all resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Start Date *</label>
                            <input
                                type="date"
                                title="Start Date"
                                value={form.startDate}
                                onChange={e => setForm((p: any) => ({ ...p, startDate: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-black transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">End Date *</label>
                            <input
                                type="date"
                                title="End Date"
                                value={form.endDate}
                                onChange={e => setForm((p: any) => ({ ...p, endDate: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-black transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Target Points/Actions</label>
                            <input
                                type="number"
                                title="Target"
                                value={form.target}
                                onChange={e => setForm((p: any) => ({ ...p, target: parseInt(e.target.value) || 0 }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-black transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Reward Points (on Completion)</label>
                            <input
                                type="number"
                                title="Reward Points"
                                value={form.rewardPoints}
                                onChange={e => setForm((p: any) => ({ ...p, rewardPoints: parseInt(e.target.value) || 0 }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-black transition-all"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Reward Badge (emoji or text)</label>
                            <input
                                value={form.rewardBadge}
                                onChange={e => setForm((p: any) => ({ ...p, rewardBadge: e.target.value }))}
                                placeholder="e.g. 🏆 Champion or 'Gold Explorer Badge'"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl font-bold text-gray-900 outline-none focus:border-black transition-all"
                            />
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Milestones (Optional)</h3>
                            <button onClick={addMilestone} className="text-xs font-black uppercase tracking-widest text-black hover:text-indigo-600 transition-colors flex items-center gap-1">
                                <Plus className="w-3 h-3" /> Add Milestone
                            </button>
                        </div>
                        <div className="space-y-3">
                            {(form.milestones || []).map((m: any, idx: number) => (
                                <div key={idx} className="flex gap-3 items-center bg-gray-50 rounded-xl p-4">
                                    <div className="flex-1 grid grid-cols-3 gap-3">
                                        <input
                                            type="number"
                                            placeholder="Target"
                                            title="Milestone Target"
                                            value={m.target}
                                            onChange={e => updateMilestone(idx, 'target', parseInt(e.target.value) || 0)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-black"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Points"
                                            title="Milestone Points"
                                            value={m.rewardPoints}
                                            onChange={e => updateMilestone(idx, 'rewardPoints', parseInt(e.target.value) || 0)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-black"
                                        />
                                        <input
                                            placeholder="Description"
                                            title="Milestone Description"
                                            value={m.description}
                                            onChange={e => updateMilestone(idx, 'description', e.target.value)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:border-black"
                                        />
                                    </div>
                                    <button onClick={() => removeMilestone(idx)} title="Remove Milestone" className="text-red-400 hover:text-red-600 transition-colors p-1">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-black text-[#A3E635] rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            {editingId ? 'Update Challenge' : 'Create Challenge'}
                        </button>
                        <button
                            onClick={() => { setShowForm(false); setEditingId(null); setForm(defaultForm); }}
                            className="px-6 py-3 border border-gray-200 rounded-xl font-black uppercase text-xs tracking-widest text-gray-500 hover:border-gray-400 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Challenges List */}
            <div className="space-y-4">
                <h2 className="text-lg font-black uppercase italic tracking-tight text-gray-700">All Challenges</h2>
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                    </div>
                ) : challenges.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center">
                        <Target className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No challenges yet. Create the first one!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {challenges.map((challenge: any) => {
                            const now = new Date();
                            const end = new Date(challenge.endDate);
                            const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
                            return (
                                <div key={challenge._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="p-6 flex items-start gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${challenge.isActive ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                                            <Trophy className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <h3 className="font-black text-gray-900 text-lg">{challenge.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${challenge.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {challenge.isActive ? '🟢 Active' : '⚫ Inactive'}
                                                </span>
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    {(challenge.type || 'CUSTOM').replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                            {challenge.description && (
                                                <p className="text-sm text-gray-500 mb-3">{challenge.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400">
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {challenge.participantCount || 0} participants
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Target className="w-3.5 h-3.5" />
                                                    Target: {challenge.target}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-amber-500">
                                                    🏆 {challenge.rewardPoints} pts reward
                                                </span>
                                                {challenge.rewardBadge && (
                                                    <span className="flex items-center gap-1.5 text-purple-500">
                                                        {challenge.rewardBadge}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => openEdit(challenge)}
                                                title="Edit"
                                                className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(challenge)}
                                                title={challenge.isActive ? 'Deactivate' : 'Activate'}
                                                className={`p-2.5 rounded-xl transition-colors ${challenge.isActive ? 'bg-red-50 hover:bg-red-100 text-red-500' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-500'}`}
                                            >
                                                {challenge.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Milestones preview */}
                                    {challenge.milestones && challenge.milestones.length > 0 && (
                                        <div className="border-t border-gray-50 px-6 py-4 bg-gray-50">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Milestones</p>
                                            <div className="flex flex-wrap gap-2">
                                                {challenge.milestones.map((m: any, i: number) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600">
                                                        {m.description || `Step ${i + 1}`}: {m.target} → +{m.rewardPoints} pts
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
