import { ArrowLeft, Search, SlidersHorizontal, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { VenueCard } from "./ui/VenueCard";
import { useEffect, useState } from "react";
import { fetchGyms } from "../lib/api";

export function GymListingScreen({ onBack, onGymClick }: { onBack: () => void; onGymClick: (gymId: number) => void }) {
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
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black uppercase italic tracking-tight">Explore Venues</h2>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center gap-3 shadow-inner group focus-within:ring-2 focus-within:ring-black/5 transition-all">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Search by name or category..."
              className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-3 hover:bg-black hover:text-white transition-all shadow-sm"
            aria-label="Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Gym List */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{gyms.length} Premium Venues</p>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
            Sort: <span className="text-primary border-b border-primary">Popularity</span>
          </div>
        </div>

        <div className="space-y-8 pb-20">
          {gyms.map((gym, index) => (
            <motion.div
              key={gym.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * index }}
            >
              <VenueCard
                gym={gym}
                onClick={() => onGymClick(gym.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
