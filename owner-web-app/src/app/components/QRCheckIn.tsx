import { ArrowLeft, Camera, CheckCircle2, RotateCcw, User, UserCheck, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";

interface QRCheckInProps {
  onBack: () => void;
}

export function QRCheckIn({ onBack }: QRCheckInProps) {
  const [scanState, setScanState] = useState<"scanning" | "processing" | "success" | "error">("scanning");
  const [scannedUser, setScannedUser] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // simulate camera stream
  useEffect(() => {
    if (scanState === "scanning" && videoRef.current) {
      // In a real app, this would use navigator.mediaDevices.getUserMedia
      // For simulation, we'll just show a placeholder or mock stream if possible
    }
  }, [scanState]);

  const handleSimulateScan = () => {
    setScanState("processing");
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes, mostly succeed
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setScannedUser({
          name: "Rahul Sharma",
          plan: "Gold Membership",
          expiry: "24 Days Left",
          photoUrl: null, // Placeholder
          lastCheckIn: "Yesterday, 6:30 PM"
        });
        setScanState("success");
      } else {
        setScanState("error");
      }
    }, 1500);
  };

  const resetScan = () => {
    setScanState("scanning");
    setScannedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
        <button onClick={onBack} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors" title="Back">
          <ArrowLeft size={20} />
        </button>
        <span className="font-semibold text-lg">QR Check-in</span>
        <div className="w-9"></div> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto relative">

        {scanState === "scanning" && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="relative w-72 h-72 border-2 border-dashed border-gray-600 rounded-3xl overflow-hidden mb-8 bg-gray-800 flex items-center justify-center">
              {/* Simulated Camera Feed View */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-scan"></div>
              <Camera className="text-gray-600 w-16 h-16 opacity-50" />
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-scan-line"></div>
            </div>

            <p className="text-gray-400 text-center mb-8">
              Align the member's QR code within the frame to check them in.
            </p>

            <Button
              onClick={handleSimulateScan}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-900/20"
            >
              Simulate Scan
            </Button>
          </div>
        )}

        {scanState === "processing" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold">Verifying...</h3>
            <p className="text-gray-400 mt-2">Checking membership status</p>
          </div>
        )}

        {scanState === "success" && scannedUser && (
          <div className="w-full bg-gray-800 rounded-2xl p-6 text-center animate-in slide-in-from-bottom-10 fade-in duration-300 border border-gray-700 shadow-2xl">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto -mt-16 shadow-lg border-4 border-gray-900">
              <CheckCircle2 size={40} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold mt-4 text-white">Check-in Successful!</h2>
            <p className="text-green-400 font-medium text-sm mt-1">Membership Active</p>

            <div className="mt-6 bg-gray-700/50 rounded-xl p-4 text-left border border-gray-700">
              <div className="flex items-center gap-4 border-b border-gray-600 pb-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {scannedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{scannedUser.name}</h3>
                  <p className="text-sm text-gray-400">ID: #987654</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span className="font-semibold">{scannedUser.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expires In</span>
                  <span className="font-semibold text-yellow-400">{scannedUser.expiry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Visit</span>
                  <span>{scannedUser.lastCheckIn}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={resetScan}
              className="w-full h-12 mt-6 bg-white text-gray-900 hover:bg-gray-100 font-bold"
            >
              Done & Scan Next
            </Button>
          </div>
        )}

        {scanState === "error" && (
          <div className="w-full bg-gray-800 rounded-2xl p-6 text-center animate-in slide-in-from-bottom-10 fade-in duration-300 border border-gray-700 shadow-2xl">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto -mt-16 shadow-lg border-4 border-gray-900">
              <XCircle size={40} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold mt-4 text-white">Check-in Failed</h2>
            <p className="text-red-400 font-medium text-sm mt-1">Invalid QR or Expired Membership</p>

            <p className="text-gray-400 mt-4 mb-6 text-sm">
              The scanned code is either invalid or belongs to an inactive membership. Please ask the member to verify their plan.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={resetScan}
                variant="outline"
                className="flex-1 h-12 border-gray-600 text-white hover:bg-gray-700"
              >
                Try Again
              </Button>
              <Button
                onClick={resetScan} // Ideally navigate to manual entry 
                className="flex-1 h-12 bg-white text-gray-900 hover:bg-gray-100 font-bold"
              >
                Enter ID Manually
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Footer hint */}
      {scanState === "scanning" && (
        <div className="p-6 text-center text-xs text-gray-500">
          Powered by Gymkaana Secure Entry
        </div>
      )}
    </div>
  );
}
