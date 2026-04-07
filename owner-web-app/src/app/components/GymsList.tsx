import { MapPin, Star, Plus, ChevronRight, Users, Search } from "lucide-react";
import { Input } from "./ui/input";
import { fetchGyms } from "../lib/api";
import { useEffect, useState } from "react";

interface GymsListProps {
  onGymSelect: (gymId: any) => void;
  onAddGym: () => void;
}

export function GymsList({ onGymSelect, onAddGym }: GymsListProps) {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchGyms().then(data => {
      setGyms(data);
      setLoading(false);
    });
  }, []);

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (gym.location || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Gyms</h1>
              <p className="text-gray-500 text-sm mt-1">Manage your gym listings</p>
            </div>
            <button
              onClick={onAddGym}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Venue</span>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 font-black" />
            <Input
              placeholder="Search by venue name or city..."
              className="pl-12 h-12 bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all rounded-xl font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-6xl mx-auto">
        {filteredGyms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-gray-900 italic">No Matching Venues</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {filteredGyms.map((gym) => (
              <div
                key={gym._id || gym.id}
                onClick={() => onGymSelect(gym._id || gym.id)}
                className="bg-white p-6 rounded-[32px] border-2 border-gray-100 hover:border-black shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col h-full overflow-hidden relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-blue-600 transition-colors">{gym.name}</h3>
                    <div className="flex items-center text-gray-400 text-xs font-bold mt-2 uppercase tracking-wide">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                      <span className="truncate">{gym.location}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border ${(gym.status === 'Active' || gym.status === 'Approved')
                      ? "bg-green-500 text-white border-green-500"
                      : (gym.status === 'Pending' || gym.status === 'pending')
                        ? "bg-orange-500 text-white border-orange-500 animate-pulse"
                        : "bg-red-500 text-white border-red-500"
                    }`}>
                    {gym.status === 'pending' ? 'Under Review' : gym.status}
                  </span>
                </div>

                <div className="flex-1 mb-6">
                  <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">
                    {gym.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                  <div className="flex gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Members</span>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-black text-gray-900">{gym.members}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Rating</span>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-black text-gray-900">{gym.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-black transition-all group-hover:shadow-lg shadow-black/20">
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
