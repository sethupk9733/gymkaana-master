import { ArrowLeft, Upload, Clock, Check, X, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface EditGymProps {
  onBack: () => void;
}

export function EditGym({ onBack }: EditGymProps) {
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

  const photos = [1, 2]; // Mock existing photos

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700">
          <ArrowLeft size={20} />
          <span>Edit Gym</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Photos */}
        <div>
          <h3 className="text-base mb-3 font-medium">Photos</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((_, index) => (
              <div key={index} className="relative aspect-square bg-gray-300 rounded-lg group">
                {/* Delete Button */}
                <button className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors" title="Delete Photo">
                  <X size={14} />
                </button>
              </div>
            ))}

            <button className="aspect-square bg-white border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <Upload size={20} className="text-gray-400" />
              <span className="text-xs text-gray-500">Add Photo</span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-700 font-medium">Gym Name</label>
            <Input
              defaultValue="FitZone Gym"
              className="h-11 border-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 font-medium">Description</label>
            <Textarea
              defaultValue="Premium fitness facility with state-of-the-art equipment and experienced trainers."
              rows={4}
              className="border-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 font-medium">Address</label>
            <Input
              defaultValue="Sector 18, Noida, Delhi NCR"
              className="h-11 border-2 border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-medium">Phone</label>
              <Input
                defaultValue="+91 98765 43210"
                className="h-11 border-2 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-medium">Email</label>
              <Input
                defaultValue="fitzone@gym.com"
                className="h-11 border-2 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div>
          <h3 className="text-base mb-3 font-medium">Location Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-medium">City</label>
              <Input defaultValue="New York" className="h-11 border-2 border-gray-300" />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-medium">Zip Code</label>
              <Input defaultValue="10001" className="h-11 border-2 border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-gray-700 font-medium">Landmark</label>
              <Input defaultValue="Near Central Park" className="h-11 border-2 border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-gray-700 font-medium">Google Maps Link</label>
              <Input defaultValue="https://maps.google.com/..." className="h-11 border-2 border-gray-300" />
            </div>
          </div>
        </div>

        {/* Trainer Details */}
        <div>
          <h3 className="text-base mb-3 font-medium">Trainer Details</h3>
          <div className="space-y-4 border-2 border-gray-200 rounded-lg p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-700 font-medium">Head Trainer Name</label>
                <Input defaultValue="John Doe" className="h-11 border-2 border-gray-300" />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-700 font-medium">Experience (Years)</label>
                <Input defaultValue="5" type="number" className="h-11 border-2 border-gray-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-700 font-medium">Specializations</label>
              <Input defaultValue="Weight Loss, Muscle Building" className="h-11 border-2 border-gray-300" />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="text-base mb-3 font-medium">Opening Hours</h3>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Weekdays</label>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <Input defaultValue="6:00 AM - 10:00 PM" className="h-10" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Weekends</label>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" />
                  <Input defaultValue="7:00 AM - 9:00 PM" className="h-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-base mb-3 font-medium">Select Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {facilities.map((facility, index) => (
              <button
                key={index}
                className={`h-12 rounded-lg border-2 flex items-center justify-between px-4 transition-colors ${index < 4
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
              >
                <span className="text-sm">{facility}</span>
                {index < 4 && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <Button onClick={onBack} className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 text-lg font-medium">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
