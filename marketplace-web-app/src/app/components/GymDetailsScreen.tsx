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
      className="w-full pb-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 px-6 max-w-7xl mx-auto pt-8">

        {/* Left Column: Images (Sticky on Desktop) */}
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="mb-6 flex items-center gap-2">
              <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Explore
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="rounded-[32px] overflow-hidden shadow-sm border border-gray-100 bg-gray-50 aspect-[4/3] relative group"
            >
              <ImageCarousel images={gym.images} />
              <div className="absolute inset-0 pointer-events-none border-[6px] border-white/20 rounded-[32px] z-20" />
            </motion.div>

            {/* Description moved here for better desktop reading flow usually, or keep in right col? 
                    Let's put Description in the Left Column below images for better balance if right col has many details.
                */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm"
            >
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-gray-200"></span> About this Venue
              </h3>
              <p className="text-base leading-relaxed text-gray-600 font-medium">
                {gym.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic uppercase mb-4">{gym.name}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Star className="w-3 h-3 fill-current text-yellow-400 stroke-none" />
                <span>{gym.rating} / 5.0</span>
              </div>
              <span className="text-xs font-bold text-gray-400 px-3 py-1 bg-gray-100 rounded-full">{gym.reviews} Verified Reviews</span>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors block group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Location</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors underline decoration-dotted decoration-gray-400 underline-offset-2">
                {gym.location}
              </p>
            </a>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Open Hours</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight">06:00 AM - 10:00 PM</p>
            </div>
          </div>

          {/* Book Now Action Card */}
          <div className="p-8 bg-gray-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[60px] rounded-full group-hover:bg-primary/30 transition-all" />
            <div className="relative z-10">
              <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Ready to sweat?</h3>
              <p className="text-sm font-bold text-white/60 mb-8">Book a session or get a membership now.</p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBookNow("standard")}
                className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-lg"
              >
                Book Your Spot
              </motion.button>
            </div>
          </div>

          {/* Facilities */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Amenity Highlights</h3>
            <div className="grid grid-cols-2 gap-4">
              {facilities.map((facility: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-black transition-colors group bg-white">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                    <facility.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-600 group-hover:text-black">{facility.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
