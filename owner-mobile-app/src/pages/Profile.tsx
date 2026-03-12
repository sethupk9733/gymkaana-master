import { Mail, Phone, MapPin, LogOut, ChevronRight, Edit2, Loader2, Save, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, fetchProfile, updateProfile, fetchDashboardStats } from '../lib/api';
import { useState, useEffect, useRef } from 'react';

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        phoneNumber: '',
        profileImage: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [profileData, statsData] = await Promise.all([
                fetchProfile(),
                fetchDashboardStats()
            ]);
            setProfile(profileData);
            setStats(statsData);
            setEditData({
                name: profileData.name || '',
                phoneNumber: profileData.phoneNumber || '',
                profileImage: profileData.profileImage || ''
            });
        } catch (err) {
            console.error("Failed to load profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setEditData(prev => ({ ...prev, profileImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const updated = await updateProfile(editData);
            setProfile(updated);
            setEditing(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!profile) {
        return <div className="p-10 text-center">Please login to view profile.</div>;
    }

    const initials = profile.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'OW';

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-6 pb-8 sticky top-0 z-10 border-b-2 border-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-white overflow-hidden -skew-x-2">
                                {editData.profileImage ? (
                                    <img src={editData.profileImage} alt="Profile" className="w-full h-full object-cover skew-x-2 scale-110" />
                                ) : (
                                    initials
                                )}
                            </div>
                            {editing && (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 bg-white p-2 rounded-xl shadow-lg border border-gray-100 text-black hover:bg-black hover:text-white transition-all transform hover:scale-110 active:scale-90"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">{profile.name || 'Master User'}</h1>
                            <p className="text-gray-400 text-[10px] uppercase tracking-[0.3em] font-black">Status: Authorized</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditing(!editing)}
                        className={`p-3 rounded-2xl transition-all active:scale-95 ${editing ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}
                        title={editing ? "Cancel" : "Edit Profile"}
                    >
                        {editing ? <ChevronRight className="w-6 h-6 rotate-90" /> : <Edit2 className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4 -mt-4 relative z-20">
                {/* Stats Card */}
                {!editing && (
                    <div className="bg-white rounded-[32px] shadow-sm border-2 border-gray-50 overflow-hidden">
                        <h3 className="px-6 py-4 bg-gray-50/50 text-sm font-black text-gray-400 border-b-2 border-gray-50 uppercase tracking-[0.3em] italic text-[9px]">Mission Intelligence</h3>
                        <div className="p-6 grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-black italic tracking-tighter text-gray-900">{stats?.totalGyms || stats?.gymPerformance?.length || 0}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Assets</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black italic tracking-tighter text-gray-900">{stats?.totalMembers || 0}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Personal</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-black italic tracking-tighter text-emerald-600">₹{((stats?.totalRevenue || 0) / 1000).toFixed(1)}K</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Capital</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Form or Contact Info */}
                {editing ? (
                    <div className="bg-white rounded-[32px] shadow-sm border-2 border-gray-50 overflow-hidden">
                        <h3 className="px-6 py-4 bg-gray-50/50 text-sm font-black text-gray-400 border-b-2 border-gray-50 uppercase tracking-[0.3em] italic text-[9px]">Identity Modification</h3>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Full Legal Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    placeholder="Enter full identity"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-black text-sm focus:outline-none focus:border-black transition-all uppercase tracking-tight"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">Secure Line (Phone)</label>
                                <input
                                    type="tel"
                                    value={editData.phoneNumber}
                                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl font-black text-sm focus:outline-none focus:border-black transition-all"
                                />
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:bg-gray-200 flex items-center justify-center gap-3"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Confirm Update</>}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[32px] shadow-sm border-2 border-gray-50 overflow-hidden">
                        <h3 className="px-6 py-4 bg-gray-50/50 text-sm font-black text-gray-400 border-b-2 border-gray-50 uppercase tracking-[0.3em] italic text-[9px]">Encrypted Contact</h3>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <Mail className="w-5 h-5 text-gray-900" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Digital Mailbox</p>
                                    <p className="text-sm font-black text-gray-900 tracking-tight">{profile.email || 'REDACTED'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <Phone className="w-5 h-5 text-gray-900" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Signal Frequency</p>
                                    <p className="text-sm font-black text-gray-900 tracking-tight">{profile.phoneNumber || 'SIGNAL LOST'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <MapPin className="w-5 h-5 text-gray-900" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Base of Operations</p>
                                    <p className="text-sm font-black text-gray-900 tracking-tight">Bharat Hub</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="bg-white rounded-[32px] shadow-sm border-2 border-gray-50 overflow-hidden divide-y-2 divide-gray-50">
                    <button
                        onClick={() => navigate('/reviews')}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Feed Intelligence</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </button>
                    <button
                        onClick={() => navigate('/help-support')}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Support Uplink</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </button>
                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
                    >
                        <span className="text-xs font-black uppercase tracking-widest text-gray-900 italic">System Config</span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </button>
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        className="flex items-center gap-3 px-8 py-4 bg-red-50 rounded-2xl hover:bg-red-600 group transition-all duration-500"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 text-red-500 group-hover:text-white transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 group-hover:text-white transition-colors">Terminate Session</span>
                    </button>
                </div>

                <div className="text-center pt-10 pb-6 opacity-20">
                    <h2 className="text-lg font-black tracking-[-0.1em] uppercase -skew-x-12 inline-block">
                        <span className="text-gray-900">GYM</span>
                        <span className="text-primary italic mx-0.5">KAA</span>
                        <span className="text-gray-900">NA</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] mt-2">v1.0.4 CORE_LINKED</p>
                </div>
            </div>
        </div>
    );
}
