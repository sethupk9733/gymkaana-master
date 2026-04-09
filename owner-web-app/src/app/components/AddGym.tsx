import { ArrowLeft, Upload, Clock, Check, X, Camera, Image as ImageIcon, Loader2, ShieldCheck, FileText, ExternalLink, Dumbbell, Shield, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import * as api from "../lib/api";

interface AddGymProps {
    onBack: () => void;
}

export function AddGym({ onBack }: AddGymProps) {
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
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

    const [declaration, setDeclaration] = useState({
        accepted: false,
        signature: ''
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
        if (step === 1) {
            setStep(2);
            window.scrollTo(0, 0);
            return;
        }

        if (!declaration.accepted || !declaration.signature) {
            alert('Please accept the declaration and provide your digital signature.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                images: images,
                timings: `${form.weekdayHours || '9 AM - 9 PM'} (Weekdays), ${form.weekendHours || '10 AM - 8 PM'} (Weekends)`,
                trainers: form.trainers.map(t => t.name),
                trainerDetails: form.trainers,
                documentation: {
                    tradingLicense: form.tradingLicense || 'Pending Upload',
                    fireSafety: form.fireSafety || 'Pending Upload',
                    insurancePolicy: form.insurancePolicy || 'Pending Upload',
                    bankStatement: form.bankStatement || 'Pending Upload'
                },
                status: 'Pending'
            };

            const newGym = await api.createGym(payload);
            const declarationText = `I hereby confirm that I am the authorized owner/representative of the gym/business registered on Gymkaana.
I agree to partner with Gymkaana (operated by Vuegam Solutions) for listing and providing services to customers.
I authorize Gymkaana to:
- List my gym on its platform
- Collect payments from customers on my behalf
- Deduct applicable commission/fees
- Settle remaining amounts to my registered bank account
I confirm that:
- All information provided is true and accurate
- I will provide services as listed on the platform
- I comply with applicable laws and regulations
I agree to Gymkaana’s Terms & Conditions and Gym Partner Agreement.`;

            await api.submitDeclaration({
                gymId: newGym._id,
                signatureName: declaration.signature,
                declarationAccepted: declaration.accepted,
                declarationText
            });

            onBack();
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Failed to submit gym. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b-2 border-gray-300 px-6 py-4 sticky top-0 z-10">
                <button onClick={step === 2 ? () => setStep(1) : onBack} className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-bold uppercase tracking-wide text-sm">{step === 2 ? 'Back to Form' : 'Cancel & Return'}</span>
                </button>
            </div>

            <div className="px-6 py-8 space-y-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">
                            {step === 1 ? "Onboard New Hub" : "Legal Authorization"}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            {step === 1 ? "Fill in the details to submit your venue for review." : "Final declaration and digital signature."}
                        </p>
                    </div>
                </div>

                {step === 1 ? (
                    <>
                        {/* PHOTOS */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Media Vault</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer group">
                                    <Camera size={24} className="text-gray-400 group-hover:text-black" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Camera</span>
                                    <input type="file" title="Upload Photo" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer group">
                                    <Upload size={24} className="text-gray-400 group-hover:text-black" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Upload</span>
                                    <input type="file" title="Upload Photo" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                {images.map((img, i) => (
                                    <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 group">
                                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                        <button onClick={() => removeImage(i)} title="Remove Photo" className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* BASIC INFO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Core Identity</h3>
                                <div className="space-y-4">
                                    <Input placeholder="Hub Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                    <Textarea placeholder="Description" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                                    <Input type="number" placeholder="Base Day Pass Price (₹)" value={form.baseDayPassPrice} onChange={e => setForm({ ...form, baseDayPassPrice: parseFloat(e.target.value) || 0 })} />
                                </div>
                            </div>
                            <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Contact & Location</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                        <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                    </div>
                                    <Input placeholder="Full Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                                        <Input placeholder="Zip Code" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TRAINERS */}
                        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Staff & Trainers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input placeholder="Name" value={newTrainer.name} onChange={e => setNewTrainer({ ...newTrainer, name: e.target.value })} />
                                <Input placeholder="Experience" value={newTrainer.experience} onChange={e => setNewTrainer({ ...newTrainer, experience: e.target.value })} />
                                <div className="flex gap-2">
                                    <Input placeholder="Specialization" value={newTrainer.specialization} onChange={e => setNewTrainer({ ...newTrainer, specialization: e.target.value })} />
                                    <Button title="Add Trainer" onClick={() => { if(newTrainer.name) { setForm({...form, trainers: [...form.trainers, newTrainer]}); setNewTrainer({name:'', experience:'', specialization:''}); } }} className="bg-black text-white">Add</Button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.trainers.map((t, i) => (
                                    <div key={i} className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-3">
                                        <span className="text-xs font-bold uppercase italic">{t.name} ({t.experience})</span>
                                        <button title="Remove" onClick={() => setForm({...form, trainers: form.trainers.filter((_, idx) => idx !== i)})} className="text-red-500"><X size={14}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PLANS */}
                        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Membership Tiers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input placeholder="Plan Name" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} />
                                <Input type="number" placeholder="Price (₹)" value={newPlan.price} onChange={e => setNewPlan({...newPlan, price: e.target.value})} />
                                <select title="Duration" className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm" value={newPlan.duration} onChange={e => setNewPlan({...newPlan, duration: e.target.value})}>
                                    <option>1 Month</option><option>3 Months</option><option>6 Months</option><option>1 Year</option>
                                </select>
                                <div className="flex gap-2">
                                    <Input type="number" placeholder="Days" value={newPlan.sessions} onChange={e => setNewPlan({...newPlan, sessions: e.target.value})} />
                                    <Button title="Add Plan" onClick={() => { if(newPlan.name && newPlan.price) { setForm({...form, plans: [...form.plans, {...newPlan, price: parseFloat(newPlan.price), sessions: parseInt(newPlan.sessions)||1}]}); setNewPlan({name:'', price:'', duration:'1 Month', sessions:'30', description:''}); } }} className="bg-black text-white">Add</Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {form.plans.map((p, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center group">
                                        <div><p className="font-black italic uppercase text-sm">{p.name}</p><p className="text-xs font-bold text-gray-500">{p.duration} ({p.sessions} Days) • ₹{p.price}</p></div>
                                        <button title="Remove" onClick={() => setForm({...form, plans: form.plans.filter((_, idx)=> idx !== i)})} className="text-red-500"><X size={16}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FACILITIES & SPECIALIZATIONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Amenities</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {FACILITIES.map((f, i) => (
                                        <button key={i} title={`Toggle ${f}`} onClick={() => toggleFacility(f)} className={`p-3 text-left text-xs font-bold uppercase rounded-xl border-2 transition-all ${form.facilities.includes(f) ? 'bg-black border-black text-white' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{f}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Disciplines</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {SPECIALIZATIONS.map((s, i) => (
                                        <button key={i} title={`Toggle ${s}`} onClick={() => toggleSpecialization(s)} className={`p-3 text-left text-xs font-bold uppercase rounded-xl border-2 transition-all ${form.specializations.includes(s) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BANKING */}
                        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Settlement Account</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input placeholder="Account Holder Name" value={form.bankDetails.accountName} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountName: e.target.value } })} />
                                <Input placeholder="Account Number" value={form.bankDetails.accountNumber} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })} />
                                <Input placeholder="IFSC Code" value={form.bankDetails.ifscCode} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, ifscCode: e.target.value } })} />
                                <Input placeholder="Bank Name" value={form.bankDetails.bankName} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl space-y-8">
                        <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100/50 relative overflow-hidden">
                            <ShieldCheck className="absolute -top-4 -right-4 w-32 h-32 text-blue-600/5 rotate-12" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4 border-b border-blue-100 pb-6">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center"><FileText className="text-white w-6 h-6" /></div>
                                    <h3 className="text-xl font-black italic tracking-tighter text-blue-900 uppercase">Declaration & Authorization</h3>
                                </div>
                                <div className="prose prose-sm max-w-none text-blue-900/80 font-medium leading-relaxed">
                                    <p>I hereby confirm that I am the authorized owner/representative of the gym/business registered on Gymkaana.</p>
                                    <p>I agree to partner with Gymkaana (operated by Vuegam Solutions) for listing and providing services to customers.</p>
                                    <p className="font-bold underline italic text-blue-900">I authorize Gymkaana to:</p>
                                    <ul className="list-disc pl-5 mt-2"><li>List my gym on its platform</li><li>Collect payments on my behalf</li><li>Deduct commission/fees</li><li>Settle remaining amounts</li></ul>
                                    <p>I confirm all info is true and I comply with applicable laws.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 pt-4">
                            <label className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer group">
                                <input type="checkbox" title="Accept Declaration" className="w-6 h-6 mt-1 cursor-pointer" checked={declaration.accepted} onChange={e => setDeclaration({ ...declaration, accepted: e.target.checked })} />
                                <div><p className="text-xs font-black uppercase text-gray-900">I agree to the above declaration</p><p className="text-[10px] text-gray-400 font-medium uppercase mt-1">Mandatory for automated settlements</p></div>
                            </label>
                            <Input placeholder="TYPE YOUR FULL NAME AS SIGNATURE" className="h-16 pl-6 text-lg font-black italic border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-600 rounded-3xl transition-all uppercase" value={declaration.signature} onChange={e => setDeclaration({ ...declaration, signature: e.target.value })} />
                            <p className="text-[10px] text-gray-400 font-bold ml-2">DATED: {new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                    </div>
                )}
                <div className="pt-6">
                    <Button onClick={handleSubmit} disabled={loading || (step === 2 && (!declaration.accepted || !declaration.signature))} className={`w-full h-20 rounded-[32px] text-sm font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 ${step === 1 ? "bg-black text-white" : "bg-blue-600 text-white"}`}>
                        {loading ? <Loader2 className="animate-spin" /> : (step === 1 ? <Plus className="w-5 h-5" /> : <ShieldCheck className="w-6 h-6" />)}
                        {loading ? 'Processing...' : (step === 1 ? 'Go to Authorization' : 'Finalize Onboarding')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
