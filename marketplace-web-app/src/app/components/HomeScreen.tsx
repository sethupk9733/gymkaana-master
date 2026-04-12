import { Search, Dumbbell, Users, Award, TrendingUp, SlidersHorizontal, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VenueCard } from "./ui/VenueCard";
import { useEffect, useState, useMemo } from "react";
import { fetchGyms } from "../lib/api";
import { SEO } from "./SEO";

const SPECIALIZATIONS = [
  "Bodybuilding", "CrossFit", "Yoga", "Zumba", "MMA/Kickboxing",
  "Pilates", "Powerlifting", "Aerobics", "Calisthenics",
  "Swimming", "Cardio", "Strength Training"
];

export function HomeScreen({
  onGymClick,
  onProfile,
  initialDiscipline,
  onClearInitialDiscipline,
  initialSearch,
  onClearInitialSearch
}: {
  onGymClick: (gymId: any) => void;
  onProfile: () => void;
  initialDiscipline?: string | null;
  onClearInitialDiscipline?: () => void;
  initialSearch?: string | null;
  onClearInitialSearch?: () => void;
}) {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(15);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);

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

  useEffect(() => {
    if (initialDiscipline) {
      setSelectedDisciplines([initialDiscipline]);
      setTimeout(() => {
        const element = document.getElementById('featured-venues');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [initialDiscipline]);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
      setTimeout(() => {
        const element = document.getElementById('featured-venues');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [initialSearch]);

  const parseDistance = (location: string) => {
    const match = location.match(/(\d+(\.\d+)?)\s*km/);
    return match ? parseFloat(match[1]) : 0;
  };

  const filteredGyms = useMemo(() => {
    const results = gyms.filter(gym => {
      const distance = parseDistance(gym.location || "");
      const matchesSearch = gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistance = distance <= maxDistance;

      const gymSpecs = Array.isArray(gym.specializations) ? gym.specializations : [];
      const matchesDisciplines = selectedDisciplines.length === 0 ||
        selectedDisciplines.some(selected =>
          gymSpecs.some((spec: string) => spec.toLowerCase() === selected.toLowerCase())
        );

      return matchesSearch && matchesDistance && matchesDisciplines;
    });

    return results;
  }, [gyms, searchQuery, maxDistance, selectedDisciplines]);

  const nearbyGyms = useMemo(() => {
    if (filteredGyms.length > 0) return [];

    return gyms.filter(gym => {
      const distance = parseDistance(gym.location || "");
      const matchesDistance = distance <= maxDistance;
      const gymSpecs = Array.isArray(gym.specializations) ? gym.specializations : [];
      const matchesDisciplines = selectedDisciplines.length === 0 ||
        selectedDisciplines.some(selected =>
          gymSpecs.some((spec: string) => spec.toLowerCase() === selected.toLowerCase())
        );
      return matchesDistance && matchesDisciplines;
    }).slice(0, 6);
  }, [gyms, filteredGyms, maxDistance, selectedDisciplines]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full pb-12"
    >
      <SEO
        title="Find Top Gyms & Studios"
        description="Book memberships and classes at elite fitness venues near you. Your universal pass to the best gyms, yoga, and CrossFit studios."
      />
      {/* Hero Section */}
      <div className="mx-6 mt-8 mb-8 p-8 md:p-12 bg-white rounded-[40px] border border-gray-100 shadow-xl relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
        <div className="relative z-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl md:text-7xl font-black tracking-tighter text-gray-900 italic mb-4 leading-tight">ELEVATE YOUR <br /><span className="text-primary underline decoration-black decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-[12px]">LIFESTYLE</span></h1>
            <p className="text-[10px] md:text-base font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 mb-8 md:mb-12">Universal access to the finest fitness venues</p>
          </motion.div>

          {/* Integrated Search & Filter Experience */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 bg-white border-2 border-gray-100 rounded-3xl p-5 flex items-center gap-5 shadow-2xl group focus-within:border-black transition-all"
            >
              <Search className="w-6 h-6 text-gray-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gyms, yoga studios or areas..."
                className="flex-1 bg-transparent outline-none text-base font-black text-gray-900 placeholder:text-gray-300 placeholder:italic"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-8 rounded-3xl font-black uppercase tracking-widest text-sm border-2 transition-all ${showFilters ? 'bg-black text-white border-black shadow-lg shadow-black/20' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {showFilters ? 'Close Radius' : 'Radius Filter'}
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-900 rounded-[32px] p-8 shadow-2xl relative">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">Maximum Distance</h4>
                      <p className="text-2xl font-black text-primary italic">{maxDistance} KM RADIUS</p>
                    </div>
                    <div className="flex gap-2">
                      {[5, 10, 15, 25].map(d => (
                        <button
                          key={d}
                          onClick={() => setMaxDistance(d)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${maxDistance === d ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                          {d}KM
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                    title="Distance Radius Slider"
                  />
                  <div className="flex justify-between mt-4 text-[9px] font-black text-white/20 tracking-tighter uppercase">
                    <span>1 KM</span>
                    <span>50 KM (Anywhere in City)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-gray-100/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Browse Disciplines</h3>
              {selectedDisciplines.length > 0 && (
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">
                  {selectedDisciplines.length} Selected
                </span>
              )}
            </div>
            <div className="overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
              <div className="flex gap-2 min-w-max">
                {SPECIALIZATIONS.map((discipline, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedDisciplines(prev =>
                        prev.includes(discipline)
                          ? prev.filter(d => d !== discipline)
                          : [...prev, discipline]
                      );
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${selectedDisciplines.includes(discipline)
                      ? 'bg-black border-black text-white shadow-lg'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-black hover:text-black'
                      }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider">{discipline}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Dumbbell className="absolute -right-16 -bottom-16 w-80 h-80 text-gray-100/50 rotate-[-15deg] hidden lg:block" />
      </div>

      <div id="featured-venues" className="px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">
              {searchQuery || showFilters ? 'Search Intelligence' : 'Handpicked for You'}
            </h3>
            <p className="text-3xl font-black italic tracking-tight text-gray-900 uppercase">
              {searchQuery && filteredGyms.length === 0 ? 'Protocol Notification' : searchQuery || showFilters ? `Venues near you (${filteredGyms.length})` : 'Featured Venues'}
            </p>
          </div>
          {(searchQuery || showFilters || selectedDisciplines.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setShowFilters(false);
                setMaxDistance(15);
                setSelectedDisciplines([]);
                if (onClearInitialDiscipline) onClearInitialDiscipline();
                if (onClearInitialSearch) onClearInitialSearch();
              }}
              className="group flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
            >
              Clear Filters
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-12">
            {searchQuery && filteredGyms.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-black/5 rounded-[32px] border border-black/5"
              >
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                  The location <span className="text-primary italic">"{searchQuery}"</span> is currently outside our active operations.
                  However, our high-integrity venues in adjacent sectors are available below.
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(filteredGyms.length > 0 ? filteredGyms : nearbyGyms).map((gym, index) => (
                <motion.div
                  key={gym._id || gym.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  layout
                >
                  <VenueCard
                    gym={gym}
                    onClick={() => onGymClick(gym._id || gym.id)}
                  />
                </motion.div>
              ))}
            </div>

            {filteredGyms.length === 0 && nearbyGyms.length === 0 && (
              <div className="py-40 flex flex-col items-center justify-center text-center bg-gray-50 rounded-[48px] border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-8">
                  <Search className="w-10 h-10 text-gray-100" />
                </div>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">Zero Matches Found</h4>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Adjust your search or expand your distance radius </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
