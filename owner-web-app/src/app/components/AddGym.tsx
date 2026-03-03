import { ArrowLeft, Upload, Clock, Check, Loader2 } from "lucide-react";
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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

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
        headTrainer: "",
        experience: "",
        specializations: "",
        openingHoursWeekdays: "",
        openingHoursWeekends: "",
    });

    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

    const facilities = [
        "Cardio Equipment",
        "Free Weights",
        "WiFi",
        "Shower",
        "Locker",
        "Parking",
        "Personal Trainer",
        "Steam Room",
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleFacility = (facility: string) => {
        setSelectedFacilities(prev =>
            prev.includes(facility)
                ? prev.filter(f => f !== facility)
                : [...prev, facility]
        );
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.address) {
            setError("Gym Name and Address are required.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createGym({
                ...formData,
                facilities: selectedFacilities,
                status: 'pending' // Correctly use 'pending' as defined in model
            });
            setSuccess(true);
            setTimeout(() => onBack(), 2000);
        } catch (err: any) {
            setError(err.message || "Failed to create gym. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check className="text-green-600 w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gym Created Successfully!</h2>
                <p className="text-gray-600 mb-8 text-lg">Your gym has been submitted for approval. You'll be redirected soon.</p>
                <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b-2 border-gray-300 px-6 py-4 sticky top-0 z-10">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-semibold text-lg">Add New Gym</span>
                </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-8 max-w-4xl mx-auto">
                {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 font-medium">
                        {error}
                    </div>
                )}

                {/* Photos */}
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm">
                    <h3 className="text-lg mb-4 font-bold flex items-center gap-2">
                        <Upload size={20} className="text-blue-500" />
                        Gym Photos
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        <button className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-100 hover:border-blue-400 transition-all group">
                            <Upload size={24} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 group-hover:text-blue-500">Upload Photo</span>
                        </button>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold">Basic Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Gym Name *</label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. FitZone Gym"
                                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Description</label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your gym, programs, and philosophy..."
                                rows={4}
                                className="border-2 border-gray-200 focus:border-blue-500 rounded-xl font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Full Address *</label>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Street, Area, etc."
                                className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Phone</label>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+91 98765 43210"
                                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Email</label>
                                <Input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="info@gym.com"
                                    className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Details */}
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold">Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">City</label>
                            <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Bangalore" className="h-12 border-2 border-gray-200 rounded-xl" />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Zip Code</label>
                            <Input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="e.g. 560001" className="h-12 border-2 border-gray-200 rounded-xl" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Landmark</label>
                            <Input name="landmark" value={formData.landmark} onChange={handleInputChange} placeholder="e.g. Near Metro Station" className="h-12 border-2 border-gray-200 rounded-xl" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Google Maps Link</label>
                            <Input name="googleMapsLink" value={formData.googleMapsLink} onChange={handleInputChange} placeholder="https://maps.google.com/..." className="h-12 border-2 border-gray-200 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Trainer Details */}
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold">Trainer Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Head Trainer Name</label>
                            <Input name="headTrainer" value={formData.headTrainer} onChange={handleInputChange} placeholder="John Doe" className="h-12 border-2 border-gray-200 rounded-xl font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Experience (Years)</label>
                            <Input name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g. 10" type="number" className="h-12 border-2 border-gray-200 rounded-xl font-medium" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Specializations</label>
                            <Input name="specializations" value={formData.specializations} onChange={handleInputChange} placeholder="e.g. Weight Loss, HIIT, Yoga" className="h-12 border-2 border-gray-200 rounded-xl font-medium" />
                        </div>
                    </div>
                </div>

                {/* Opening Hours */}
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold">Opening Hours</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Weekdays</label>
                            <div className="relative">
                                <Clock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input name="openingHoursWeekdays" value={formData.openingHoursWeekdays} onChange={handleInputChange} placeholder="6:00 AM - 10:00 PM" className="pl-10 h-12 border-2 border-gray-200 rounded-xl" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm mb-2 text-gray-700 font-bold uppercase tracking-wider">Weekends</label>
                            <div className="relative">
                                <Clock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input name="openingHoursWeekends" value={formData.openingHoursWeekends} onChange={handleInputChange} placeholder="7:00 AM - 9:00 PM" className="pl-10 h-12 border-2 border-gray-200 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Facilities */}
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold">Select Facilities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {facilities.map((facility, index) => (
                            <button
                                key={index}
                                onClick={() => toggleFacility(facility)}
                                className={`h-12 rounded-xl border-2 flex items-center justify-between px-4 transition-all ${selectedFacilities.includes(facility)
                                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold"
                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                    }`}
                            >
                                <span className="text-xs uppercase tracking-tight">{facility}</span>
                                {selectedFacilities.includes(facility) && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="pt-8 pb-10">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 text-lg font-bold uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98]"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin w-6 h-6" />
                                <span>Submitting Profile...</span>
                            </div>
                        ) : (
                            <span>Create Gym & Submit for Review</span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
