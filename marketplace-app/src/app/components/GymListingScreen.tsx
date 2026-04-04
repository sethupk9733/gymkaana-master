import { ArrowLeft, Search, SlidersHorizontal, MapPin, Star, X, RotateCcw, Dumbbell, Users, Award, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VenueCard } from "./ui/VenueCard";
import { useEffect, useState, useMemo } from "react";
import { fetchGyms } from "../lib/api";

export function GymListingScreen({ onBack, onGymClick }: { onBack: () => void; onGymClick: (gymId: any) => void }) {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(20); // Default 20km for discovery
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);

  const SPECIALIZATIONS = [
    "Bodybuilding", "CrossFit", "Yoga", "Zumba", "MMA/Kickboxing",
    "Pilates", "Powerlifting", "Aerobics"
  ];

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

  const parseDistance = (location: string) => {
    const match = location.match(/(\d+(\.\d+)?)\s*km/);
    return match ? parseFloat(match[1]) : 0;
  };

  const filteredGyms = useMemo(() => {
    return gyms.filter(gym => {
      const distance = parseDistance(gym.location || "");
      const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistance = distance <= maxDistance;

      const matchesDisciplines = selectedDisciplines.length === 0 ||
        (gym.specializations && selectedDisciplines.some(d => gym.specializations.includes(d)));

      return matchesSearch && matchesDistance && matchesDisciplines;
    });
  }, [gyms, searchQuery, maxDistance, selectedDisciplines]);

  const resetFilters = () => {
    setSearchQuery("");
    setMaxDistance(20);
    setShowFilters(false);
    setSelectedDisciplines([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">Explore Venues</h2>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-1">Universal Catalogue</p>
            </div>
          </div>
          {(searchQuery || maxDistance !== 20 || selectedDisciplines.length > 0) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetFilters}
              className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-inner group focus-within:ring-2 focus-within:ring-black/5 focus-within:border-black transition-all">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or area..."
              className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${showFilters ? 'bg-black border-black text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
            title="Toggle Distance Filter"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Distance Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-900 rounded-[32px] p-6 shadow-xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[40px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Distance Radius</h3>
                    <div className="flex gap-1.5">
                      {[5, 10, 20, 50].map(d => (
                        <button
                          key={d}
                          onClick={() => setMaxDistance(d)}
                          className={`px-3 py-1.5 rounded-lg text-[8px] font-black transition-all ${maxDistance === d ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                          {d}KM
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                    title="Distance Radius Slider"
                  />
                  <div className="flex justify-between mt-3 text-[8px] font-black text-white/20 uppercase tracking-widest">
                    <span className={maxDistance <= 5 ? 'text-primary' : ''}>1 KM</span>
                    <span className="text-primary italic font-black">{maxDistance} KM RADIUS</span>
                    <span className={maxDistance >= 45 ? 'text-primary' : ''}>50 KM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gym List */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">
        {/* Specialized Disciplines Filter */}
        <div className="px-6 py-6 border-b border-gray-100 bg-white">
          <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Filter by Discipline</h3>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
            {SPECIALIZATIONS.map((spec, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDisciplines(prev =>
                    prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
                  );
                }}
                className={`px-4 py-2.5 rounded-xl border-2 transition-all min-w-max ${selectedDisciplines.includes(spec) ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-blue-600 hover:text-blue-600'}`}
              >
                <span className="text-[9px] font-black uppercase tracking-widest">{spec}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              {filteredGyms.length} {filteredGyms.length === 1 ? 'Venue' : 'Venues'} Identified
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-wider">
              Sort: <span className="text-primary border-b-2 border-primary/30 pb-0.5">Distance</span>
            </div>
          </div>

          <div className="space-y-8 pb-20">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-black/10 border-t-primary rounded-full animate-spin" />
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Scanning Portfolio...</p>
              </div>
            ) : filteredGyms.length > 0 ? (
              filteredGyms.map((gym, index) => (
                <motion.div
                  key={gym._id || gym.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                  layout
                >
                  <VenueCard
                    gym={gym}
                    onClick={() => onGymClick(gym._id || gym.id)}
                  />
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Search className="w-8 h-8 text-gray-100" />
                </div>
                <h4 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">Zero Matches</h4>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-12 leading-relaxed">Adjust your distance radius or search query to see more results</p>
                {!searchQuery && !showFilters && (
                  <button
                    onClick={() => (window as any).setCurrentScreen("listing")}
                    className="text-[10px] font-black text-black uppercase tracking-wider border-b-2 border-primary mb-1 active:opacity-50 transition-opacity"
                  >
                    View All
                  </button>
                )}
                <button
                  onClick={resetFilters}
                  className="mt-8 text-[10px] font-black text-primary uppercase border-b-2 border-primary pb-1"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
