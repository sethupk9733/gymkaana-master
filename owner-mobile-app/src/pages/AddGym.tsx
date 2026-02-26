import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Building2, MapPin, Phone, Mail, Clock, Shield, Camera, Image as ImageIcon, Loader2, X, Users, Plus, CreditCard, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { createGym } from '../lib/api';

const FACILITIES = ["Cardio Equipment", "Free Weights", "WiFi", "Shower", "Locker", "Parking", "Personal Trainer", "Steam Room", "Swimming Pool", "Yoga Studio", "Cafe", "Sauna"];
const SPECIALIZATIONS = ["Bodybuilding", "CrossFit", "Yoga", "Zumba", "MMA/Kickboxing", "Pilates", "Powerlifting", "Aerobics", "Calisthenics", "Swimming", "Cardio", "Strength Training"];

export default function AddGym() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form state
    const [form, setForm] = useState({
        name: '',
        address: '',
        location: '',
        city: '',
        zip: '',
        description: '',
        phone: '',
        email: '',
        timings: '',
        facilities: [] as string[],
        specializations: [] as string[],
        trainers: [] as { name: string, experience: string, specialization: string }[],
        houseRules: [] as string[],
        tradingLicense: '',
        fireSafety: '',
        insurancePolicy: '',
        bankStatement: '',
        bankDetails: {
            accountName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: ''
        },
        plans: [] as { name: string, price: number, duration: string, description: string }[]
    });

    const [newRule, setNewRule] = useState('');
    const [newTrainer, setNewTrainer] = useState({ name: '', experience: '', specialization: '' });
    const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '1 Month', description: '' });

    const [images, setImages] = useState<string[]>([]);

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
        setLoading(true);
        try {
            const payload = {
                ...form,
                trainerDetails: form.trainers,
                trainers: form.trainers.map(t => t.name),
                specializations: form.specializations,
                images: images,
                documentation: {
                    tradingLicense: form.tradingLicense || 'Pending',
                    fireSafety: form.fireSafety || 'Pending',
                    insurancePolicy: form.insurancePolicy || 'Pending',
                    bankStatement: form.bankStatement || 'Pending'
                },
                bankDetails: form.bankDetails,
                plans: form.plans,
                status: 'Pending'
            };
            await createGym(payload);
            navigate('/gyms');
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Failed to submit gym for review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-6 shadow-sm flex items-center border-b border-gray-100 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 bg-gray-50 rounded-xl text-gray-900" aria-label="Go back">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Onboard Venue</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">New Facility Registration</p>
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
                                    placeholder="e.g. Golds Gym Elite"
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
                                        placeholder="e.g. Koramangala, Bangalore"
                                        value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Full Address</label>
                                <textarea
                                    required
                                    rows={2}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none resize-none"
                                    placeholder="Enter complete postal address"
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">City</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                        placeholder="Bangalore"
                                        value={form.city}
                                        onChange={e => setForm({ ...form, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Zip Code</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                        placeholder="560001"
                                        value={form.zip}
                                        onChange={e => setForm({ ...form, zip: e.target.value })}
                                    />
                                </div>
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
                                            placeholder="+91 99999 00000"
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
                                            placeholder="contact@gymname.com"
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
                                    placeholder="e.g. 5:00 AM - 11:00 PM"
                                    value={form.timings}
                                    onChange={e => setForm({ ...form, timings: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Staff Roster */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-pink-50 rounded-lg">
                                <Users className="w-5 h-5 text-pink-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Staff Roster</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                <input
                                    type="text"
                                    placeholder="Trainer Name"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                    value={newTrainer.name}
                                    onChange={e => setNewTrainer({ ...newTrainer, name: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        placeholder="Experience"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                        value={newTrainer.experience}
                                        onChange={e => setNewTrainer({ ...newTrainer, experience: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Specialty"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                        value={newTrainer.specialization}
                                        onChange={e => setNewTrainer({ ...newTrainer, specialization: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="button"
                                    title="Add Staff Member"
                                    onClick={() => {
                                        if (newTrainer.name) {
                                            setForm(prev => ({ ...prev, trainers: [...prev.trainers, newTrainer] }));
                                            setNewTrainer({ name: '', experience: '', specialization: '' });
                                        }
                                    }}
                                    className="w-full py-3 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                >
                                    Add Staff Member
                                </button>
                            </div>

                            <div className="space-y-2">
                                {form.trainers.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div>
                                            <p className="text-[10px] font-black uppercase italic tracking-tight">{t.name}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.specialization} • {t.experience}</p>
                                        </div>
                                        <button
                                            type="button"
                                            title="Remove Trainer"
                                            onClick={() => setForm(prev => ({ ...prev, trainers: prev.trainers.filter((_, idx) => idx !== i) }))}
                                            className="p-1.5 bg-red-50 text-red-500 rounded-lg"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Membership Tiers */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <CreditCard className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Membership Tiers</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                <input
                                    type="text"
                                    placeholder="Plan Name (e.g. Pro Monthly)"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black"
                                    value={newPlan.name}
                                    onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        placeholder="Price (₹)"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black"
                                        value={newPlan.price}
                                        onChange={e => setNewPlan({ ...newPlan, price: e.target.value })}
                                    />
                                    <select
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black"
                                        title="Plan Duration"
                                        value={newPlan.duration}
                                        onChange={e => setNewPlan({ ...newPlan, duration: e.target.value })}
                                    >
                                        <option>1 Month</option>
                                        <option>3 Months</option>
                                        <option>6 Months</option>
                                        <option>1 Year</option>
                                    </select>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Short Description"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black"
                                    value={newPlan.description}
                                    onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                                />
                                <button
                                    type="button"
                                    title="Add Plan"
                                    onClick={() => {
                                        if (newPlan.name && newPlan.price) {
                                            setForm(prev => ({
                                                ...prev,
                                                plans: [...prev.plans, { ...newPlan, price: parseFloat(newPlan.price) }]
                                            }));
                                            setNewPlan({ name: '', price: '', duration: '1 Month', description: '' });
                                        }
                                    }}
                                    className="w-full py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                >
                                    Add Membership Tier
                                </button>
                            </div>

                            <div className="space-y-2">
                                {form.plans.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div>
                                            <p className="text-[10px] font-black uppercase italic tracking-tight">{p.name}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{p.duration} • ₹{p.price}</p>
                                        </div>
                                        <button
                                            type="button"
                                            title="Remove Plan"
                                            onClick={() => setForm(prev => ({ ...prev, plans: prev.plans.filter((_, idx) => idx !== i) }))}
                                            className="p-1.5 bg-red-50 text-red-500 rounded-lg"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* House Rules */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <Shield className="w-5 h-5 text-yellow-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">House Rules</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter rule..."
                                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                    value={newRule}
                                    onChange={e => setNewRule(e.target.value)}
                                />
                                <button
                                    type="button"
                                    title="Add Rule"
                                    onClick={() => {
                                        if (newRule.trim()) {
                                            setForm(prev => ({ ...prev, houseRules: [...prev.houseRules, newRule.trim()] }));
                                            setNewRule('');
                                        }
                                    }}
                                    className="px-4 bg-black text-white rounded-2xl"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                {form.houseRules.map((rule, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-100/50 rounded-xl">
                                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{rule}</p>
                                        <button
                                            type="button"
                                            title="Remove Rule"
                                            onClick={() => setForm(prev => ({ ...prev, houseRules: prev.houseRules.filter((_, idx) => idx !== i) }))}
                                            className="text-gray-400"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Documentation Portfolio */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Shield className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Vetting Docs</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Trade License #</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                    placeholder="Enter license number"
                                    value={form.tradingLicense}
                                    onChange={e => setForm({ ...form, tradingLicense: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">GST/Insurance #</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                    placeholder="Enter policy number"
                                    value={form.insurancePolicy}
                                    onChange={e => setForm({ ...form, insurancePolicy: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Banking Details */}
                    <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Settlement Account</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Account Holder Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black"
                                    placeholder="Name as per Bank"
                                    value={form.bankDetails.accountName}
                                    onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountName: e.target.value } })}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Account Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black"
                                    placeholder="0000000000"
                                    value={form.bankDetails.accountNumber}
                                    onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">IFSC Code</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black"
                                        placeholder="BANK0123"
                                        value={form.bankDetails.ifscCode}
                                        onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, ifscCode: e.target.value } })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-1">Bank Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-bold outline-none focus:border-black"
                                        placeholder="e.g. HDFC"
                                        value={form.bankDetails.bankName}
                                        onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })}
                                    />
                                </div>
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
                                        <img src={img} className="w-full h-full object-cover" alt={`Hub Photo ${i + 1}`} />
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
                            className={cn(
                                "w-full bg-black text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3",
                                loading && "opacity-70"
                            )}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                            {loading ? 'Transmitting Data...' : 'Submit for Review'}
                        </button>
                        <div className="flex items-center gap-3 justify-center text-gray-400">
                            <Shield className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">
                                Requires Administrative Clearance
                            </p>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    );
}
