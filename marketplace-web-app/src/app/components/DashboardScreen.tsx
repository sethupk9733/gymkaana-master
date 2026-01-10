import { ArrowLeft, Calendar, MapPin, QrCode, Clock, Trophy, ChevronRight, X, Info, ShieldCheck, Dumbbell, Users, Bike, Droplets } from "lucide-react";
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
      className="w-full pb-12"
    >
      {/* Page Header */}
      <div className="mb-8 mt-4 px-2">
        <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase">My Dashboard</h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Manage your fitness journey</p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Active Membership */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Active Membership</h3>
              <button className="text-[10px] font-black uppercase tracking-wider text-primary hover:text-black transition-colors">Manage Plan</button>
            </div>

            <ActivePassCard pass={activePass} onClick={() => setShowQR(true)} />
          </div>

          {/* Discovery Hint (Moved from bottom) */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-[24px] border border-gray-100 flex justify-between items-center">
            <div>
              <h4 className="font-black italic text-xl mb-1">Looking for a change?</h4>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Explore new venues in your area</p>
            </div>
            <motion.button
              whileHover={{ x: 5 }}
              onClick={onHome}
              className="px-6 py-3 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              Explore <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="bg-white rounded-[32px] md:p-8 p-6 md:border md:border-gray-100 md:shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recent Activity</h3>
            <button className="text-[10px] font-black uppercase tracking-wider text-black border-b-2 border-primary">View All</button>
          </div>

          <div className="space-y-4">
            {pastBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl p-4 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-gray-300 group-hover:bg-black group-hover:text-white transition-colors text-xs">
                      <CreditCardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 italic uppercase tracking-tight text-sm">{booking.gym}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{booking.plan} Access</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-black text-gray-900 italic mb-1">{booking.amount}</span>
                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{booking.date}</span>
                  </div>
                  <span className="text-[9px] font-bold text-gray-300">#{booking.id.split('-')[1]}...</span>
                </div>
              </motion.div>
            ))}

            {/* Empty State / Placeholder */}
            <div className="border-2 border-dashed border-gray-100 rounded-2xl p-6 text-center">
              <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No more recent activity</p>
            </div>
          </div>
        </div>
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
              className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative"
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
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Venue Guide</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeMembership.gym}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">House Rules</h4>
                    <div className="space-y-3">
                      {[
                        "Always carry a clean pair of workout shoes",
                        "Wipe down equipment after use",
                        "Re-rack weights in their proper place",
                        "Maximum 20 mins on cardio during peak hours",
                        "Personal training from outside is not allowed"
                      ].map((rule, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                            {i + 1}
                          </div>
                          <p className="text-sm font-medium text-gray-700">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">Amenities</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Dumbbell, label: "Advanced Weights" },
                        { icon: Users, label: "Certified Coaches" },
                        { icon: Bike, label: "Modern Cardio" },
                        { icon: Droplets, label: "Luxury Showers" },
                      ].map((amenity, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <amenity.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-bold text-gray-700">{amenity.label}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <button
                  onClick={() => setShowVenueGuide(false)}
                  className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-all"
                >
                  Got it, Thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
// Helper icon for activity
function CreditCardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
