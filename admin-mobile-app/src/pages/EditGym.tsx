import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Building2, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_GYMS } from '../lib/api';

export default function EditGym() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const gym = MOCK_GYMS.find(g => g.id === Number(id));
        if (gym) {
            setName(gym.name);
            setLocation(gym.location);
            // MOCK_GYMS doesn't have description yet, but we can simulate it or leave empty
            setDescription('One of the best gums in the city.');
        } else {
            // Handle not found
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate(-1); // Go back to details
        }, 1500);
    };

    if (!id) return <div>Invalid Gym ID</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Edit Gym Details</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Details</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gym Name</label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="e.g. Golds Gym"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location / Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Enter full address"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Tell us about your gym..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Info</h2>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="gym@example.com" />
                        </div>
                    </div>

                    {/* Amenities */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['WiFi', 'AC', 'Showers', 'Lockers', 'Cardio', 'Weights', 'Parking'].map(amenity => (
                                <label key={amenity} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Trainer List */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trainer List (Comma separated)</label>
                        <textarea rows={2} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Rahul Dev, Sanjana M..." defaultValue="Rahul Dev, Sanjana M"></textarea>
                    </div>

                    {/* Map Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Map Location (Coordinates or Link)</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input type="text" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="e.g. 12.9716, 77.5946" defaultValue="12.9716, 77.5946" />
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Open (e.g. 6:00 AM)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="6:00 AM" />
                            <input type="text" placeholder="Close (e.g. 10:00 PM)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" defaultValue="10:00 PM" />
                        </div>
                    </div>
                </div>

                {/* Photos Placeholder */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gym Photos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <span className="text-sm">Click to upload new photos</span>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all",
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full mt-3 text-gray-600 font-medium py-3 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
