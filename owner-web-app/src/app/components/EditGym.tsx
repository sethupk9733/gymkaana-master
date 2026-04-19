import { ArrowLeft, Check, X, Camera, Upload, Loader2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState, useEffect } from "react";
import { fetchGymById, updateGym } from "../lib/api";

interface EditGymProps {
  gymId: string;
  onBack: () => void;
}

// Compress image before storing (prevents 'failed to fetch' on large payloads)
const compressImage = (base64: string, maxWidth = 800, quality = 0.7): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = base64;
  });

export function EditGym({ gymId, onBack }: EditGymProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    baseDayPassPrice: 0,
    address: '',
    location: '',
    phone: '',
    email: '',
    timings: '',
    operatingHours: [] as { day: string; open: string; close: string; isClosed: boolean }[],
    facilities: [] as string[],
    specializations: [] as string[],
    houseRules: [] as string[],
    trainers: [] as { name: string; experience: string; specialization: string }[],
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
    }
  });

  const [newTrainer, setNewTrainer] = useState({ name: '', experience: '', specialization: '' });
  const [newRule, setNewRule] = useState('');

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

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchGymById(gymId)
      .then((data: any) => {
        const trainerDetails = data.trainerDetails?.length
          ? data.trainerDetails
          : (data.trainers || []).map((name: string) => ({ name: name, experience: '', specialization: '' }));
        
        // Initialize operatingHours if missing
        const operatingHours = data.operatingHours?.length 
          ? data.operatingHours 
          : DAYS.map(day => ({ day, open: '06:00', close: '22:00', isClosed: false }));

        setForm({
          name: data.name || '',
          description: data.description || '',
          baseDayPassPrice: data.baseDayPassPrice || 0,
          address: data.address || '',
          location: data.location || '',
          phone: data.phone || '',
          email: data.email || '',
          timings: data.timings || '',
          operatingHours,
          facilities: data.facilities || [],
          specializations: data.specializations || [],
          houseRules: data.houseRules || [],
          trainers: trainerDetails,
          kycDetails: {
            aadhaarNumber: data.kycDetails?.aadhaarNumber || '',
            panNumber: data.kycDetails?.panNumber || '',
            gstNumber: data.kycDetails?.gstNumber || '',
            businessRegistrationNumber: data.kycDetails?.businessRegistrationNumber || ''
          },
          bankDetails: {
            accountName: data.bankDetails?.accountName || '',
            accountNumber: data.bankDetails?.accountNumber || '',
            ifscCode: data.bankDetails?.ifscCode || '',
            bankName: data.bankDetails?.bankName || ''
          }
        });
        setImages(data.images || []);
        setFetching(false);
      })
      .catch((err: any) => { console.error(err); alert("Failed to fetch gym details"); onBack(); });
  }, [gymId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Limit to 10 total images
    if (images.length + files.length > 10) {
      alert("Maximum 10 photos allowed for each hub.");
      return;
    }

    const compressed: string[] = [];
    for (const file of Array.from(files)) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          // Use more aggressive compression for many photos (600px width)
          const comp = await compressImage(reader.result as string, 600, 0.6);
          compressed.push(comp);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setImages(prev => [...prev, ...compressed]);
    e.target.value = '';
  };

  const toggleFacility = (f: string) => setForm(prev => ({
    ...prev,
    facilities: prev.facilities.includes(f) ? prev.facilities.filter(x => x !== f) : [...prev.facilities, f]
  }));

  const toggleSpec = (s: string) => setForm(prev => ({
    ...prev,
    specializations: prev.specializations.includes(s) ? prev.specializations.filter(x => x !== s) : [...prev.specializations, s]
  }));

  const addTrainer = () => {
    if (newTrainer.name) {
      setForm(prev => ({ ...prev, trainers: [...prev.trainers, newTrainer] }));
      setNewTrainer({ name: '', experience: '', specialization: '' });
    }
  };

  const removeTrainer = (i: number) => setForm(prev => ({ ...prev, trainers: prev.trainers.filter((_, idx) => idx !== i) }));

  const addRule = () => {
    if (newRule.trim()) { setForm(prev => ({ ...prev, houseRules: [...prev.houseRules, newRule.trim()] })); setNewRule(''); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateGym(gymId, {
        ...form,
        images,
        timings: form.operatingHours.map(oh => `${oh.day}: ${oh.isClosed ? 'Closed' : oh.open + '-' + oh.close}`).join(', '),
        trainerDetails: form.trainers,
        trainers: form.trainers.map(t => t.name)
      });
      alert('Gym updated successfully!');
      onBack();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update gym. If you have many photos, try uploading fewer at once.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b-2 border-gray-200 px-6 py-4 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 font-bold hover:text-black">
          <ArrowLeft size={20} /><span className="uppercase tracking-wide text-sm">Back</span>
        </button>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter mt-2">Modify Hub</h1>
      </div>

      <div className="px-6 py-8 space-y-8 max-w-4xl mx-auto">

        {/* PHOTOS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Media Vault <span className="text-gray-300">(Multiple allowed)</span></h3>
          <div className="flex flex-wrap gap-3">
            <label className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-gray-100 cursor-pointer group">
              <Camera size={20} className="text-gray-400 group-hover:text-black" />
              <span className="text-[9px] font-bold uppercase text-gray-400">Add</span>
              <input type="file" title="Upload photos" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            </label>
            {images.map((img, i) => (
              <div key={i} className="w-24 h-24 relative rounded-xl overflow-hidden border border-gray-200 group">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button title="Remove" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100"><X size={10} /></button>
              </div>
            ))}
          </div>
          {images.length > 0 && <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">{images.length} photo{images.length !== 1 ? 's' : ''} — auto-compressed for upload</p>}
        </div>

        {/* CORE INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Core Identity</h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Hub Name</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Full Address</label>
              <Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className="resize-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Area / Locality</label>
              <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Indiranagar" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Description</label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="resize-none" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Contact & Pricing</h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Phone</label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Email</label>
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Timings</label>
              <Input value={form.timings} onChange={e => setForm({ ...form, timings: e.target.value })} placeholder="e.g. 6AM–10PM" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Base Day Pass Price (₹)</label>
              <Input type="number" value={form.baseDayPassPrice || ''} onChange={e => setForm({ ...form, baseDayPassPrice: parseFloat(e.target.value) || 0 })} className="font-black text-blue-600 text-lg" />
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

        {/* KYC */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Business KYC</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Aadhaar Number</label>
              <Input placeholder="XXXX XXXX XXXX" value={form.kycDetails.aadhaarNumber} onChange={e => setForm({ ...form, kycDetails: { ...form.kycDetails, aadhaarNumber: e.target.value } })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">PAN Number</label>
              <Input placeholder="ABCDE1234F" value={form.kycDetails.panNumber} onChange={e => setForm({ ...form, kycDetails: { ...form.kycDetails, panNumber: e.target.value.toUpperCase() } })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">GST Number <span className="text-gray-300">(Optional)</span></label>
              <Input placeholder="22AAAAA0000A1Z5" value={form.kycDetails.gstNumber} onChange={e => setForm({ ...form, kycDetails: { ...form.kycDetails, gstNumber: e.target.value.toUpperCase() } })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Business Registration No.</label>
              <Input placeholder="CIN / MSME / Shop Act" value={form.kycDetails.businessRegistrationNumber} onChange={e => setForm({ ...form, kycDetails: { ...form.kycDetails, businessRegistrationNumber: e.target.value } })} />
            </div>
          </div>
        </div>

        {/* BANK DETAILS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Settlement Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Account Holder Name</label><Input value={form.bankDetails.accountName} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountName: e.target.value } })} /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Account Number</label><Input value={form.bankDetails.accountNumber} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, accountNumber: e.target.value } })} /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">IFSC Code</label><Input value={form.bankDetails.ifscCode} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, ifscCode: e.target.value } })} /></div>
            <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Bank Name</label><Input value={form.bankDetails.bankName} onChange={e => setForm({ ...form, bankDetails: { ...form.bankDetails, bankName: e.target.value } })} /></div>
          </div>
        </div>

        {/* TRAINERS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Trainers & Staff</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input placeholder="Name" value={newTrainer.name} onChange={e => setNewTrainer({ ...newTrainer, name: e.target.value })} />
            <Input placeholder="Experience (e.g. 3 yrs)" value={newTrainer.experience} onChange={e => setNewTrainer({ ...newTrainer, experience: e.target.value })} />
            <Input placeholder="Specialization" value={newTrainer.specialization} onChange={e => setNewTrainer({ ...newTrainer, specialization: e.target.value })} />
            <Button title="Add Trainer" onClick={addTrainer} className="bg-black text-white"><Plus size={16} className="mr-1" /> Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.trainers.map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <div><p className="text-xs font-black uppercase">{t.name}</p><p className="text-[10px] text-gray-400">{t.specialization} {t.experience && `· ${t.experience}`}</p></div>
                <button title="Remove" onClick={() => removeTrainer(i)}><X size={12} className="text-red-400" /></button>
              </div>
            ))}
            {form.trainers.length === 0 && <p className="text-[10px] text-gray-300 uppercase font-bold">No trainers added yet</p>}
          </div>
        </div>

        {/* HOUSE RULES */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">House Rules</h3>
          <div className="flex gap-3">
            <Input placeholder="Add a rule..." value={newRule} onChange={e => setNewRule(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRule()} />
            <Button title="Add Rule" onClick={addRule} className="bg-black text-white shrink-0"><Plus size={16} /></Button>
          </div>
          <div className="space-y-2">
            {form.houseRules.map((rule, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                <span className="flex-1 text-sm text-gray-700">{rule}</span>
                <button title="Remove" onClick={() => setForm(prev => ({ ...prev, houseRules: prev.houseRules.filter((_, idx) => idx !== i) }))}><X size={12} className="text-red-400" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* FACILITIES & SPECIALIZATIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {FACILITIES.map((f, i) => (
                <button key={i} title={f} onClick={() => toggleFacility(f)} className={`p-2.5 text-left text-[10px] font-bold uppercase rounded-xl border-2 flex items-center justify-between transition-all ${form.facilities.includes(f) ? 'bg-black border-black text-white' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                  {f}{form.facilities.includes(f) && <Check size={12} className="text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Specializations</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {SPECIALIZATIONS.map((s, i) => (
                <button key={i} title={s} onClick={() => toggleSpec(s)} className={`p-2.5 text-left text-[10px] font-bold uppercase rounded-xl border-2 flex items-center justify-between transition-all ${form.specializations.includes(s) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                  {s}{form.specializations.includes(s) && <Check size={12} className="text-blue-200" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SAVE */}
        <div className="pt-4">
          <Button onClick={handleSubmit} disabled={loading} className="w-full h-16 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            {loading ? 'Saving...' : 'Confirm Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
