import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Building2, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AddGym() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate('/gyms');
        }, 1500);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Add New Gym</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gym Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input type="text" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 focus:border-transparent outline-none" placeholder="e.g. Golds Gym" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input type="text" required className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 focus:border-transparent outline-none" placeholder="Enter full address" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 focus:border-transparent outline-none" placeholder="Tell us about your gym..."></textarea>
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Gym Details</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none" placeholder="e.g. 6:00 AM" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 outline-none" placeholder="e.g. 10:00 PM" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['WiFi', 'AC', 'Showers', 'Lockers', 'Cardio', 'Weights', 'Parking', 'Personal Training', 'Swimming Pool', 'Steam Room'].map(facility => (
                                <label key={facility} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary/100" />
                                    <span className="text-sm text-gray-700">{facility}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trainer List (Comma separated)</label>
                        <textarea rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 focus:border-transparent outline-none" placeholder="Rahul Dev, Sanjana M..."></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Map Location (Coordinates or Link)</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input type="text" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/100 focus:border-transparent outline-none" placeholder="e.g. 12.9716, 77.5946" />
                        </div>
                    </div>
                </div>

                {/* Photos Placeholder */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gym Photos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <span className="text-sm">Click to upload photos</span>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-md hover:bg-secondary transition-all",
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {loading ? 'Submitting...' : 'Submit for Review'}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-3">
                        New gyms are set to "Pending Review" until approved.
                    </p>
                </div>
            </form>
        </div>
    );
}
