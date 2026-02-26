import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Loader2, Phone, Mail, Clock, Shield, Camera, Image as ImageIcon, X, Upload, Users, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { fetchGymById, updateGym } from '../lib/api';

const FACILITIES = ["Cardio Equipment", "Free Weights", "WiFi", "Shower", "Locker", "Parking", "Personal Trainer", "Steam Room", "Swimming Pool", "Yoga Studio", "Cafe", "Sauna"];
const SPECIALIZATIONS = ["Bodybuilding", "CrossFit", "Yoga", "Zumba", "MMA/Kickboxing", "Pilates", "Powerlifting", "Aerobics", "Calisthenics", "Swimming", "Cardio", "Strength Training"];

export default function EditGym() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loadingGym, setLoadingGym] = useState(true);
    const [loading, setLoading] = useState(false);

    // Form state
    const [form, setForm] = useState({
        name: '',
        address: '',
        location: '',
        description: '',
        baseDayPassPrice: 0,
        phone: '',
        email: '',
        timings: '',
        facilities: [] as string[],
        specializations: [] as string[],
        trainers: '',
    });

    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        if (!id) return;
        fetchGymById(id)
            .then(gym => {
                setForm({
                    name: gym.name || '',
                    address: gym.address || '',
                    location: gym.location || '',
                    description: gym.description || '',
                    baseDayPassPrice: gym.baseDayPassPrice || 0,
                    phone: gym.phone || '',
                    email: gym.email || '',
                    timings: gym.timings || '',
                    facilities: gym.facilities || [],
                    specializations: gym.specializations || [],
                    trainers: (gym.trainers || []).join(', '),
                });
                setImages(gym.images || []);
                setLoadingGym(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingGym(false);
            });
    }, [id]);

    const handleFacilityToggle = (facility: string) => {
        setForm(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const handleSpecializationToggle = (spec: string) => {
        setForm(prev => ({
            ...prev,
            specializations: prev.specializations.includes(spec)
                ? prev.specializations.filter(s => s !== spec)
                : [...prev.specializations, spec]
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setLoading(true);
        try {
            const payload = {
                ...form,
                trainers: form.trainers.split(',').map(t => t.trim()).filter(t => t),
                images: images
            };
            await updateGym(id, payload);
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert('Failed to update gym');
        } finally {
            setLoading(false);
        }
    };

    if (!id) return <div>Invalid Gym ID</div>;
    if (loadingGym) return <div className="p-10 text-center flex flex-col items-center gap-4"><Loader2 className="w-10 h-10 animate-spin text-black" /><p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Retrieving Vault Data...</p></div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-6 shadow-sm flex items-center border-b border-gray-100 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-gray-50 rounded-xl text-gray-900" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Modify Profile</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gym ID: {id.slice(-6).toUpperCase()}</p>
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Core Information</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Gym Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                    placeholder="Gym Name"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Area / Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                        placeholder="Area"
                                        value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Gym Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none resize-none"
                                    placeholder="Tell members about your hub..."
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Base Day Pass Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-black text-primary placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                    placeholder="Monthly rate reference"
                                    value={form.baseDayPassPrice}
                                    onChange={e => setForm({ ...form, baseDayPassPrice: parseFloat(e.target.value) || 0 })}
                                />
                                <p className="text-[10px] text-gray-400 mt-1 ml-1 uppercase font-black tracking-widest">Crucial for auto-discount yield</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Operations */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <Clock className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Operations</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Contact Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel"
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                            placeholder="Phone"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                            placeholder="Email"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Operating Hours</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                    placeholder="Timings"
                                    value={form.timings}
                                    onChange={e => setForm({ ...form, timings: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Media Vault */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Camera className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Media Vault</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:border-black transition-all cursor-pointer group">
                                <Camera className="w-6 h-6 text-gray-300 group-hover:text-black mb-2" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Take Photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} title="Take Photo" />
                            </label>
                            <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:border-black transition-all cursor-pointer group">
                                <ImageIcon className="w-6 h-6 text-gray-300 group-hover:text-black mb-2" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Device Upload</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} title="Device Upload" />
                            </label>
                        </div>

                        {images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto py-2 no-scrollbar">
                                {images.map((img, i) => (
                                    <div key={i} className="relative aspect-square w-20 shrink-0 rounded-xl overflow-hidden shadow-sm">
                                        <img src={img} className="w-full h-full object-cover" alt={`Gym photo ${i + 1}`} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full backdrop-blur-md"
                                            title="Remove image"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Experts & Trainers Card */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <Users className="w-5 h-5 text-yellow-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Experts & Trainers</h3>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Team Members (Comma separated)</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none resize-none"
                                placeholder="e.g. John Doe, Jane Smith"
                                value={form.trainers}
                                onChange={e => setForm({ ...form, trainers: e.target.value })}
                            />
                            <p className="text-[9px] text-gray-400 mt-2 uppercase font-black tracking-widest leading-relaxed px-1">List individual coaches or specialist team members.</p>
                        </div>
                    </div>

                    {/* Specialized Disciplines Card */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Specialized Disciplines</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {SPECIALIZATIONS.map(spec => (
                                <button
                                    key={spec}
                                    type="button"
                                    onClick={() => handleSpecializationToggle(spec)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-xl border-2 transition-all group",
                                        form.specializations.includes(spec)
                                            ? "bg-primary border-primary text-white shadow-lg"
                                            : "bg-gray-50 border-gray-100 text-gray-400 hover:border-primary hover:text-primary"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight text-left">{spec}</span>
                                    {form.specializations.includes(spec) && <Check size={12} className="text-blue-200" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Facilities Selector */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <Shield className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Amenities</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {FACILITIES.map(facility => (
                                <button
                                    key={facility}
                                    type="button"
                                    onClick={() => handleFacilityToggle(facility)}
                                    className={cn(
                                        "flex items-center justify-between p-3 rounded-xl border-2 transition-all group",
                                        form.facilities.includes(facility)
                                            ? "bg-black border-black text-white shadow-lg"
                                            : "bg-gray-50 border-gray-100 text-gray-400 hover:border-black hover:text-black"
                                    )}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-tight text-left">{facility}</span>
                                    {form.facilities.includes(facility) && <Check size={12} className="text-emerald-400" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="pt-4 space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            title="Save all changes"
                            className={cn(
                                "w-full bg-black text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3",
                                loading && "opacity-70"
                            )}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {loading ? 'Propagating Changes...' : 'Synchronize Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
