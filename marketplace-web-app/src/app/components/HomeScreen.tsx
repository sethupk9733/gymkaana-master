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

  const HERO_CONTENT = useMemo(() => [
    {
      heading: <>FUEL THE <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-8 underline-offset-[12px]">PASSION.</span></>,
      subline: "Universal access to the city's finest fitness venues"
    },
    {
      heading: <>LEVEL UP <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-8 underline-offset-[12px]">YOUR GAME.</span></>,
      subline: "Direct access to elite training grounds near you"
    },
    {
      heading: <>UNLEASH THE <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-8 underline-offset-[12px]">BEAST.</span></>,
      subline: "Your universal ticket to premium fitness hubs"
    },
    {
      heading: <>MASTER YOUR <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-8 underline-offset-[12px]">CRAFT.</span></>,
      subline: "Discover top-tier yoga, crossfit & MMA studios"
    },
    {
      heading: <>DOMINATE THE <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-8 underline-offset-[12px]">DAY.</span></>,
      subline: "Elite gym access at your fingertips, anytime"
    }
  ], []);

  const [activeHero, setActiveHero] = useState(HERO_CONTENT[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * HERO_CONTENT.length);
    setActiveHero(HERO_CONTENT[randomIndex]);
  }, [HERO_CONTENT]);

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
      {/* Hyper-Attractive Hero Section */}
      <div className="mx-6 mt-8 mb-8 p-8 md:p-12 rounded-[40px] border border-secondary shadow-[0_32px_64px_-16px_rgba(30,41,59,0.4)] relative overflow-hidden bg-secondary">
        {/* Dynamic Glow Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -ml-32 -mb-32" />

        <div className="relative z-10">
          <motion.div
            key={activeHero.subline}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter text-white italic mb-4 leading-none">
              {activeHero.heading}
            </h1>
            <p className="text-xs md:text-lg font-bold uppercase tracking-[0.4em] text-white/40 mb-12">
              {activeHero.subline}
            </p>
          </motion.div>

          {/* Elevated Search Experience */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl relative">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[28px] p-5 flex items-center gap-5 shadow-2xl group focus-within:bg-white/20 transition-all"
            >
              <Search className="w-6 h-6 text-white group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search venues, yoga or areas..."
                className="flex-1 bg-transparent outline-none text-base font-black text-white placeholder:text-white/30 placeholder:italic"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-8 rounded-[28px] font-black uppercase tracking-widest text-sm transition-all shadow-xl ${showFilters ? 'bg-primary text-secondary' : 'bg-white text-secondary hover:bg-primary'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {showFilters ? 'Radius' : 'Radius'}
            </motion.button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-border/60">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Search Radius</h4>
                      <p className="text-xl font-black text-secondary italic uppercase tracking-tighter">{maxDistance} KM</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[5, 10, 15, 25, 50].map(d => (
                        <button
                          key={d}
                          onClick={() => setMaxDistance(d)}
                          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${maxDistance === d ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-muted border-border/40 text-muted-foreground hover:border-secondary hover:text-secondary'}`}
                        >
                          {d} KM
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative h-1.5 w-full bg-slate-100 rounded-full">
                    <motion.div
                      className="absolute h-full bg-primary rounded-full transition-all duration-300"
                      initial={false}
                      animate={{ width: `${Math.min((maxDistance / 50) * 100, 100)}%` }}
                    />
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Distance Radius Slider"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-border/60">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Specialized Disciplines</h3>
              {selectedDisciplines.length > 0 && (
                <button
                  onClick={() => setSelectedDisciplines([])}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Clear All ({selectedDisciplines.length})
                </button>
              )}
            </div>
            <div className="overflow-x-auto pb-4 -mx-2 px-2 no-scrollbar">
              <div className="flex gap-2.5 min-w-max">
                {SPECIALIZATIONS.map((discipline, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedDisciplines(prev =>
                        prev.includes(discipline)
                          ? prev.filter(d => d !== discipline)
                          : [...prev, discipline]
                      );
                    }}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full border-2 transition-all ${selectedDisciplines.includes(discipline)
                      ? 'bg-secondary border-secondary text-white shadow-xl'
                      : 'bg-white border-border/80 text-muted-foreground hover:border-secondary hover:text-secondary'
                      }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-[0.1em]">{discipline}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="featured-venues" className="px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">
              {searchQuery || showFilters ? 'Search Intelligence' : 'Handpicked for You'}
            </h3>
            <p className="text-3xl font-black italic tracking-tight text-foreground uppercase">
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
