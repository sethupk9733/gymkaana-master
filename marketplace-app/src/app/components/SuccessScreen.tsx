import { CheckCircle2, Home, QrCode, X, Info, Calendar, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SuccessScreen({
  onGoHome,
  onViewDashboard,
  userPhoto,
  booking,
}: {
  onGoHome: () => void;
  onViewDashboard: () => void;
  userPhoto?: string | null;
  booking?: any;
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Priority 1: Use prop passed from PaymentScreen (prevents localStorage quota errors)
    if (booking) {
      setBookingDetails(booking);
      const qrData = `GYMKAANA-${booking._id || booking.id || 'BOOKING'}`;
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&t=${Date.now()}`);
      return;
    }

    // Priority 2: Fallback to localStorage (legacy/refresh support)
    const latestBooking = localStorage.getItem('latest_booking');
    const lastGym = localStorage.getItem('last_selected_gym');
    const lastPlan = localStorage.getItem('last_selected_plan');

    if (latestBooking) {
      try {
        const b = JSON.parse(latestBooking);
        const gym = lastGym ? JSON.parse(lastGym) : null;
        const plan = lastPlan ? JSON.parse(lastPlan) : null;

        // Enhance booking details with gym/plan info if missing
        if (typeof b.gymId === 'string' && gym) {
          b.gymId = gym;
        }
        if (typeof b.planId === 'string' && plan) {
          b.planId = plan;
        }

        setBookingDetails(b);

        // Generate QR code URL with booking ID
        const qrData = `GYMKAANA-${b._id || b.id || 'BOOKING'}`;
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&t=${Date.now()}`);
      } catch (e) {
        console.error("Failed to parse latest booking", e);
      }
    }
  }, [booking]);


  const handleFlip = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.stop-propagation')) return;
    setIsFlipped(!isFlipped);
  };

  if (!bookingDetails) {
    return (
      <div className="h-full flex items-center justify-center bg-white p-6">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-900 mb-4" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Processing Ticket...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Confetti-like Header */}
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Booking Success!</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your access ticket is ready</p>
      </div>

      {/* Flipping Ticket Container */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50">
        <div className="w-full max-w-sm h-[480px] [perspective:1200px] relative">
          <motion.div
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 25 }}
            className="w-full h-full relative [transform-style:preserve-3d]"
          >
            {/* Front Side: access QR */}
            <div
              onClick={handleFlip}
              className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col cursor-pointer border border-gray-100"
            >
              <div className="p-8 pb-4 text-center flex-1 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl p-2 mb-4 border border-gray-100 flex items-center justify-center">
                  <div className="text-xs font-black italic">{bookingDetails?.gymId?.name?.charAt(0) || 'G'}</div>
                </div>
                <h3 className="text-lg font-black italic tracking-tighter uppercase">{bookingDetails?.gymId?.name || 'Gym Venue'}</h3>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">{bookingDetails?.planId?.name || 'Membership'} Access</p>


                <div className="mb-4 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white p-1 rounded-2xl shadow-xl border border-gray-100 -rotate-3 transition-transform duration-500 group-hover:rotate-0">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center relative">
                      {userPhoto ? (
                        <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-gray-100 mb-4 inline-block shadow-inner">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-50 animate-pulse rounded-xl" />
                  )}
                  <p className="mt-2 text-[8px] font-mono text-gray-300 font-bold uppercase tracking-[0.3em]">#{bookingDetails?._id?.slice(-8).toUpperCase()}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full max-w-[240px]">
                  <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[7px] text-gray-400 uppercase font-black tracking-widest mb-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      Valid Thru
                    </div>
                    <div className="text-[10px] font-black">{new Date(bookingDetails.endDate).toLocaleDateString()}</div>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-1.5 text-[7px] text-gray-400 uppercase font-black tracking-widest mb-0.5">
                      <ShieldCheck className="w-2.5 h-2.5" />
                      Status
                    </div>
                    <div className="text-[10px] font-black text-emerald-500">ACTIVE</div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
                  <Info className="w-3 h-3" />
                  Tap to Flip for Details
                </div>
              </div>
            </div>

            {/* Back Side: details */}
            <div
              onClick={handleFlip}
              className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col cursor-pointer border border-gray-100"
            >
              <div className="p-8 flex flex-col h-full uppercase">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                      <Info className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black italic tracking-tighter">Receipt</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors stop-propagation"
                    title="Flip back to QR"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 stop-propagation">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <span className="text-[10px] font-black text-gray-400 tracking-widest">Amount Paid</span>
                      <span className="text-xl font-black italic">₹{bookingDetails?.amount}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <span className="text-[10px] font-black text-gray-400 tracking-widest">Plan Type</span>
                      <span className="text-sm font-black italic">{bookingDetails?.planId?.name || 'Quarterly'}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <span className="text-[10px] font-black text-gray-400 tracking-widest">Gym Venue</span>
                      <span className="text-sm font-black italic">{bookingDetails?.gymId?.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <span className="text-[10px] font-black text-gray-400 tracking-widest">Date</span>
                      <span className="text-sm font-black italic">{new Date(bookingDetails.bookingDate || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 border-dashed">
                    <p className="text-[9px] font-black text-emerald-600 tracking-widest text-center leading-relaxed">
                      This receipt confirms your payment for the selected membership. Present ticket to staff for entry.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-50">
                  <div className="text-center text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <ArrowLeft className="w-3 h-3" /> Tap to flip back
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <button
          onClick={onViewDashboard}
          className="w-full bg-black text-white rounded-[24px] py-5 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
        >
          View Membership
        </button>
        <button
          onClick={onGoHome}
          className="w-full bg-gray-100 text-gray-400 rounded-[24px] py-4 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-200 hover:text-gray-900 transition-all"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
