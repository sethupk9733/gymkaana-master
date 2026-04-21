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
  const [schedule, setSchedule] = useState({
    monSat: [{ open: '06:00', close: '22:00' }],
    monSatClosed: false,
    sunday: [{ open: '08:00', close: '14:00' }],
    sundayClosed: false
  });

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
        const oh = data.operatingHours || [];
        const monSatOH = oh.filter((o: any) => o.day !== 'Sunday');
        const sundayOH = oh.filter((o: any) => o.day === 'Sunday');
        
        let monSat = [{ open: '06:00', close: '22:00' }];
        let monSatClosed = false;
        if (monSatOH.length > 0) {
            monSatClosed = monSatOH.every((o: any) => o.isClosed);
            if (!monSatClosed) {
                const monShifts = monSatOH.filter((o: any) => o.day === 'Monday' && !o.isClosed);
                if (monShifts.length > 0) monSat = monShifts.map((o: any) => ({ open: o.open, close: o.close }));
            }
        }
        
        let sunday = [{ open: '08:00', close: '14:00' }];
        let sundayClosed = false;
        if (sundayOH.length > 0) {
            sundayClosed = sundayOH.every((o: any) => o.isClosed);
            if (!sundayClosed) {
                const sunShifts = sundayOH.filter((o: any) => !o.isClosed);
                if (sunShifts.length > 0) sunday = sunShifts.map((o: any) => ({ open: o.open, close: o.close }));
            }
        }

        setSchedule({ monSat, monSatClosed, sunday, sundayClosed });

        setForm({
          name: data.name || '',
          description: data.description || '',
          baseDayPassPrice: data.baseDayPassPrice || 0,
          address: data.address || '',
          location: data.location || '',
          phone: data.phone || '',
          email: data.email || '',
          timings: data.timings || '',
          googleMapsLink: data.googleMapsLink || '',
          coordinates: data.coordinates || { lat: 0, lng: 0 },
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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setForm(prev => ({
                ...prev,
                coordinates: { lat: latitude, lng: longitude },
                googleMapsLink: prev.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
            }));
            alert('Location captured successfully!');
        },
        (error) => {
            console.error("Geolocation error:", error);
            alert('Failed to get location. Please allow location permissions.');
        }
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payloadTimings: any[] = [];
      const monSatDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let monSatString = '';
      let sundayString = '';

      if (schedule.monSatClosed) {
          monSatDays.forEach(d => payloadTimings.push({ day: d, open: '', close: '', isClosed: true }));
          monSatString = 'Mon-Sat: Closed';
      } else {
          monSatDays.forEach(d => {
              schedule.monSat.forEach(shift => payloadTimings.push({ day: d, open: shift.open, close: shift.close, isClosed: false }));
          });
          monSatString = 'Mon-Sat: ' + schedule.monSat.map(s => `${s.open}-${s.close}`).join(', ');
      }
      if (schedule.sundayClosed) {
          payloadTimings.push({ day: 'Sunday', open: '', close: '', isClosed: true });
          sundayString = 'Sun: Closed';
      } else {
          schedule.sunday.forEach(shift => payloadTimings.push({ day: 'Sunday', open: shift.open, close: shift.close, isClosed: false }));
          sundayString = 'Sun: ' + schedule.sunday.map(s => `${s.open}-${s.close}`).join(', ');
      }
      const timingsString = `${monSatString} | ${sundayString}`;

      await updateGym(gymId, {
        ...form,
        images,
        operatingHours: payloadTimings,
        timings: timingsString,
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
              <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Maps Link / Coordinates</label>
                  <button type="button" onClick={handleGetLocation} className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors">
                      Capture Current Location
                  </button>
              </div>
              <Input placeholder="e.g. https://goo.gl/maps/..." value={form.googleMapsLink} onChange={e => setForm({ ...form, googleMapsLink: e.target.value })} />
              {form.coordinates.lat !== 0 && (
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">
                      ✓ Coordinates saved ({form.coordinates.lat.toFixed(4)}, {form.coordinates.lng.toFixed(4)})
                  </p>
              )}
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Base Day Pass Price (₹)</label>
              <Input type="number" value={form.baseDayPassPrice || ''} onChange={e => setForm({ ...form, baseDayPassPrice: parseFloat(e.target.value) || 0 })} className="font-black text-blue-600 text-lg" />
            </div>
          </div>
        </div>

        {/* OPERATING HOURS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#A3E635]">Operating Hours</h3>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest leading-none">Configure multiple shifts per day</p>
            </div>
            
            {/* Monday - Saturday */}
            <div className={`p-4 rounded-xl border ${schedule.monSatClosed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'} space-y-3`}>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-black uppercase tracking-tight">Monday - Saturday</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={schedule.monSatClosed} onChange={e => setSchedule({ ...schedule, monSatClosed: e.target.checked })} className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase text-gray-400">Closed</span>
                    </label>
                </div>
                {!schedule.monSatClosed && (
                    <div className="space-y-2">
                        {schedule.monSat.map((shift, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <input type="time" title="Open Time" value={shift.open} onChange={e => {
                                    const newArr = [...schedule.monSat]; newArr[idx].open = e.target.value; setSchedule({ ...schedule, monSat: newArr });
                                }} className="flex-1 p-2 text-xs font-bold border rounded-lg" />
                                <span className="text-gray-300 text-xs">to</span>
                                <input type="time" title="Close Time" value={shift.close} onChange={e => {
                                    const newArr = [...schedule.monSat]; newArr[idx].close = e.target.value; setSchedule({ ...schedule, monSat: newArr });
                                }} className="flex-1 p-2 text-xs font-bold border rounded-lg" />
                                <button title="Remove Shift" onClick={() => setSchedule({ ...schedule, monSat: schedule.monSat.filter((_, i) => i !== idx) })} className="p-2 text-red-400 hover:text-red-600"><X size={16} /></button>
                            </div>
                        ))}
                        <button title="Add Shift" onClick={() => setSchedule({ ...schedule, monSat: [...schedule.monSat, { open: '16:00', close: '22:00' }] })} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2">
                            <Plus size={12} /> Add Shift
                        </button>
                    </div>
                )}
            </div>

            {/* Sunday */}
            <div className={`p-4 rounded-xl border ${schedule.sundayClosed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'} space-y-3`}>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-black uppercase tracking-tight">Sunday</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={schedule.sundayClosed} onChange={e => setSchedule({ ...schedule, sundayClosed: e.target.checked })} className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase text-gray-400">Closed</span>
                    </label>
                </div>
                {!schedule.sundayClosed && (
                    <div className="space-y-2">
                        {schedule.sunday.map((shift, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <input type="time" title="Open Time" value={shift.open} onChange={e => {
                                    const newArr = [...schedule.sunday]; newArr[idx].open = e.target.value; setSchedule({ ...schedule, sunday: newArr });
                                }} className="flex-1 p-2 text-xs font-bold border rounded-lg" />
                                <span className="text-gray-300 text-xs">to</span>
                                <input type="time" title="Close Time" value={shift.close} onChange={e => {
                                    const newArr = [...schedule.sunday]; newArr[idx].close = e.target.value; setSchedule({ ...schedule, sunday: newArr });
                                }} className="flex-1 p-2 text-xs font-bold border rounded-lg" />
                                <button title="Remove Shift" onClick={() => setSchedule({ ...schedule, sunday: schedule.sunday.filter((_, i) => i !== idx) })} className="p-2 text-red-400 hover:text-red-600"><X size={16} /></button>
                            </div>
                        ))}
                        <button title="Add Shift" onClick={() => setSchedule({ ...schedule, sunday: [...schedule.sunday, { open: '15:00', close: '20:00' }] })} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-2">
                            <Plus size={12} /> Add Shift
                        </button>
                    </div>
                )}
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
