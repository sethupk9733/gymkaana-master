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
      className="w-full pb-12"
    >
      {/* Hero Section */}
      <div className="mx-6 mt-8 mb-8 p-8 md:p-12 bg-white rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 italic mb-2">ELEVATE YOUR <br /><span className="text-primary">LIFESTYLE</span></h1>
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">Discover premium fitness venues near you</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm group focus-within:ring-2 focus-within:ring-black/5 transition-all max-w-xl"
          >
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              placeholder="Search for venues, activities or locations..."
              className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
            />
          </motion.div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-gray-50 to-transparent hidden md:block" />
        <Dumbbell className="absolute -right-12 -bottom-12 w-64 h-64 text-gray-50 rotate-[-15deg] hidden md:block" />
      </div>

      {/* Content Container */}
      <div className="px-6 max-w-7xl mx-auto">
        {/* Categories */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 flex-1" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Explore by Category</h3>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                whileHover={{ y: -5, borderColor: '#000' }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-4 p-8 bg-white rounded-[24px] border border-gray-100 shadow-sm transition-all group"
              >
                <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                  <category.icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-gray-500 group-hover:text-black transition-colors">{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Featured Venues */}
        <div>
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Featured Collections</h3>
              <p className="text-2xl font-black italic tracking-tight text-gray-900">Popular Venues</p>
            </div>
            <button className="text-xs font-black text-black uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1 group">
              View All Venues
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
