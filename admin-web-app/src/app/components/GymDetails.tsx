import { ArrowLeft, MapPin, Star, Phone, Mail, Clock, Edit, Dumbbell, Wifi, Droplets, User, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { fetchGymById, fetchPlansByGym } from "../lib/api";
import { useEffect, useState } from "react";

interface GymDetailsProps {
  gymId: string;
  onBack: () => void;
  onEdit: () => void;
  onManagePlans: () => void;
}

export function GymDetails({ gymId, onBack, onEdit, onManagePlans }: GymDetailsProps) {
  const [gym, setGym] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchGymById(gymId),
      fetchPlansByGym(gymId)
    ])
      .then(([gymData, plansData]) => {
        setGym(gymData);
        setPlans(plansData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [gymId]);

  const facilities = [
    { name: "Cardio Equipment", icon: Dumbbell },
    { name: "Free WiFi", icon: Wifi },
    { name: "Shower", icon: Droplets },
    { name: "Personal Trainer", icon: User },
  ];

  if (loading || !gym) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading gym details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 mb-4">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      {/* Banner Image */}
      <div className="w-full h-48 bg-gray-300 border-b-2 border-gray-300 overflow-hidden">
        <img src={gym.images?.[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"} alt={gym.name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Gym Info Block */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-xl mb-2">{gym.name}</h1>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin size={14} />
                <span className="text-sm">{gym.location || gym.address}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Star size={14} className="text-gray-600" />
                <span className="text-sm text-gray-600">{gym.rating || 0} ({gym.reviews || 0} reviews)</span>
              </div>
            </div>
            <div className={`px-3 py-1 rounded text-xs ${gym.status === 'Active' ? 'bg-green-100 text-green-700' : gym.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-900 text-white'}`}>
              {gym.status || 'Active'}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            {gym.description || 'No description available'}
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span>{gym.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} />
              <span>{gym.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>{gym.timings || '6:00 AM - 10:00 PM'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-auto bg-white border-2 border-gray-300 p-1">
            <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="facilities" className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Facilities
            </TabsTrigger>
            <TabsTrigger value="plans" className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Plans
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-xs data-[state=active]:bg-gray-900 data-[state=active]:text-white">
              Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="text-base mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl mb-1">{gym.realMembers || 0}</p>
                  <p className="text-xs text-gray-500">Active Members</p>
                </div>
                <div>
                  <p className="text-2xl mb-1">{gym.realCheckins || 0}</p>
                  <p className="text-xs text-gray-500">Today Check-ins</p>
                </div>
                <div>
                  <p className="text-2xl mb-1">₹{(gym.realRevenue || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
                <div>
                  <p className="text-2xl mb-1">{gym.rating || 0}</p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-4">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="text-base mb-4">Available Facilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {(gym.facilities || []).map((facility: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Dumbbell size={18} className="text-gray-600" />
                    </div>
                    <span className="text-sm">{facility}</span>
                  </div>
                ))}
              </div>

              {gym.specializations && gym.specializations.length > 0 && (
                <div className="mt-6 pt-6 border-t-2 border-gray-100">
                  <h3 className="text-base mb-4 flex items-center gap-2">
                    <Shield size={16} className="text-blue-600" />
                    Specialized Disciplines
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gym.specializations.map((spec: string, index: number) => (
                      <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="plans" className="mt-4">
            <div className="space-y-3">
              {plans.length > 0 ? plans.map((plan, index) => (
                <div key={index} className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base mb-1">{plan.name}</h4>
                      <p className="text-xs text-gray-500">{plan.duration}</p>
                    </div>
                    <p className="text-xl">₹{plan.price}</p>
                  </div>
                </div>
              )) : (
                <div className="bg-white border-2 border-gray-300 rounded-lg p-4 text-center text-gray-500">
                  No plans available
                </div>
              )}
              <Button onClick={onManagePlans} variant="outline" className="w-full h-11 border-2 border-gray-300">
                Manage Plans
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {(gym.images || []).length > 0 ? gym.images.map((img: string, i: number) => (
                <div key={i} className="aspect-square bg-gray-300 rounded-lg overflow-hidden">
                  <img src={img} alt={`Gym photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              )) : (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-300 rounded-lg"></div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Button */}
        <Button onClick={onEdit} className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800">
          <Edit size={18} className="mr-2" />
          Edit Gym
        </Button>
      </div>
    </div>
  );
}
