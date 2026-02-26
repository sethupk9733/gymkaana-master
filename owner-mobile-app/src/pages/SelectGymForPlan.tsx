import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchGyms } from '../lib/api';

export default function SelectGymForPlan() {
    const navigate = useNavigate();
    const [gyms, setGyms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGyms()
            .then(data => {
                setGyms(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-4 text-center">Loading gyms...</div>;

    return (
        <div className="p-4 max-w-2xl mx-auto min-h-screen bg-gray-50 pb-20">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Select Gym</h1>
            </div>

            <p className="text-gray-500 mb-4 text-sm">Choose a gym to add a new membership plan.</p>

            <div className="space-y-3">
                {gyms.map((gym) => (
                    gym.status === 'Active' || gym.status === 'active' ? (
                        <button
                            key={gym._id}
                            onClick={() => navigate(`/plans/create?gymId=${gym._id}`)}
                            className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-primary/100 transition-all group"
                        >
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900 group-hover:text-secondary">{gym.name}</h3>
                                <p className="text-xs text-gray-500">{gym.location}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary/100" />
                        </button>
                    ) : null
                ))}
            </div>
        </div>
    );
}
