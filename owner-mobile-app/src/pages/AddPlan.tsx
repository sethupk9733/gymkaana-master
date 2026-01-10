import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Clock, FileText } from 'lucide-react';
import { MOCK_GYMS } from '../lib/api';
import { cn } from '../lib/utils';

export default function AddPlan() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const gymId = searchParams.get('gymId');
    const gym = MOCK_GYMS.find(g => g.id === Number(gymId));

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            setLoading(false);
            navigate(`/gyms/${gymId}`); // Return to Gym Details context
        }, 1500);
    };

    if (!gym) return <div className="p-10 text-center">Invalid Gym ID</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto min-h-screen bg-gray-50 pb-20">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Create Plan</h1>
                    <p className="text-xs text-gray-500">for {gym.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-blue-50/30"
                        placeholder="e.g. Gold Membership"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                required
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="2500"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <select id="duration" className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option>Daily</option>
                                <option>Weekly (5 days)</option>
                                <option>Weekend (Sat-Sun)</option>
                                <option>1 Month</option>
                                <option>3 Months</option>
                                <option>6 Months</option>
                                <option>1 Year</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <textarea
                            rows={3}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            placeholder="Includes access to all equipment..."
                        ></textarea>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                        "w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all mt-4",
                        loading && "opacity-70"
                    )}
                >
                    {loading ? 'Creating Plan...' : 'Create Plan'}
                </button>

            </form>
        </div>
    );
}
