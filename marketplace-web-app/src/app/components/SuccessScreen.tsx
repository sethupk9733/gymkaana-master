import { CheckCircle2, Download, Home, QrCode } from "lucide-react";

export function SuccessScreen({
  booking,
  onGoHome
}: {
  booking: any;
  onGoHome: () => void;
}) {
  const displayId = booking?._id ? `#GYM-${booking._id.slice(-8).toUpperCase()}` : "#GYM-PENDING";
  const gymName = booking?.gymId?.name || booking?.gymName || "Gym Venue";
  const planName = booking?.planId?.name || "Membership Plan";
  const startDate = booking?.startDate ? new Date(booking.startDate).toLocaleDateString() : new Date().toLocaleDateString();
  const endDate = booking?.endDate ? new Date(booking.endDate).toLocaleDateString() : "--";
  const amount = booking?.amount ? `₹${booking.amount}` : "₹--";
  const qrUrl = (booking?._id || booking?.id) ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`GYMKAANA-${booking._id || booking.id}`)}&t=${Date.now()}` : null;


  return (
    <div className="h-screen bg-white flex flex-col overflow-y-auto">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center p-6 pt-12">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/20">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-1">Success!</h2>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] text-center mb-10">
          Membership Activated at {gymName}
        </p>

        {/* QR Pass Section */}
        {qrUrl && (
          <div className="w-full max-w-sm mb-10 p-8 bg-gray-50 rounded-[48px] border-2 border-gray-100 flex flex-col items-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -mr-12 -mt-12" />
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Access Pass
            </div>
            <div className="bg-white p-6 rounded-[32px] border border-gray-200 shadow-inner flex flex-col items-center gap-4">
              <img src={qrUrl} alt="QR Code" className="w-40 h-40" />
              <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{displayId}</p>
            </div>
            <p className="mt-6 text-[8px] font-bold text-gray-400 uppercase tracking-widest text-center px-4">Scan this at the front desk for instant entry clearance.</p>
          </div>
        )}

        {/* Booking Details Card */}
        <div className="w-full max-w-sm bg-white border border-gray-100 rounded-[32px] p-8 mb-10 shadow-sm">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-1">Booking ID</div>
            <div className="text-lg tracking-wide">{displayId}</div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-400">Gym Hub</span>
              <span className="text-gray-900">{gymName}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-400">Membership</span>
              <span className="text-gray-900">{planName}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-400">Activation</span>
              <span className="text-gray-900">{startDate}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span className="text-gray-400">Expires</span>
              <span className="text-gray-900">{endDate}</span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-50 pt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Paid</span>
              <span className="text-xl font-black italic text-gray-900">{amount}</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={onGoHome}
            className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
          >
            <Home className="w-4 h-4 text-primary" />
            Go to Home
          </button>

          <button className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors flex items-center justify-center gap-2">
            <Download className="w-3 h-3" />
            Download Digital Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
