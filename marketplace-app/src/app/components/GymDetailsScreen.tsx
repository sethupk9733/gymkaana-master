import { ArrowLeft, Star, MapPin, Clock, Dumbbell, Users, Bike, Droplets } from "lucide-react";
import { motion } from "motion/react";
import { ImageCarousel } from "./ui/ImageCarousel";
import { useEffect, useState } from "react";
import { fetchGymById } from "../lib/api";
import { LoadingSpinner } from "./ui/LoadingSpinner";

export function GymDetailsScreen({ gymId, onBack, onBookNow }: { gymId: string | null; onBack: () => void; onBookNow: (plan: string) => void }) {
  const [gym, setGym] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gymId) {
      fetchGymById(gymId)
        .then(data => {
          setGym(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [gymId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Map facilities icons if they come from backend (backend currently just has strings or is empty)
  // For now, we'll use a default set or map them
  const facilities = [
    { icon: Dumbbell, label: "Weights" },
    { icon: Users, label: "Trainers" },
    { icon: Bike, label: "Cardio" },
    { icon: Droplets, label: "Shower" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-white flex flex-col relative"
    >
      {/* Header */}
      <div className="relative shrink-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="h-72"
        >
          <ImageCarousel images={gym.images} />
        </motion.div>
        <button
          onClick={onBack}
          className="absolute top-6 left-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors z-20"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>

        <div className="absolute -bottom-1 left-0 right-0 h-10 bg-white rounded-t-[40px] z-10" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pt-0 pb-32">
          {/* Basic Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white border border-gray-100 p-2 rounded-2xl shadow-md">
                <img src={gym.logo} alt={gym.name} className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{gym.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{gym.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-400">{gym.reviews} Reviews</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Location</div>
                  <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors underline decoration-dotted decoration-gray-400 underline-offset-2">
                    {gym.location}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-50">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Timing</div>
                  <div className="text-sm font-bold text-gray-900">6:00 AM - 10:00 PM</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-6 bg-gray-900 text-white rounded-[32px] shadow-xl"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Description</h3>
            <p className="text-sm leading-relaxed text-white/80 font-medium">
              {gym.description}
            </p>
          </motion.div>

          {/* Facilities */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Facilities</h3>
            <div className="grid grid-cols-4 gap-3">
              {facilities.map((facility: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-2xl transition-all group"
                >
                  <div className="p-2 bg-white rounded-xl shadow-sm text-gray-900">
                    <facility.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider text-gray-500">{facility.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sticky Book Now Button - Using absolute positioning to guarantee visibility */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-30">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onBookNow("standard")}
          className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:bg-primary/90 transition-all"
        >
          Book Your Spot
        </motion.button>
      </div>
    </motion.div>
  );
}
