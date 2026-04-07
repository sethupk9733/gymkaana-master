import { ArrowLeft, Upload, Clock, Check, X, Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { createGym } from "../lib/api";

interface AddGymProps {
    onBack: () => void;
}

export function AddGym({ onBack }: AddGymProps) {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        baseDayPassPrice: 0,
        address: '',
        city: '',
        zip: '',
        landmark: '',
        phone: '',
        email: '',
        googleMapsLink: '',
        headTrainer: '',
        trainerExperience: '',
        trainerSpecialization: '',
        trainers: [] as { name: string, experience: string, specialization: string }[],
        weekdayHours: '',
        weekendHours: '',
        facilities: [] as string[],
        specializations: [] as string[],
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
        plans: [] as { name: string, price: number, duration: string, sessions: number, description: string }[]
    });

    const [newRule, setNewRule] = useState('');
    const [newTrainer, setNewTrainer] = useState({ name: '', experience: '', specialization: '' });
    const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '1 Month', sessions: '30', description: '' });

    const FACILITIES = [
        "Cardio Equipment", "Free Weights", "WiFi", "Shower", "Locker",
        "Parking", "Personal Trainer", "Steam Room", "Swimming Pool",
        "Yoga Studio", "Cafe", "Sauna"
    ];

    const SPECIALIZATIONS = [
        "Bodybuilding", "CrossFit", "Yoga", "Zumba", "MMA/Kickboxing",
        "Pilates", "Powerlifting", "Aerobics", "Calisthenics",
        "Swimming", "Cardio", "Strength Training"
    ];

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

    const toggleFacility = (facility: string) => {
        setForm(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const toggleSpecialization = (spec: string) => {
        setForm(prev => ({
            ...prev,
            specializations: prev.specializations.includes(spec)
                ? prev.specializations.filter(s => s !== spec)
                : [...prev.specializations, spec]
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = {
                name: form.name,
                description: form.description,
                address: form.address,
                location: form.city,
                phone: form.phone,
                email: form.email,
                images: images,
                facilities: form.facilities,
                specializations: form.specializations,
                houseRules: form.houseRules,
                timings: `${form.weekdayHours} (Weekdays), ${form.weekendHours} (Weekends)`,
                trainers: form.trainers.map(t => t.name),
                trainerDetails: form.trainers,
                documentation: {
                    tradingLicense: form.tradingLicense || 'Pending Upload',
                    fireSafety: form.fireSafety || 'Pending Upload',
                    insurancePolicy: form.insurancePolicy || 'Pending Upload',
                    bankStatement: form.bankStatement || 'Pending Upload'
                },
                bankDetails: form.bankDetails,
                plans: form.plans,
                baseDayPassPrice: form.baseDayPassPrice,
                status: 'Pending'
            };

            await createGym(payload);
            onBack(); // Go back to list on success
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Failed to submit gym. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b-2 border-gray-300 px-6 py-4 sticky top-0 z-10">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-bold uppercase tracking-wide text-sm">Cancel & Return</span>
                </button>
            </div>

            {/* Content */}
            <div className="px-6 py-8 space-y-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">Onboard New Hub</h1>
                        <p className="text-sm text-gray-500 font-medium">Fill in the details to submit your venue for review.</p>
                    </div>
                </div>

                {/* Photos */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Media Vault</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer group">
                            <Camera size={24} className="text-gray-400 group-hover:text-black" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Camera</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                        <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer group">
                            <Upload size={24} className="text-gray-400 group-hover:text-black" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        </label>
                        {images.map((img, i) => (
                            <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 group">
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeImage(i)}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                                    title="Remove Image"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Core Identity</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Hub Name</label>
                                <Input
                                    placeholder="e.g. Iron Paradise"
                                    className="h-12 border-gray-200 bg-gray-50 focus:bg-white transition-all font-medium"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Description</label>
                                <Textarea
                                    placeholder="Tell us what makes this gym unique..."
                                    rows={4}
                                    className="border-gray-200 bg-gray-50 focus:bg-white transition-all font-medium resize-none"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Base Day Pass Price (₹)</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 300"
                                    className="h-12 border-gray-200 bg-gray-50 focus:bg-white transition-all font-black text-xl text-blue-600"
                                    value={form.baseDayPassPrice}
                                    onChange={e => setForm({ ...form, baseDayPassPrice: parseFloat(e.target.value) || 0 })}
                                />
                                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Crucial for auto-discount yield calculation</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Contact & Location</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Phone</label>
                                    <Input
                                        placeholder="+91..."
                                        className="h-12 border-gray-200 bg-gray-50 focus:bg-white transition-all font-medium"
                                        value={form.phone}
                                        onChange={e => setForm({ ...form, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Email</label>
                                    <Input
                                        placeholder="hello@gym.com"
                                        className="h-12 border-gray-200 bg-gray-50 focus:bg-white transition-all font-medium"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Full Address</label>
                                <Input
                                    placeholder="Door No, Street"
                                    className="h-12 border-gray-200 bg-gray-50 focus:bg-white transition-all font-medium"
                                    value={form.address}
                                    onChange={e => setForm({ ...form, address: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">City/Area</label>
                                    <Input
                                        placeholder="e.g. Indiranagar"
                                        className="h-12 border-gray-200 bg-gray-50 focus:bg-white transition-all font-medium"
                                        value={form.city}
                                        onChange={e => setForm({ ...form, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Zip Code</label>
                                    <Input
                                        placeholder="560000"
                                        className="h-12 border-gray-200 bg-gray-50 focus:bg-white transition-all font-medium"
                                        value={form.zip}
                                        onChange={e => setForm({ ...form, zip: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Staff & Trainers */}
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Staff & Trainers</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Trainer Name</label>
                                <Input
                                    placeholder="Name"
                                    value={newTrainer.name}
                                    onChange={e => setNewTrainer({ ...newTrainer, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Experience</label>
                                <Input
                                    placeholder="e.g. 5 Years"
                                    value={newTrainer.experience}
                                    onChange={e => setNewTrainer({ ...newTrainer, experience: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Specialization</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. Crossfit"
                                        value={newTrainer.specialization}
                                        onChange={e => setNewTrainer({ ...newTrainer, specialization: e.target.value })}
                                    />
                                    <Button
                                        type="button"
                                        title="Add Trainer"
                                        onClick={() => {
                                            if (newTrainer.name) {
                                                setForm(prev => ({ ...prev, trainers: [...prev.trainers, newTrainer] }));
                                                setNewTrainer({ name: '', experience: '', specialization: '' });
                                            }
                                        }}
                                        className="bg-black text-white shrink-0"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {form.trainers.map((t, i) => (
                                <div key={i} className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                                    <span className="text-xs font-bold uppercase italic">{t.name} ({t.experience})</span>
                                    <button
                                        type="button"
                                        title="Remove Trainer"
                                        onClick={() => setForm(prev => ({ ...prev, trainers: prev.trainers.filter((_, idx) => idx !== i) }))}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Membership Plans */}
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Membership Tiers</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Plan Name</label>
                                <Input
                                    placeholder="e.g. Pro Monthly"
                                    value={newPlan.name}
                                    onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Price (₹)</label>
                                <Input
                                    type="number"
                                    placeholder="2999"
                                    value={newPlan.price}
                                    onChange={e => setNewPlan({ ...newPlan, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Duration</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
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
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Sessions/Days</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 30"
                                    value={newPlan.sessions}
                                    className="h-12"
                                    onChange={e => setNewPlan({ ...newPlan, sessions: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Brief Description</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Full Gym Access+Steam"
                                        value={newPlan.description}
                                        className="h-12"
                                        onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                                    />
                                    <Button
                                        type="button"
                                        title="Add Plan"
                                        onClick={() => {
                                            if (newPlan.name && newPlan.price) {
                                                setForm(prev => ({
                                                    ...prev,
                                                    plans: [...prev.plans, {
                                                        ...newPlan,
                                                        price: parseFloat(newPlan.price),
                                                        sessions: parseInt(newPlan.sessions) || 1
                                                    }]
                                                }));
                                                setNewPlan({ name: '', price: '', duration: '1 Month', sessions: '30', description: '' });
                                            }
                                        }}
                                        className="bg-black text-white shrink-0 h-12"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {form.plans.map((p, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center group">
                                    <div>
                                        <p className="font-black italic uppercase text-sm">{p.name}</p>
                                        <p className="text-xs font-bold text-gray-500 capitalize">{p.duration} ({p.sessions} Days) • ₹{p.price}</p>
                                        {form.baseDayPassPrice > 0 && p.sessions > 1 && (
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                                                SAVE {Math.round((1 - (p.price / (form.baseDayPassPrice * p.sessions))) * 100)}% DISCOUNT
                                            </p>
                                        )}
                                        <p className="text-[10px] text-gray-400 italic mt-1">{p.description}</p>
                                    </div>
                                    <button
                                        type="button"
                                        title="Remove Plan"
                                        onClick={() => setForm(prev => ({ ...prev, plans: prev.plans.filter((_, idx) => idx !== i) }))}
                                        className="text-red-500 hover:scale-110 transition-transform"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* House Rules */}
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">House Rules</h3>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter a rule (e.g. Masks mandatory, No outside shoes)"
                                value={newRule}
                                onChange={e => setNewRule(e.target.value)}
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (newRule.trim()) {
                                            setForm(prev => ({ ...prev, houseRules: [...prev.houseRules, newRule.trim()] }));
                                            setNewRule('');
                                        }
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                title="Add Rule"
                                onClick={() => {
                                    if (newRule.trim()) {
                                        setForm(prev => ({ ...prev, houseRules: [...prev.houseRules, newRule.trim()] }));
                                        setNewRule('');
                                    }
                                }}
                                className="bg-black text-white shrink-0"
                            >
                                Add Rule
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {form.houseRules.map((rule, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-black italic">{i + 1}</div>
                                        <span className="text-xs font-bold text-gray-700 uppercase">{rule}</span>
                                    </div>
                                    <button
                                        type="button"
                                        title="Remove Rule"
                                        onClick={() => setForm(prev => ({ ...prev, houseRules: prev.houseRules.filter((_, idx) => idx !== i) }))}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Facilities & Specializations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Amenities & Features</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {FACILITIES.map((facility, index) => (
                                <button
                                    key={index}
                                    title={`Toggle ${facility}`}
                                    onClick={() => toggleFacility(facility)}
                                    className={`h-14 rounded-xl border-2 flex items-center justify-between px-4 transition-all group ${form.facilities.includes(facility)
                                        ? "bg-black border-black text-white shadow-lg shadow-black/20"
                                        : "bg-gray-50 border-gray-100 text-gray-500 hover:border-black hover:text-black"
                                        }`}
                                >
                                    <span className="text-xs font-bold uppercase tracking-wide text-left leading-tight">{facility}</span>
                                    {form.facilities.includes(facility) && <Check size={16} className="text-emerald-400" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Specialized Disciplines</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {SPECIALIZATIONS.map((spec, index) => (
                                <button
                                    key={index}
                                    title={`Toggle ${spec}`}
                                    onClick={() => toggleSpecialization(spec)}
                                    className={`h-14 rounded-xl border-2 flex items-center justify-between px-4 transition-all group ${form.specializations.includes(spec)
                                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue/20"
                                        : "bg-gray-50 border-gray-100 text-gray-500 hover:border-blue-600 hover:text-blue-600"
                                        }`}
                                >
                                    <span className="text-xs font-bold uppercase tracking-wide text-left leading-tight">{spec}</span>
                                    {form.specializations.includes(spec) && <Check size={16} className="text-blue-200" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Banking Details */}
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Settlement Account</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Account Holder Name</label>
                            <Input
                                placeholder="Name as per Bank"
                                value={form.bankDetails.accountName}
                                onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountName: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Account Number</label>
                            <Input
                                placeholder="0000000000"
                                value={form.bankDetails.accountNumber}
                                onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">IFSC Code</label>
                            <Input
                                placeholder="BANK0123"
                                value={form.bankDetails.ifscCode}
                                onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, ifscCode: e.target.value } })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Bank Name</label>
                            <Input
                                placeholder="e.g. HDFC Bank"
                                value={form.bankDetails.bankName}
                                onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 border-t border-gray-200">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        title="Submit for Review"
                        className="w-full h-16 bg-black hover:bg-gray-800 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Upload />}
                        {loading ? 'Submitting Venue...' : 'Submit for Review'}
                    </Button>
                    <p className="text-center text-xs font-medium text-gray-400 mt-4">
                        By submitting, you agree to the Platform Partner Terms & Conditions.
                    </p>
                </div>
            </div>
        </div>
    );
}

const handleOldSubmit = (form: any, images: any, createGym: any, onBack: any, setLoading: any) => {
    // This is just for reference, I'll update the real handleSubmit below
};

// ... existing code ...


