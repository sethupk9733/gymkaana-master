import { ArrowLeft, Upload, Check, X, Camera, Loader2, ShieldCheck, FileText, Plus, Dumbbell } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import * as api from "../lib/api";

interface AddGymProps {
    onBack: () => void;
}

// Compress image to reduce size before storing
const compressImage = (base64: string, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.src = base64;
    });
};

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
        trainers: [] as { name: string, experience: string, specialization: string }[],
        operatingHours: [
            { day: 'Monday', open: '06:00', close: '22:00', isClosed: false },
            { day: 'Tuesday', open: '06:00', close: '22:00', isClosed: false },
            { day: 'Wednesday', open: '06:00', close: '22:00', isClosed: false },
            { day: 'Thursday', open: '06:00', close: '22:00', isClosed: false },
            { day: 'Friday', open: '06:00', close: '22:00', isClosed: false },
            { day: 'Saturday', open: '08:00', close: '20:00', isClosed: false },
            { day: 'Sunday', open: '08:00', close: '14:00', isClosed: false }
        ],
        facilities: [] as string[],
        specializations: [] as string[],
        houseRules: [] as string[],
        tradingLicense: '',
        fireSafety: '',
        insurancePolicy: '',
        bankStatement: '',
        kycDetails: {
            aadhaarNumber: '',
            panNumber: '',
            gstNumber: '',
            businessRegistrationNumber: ''
        },
        bankDetails: {
            accountName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: ''
        },
        plans: [] as { name: string, price: number, duration: string, sessions: number, description: string }[]
    });

    const [declaration, setDeclaration] = useState({ accepted: false, signature: '' });
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

    const DURATIONS = [
        "Day Pass", "Weekly Pass", "Weekend Pass", "1 Month", "3 Months", "6 Months", "1 Year", "2 Years", "3 Years"
    ];

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        if (images.length + files.length > 10) {
            alert('A maximum of 10 photos can be uploaded.');
            return;
        }
        const newImages: string[] = [];
        for (const file of Array.from(files)) {
            const reader = new FileReader();
            await new Promise<void>((resolve) => {
                reader.onloadend = async () => {
                    // Use higher compression (600px width) to stay within Vercel body limits
                    const compressed = await compressImage(reader.result as string, 600, 0.6);
                    newImages.push(compressed);
                    resolve();
                };
                reader.readAsDataURL(file);
            });
        }
        setImages(prev => [...prev, ...newImages]);
        e.target.value = '';
    };

    const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

    const toggleFacility = (facility: string) => setForm(prev => ({
        ...prev,
        facilities: prev.facilities.includes(facility)
            ? prev.facilities.filter(f => f !== facility)
            : [...prev.facilities, facility]
    }));

    const toggleSpecialization = (spec: string) => setForm(prev => ({
        ...prev,
        specializations: prev.specializations.includes(spec)
            ? prev.specializations.filter(s => s !== spec)
            : [...prev.specializations, spec]
    }));

    const handleSubmit = async () => {
        if (step === 1) {
            if (!form.name || !form.address) {
                alert('Please fill in at least the Hub Name and Address.');
                return;
            }
            setStep(2);
            window.scrollTo(0, 0);
            return;
        }

        if (!declaration.accepted || !declaration.signature.trim()) {
            alert('Please accept the declaration and sign with your full name.');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...form,
                images,
                timings: form.operatingHours.map(oh => `${oh.day}: ${oh.isClosed ? 'Closed' : oh.open + '-' + oh.close}`).join(', '),
                trainers: form.trainers.map(t => t.name),
                trainerDetails: form.trainers,
                documentation: {
                    tradingLicense: form.tradingLicense || 'Pending',
                    fireSafety: form.fireSafety || 'Pending',
                    insurancePolicy: form.insurancePolicy || 'Pending',
                    bankStatement: form.bankStatement || 'Pending'
                },
                status: 'Pending'
            };

            const newGym = await api.createGym(payload);

            const declarationText = `I hereby confirm that I am the authorized owner/representative of the gym/business registered on Gymkaana.
I agree to partner with Gymkaana (operated by Vuegam Solutions) for listing and providing services.
I authorize Gymkaana to list my gym, collect payments, deduct commission, and settle amounts to my bank.
I confirm all information is true and I comply with applicable laws.
I agree to Gymkaana's Terms & Conditions and Gym Partner Agreement.`;

            await api.submitDeclaration({
                gymId: newGym._id,
                signatureName: declaration.signature,
                declarationAccepted: declaration.accepted,
                declarationText
            });

            onBack();
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Submission failed. If you uploaded many photos, try with fewer images.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <div className="bg-white border-b-2 border-gray-200 px-6 py-4 sticky top-0 z-10">
                <button onClick={step === 2 ? () => { setStep(1); window.scrollTo(0,0); } : onBack} className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-bold uppercase tracking-wide text-sm">{step === 2 ? 'Back to Form' : 'Cancel'}</span>
                </button>
                <div className="flex items-center gap-3 mt-3">
                    <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`} />
                    <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                </div>
            </div>

            <div className="px-6 py-8 space-y-8 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">
                        {step === 1 ? "Onboard New Hub" : "Legal Authorization"}
                    </h1>
                    <p className="text-sm text-gray-400 font-medium mt-1">
                        {step === 1 ? "Step 1 of 2 — Fill in your venue details." : "Step 2 of 2 — Review and sign the partner declaration."}
                    </p>
                </div>

                {step === 1 ? (
                    <>
                        {/* PHOTOS */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Photos <span className="text-gray-300">(Multiple allowed)</span></h3>
                            <div className="flex flex-wrap gap-4">
                                <label className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-gray-100 cursor-pointer group">
                                    <Camera size={20} className="text-gray-400 group-hover:text-black" />
                                    <span className="text-[9px] font-bold uppercase text-gray-400">Add</span>
                                    <input type="file" title="Upload multiple photos" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                                </label>
                                {images.map((img, i) => (
                                    <div key={i} className="w-24 h-24 relative rounded-xl overflow-hidden border border-gray-200 group">
                                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                        <button onClick={() => removeImage(i)} title="Remove" className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {images.length > 0 && <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase">{images.length} photo{images.length !== 1 ? 's' : ''} selected. Images are auto-compressed.</p>}
                        </div>

                        {/* BASIC INFO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Core Identity</h3>
                                <Input placeholder="Hub Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                <Textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="resize-none" />
                                <Input type="number" placeholder="Base Day Pass Price (₹)" value={form.baseDayPassPrice || ''} onChange={e => setForm({ ...form, baseDayPassPrice: parseFloat(e.target.value) || 0 })} />
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Contact & Location</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <Input placeholder="Full Address *" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                                    <Input placeholder="Zip Code" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* OPERATING HOURS */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#A3E635]">7-Day Operational Configuration</h3>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest leading-none">Customize access windows for each day</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {form.operatingHours.map((oh, idx) => (
                                    <div key={oh.day} className={`p-4 rounded-xl border ${oh.isClosed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}`}>
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-xs font-black uppercase tracking-tight">{oh.day}</span>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    title={`Close on ${oh.day}`}
                                                    checked={oh.isClosed} 
                                                    onChange={e => {
                                                        const newOH = [...form.operatingHours];
                                                        newOH[idx].isClosed = e.target.checked;
                                                        setForm({ ...form, operatingHours: newOH });
                                                    }}
                                                    className="w-3 h-3"
                                                />
                                                <span className="text-[9px] font-bold uppercase text-gray-400">Closed</span>
                                            </label>
                                        </div>
                                        {!oh.isClosed && (
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="time" 
                                                    title="Open Time"
                                                    value={oh.open} 
                                                    onChange={e => {
                                                        const newOH = [...form.operatingHours];
                                                        newOH[idx].open = e.target.value;
                                                        setForm({ ...form, operatingHours: newOH });
                                                    }}
                                                    className="flex-1 p-1.5 text-[10px] font-bold border rounded-lg"
                                                />
                                                <span className="text-gray-300 text-[10px]">to</span>
                                                <input 
                                                    type="time" 
                                                    title="Close Time"
                                                    value={oh.close} 
                                                    onChange={e => {
                                                        const newOH = [...form.operatingHours];
                                                        newOH[idx].close = e.target.value;
                                                        setForm({ ...form, operatingHours: newOH });
                                                    }}
                                                    className="flex-1 p-1.5 text-[10px] font-bold border rounded-lg"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* KYC / BUSINESS IDENTITY */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Business KYC</h3>
                                <p className="text-[10px] text-gray-300 mt-1">These details are used for identity verification and compliance.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Aadhaar Number</label>
                                    <Input placeholder="XXXX XXXX XXXX" value={form.kycDetails.aadhaarNumber} onChange={e => setForm({ ...form, kycDetails: { ...form.kycDetails, aadhaarNumber: e.target.value } })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">PAN Number</label>
                                    <Input placeholder="ABCDE1234F" value={form.kycDetails.panNumber} onChange={e => setForm({ ...form, kycDetails: { ...form.kycDetails, panNumber: e.target.value.toUpperCase() } })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">GST Number</label>
                                    <Input placeholder="22AAAAA0000A1Z5 (Optional)" value={form.kycDetails.gstNumber} onChange={e => setForm({ ...form, kycDetails: { ...form.kycDetails, gstNumber: e.target.value.toUpperCase() } })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Business Registration No.</label>
                                    <Input placeholder="e.g. CIN / MSME / Shop Act" value={form.kycDetails.businessRegistrationNumber} onChange={e => setForm({ ...form, kycDetails: { ...form.kycDetails, businessRegistrationNumber: e.target.value } })} />
                                </div>
                            </div>
                        </div>

                        {/* TRAINERS */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Trainers</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <Input placeholder="Name" value={newTrainer.name} onChange={e => setNewTrainer({ ...newTrainer, name: e.target.value })} />
                                <Input placeholder="Experience" value={newTrainer.experience} onChange={e => setNewTrainer({ ...newTrainer, experience: e.target.value })} />
                                <Input placeholder="Specialization" value={newTrainer.specialization} onChange={e => setNewTrainer({ ...newTrainer, specialization: e.target.value })} />
                                <Button title="Add Trainer" onClick={() => { if (newTrainer.name) { setForm({ ...form, trainers: [...form.trainers, newTrainer] }); setNewTrainer({ name: '', experience: '', specialization: '' }); } }} className="bg-black text-white"><Plus size={16} /></Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {form.trainers.map((t, i) => (
                                    <div key={i} className="px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center gap-2 text-xs font-bold">
                                        {t.name} ({t.experience}) <button title="Remove" onClick={() => setForm({ ...form, trainers: form.trainers.filter((_, idx) => idx !== i) })}><X size={12} className="text-red-400" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PLANS */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Membership Plans</h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                <Input placeholder="Plan Name" value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} />
                                <Input type="number" placeholder="Price (₹)" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} />
                                <select title="Duration" className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm" value={newPlan.duration} onChange={e => setNewPlan({ ...newPlan, duration: e.target.value })}>
                                    {DURATIONS.map(d => <option key={d}>{d}</option>)}
                                </select>
                                <Input type="number" placeholder="Sessions" value={newPlan.sessions} onChange={e => setNewPlan({ ...newPlan, sessions: e.target.value })} />
                                <Button title="Add Plan" onClick={() => { if (newPlan.name && newPlan.price) { setForm({ ...form, plans: [...form.plans, { ...newPlan, price: parseFloat(newPlan.price), sessions: parseInt(newPlan.sessions) || 1 }] }); setNewPlan({ name: '', price: '', duration: '1 Month', sessions: '30', description: '' }); } }} className="bg-black text-white"><Plus size={16} /></Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {form.plans.map((p, i) => (
                                    <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center">
                                        <div><p className="font-black italic uppercase text-sm">{p.name}</p><p className="text-xs text-gray-400">{p.duration} • ₹{p.price}</p></div>
                                        <button title="Remove" onClick={() => setForm({ ...form, plans: form.plans.filter((_, idx) => idx !== i) })}><X size={14} className="text-red-400" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FACILITIES & SPECIALIZATIONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Amenities</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {FACILITIES.map((f, i) => (
                                        <button key={i} title={f} onClick={() => toggleFacility(f)} className={`p-2.5 text-left text-[10px] font-bold uppercase rounded-xl border-2 transition-all ${form.facilities.includes(f) ? 'bg-black border-black text-white' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{f}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-200">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Specializations</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {SPECIALIZATIONS.map((s, i) => (
                                        <button key={i} title={s} onClick={() => toggleSpecialization(s)} className={`p-2.5 text-left text-[10px] font-bold uppercase rounded-xl border-2 transition-all ${form.specializations.includes(s) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>{s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* BANKING */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Settlement Account</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input placeholder="Account Holder Name" value={form.bankDetails.accountName} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountName: e.target.value } })} />
                                <Input placeholder="Account Number" value={form.bankDetails.accountNumber} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })} />
                                <Input placeholder="IFSC Code" value={form.bankDetails.ifscCode} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, ifscCode: e.target.value } })} />
                                <Input placeholder="Bank Name" value={form.bankDetails.bankName} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <div className="flex items-center gap-3 border-b border-blue-100 pb-4 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><FileText className="text-white w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-base font-black italic uppercase text-blue-900">Declaration & Authorization</h3>
                                    <p className="text-[10px] text-blue-400 uppercase font-bold">Gymkaana Partner Agreement</p>
                                </div>
                            </div>
                            <div className="text-blue-900/80 text-sm font-medium leading-relaxed space-y-3">
                                <p>I hereby confirm that I am the authorized owner/representative of the gym/business registered on Gymkaana.</p>
                                <p>I agree to partner with Gymkaana (operated by Vuegam Solutions) for listing and providing services to customers.</p>
                                <p className="font-bold">I authorize Gymkaana to:</p>
                                <ul className="list-disc pl-5 space-y-1 text-[13px]">
                                    <li>List my gym on its platform</li>
                                    <li>Collect payments from customers on my behalf</li>
                                    <li>Deduct applicable commission/fees</li>
                                    <li>Settle remaining amounts to my registered bank account</li>
                                </ul>
                                <p className="font-bold">I confirm that:</p>
                                <ul className="list-disc pl-5 space-y-1 text-[13px]">
                                    <li>All information provided is true and accurate</li>
                                    <li>I will provide services as listed on the platform</li>
                                    <li>I comply with applicable laws and regulations</li>
                                </ul>
                                <p className="text-[11px] bg-white/60 p-3 rounded-xl border border-blue-100 font-bold">I agree to Gymkaana's <span className="text-blue-600 underline">Terms & Conditions</span> and <span className="text-blue-600 underline">Gym Partner Agreement</span>.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <label className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 transition-all cursor-pointer">
                                <input type="checkbox" title="Accept Declaration" className="w-5 h-5 mt-0.5 cursor-pointer accent-blue-600" checked={declaration.accepted} onChange={e => setDeclaration({ ...declaration, accepted: e.target.checked })} />
                                <div>
                                    <p className="text-xs font-black uppercase text-gray-900">I agree to the above declaration</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Mandatory for platform listing and automated settlement</p>
                                </div>
                            </label>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Digital Signature — Type Your Full Name</label>
                                <Input placeholder="e.g. RAJESH KUMAR" className="h-14 text-lg font-black italic uppercase tracking-tight border-gray-200 bg-gray-50 focus:bg-white" value={declaration.signature} onChange={e => setDeclaration({ ...declaration, signature: e.target.value })} />
                                <p className="text-[10px] text-gray-300 mt-1 font-bold">Dated: {new Date().toLocaleDateString('en-IN')}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || (step === 2 && (!declaration.accepted || !declaration.signature.trim()))}
                        className={`w-full h-16 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${step === 1 ? 'bg-black text-white hover:bg-zinc-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : (step === 1 ? <Plus size={20} /> : <ShieldCheck size={20} />)}
                        {loading ? 'Processing...' : (step === 1 ? 'Continue to Authorization' : 'Finalize Onboarding')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
