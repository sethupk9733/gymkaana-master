import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Upload, Clock, Check, X, 
  Trash2, ShieldCheck, Mail, Phone, MapPin, 
  Building2, FileText, Landmark, Award, Loader2,
  Trash
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { fetchGymById, updateGym } from "../lib/api";

interface EditGymProps {
  gymId: string | number;
  onBack: () => void;
}

export function EditGym({ gymId, onBack }: EditGymProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    zipCode: "",
    landmark: "",
    googleMapsLink: "",
    openingHours: {
      weekdays: "6:00 AM - 10:00 PM",
      weekends: "7:00 AM - 9:00 PM"
    },
    facilities: [] as string[],
    gstNo: "",
    panNo: "",
    documentation: {
      tradingLicense: "",
      fireSafety: "",
      insurancePolicy: ""
    }
  });

  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableFacilities = [
    "Cardio Equipment", "Free Weights", "WiFi", "Shower", 
    "Locker", "Parking", "Personal Trainer", "Steam Room",
  ];

  useEffect(() => {
    const loadGym = async () => {
      try {
        const data = await fetchGymById(gymId);
        if (data) {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            address: data.address || "",
            phone: data.phone || data.ownerId?.phoneNumber || "",
            email: data.email || data.ownerId?.email || "",
            city: data.city || "",
            zipCode: data.zipCode || "",
            landmark: data.landmark || "",
            googleMapsLink: data.googleMapsLink || "",
            openingHours: data.openingHours || {
              weekdays: "6:00 AM - 10:00 PM",
              weekends: "7:00 AM - 9:00 PM"
            },
            facilities: data.facilities || [],
            gstNo: data.gstNo || "",
            panNo: data.panNo || "",
            documentation: data.documentation || {
              tradingLicense: "",
              fireSafety: "",
              insurancePolicy: ""
            }
          });
          setImages(data.images || (data.image ? [data.image] : []));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load gym data");
      } finally {
        setLoading(false);
      }
    };
    loadGym();
  }, [gymId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocumentationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      documentation: { ...prev.documentation, [field]: value }
    }));
  };

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        images,
        image: images[0] || ""
      };
      await updateGym(gymId, payload);
      onBack();
    } catch (err: any) {
      setError(err.message || "Failed to update gym");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-black mx-auto" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Hub Config...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-8 py-6 sticky top-0 z-30 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-3 text-black font-black uppercase tracking-widest text-xs hover:text-gray-600 transition-all">
          <ArrowLeft size={18} />
          <span>Edit Node Profile</span>
        </button>
        <div className="flex items-center gap-3">
            {saving && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 italic">Instance ID: {gymId}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-12">
        {error && (
            <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[32px] flex items-center gap-4 animate-shake">
                <ShieldCheck className="text-red-500 w-6 h-6" />
                <p className="text-red-600 font-bold text-xs uppercase tracking-widest">{error}</p>
            </div>
        )}

        {/* Photos Grid */}
        <section className="space-y-6">
            <h3 className="text-base font-black uppercase tracking-widest italic flex items-center gap-3">
                <Building2 size={18} className="text-[#A3E635]" /> Asset Gallery
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div key={index} className="relative aspect-square group rounded-3xl overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-100">
                        <img src={img} alt={`Asset ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <button 
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                            title="Remove Asset"
                        >
                            <Trash size={14} />
                        </button>
                    </div>
                ))}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-black hover:bg-gray-50 transition-all group"
                >
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                        <Upload size={20} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black">Add Asset</span>
                </button>
                <input type="file" hidden ref={fileInputRef} multiple accept="image/*" onChange={handleImageUpload} />
            </div>
        </section>

        {/* Vital Info */}
        <section className="bg-white border-2 border-gray-100 p-10 rounded-[64px] shadow-sm space-y-8">
            <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3 border-b-2 border-gray-50 pb-6">
                <FileText size={18} className="text-[#A3E635]" /> Core Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Display Name</label>
                    <Input value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="h-14 font-black uppercase tracking-tighter text-lg border-2 border-gray-100 focus:border-black rounded-2xl" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Institutional Mission</label>
                    <Textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={4} className="border-2 border-gray-100 font-bold focus:border-black rounded-3xl p-6" />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Comm Channel (Phone)</label>
                    <Input value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="h-14 font-bold border-2 border-gray-100 focus:border-black rounded-2xl" />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Network Layer (Email)</label>
                    <Input value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="h-14 font-bold border-2 border-gray-100 focus:border-black rounded-2xl" />
                </div>
            </div>
        </section>

        {/* Compliance & Governance */}
        <section className="bg-gray-900 p-10 rounded-[64px] shadow-2xl space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#A3E635]/10 blur-[120px] rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3 text-white border-b border-white/10 pb-6 relative z-10">
                <ShieldCheck size={18} className="text-[#A3E635]" /> Governance & Compliance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div>
                    <label className="block text-[9px] uppercase font-black tracking-widest text-white/40 mb-3 ml-2">Direct Tax (GST)</label>
                    <Input value={formData.gstNo} onChange={e => handleInputChange('gstNo', e.target.value)} className="h-14 bg-white/5 border-white/10 text-white font-black uppercase tracking-widest text-xs focus:border-[#A3E635] rounded-2xl" />
                </div>
                <div>
                    <label className="block text-[9px] uppercase font-black tracking-widest text-white/40 mb-3 ml-2">Legal Entity (PAN)</label>
                    <Input value={formData.panNo} onChange={e => handleInputChange('panNo', e.target.value)} className="h-14 bg-white/5 border-white/10 text-white font-black uppercase tracking-widest text-xs focus:border-[#A3E635] rounded-2xl" />
                </div>
                <div>
                    <label className="block text-[9px] uppercase font-black tracking-widest text-white/40 mb-3 ml-2">Trading License Protocol</label>
                    <Input value={formData.documentation.tradingLicense} onChange={e => handleDocumentationChange('tradingLicense', e.target.value)} className="h-14 bg-white/5 border-white/10 text-white font-black uppercase tracking-widest text-xs focus:border-[#A3E635] rounded-2xl" />
                </div>
                <div>
                    <label className="block text-[9px] uppercase font-black tracking-widest text-white/40 mb-3 ml-2">Fire Safety Certification</label>
                    <Input value={formData.documentation.fireSafety} onChange={e => handleDocumentationChange('fireSafety', e.target.value)} className="h-14 bg-white/5 border-white/10 text-white font-black uppercase tracking-widest text-xs focus:border-[#A3E635] rounded-2xl" />
                </div>
            </div>
        </section>

        {/* Location Intelligence */}
        <section className="bg-white border-2 border-gray-100 p-10 rounded-[64px] shadow-sm space-y-10">
            <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3 border-b-2 border-gray-50 pb-6">
                <MapPin size={18} className="text-[#A3E635]" /> Neural Link (Location)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Physical Coordinates (Address)</label>
                    <Input value={formData.address} onChange={e => handleInputChange('address', e.target.value)} className="h-14 font-bold border-2 border-gray-100 focus:border-black rounded-2xl" />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Urban Sector (City)</label>
                    <Input value={formData.city} onChange={e => handleInputChange('city', e.target.value)} className="h-14 font-bold border-2 border-gray-100 focus:border-black rounded-2xl" />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Zip Matrix (Pincode)</label>
                    <Input value={formData.zipCode} onChange={e => handleInputChange('zipCode', e.target.value)} className="h-14 font-bold border-2 border-gray-100 focus:border-black rounded-2xl" />
                </div>
            </div>
        </section>

        {/* Node Facilities */}
        <section className="space-y-6">
            <h3 className="text-base font-black uppercase tracking-widest italic flex items-center gap-3">
                <Check size={18} className="text-[#A3E635]" /> Facility Matrix
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableFacilities.map((facility, index) => (
                    <button
                        key={index}
                        onClick={() => toggleFacility(facility)}
                        className={`h-16 rounded-[24px] border-2 font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-between px-6 ${
                        formData.facilities.includes(facility)
                            ? "bg-black text-white border-black shadow-lg"
                            : "bg-white border-gray-100 text-gray-400 hover:border-gray-200 shadow-sm"
                        }`}
                    >
                        <span>{facility}</span>
                        {formData.facilities.includes(facility) && <Check size={14} className="text-[#A3E635]" />}
                    </button>
                ))}
            </div>
        </section>

        {/* Ops Window */}
        <section className="bg-white border-2 border-gray-100 p-10 rounded-[64px] shadow-sm space-y-10">
            <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3 border-b-2 border-gray-50 pb-6">
                <Clock size={18} className="text-[#A3E635]" /> Operational Window
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Standard Protocol (Weekdays)</label>
                    <Input value={formData.openingHours.weekdays} onChange={e => setFormData(p => ({ ...p, openingHours: { ...p.openingHours, weekdays: e.target.value } }))} className="h-14 font-bold border-2 border-gray-100 focus:border-black rounded-2xl" />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 ml-2">Extended Protocol (Weekends)</label>
                    <Input value={formData.openingHours.weekends} onChange={e => setFormData(p => ({ ...p, openingHours: { ...p.openingHours, weekends: e.target.value } }))} className="h-14 font-bold border-2 border-gray-100 focus:border-black rounded-2xl" />
                </div>
            </div>
        </section>

        {/* Final Execution */}
        <div className="pt-10 flex flex-col md:flex-row gap-6">
            <button 
                onClick={onBack}
                className="flex-1 h-20 bg-gray-100 text-black rounded-[32px] font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all border-2 border-gray-200"
            >
                Abort Changes
            </button>
            <button 
                onClick={handleSave}
                disabled={saving}
                className="flex-[2] h-20 bg-black text-white rounded-[32px] font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-[0_24px_48px_rgba(0,0,0,0.2)] flex items-center justify-center gap-4"
            >
                {saving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Applying Core Data...</span>
                    </>
                ) : (
                    <>
                        <ShieldCheck className="w-5 h-5 text-[#A3E635]" />
                        <span>Commit Instance Changes</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}

