import { ArrowLeft, Calendar, MapPin, QrCode, Clock, Trophy, ChevronRight, X, Info, Dumbbell, Users, Bike, Droplets } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { QRModal } from "./ui/QRModal";
import { ActivePassCard } from "./ui/ActivePassCard";
import { activePass } from "../data/mockData";

const activeMembership = {
  gym: "PowerHouse Fitness",
  plan: "Quarterly",
  validFrom: "Jan 3, 2026",
  validTill: "Apr 3, 2026",
  daysLeft: 90,
  location: "123 Downtown Street",
};

const pastBookings = [
  {
    id: "#GYM2023-00098",
    gym: "FitZone Arena",
    plan: "Monthly",
    date: "Dec 5, 2025",
    amount: "₹999",
    status: "Completed",
  },
  {
    id: "#GYM2023-00067",
    gym: "Elite Sports Club",
    plan: "Monthly",
    date: "Nov 8, 2025",
    amount: "₹1,299",
    status: "Completed",
  },
];

export function DashboardScreen({ onBack, onHome }: { onBack: () => void; onHome: () => void }) {
  const [showQR, setShowQR] = useState(false);
  const [showVenueGuide, setShowVenueGuide] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="h-full bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black uppercase italic tracking-tight">Your Dashboard</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        {/* Active Membership */}
        <div className="mb-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">Active Membership</h3>
          <ActivePassCard pass={activePass} onClick={() => setShowQR(true)} />
        </div>

        {/* Past Bookings */}
        <div className="pb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">Recent Activity</h3>
          <div className="space-y-4">
            {pastBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      #
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 italic uppercase tracking-tight">{booking.gym}</h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{booking.plan} Access</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-black text-gray-900 italic mb-1">{booking.amount}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{booking.date}</span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-300">ID: {booking.id}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0">
        <motion.button
          whileHover={{ x: 5 }}
          onClick={onHome}
          className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-2"
        >
          Discover New Venues <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
      <AnimatePresence>
        {showQR && (
          <QRModal pass={activePass} onClose={() => setShowQR(false)} />
        )}

        {showVenueGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative"
            >
              <button
                onClick={() => setShowVenueGuide(false)}
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                    <Info className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">Venue Guide</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeMembership.gym}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">House Rules</h4>
                    <div className="space-y-3">
                      {[
                        "Clean workout shoes required",
                        "Wipe down equipment",
                        "Re-rack weights",
                        "No outside training"
                      ].map((rule, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[8px] font-bold">
                            {i + 1}
                          </div>
                          <p className="text-xs font-medium text-gray-700">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">Amenities</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Dumbbell, label: "Weights" },
                        { icon: Users, label: "Coaches" },
                        { icon: Bike, label: "Cardio" },
                        { icon: Droplets, label: "Showers" },
                      ].map((amenity, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <amenity.icon className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-700">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <button
                  onClick={() => setShowVenueGuide(false)}
                  className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-all font-sans"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
