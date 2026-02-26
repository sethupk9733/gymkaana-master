import { Mail, Phone, MapPin, LogOut, ChevronRight, Edit2, Loader2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout, fetchProfile, updateProfile, fetchDashboardStats } from '../lib/api';
import { useState, useEffect } from 'react';

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
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
                    email: profileData.email || '',
                    phoneNumber: profileData.phoneNumber || ''
                });
            } catch (err) {
                console.error("Failed to load profile:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

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
            <div className="bg-white p-6 pb-8 sticky top-0 z-10 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {initials}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{profile.name || 'Owner Name'}</h1>
                            <p className="text-gray-500 text-sm uppercase tracking-widest text-[10px] font-black">{profile.role || 'owner'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setEditing(!editing)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        title={editing ? "Cancel" : "Edit Profile"}
                    >
                        {editing ? <ChevronRight className="w-5 h-5 rotate-90" /> : <Edit2 className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-4 -mt-4 relative z-20">
                {/* Stats Card */}
                {!editing && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <h3 className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-100 uppercase tracking-widest text-[10px] font-black">Your Statistics</h3>
                        <div className="p-4 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-xl font-bold text-gray-900">{stats?.gymPerformance?.length || 0}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gyms</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-gray-900">{stats?.totalMembers || 0}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Members</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-green-600">₹{((stats?.totalRevenue || 0) / 1000).toFixed(1)}K</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Revenue</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Form or Contact Info */}
                {editing ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <h3 className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-100 uppercase tracking-widest text-[10px] font-black">Edit Profile</h3>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/100"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/100"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={editData.phoneNumber}
                                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/100"
                                />
                            </div>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full py-3 bg-primary text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-secondary transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                            >
                                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <h3 className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-100 uppercase tracking-widest text-[10px] font-black">Account Details</h3>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="text-sm font-medium text-gray-900">{profile.email || 'No email'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-sm font-medium text-gray-900">{profile.phoneNumber || 'No phone'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                                    <p className="text-sm font-medium text-gray-900">India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    <button
                        onClick={() => navigate('/reviews')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <span className="text-sm font-medium text-gray-700">Member Reviews</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => navigate('/help-support')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <span className="text-sm font-medium text-gray-700">Help Center</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => navigate('/contact')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-gray-700">Contact Us</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <span className="text-sm font-medium text-gray-700">Settings</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <a
                        href="#"
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                    >
                        <span className="text-sm font-medium text-gray-700">Privacy Policy</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </a>
                    <a
                        href="#"
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left"
                    >
                        <span className="text-sm font-medium text-gray-700">Terms & Conditions</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </a>
                    <button
                        className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group"
                        onClick={handleLogout}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-medium text-red-600">Logout</span>
                        </div>
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6 font-black uppercase tracking-widest">Gymkaana Partner v1.0.4</p>
            </div>
        </div>
    );
}
