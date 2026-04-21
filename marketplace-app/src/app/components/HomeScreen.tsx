import { Search, Dumbbell, Users, Award, TrendingUp, MapPin, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VenueCard } from "./ui/VenueCard";
import { useEffect, useState, useMemo } from "react";
import { fetchGyms } from "../lib/api";

const SPECIALIZATIONS = [
  "Bodybuilding", "CrossFit", "Yoga", "Zumba", "MMA/Kickboxing",
  "Pilates", "Powerlifting", "Aerobics", "Calisthenics",
  "Swimming", "Cardio", "Strength Training"
];

export function HomeScreen({ onGymClick, onProfile, onExplore }: { onGymClick: (gymId: any) => void; onProfile: () => void; onExplore: () => void }) {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km radius
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation skipped or failed', err),
        { timeout: 10000, maximumAge: 60000 }
      );
    }
  }, []);

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

  const getDistance = (gym: any) => {
    if (userLocation && gym.coordinates && gym.coordinates.lat && gym.coordinates.lng) {
      const R = 6371; // km
      const dLat = (gym.coordinates.lat - userLocation.lat) * Math.PI / 180;
      const dLon = (gym.coordinates.lng - userLocation.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(gym.coordinates.lat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }
    const match = (gym.location || "").match(/(\d+(\.\d+)?)\s*km/);
    return match ? parseFloat(match[1]) : 0;
  };

  const filteredGyms = useMemo(() => {
    return gyms.filter(gym => {
      const distance = getDistance(gym);
      const name = gym.name || "";
      const location = gym.location || "";
      const search = (searchQuery || "").toLowerCase();
      const matchesSearch = name.toLowerCase().includes(search) ||
        location.toLowerCase().includes(search);
      const matchesDistance = distance <= maxDistance;

      const gymSpecs = Array.isArray(gym.specializations) ? gym.specializations : [];
      const matchesDisciplines = selectedDisciplines.length === 0 ||
        selectedDisciplines.some(selected =>
          gymSpecs.some((spec: string) => spec.toLowerCase() === selected.toLowerCase())
        );

      return matchesSearch && matchesDistance && matchesDisciplines;
    });
  }, [gyms, searchQuery, maxDistance, selectedDisciplines]);

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
        <div className="flex gap-3">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-inner group focus-within:ring-2 focus-within:ring-black/5 transition-all"
          >
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for venues or activities..."
              className="flex-1 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
              title="Search venues"
            />
          </motion.div>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${showFilters ? 'bg-black border-black text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-black hover:text-black shadow-sm'}`}
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
              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-900 rounded-[32px] p-6 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[40px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Distance Radius</h3>
                    <div className="flex gap-2">
                      {[5, 10, 25, 50].map(d => (
                        <button
                          key={d}
                          onClick={() => setMaxDistance(d)}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all ${maxDistance === d ? 'bg-primary text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
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
                  <div className="flex justify-between mt-4">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">1 KM</span>
                    <span className="text-primary text-[10px] font-black italic">{maxDistance} KM RADIUS</span>
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">50 KM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Specialized Disciplines Filter */}
        <div className="px-6 pb-6 bg-white border-b border-gray-100">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Browse Disciplines</h3>
          <div className="overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
            <div className="flex gap-3 min-w-max">
              {SPECIALIZATIONS.map((discipline, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {discipline}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30">


        {/* Gym Listings */}
        <div className="p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                {searchQuery || showFilters ? 'Search Results' : 'Featured Venues'}
              </h3>
              <p className="text-xs font-bold text-gray-900 mt-1">
                {filteredGyms.length} {filteredGyms.length === 1 ? 'venue' : 'venues'} found {showFilters && `within ${maxDistance}km`}
              </p>
            </div>
            {!searchQuery && !showFilters && (
              <button
                onClick={onExplore}
                className="text-[10px] font-black text-black uppercase tracking-wider border-b-2 border-primary mb-1 active:opacity-50 transition-opacity"
              >
                View All
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" />
            </div>
          ) : filteredGyms.length > 0 ? (
            <div className="space-y-6 pb-10">
              {filteredGyms.map((gym, index) => (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-[32px] flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h4 className="text-lg font-black italic uppercase tracking-tight text-gray-900 mb-2">No Venues Found</h4>
              <p className="text-xs font-medium text-gray-400 leading-relaxed uppercase tracking-wide">Try adjusting your search or increasing the distance radius.</p>
              {(searchQuery || maxDistance !== 10 || selectedDisciplines.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setMaxDistance(10);
                    setSelectedDisciplines([]);
                  }}
                  className="mt-8 text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b-2 border-primary pb-1"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
