import { CheckCircle2, Download, Home } from "lucide-react";

export function SuccessScreen({ 
  onGoHome,
  onViewDashboard 
}: { 
  onGoHome: () => void;
  onViewDashboard: () => void;
}) {
  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <h2 className="text-2xl mb-3 text-center">Booking Successful!</h2>
        <p className="text-gray-600 text-center mb-8">
          Your membership has been confirmed. Welcome to PowerHouse Fitness!
        </p>

        {/* Booking Details */}
        <div className="w-full border border-gray-300 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-sm text-gray-600 mb-1">Booking ID</div>
            <div className="text-lg tracking-wide">#GYM2024-00123</div>
          </div>
          
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gym</span>
              <span>PowerHouse Fitness</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Plan</span>
              <span>Quarterly</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valid From</span>
              <span>Jan 3, 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valid Till</span>
              <span>Apr 3, 2026</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <span>Amount Paid</span>
              <span className="text-lg">₹2,879</span>
            </div>
          </div>
        </div>

        <button className="w-full border border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 mb-3">
          <Download className="w-5 h-5" />
          <span>Download Receipt</span>
        </button>

        <button 
          onClick={onViewDashboard}
          className="w-full bg-black text-white rounded-lg p-4 mb-3"
        >
          View My Membership
        </button>

        <button 
          onClick={onGoHome}
          className="w-full border border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}
