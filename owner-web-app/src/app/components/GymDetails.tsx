import { ArrowLeft, MapPin, Star, Phone, Mail, Clock, Edit, Dumbbell, Wifi, Droplets, User } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface GymDetailsProps {
  gymId: number;
  onBack: () => void;
  onEdit: () => void;
  onManagePlans: () => void;
}

export function GymDetails({ gymId, onBack, onEdit, onManagePlans }: GymDetailsProps) {
  const facilities = [
    { name: "Cardio Equipment", icon: Dumbbell },
    { name: "Free WiFi", icon: Wifi },
    { name: "Shower", icon: Droplets },
    { name: "Personal Trainer", icon: User },
  ];

  const plans = [
    { name: "Daily Pass", price: "₹150", duration: "1 Day" },
    { name: "Monthly", price: "₹2,500", duration: "30 Days" },
    { name: "Quarterly", price: "₹6,500", duration: "90 Days" },
  ];

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
      <div className="w-full h-48 bg-gray-300 border-b-2 border-gray-300"></div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Gym Info Block */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-xl mb-2">FitZone Gym</h1>
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin size={14} />
                <span className="text-sm">Sector 18, Noida, Delhi NCR</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <Star size={14} className="text-gray-600" />
                <span className="text-sm text-gray-600">4.5 (120 reviews)</span>
              </div>
            </div>
            <div className="px-3 py-1 bg-gray-900 text-white rounded text-xs">Active</div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Premium fitness facility with state-of-the-art equipment and experienced trainers. We
            offer a complete fitness solution for all your workout needs.
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={14} />
              <span>fitzone@gym.com</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={14} />
              <span>6:00 AM - 10:00 PM</span>
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
                  <p className="text-2xl mb-1">156</p>
                  <p className="text-xs text-gray-500">Active Members</p>
                </div>
                <div>
                  <p className="text-2xl mb-1">34</p>
                  <p className="text-xs text-gray-500">Today Check-ins</p>
                </div>
                <div>
                  <p className="text-2xl mb-1">₹45K</p>
                  <p className="text-xs text-gray-500">Monthly Revenue</p>
                </div>
                <div>
                  <p className="text-2xl mb-1">4.5</p>
                  <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-4">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="text-base mb-4">Available Facilities</h3>
              <div className="grid grid-cols-2 gap-3">
                {facilities.map((facility, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border-2 border-gray-300 rounded-lg">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <facility.icon size={18} className="text-gray-600" />
                    </div>
                    <span className="text-sm">{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="mt-4">
            <div className="space-y-3">
              {plans.map((plan, index) => (
                <div key={index} className="bg-white border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base mb-1">{plan.name}</h4>
                      <p className="text-xs text-gray-500">{plan.duration}</p>
                    </div>
                    <p className="text-xl">{plan.price}</p>
                  </div>
                </div>
              ))}
              <Button onClick={onManagePlans} variant="outline" className="w-full h-11 border-2 border-gray-300">
                Manage Plans
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-300 rounded-lg"></div>
              ))}
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
