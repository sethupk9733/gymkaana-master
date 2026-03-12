import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Camera, Save, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { fetchProfile, updateProfile } from '../lib/api';

export default function EditProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        profileImage: ''
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchProfile();
                setFormData({
                    name: data.name || '',
                    phoneNumber: data.phoneNumber || '',
                    profileImage: data.profileImage || ''
                });
            } catch (err) {
                console.error('Failed to load profile', err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile(formData);
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center mb-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">

                {/* Avatar */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md overflow-hidden">
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                formData.name.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 transition-colors shadow-sm"
                            title="Change profile picture"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1 font-black uppercase tracking-widest text-[10px]">Full Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                                <input
                                    id="fullName"
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none font-bold"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 font-black uppercase tracking-widest text-[10px]">Phone Number</label>
                            <div className="relative">
                                <Phone className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                                <input
                                    id="phone"
                                    type="tel"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none font-bold"
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className={cn(
                            "w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs",
                            saving && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {saving ? <Loader2 className="animate-spin w-4 h-4" /> : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
