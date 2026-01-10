import { ArrowLeft, Upload, Clock, Check } from "lucide-react";
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
      <div className="px-6 py-6 space-y-6">
        {/* Photos */}
        <div>
          <h3 className="text-base mb-3">Photos</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square bg-gray-300 rounded-lg"></div>
            <div className="aspect-square bg-gray-300 rounded-lg"></div>
            <button className="aspect-square bg-white border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center gap-2">
              <Upload size={20} className="text-gray-400" />
              <span className="text-xs text-gray-500">Add</span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2 text-gray-600">Gym Name</label>
            <Input
              defaultValue="FitZone Gym"
              className="h-11 border-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-600">Description</label>
            <Textarea
              defaultValue="Premium fitness facility with state-of-the-art equipment and experienced trainers."
              rows={4}
              className="border-2 border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-600">Address</label>
            <Input
              defaultValue="Sector 18, Noida, Delhi NCR"
              className="h-11 border-2 border-gray-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-2 text-gray-600">Phone</label>
              <Input
                defaultValue="+91 98765 43210"
                className="h-11 border-2 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-600">Email</label>
              <Input
                defaultValue="fitzone@gym.com"
                className="h-11 border-2 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="text-base mb-3">Opening Hours</h3>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-600" />
                <span className="text-sm">Monday - Friday</span>
              </div>
              <span className="text-sm text-gray-600">6:00 AM - 10:00 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-600" />
                <span className="text-sm">Saturday - Sunday</span>
              </div>
              <span className="text-sm text-gray-600">7:00 AM - 9:00 PM</span>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="text-base mb-3">Select Facilities</h3>
          <div className="grid grid-cols-2 gap-3">
            {facilities.map((facility, index) => (
              <button
                key={index}
                className={`h-12 rounded-lg border-2 flex items-center justify-between px-4 ${
                  index < 4
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                <span className="text-sm">{facility}</span>
                {index < 4 && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-6 pt-4">
          <Button onClick={onBack} className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
