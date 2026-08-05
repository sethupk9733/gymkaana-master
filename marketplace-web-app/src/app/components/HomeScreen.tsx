import { Search, Dumbbell, Users, Award, TrendingUp, SlidersHorizontal, ArrowRight, X, Calculator, Flame, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VenueCard } from "./ui/VenueCard";
import { useEffect, useState, useMemo, useRef } from "react";
import { fetchGyms } from "../lib/api";
import { SEO } from "./SEO";
import { ChallengeBanner } from "./ChallengeBanner";
import { getSmartLocationSuggestions, SuggestionItem } from "../lib/locationSuggestions";

const SPECIALIZATIONS = [
  "Bodybuilding", "CrossFit", "Yoga", "Zumba", "MMA/Kickboxing",
  "Pilates", "Powerlifting", "Aerobics", "Calisthenics",
  "Swimming", "Cardio", "Strength Training"
];

export function HomeScreen({
  onGymClick,
  onProfile,
  onBMIClick,
  initialDiscipline,
  onClearInitialDiscipline,
  initialSearch,
  onClearInitialSearch,
  onChallengeDashboard,
  onLeaderboard,
  onDailyPassport
}: {
  onGymClick: (gymId: any) => void;
  onProfile: () => void;
  onBMIClick: () => void;
  initialDiscipline?: string | null;
  onClearInitialDiscipline?: () => void;
  initialSearch?: string | null;
  onClearInitialSearch?: () => void;
  onChallengeDashboard?: () => void;
  onLeaderboard?: () => void;
  onDailyPassport?: () => void;
}) {
  const [gyms, setGyms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [showOnlyElite, setShowOnlyElite] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(15);
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
      heading: <>FUEL THE <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-[12px]">PASSION.</span></>,
      subline: "Universal access to the city's finest fitness venues"
    },
    {
      heading: <>LEVEL UP <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-[12px]">YOUR GAME.</span></>,
      subline: "Direct access to elite training grounds near you"
    },
    {
      heading: <>UNLEASH THE <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-[12px]">BEAST.</span></>,
      subline: "Your universal ticket to premium fitness hubs"
    },
    {
      heading: <>MASTER YOUR <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-[12px]">CRAFT.</span></>,
      subline: "Discover top-tier yoga, crossfit & MMA studios"
    },
    {
      heading: <>DOMINATE THE <br /><span className="text-secondary-foreground opacity-90 underline decoration-primary decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-[12px]">DAY.</span></>,
      subline: "Elite gym access at your fingertips, anytime"
    }
  ], []);

  const [activeHero, setActiveHero] = useState(HERO_CONTENT[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * HERO_CONTENT.length);
    setActiveHero(HERO_CONTENT[randomIndex]);
  }, [HERO_CONTENT]);

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

  const smartSuggestions = useMemo(() => {
    return getSmartLocationSuggestions(searchQuery, gyms);
  }, [searchQuery, gyms]);

  const filteredGyms = useMemo(() => {
    const results = gyms.filter(gym => {
      const distance = getDistance(gym);
      const name = gym.name || "";
      const location = gym.location || "";
      const address = gym.address || "";
      const city = gym.city || "";
      const state = gym.state || "";
      const area = gym.area || "";

      const search = (searchQuery || "").toLowerCase();
      const matchesSearch = !search ||
        name.toLowerCase().includes(search) ||
        location.toLowerCase().includes(search) ||
        address.toLowerCase().includes(search) ||
        city.toLowerCase().includes(search) ||
        state.toLowerCase().includes(search) ||
        area.toLowerCase().includes(search);
      const matchesDistance = distance <= maxDistance;

      const gymSpecs = Array.isArray(gym.specializations) ? gym.specializations : [];
      const matchesDisciplines = selectedDisciplines.length === 0 ||
        selectedDisciplines.some(selected =>
          gymSpecs.some((spec: string) => spec.toLowerCase() === selected.toLowerCase())
        );

      const isEliteMatch = showOnlyElite ? gym.isPremium : true;
      return matchesSearch && matchesDistance && matchesDisciplines && isEliteMatch;
    });

    return results;
  }, [gyms, searchQuery, maxDistance, selectedDisciplines, showOnlyElite]);

  const nearbyGyms = useMemo(() => {
    return gyms.filter(gym => {
      const distance = getDistance(gym);
      const matchesDistance = distance <= maxDistance;
      const gymSpecs = Array.isArray(gym.specializations) ? gym.specializations : [];
      const matchesDisciplines = selectedDisciplines.length === 0 ||
        selectedDisciplines.some(selected =>
          gymSpecs.some((spec: string) => spec.toLowerCase() === selected.toLowerCase())
        );
      const isEliteMatch = showOnlyElite ? gym.isPremium : true;
      return matchesDistance && matchesDisciplines && isEliteMatch;
    }).slice(0, 12);
  }, [gyms, maxDistance, selectedDisciplines, showOnlyElite]);

  const premiumGyms = useMemo(() => {
    return gyms.filter(gym => gym.isPremium);
  }, [gyms]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full pb-12"
    >
      <SEO
        title="Find Top Gyms & Fitness Studios Near You"
        description="Book gym memberships, yoga studios, CrossFit, MMA and fitness classes near you. India's premier fitness marketplace — Gymkaana. One universal pass to elite venues."
        keywords="gym near me, book gym online India, yoga studio near me, CrossFit Chennai, fitness classes near me, gym membership India, MMA studio, day pass gym, Gymkaana"
        canonical="https://gymkaana.com"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://gymkaana.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Find Gyms Near You",
                "item": "https://gymkaana.com?screen=home"
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I find a gym near me on Gymkaana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Open Gymkaana and allow location access. The app automatically shows elite gyms, yoga studios and fitness centres within your selected radius. Use filters to narrow by discipline."
                }
              },
              {
                "@type": "Question",
                "name": "What is Gymkaana's Daily Passport?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Gymkaana's Daily Passport is a day-pass feature that lets you access any partner fitness venue for a single day without committing to a monthly membership."
                }
              },
              {
                "@type": "Question",
                "name": "Which fitness disciplines are available on Gymkaana?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Gymkaana lists venues for Bodybuilding, CrossFit, Yoga, Zumba, MMA/Kickboxing, Pilates, Powerlifting, Aerobics, Calisthenics, Swimming, Cardio and Strength Training."
                }
              }
            ]
          }
        ]}
      />
      {/* Hyper-Attractive Hero Section */}
      <div className="mx-3 md:mx-6 mt-4 md:mt-8 mb-4 md:mb-8 p-4 md:p-12 rounded-[28px] md:rounded-[40px] border border-secondary shadow-[0_32px_64px_-16px_rgba(30,41,59,0.4)] relative overflow-hidden bg-secondary">
        {/* Dynamic Glow Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full -ml-32 -mb-32" />

        <div className="relative z-10">
          {/* Desktop-only: Big heading + subline */}
          <motion.div
            key={activeHero.subline}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="hidden md:block"
          >
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white italic mb-4 leading-none">
              {activeHero.heading}
            </h1>
            <p className="text-xs md:text-lg font-bold uppercase tracking-[0.4em] text-white/40 mb-12">
              {activeHero.subline}
            </p>
          </motion.div>

          {/* ── MOBILE: compact search bar with inline filter button ── */}
          <div className="flex md:hidden items-center gap-2 mb-3 relative">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex-1 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xl group focus-within:bg-white/20 transition-all"
            >
              <Search className="w-4 h-4 text-white/60 shrink-0 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search gyms or areas..."
                className="flex-1 bg-transparent outline-none text-sm font-bold text-white placeholder:text-white/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
            {/* Mobile filter button — right of search bar */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`shrink-0 w-12 h-12 flex items-center justify-center rounded-2xl font-black shadow-xl transition-all ${
                showFilters || selectedDisciplines.length > 0
                  ? 'bg-primary text-secondary'
                  : 'bg-white/10 border border-white/20 text-white'
              }`}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </motion.button>

            {/* Mobile Smart suggestions overlay */}
            <AnimatePresence>
              {showSuggestions && smartSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-[100] max-h-64 overflow-y-auto"
                >
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center justify-between border-b border-white/10 mb-1">
                    <span>Smart Match</span>
                    <span>{smartSuggestions.length} matches</span>
                  </div>
                  {smartSuggestions.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSearchQuery(s.searchValue);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between transition-all group text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs shrink-0 group-hover:bg-primary group-hover:text-black transition-colors">
                          {s.type === 'gym' ? '🏋️' : s.type === 'city' ? '🏙️' : '📍'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-primary transition-colors leading-tight">
                            {s.title}
                          </p>
                          <p className="text-[9px] font-semibold text-white/50 leading-tight">
                            {s.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold uppercase text-white/30 group-hover:text-white transition-colors">
                        Select →
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile: Daily Passport compact CTA */}
          <div className="flex md:hidden mb-1">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onDailyPassport?.()}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl group transition-all hover:bg-white/10"
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-black italic uppercase text-white group-hover:text-orange-400 transition-colors">Daily Passport</span>
            </motion.button>
          </div>

          {/* ── DESKTOP: full search row (search + filter button) ── */}
          <div className="hidden md:flex flex-row gap-4 max-w-4xl relative">
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
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Search venues, yoga or areas (e.g. Udumalpet, Avinashi)..."
                className="flex-1 bg-transparent outline-none text-base font-black text-white placeholder:text-white/30 placeholder:italic"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="p-1 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-8 rounded-[28px] font-black uppercase tracking-widest text-sm transition-all shadow-xl ${showFilters ? 'bg-primary text-secondary' : 'bg-white text-secondary hover:bg-primary'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Radius
            </motion.button>

            {/* Smart suggestions overlay */}
            <AnimatePresence>
              {showSuggestions && smartSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-[100] max-h-72 overflow-y-auto"
                >
                  <div className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center justify-between border-b border-white/10 mb-1">
                    <span>Smart Location & Venue Match</span>
                    <span>{smartSuggestions.length} matches</span>
                  </div>
                  {smartSuggestions.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSearchQuery(s.searchValue);
                        setShowSuggestions(false);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs shrink-0 group-hover:bg-primary group-hover:text-black transition-colors">
                          {s.type === 'gym' ? '🏋️' : s.type === 'city' ? '🏙️' : '📍'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors leading-tight">
                            {s.title}
                          </p>
                          <p className="text-[10px] font-semibold text-white/50 leading-tight">
                            {s.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 group-hover:text-white transition-colors">
                        Select →
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter panel — shared mobile + desktop */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl border border-border/60">
                  {/* Radius row */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-6 mb-4 md:mb-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Search Radius</h4>
                      <p className="text-lg font-black text-secondary italic uppercase tracking-tighter">{maxDistance} KM</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {[5, 10, 15, 25, 50].map(d => (
                        <button
                          key={d}
                          onClick={() => setMaxDistance(d)}
                          className={`px-3 md:px-5 py-1.5 md:py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${maxDistance === d ? 'bg-secondary border-secondary text-white shadow-lg' : 'bg-muted border-border/40 text-muted-foreground hover:border-secondary hover:text-secondary'}`}
                        >
                          {d} KM
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative h-1.5 w-full bg-slate-100 rounded-full mb-4 md:mb-0">
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

                  {/* Specialized disciplines — inside filter panel on mobile */}
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Disciplines</h3>
                      {selectedDisciplines.length > 0 && (
                        <button
                          onClick={() => setSelectedDisciplines([])}
                          className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                        >
                          Clear ({selectedDisciplines.length})
                        </button>
                      )}
                    </div>
                    <div className="overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                      <div className="flex gap-2 min-w-max">
                        {SPECIALIZATIONS.map((discipline, index) => (
                          <motion.button
                            key={index}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                              setSelectedDisciplines(prev =>
                                prev.includes(discipline)
                                  ? prev.filter(d => d !== discipline)
                                  : [...prev, discipline]
                              );
                            }}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border-2 transition-all ${
                              selectedDisciplines.includes(discipline)
                                ? 'bg-secondary border-secondary text-white shadow-xl'
                                : 'bg-gray-50 border-border/80 text-muted-foreground hover:border-secondary hover:text-secondary'
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-[0.1em] whitespace-nowrap">{discipline}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop-only: disciplines row below search */}
          <div className="hidden md:block mt-8 pt-8 border-t border-border/60">
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

          {/* Desktop-only: BMI + Daily Passport CTAs */}
          <div className="hidden md:flex mt-12 flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBMIClick}
              className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3 group transition-all hover:bg-white/10"
            >
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <Calculator className="w-5 h-5 shadow-[0_0_15px_rgba(163,230,53,0.4)]" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Free Tool</div>
                <div className="text-sm font-black italic uppercase text-white group-hover:text-primary transition-colors">BMI Calculator</div>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDailyPassport?.()}
              className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-3 group transition-all hover:bg-white/10"
            >
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Track Today</div>
                <div className="text-sm font-black italic uppercase text-white group-hover:text-orange-400 transition-colors">Daily Passport</div>
              </div>
            </motion.button>
          </div>

          {/* Desktop-only: Challenge Banner */}
          <div className="hidden md:block mt-8">
            <ChallengeBanner 
              onDashboardClick={() => onChallengeDashboard?.()} 
              onLeaderboardClick={() => onLeaderboard?.()} 
            />
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

          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Elite Tier</span>
            <button
              onClick={() => setShowOnlyElite(!showOnlyElite)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showOnlyElite ? 'bg-yellow-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showOnlyElite ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
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
