import { MapPin, Star, Plus, ChevronRight, Users, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";

// ... (props interface)
interface GymsListProps {
  onGymSelect: (gymId: number) => void;
  onAddGym: () => void;
}

export function GymsList({ onGymSelect, onAddGym }: GymsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const gyms = [
    // ... (existing gyms data)
    {
      id: 1,
      name: "Main Branch",
      address: "Indiranagar, Bangalore",
      location: "Indiranagar, Bangalore",
      rating: 4.8,
      status: "Active",
      members: 450,
    },
    {
      id: 2,
      name: "Downtown Gym",
      address: "Koramangala, Bangalore",
      location: "Koramangala, Bangalore",
      rating: 4.5,
      status: "Active",
      members: 320,
    },
    {
      id: 3,
      name: "Muscle Blaze",
      address: "HSR Layout, Bangalore",
      location: "HSR Layout, Bangalore",
      rating: 4.2,
      status: "Inactive",
      members: 150,
    },
    {
      id: 4,
      name: "Iron Pumpers",
      address: "Whitefield, Bangalore",
      location: "Whitefield, Bangalore",
      rating: 4.6,
      status: "Active",
      members: 280,
    }
  ];

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gym.location.toLowerCase().includes(searchQuery.toLowerCase())
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
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Gym</span>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search gyms by name or location..."
              className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 max-w-6xl mx-auto">
        {filteredGyms.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
            <p>No gyms found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGyms.map((gym) => (
              <div
                key={gym.id}
                onClick={() => onGymSelect(gym.id)}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{gym.name}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="truncate">{gym.address || gym.location}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${gym.status === 'active' || gym.status === 'Active'
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}>
                    {gym.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                  <div className="flex gap-4">
                    <div className="flex items-center text-sm text-gray-600" title="Total Members">
                      <Users className="w-4 h-4 mr-1.5 text-blue-500" />
                      <span className="font-semibold">{gym.members}</span>
                    </div>
                    {(gym.status === 'active' || gym.status === 'Active') && (
                      <div className="flex items-center text-sm text-gray-600" title="Rating">
                        <Star className="w-4 h-4 mr-1.5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{gym.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-1.5 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
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
