import { Search, Dumbbell, Users, Award, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { VenueCard } from "./ui/VenueCard";
import { useEffect, useState } from "react";
import { fetchGyms } from "../lib/api";

const categories = [
  { icon: Dumbbell, label: "Gym" },
  { icon: Users, label: "Yoga" },
  { icon: Award, label: "CrossFit" },
  { icon: TrendingUp, label: "Zumba" },
];

export function HomeScreen({ onGymClick, onProfile }: { onGymClick: (gymId: number) => void; onProfile: () => void }) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 italic">GYMKAANA</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">Elevate your workout</p>
          </motion.div>

          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onProfile}
            className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center border-4 border-white shadow-xl overflow-hidden"
            aria-label="View Profile"
          >
            <Users className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-inner group focus-within:ring-2 focus-within:ring-black/5 transition-all"
        >
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="Search for venues or activities..."
            className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        {/* Categories */}
        <div className="p-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Explore Categories</h3>
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 p-4 bg-white rounded-[24px] border border-gray-100 hover:border-black shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-black group-hover:text-white transition-all">
                  <category.icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 group-hover:text-black transition-colors">{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Gym Listings */}
        <div className="p-6 pt-0">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Featured Venues</h3>
              <p className="text-xs font-bold text-gray-900 mt-1">Popular near you</p>
            </div>
            <button className="text-[10px] font-black text-black uppercase tracking-wider border-b-2 border-primary mb-1">View All</button>
          </div>

          <div className="space-y-6 pb-10">
            {gyms.slice(0, 3).map((gym, index) => (
              <motion.div
                key={gym.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.5 }}
              >
                <VenueCard
                  gym={gym}
                  onClick={() => onGymClick(gym.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
