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
      className="w-full pb-20"
    >
      {/* Page Header & Search */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
            <div>
              <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </button>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">Explore Venues</h2>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-96 bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center gap-3 shadow-inner group focus-within:ring-2 focus-within:ring-black/5 transition-all">
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

          <div className="flex justify-between items-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{gyms.length} Premium Venues</p>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              Sort: <span className="text-primary border-b border-primary cursor-pointer hover:text-black transition-colors">Popularity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gym List */}
      <div className="px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

        {gyms.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold uppercase tracking-wider text-sm">No venues found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
