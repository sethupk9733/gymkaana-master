import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, ChevronRight, Star, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { fetchGyms } from '../lib/api';

export default function Gyms() {
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

    if (loading) {
        return <div className="p-4 text-center">Loading gyms...</div>;
    }

    return (
        <div className="p-4 space-y-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">My Gyms</h1>
                <button
                    onClick={() => navigate('/gyms/add')}
                    className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Gym
                </button>
            </div>

            <div className="grid gap-4">
                {gyms.map((gym: any) => (
                    <div
                        key={gym._id || gym.id}
                        onClick={() => navigate(`/gyms/${gym._id}`)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 active:scale-[0.99] transition-transform cursor-pointer"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-bold text-gray-900">{gym.name}</h3>
                                <div className="flex items-center text-gray-500 text-sm mt-1">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {gym.address || gym.location}
                                </div>
                            </div>
                            <span className={cn(
                                "px-2 py-1 text-xs font-semibold rounded-full capitalize",
                                gym.status === 'active' || gym.status === 'Active' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            )}>
                                {gym.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-1">
                            <div className="flex gap-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Users className="w-4 h-4 mr-1.5 text-primary/100" />
                                    <span className="font-semibold">{gym.members}</span>
                                    <span className="text-xs ml-1 text-gray-400">Members</span>
                                </div>
                                {gym.status === 'Active' && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Star className="w-4 h-4 mr-1.5 text-yellow-500" />
                                        <span className="font-semibold">{gym.rating}</span>
                                    </div>
                                )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
