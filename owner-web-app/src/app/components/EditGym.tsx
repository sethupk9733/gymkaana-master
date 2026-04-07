import { ArrowLeft, Clock, Check, X, Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState, useEffect } from "react";
import { fetchGymById, updateGym } from "../lib/api";

interface EditGymProps {
  gymId: string;
  onBack: () => void;
}

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
    facilities: [] as string[],
    specializations: [] as string[],
    trainers: ''
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

  useEffect(() => {
    fetchGymById(gymId)
      .then((data: any) => {
        setForm({
          name: data.name,
          description: data.description,
          baseDayPassPrice: data.baseDayPassPrice || 0,
          address: data.address,
          location: data.location || '',
          phone: data.phone,
          email: data.email,
          timings: data.timings,
          facilities: data.facilities || [],
          specializations: data.specializations || [],
          trainers: (data.trainers || []).join(', ')
        });
        setImages(data.images || []);
        setFetching(false);
      })
      .catch((err: any) => {
        console.error(err);
        alert("Failed to fetch gym details");
        onBack();
      });
  }, [gymId]);

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateGym(gymId, {
        ...form,
        trainers: form.trainers.split(',').map(t => t.trim()).filter(t => t),
        images
      });

      alert('Gym updated successfully');
      onBack();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to update gym');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 font-bold hover:text-black transition-colors">
          <ArrowLeft size={20} />
          <span>EDIT VENUE</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter">Modify Hub</h1>
            <p className="text-sm text-gray-500 font-medium">Update your venue information and pricing.</p>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4">Media vault</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 cursor-pointer transition-all group">
              <Camera size={24} className="text-gray-400 group-hover:text-black" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-black">Add Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
            {images.map((img, i) => (
              <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 group">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button
                  title="Remove Image"
                  onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Core Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Hub Name</label>
                <Input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="h-12 border-gray-200 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Location / Area</label>
                <Input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="h-12 border-gray-200 bg-gray-50"
                  placeholder="e.g. Indiranagar"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Full Address</label>
                <Textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  rows={2}
                  className="border-gray-200 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Description</label>
                <Textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="border-gray-200 bg-gray-50"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Base Day Pass Price (₹)</label>
                <Input
                  type="number"
                  value={form.baseDayPassPrice}
                  onChange={e => setForm({ ...form, baseDayPassPrice: parseFloat(e.target.value) || 0 })}
                  className="h-12 border-gray-200 bg-gray-50 font-black text-xl text-blue-600"
                />
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Crucial for auto-discount yield calculation</p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Contact Phone</label>
                <Input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="h-12 border-gray-200 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Contact Email</label>
                <Input
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="h-12 border-gray-200 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Operations Timings</label>
                <Input
                  value={form.timings}
                  onChange={e => setForm({ ...form, timings: e.target.value })}
                  className="h-12 border-gray-200 bg-gray-50"
                  placeholder="e.g. 6AM - 10PM"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities & Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {FACILITIES.map((facility, index) => (
                <button
                  key={index}
                  onClick={() => toggleFacility(facility)}
                  className={`h-14 rounded-xl border-2 flex items-center justify-between px-4 transition-all ${form.facilities.includes(facility)
                    ? "bg-black border-black text-white shadow-lg"
                    : "bg-gray-50 border-gray-100 text-gray-500 hover:border-black hover:text-black"
                    }`}
                >
                  <span className="text-[10px] font-black uppercase text-left leading-tight">{facility}</span>
                  {form.facilities.includes(facility) && <Check size={14} className="text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Specialized Disciplines</h3>
            <div className="grid grid-cols-2 gap-3">
              {SPECIALIZATIONS.map((spec, index) => (
                <button
                  key={index}
                  onClick={() => toggleSpecialization(spec)}
                  className={`h-14 rounded-xl border-2 flex items-center justify-between px-4 transition-all ${form.specializations.includes(spec)
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                    : "bg-gray-50 border-gray-100 text-gray-500 hover:border-blue-600 hover:text-blue-600"
                    }`}
                >
                  <span className="text-[10px] font-black uppercase text-left leading-tight">{spec}</span>
                  {form.specializations.includes(spec) && <Check size={14} className="text-blue-200" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Experts & Trainers</h3>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">Team Members (Comma separated)</label>
              <Textarea
                value={form.trainers}
                onChange={e => setForm({ ...form, trainers: e.target.value })}
                placeholder="e.g. John Doe, Jane Smith"
                rows={4}
                className="border-gray-200 bg-gray-50"
              />
              <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest leading-relaxed">List individual coaches or specialist team members.</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-16 bg-black hover:bg-gray-800 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
            {loading ? 'Saving Hub Data...' : 'Confirm Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
