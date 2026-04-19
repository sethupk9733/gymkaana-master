import { ArrowLeft, Camera, CheckCircle2, RotateCcw, User, UserCheck, XCircle, Search, QrCode } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { verifyQR } from "../lib/api";
import { Html5Qrcode } from 'html5-qrcode';

interface QRCheckInProps {
  onBack: () => void;
}

export function QRCheckIn({ onBack }: QRCheckInProps) {
  const [scanState, setScanState] = useState<"scanning" | "processing" | "success" | "error">("scanning");
  const [scannedUser, setScannedUser] = useState<any>(null);
  const [manualId, setManualId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLiveScanning, setIsLiveScanning] = useState(false);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;

    if (isLiveScanning) {
      const startScanner = async () => {
        try {
          html5QrCode = new Html5Qrcode("reader");
          setScannerInitialized(true);

          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          };

          await html5QrCode.start(
            { facingMode: "environment" },
            config,
            async (decodedText) => {
              if (html5QrCode?.isScanning) {
                await html5QrCode.stop();
                setScannerInitialized(false);
                setIsLiveScanning(false);
                handleVerify(decodedText);
              }
            },
            () => { }
          );
        } catch (err) {
          console.error("Scanner error:", err);
          setErrorMessage("Camera access denied or unavailable");
          setScanState('error');
          setIsLiveScanning(false);
          setScannerInitialized(false);
        }
      };

      startScanner();
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => console.error("Cleanup stop error:", err));
      }
    };
  }, [isLiveScanning]);

  const handleVerify = async (id: string, action?: 'approve' | 'reject') => {
    const cleanId = id.trim();
    if (!cleanId) return;

    // Clean "GYMKAANA-" prefix if scanned or entered manually (case-insensitive)
    const bookingId = cleanId.toUpperCase().includes('GYMKAANA-')
      ? cleanId.split(/GYMKAANA-/i)[1].trim()
      : cleanId;

    setScanState("processing");
    setErrorMessage("");
    try {
      const result = await verifyQR(bookingId, action);
      
      if (action) {
        setScanState(action === 'approve' ? 'success' : 'scanning');
        if (action === 'reject') {
          alert("Check-in rejected successfully.");
          resetScan();
        } else {
          setScannedUser({
            name: result.booking.memberName || "Member",
            plan: result.booking.planId?.name || "Premium Plan",
            expiry: "Access Granted",
            id: result.booking._id,
            photoUrl: null,
            lastCheckIn: "Verified Now"
          });
        }
        return;
      }

      setScannedUser({
        name: result.booking.memberName || "Member",
        plan: result.booking.planId?.name || "Premium Plan",
        expiry: result.booking.status === 'upcoming' ? 'Valid Pass' : (result.booking.status === 'completed' ? 'ALREADY USED' : 'Invalid'),
        id: result.booking._id,
        photoUrl: null,
        lastCheckIn: "Pending Approval",
        rawId: bookingId,
        status: result.booking.status
      });

      if (result.booking.status === 'completed') {
        setErrorMessage("This booking has already been used.");
        setScanState("error");
      } else if (result.booking.status === 'cancelled') {
        setErrorMessage("This booking is cancelled.");
        setScanState("error");
      } else {
        setScanState("success");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Invalid or Expired Booking ID");
      setScanState("error");
    }
  };

  const resetScan = () => {
    setScanState("scanning");
    setScannedUser(null);
    setManualId("");
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
      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto relative">

        {scanState === "scanning" && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="relative w-72 h-72 md:w-96 md:h-96 border-2 border-dashed border-gray-600 rounded-3xl overflow-hidden mb-8 bg-gray-800 flex items-center justify-center">
              {!isLiveScanning ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-scan"></div>
                  <button
                    onClick={() => setIsLiveScanning(true)}
                    className="z-10 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-lg transform transition-transform hover:scale-110 active:scale-95"
                    title="Start Camera"
                  >
                    <Camera className="w-8 h-8" />
                  </button>
                  <p className="absolute bottom-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Initialize Camera</p>
                </>
              ) : (
                <div className="w-full h-full relative">
                  {!scannerInitialized && (
                    <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center z-20">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Waking Lens...</p>
                    </div>
                  )}
                  <div id="reader" className="w-full h-full"></div>
                  <button
                    onClick={() => setIsLiveScanning(false)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/30 backdrop-blur-md transition-all"
                  >
                    Abort
                  </button>
                </div>
              )}
            </div>

            <div className="w-full space-y-4 mb-8">
              <p className="text-gray-400 text-center text-sm">
                Scan the member's QR code or enter the Booking ID manually.
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Enter Booking ID (e.g. 64b8...)"
                    className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-600 focus:ring-blue-500"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => handleVerify(manualId)}
                  disabled={!manualId}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-bold"
                >
                  Verify
                </Button>
              </div>
            </div>

            <Button
              onClick={() => handleVerify("678602b9f390886b1d169ac0")} // Example ID for quick test
              variant="outline"
              className="w-full h-12 border-gray-700 text-gray-400 hover:bg-gray-800 font-medium rounded-xl"
            >
              Test with Demo ID
            </Button>
          </div>
        )}

        {scanState === "processing" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-bold italic uppercase tracking-tighter">Verifying Credentials...</h3>
            <p className="text-gray-400 mt-2 font-medium">Synchronizing with Institutional Servers</p>
          </div>
        )}

        {scanState === "success" && scannedUser && (
          <div className="w-full bg-gray-800 rounded-2xl p-6 text-center animate-in slide-in-from-bottom-10 fade-in duration-300 border border-gray-700 shadow-2xl">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto -mt-16 shadow-lg border-4 border-gray-900">
              <CheckCircle2 size={40} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold mt-4 text-white italic uppercase tracking-tighter">Access Authorized!</h2>
            <p className="text-green-400 font-black text-[10px] uppercase tracking-[0.2em] mt-1">Institutional Status: Active</p>

            <div className="mt-6 bg-gray-700/50 rounded-xl p-4 text-left border border-gray-700">
              <div className="flex items-center gap-4 border-b border-gray-600 pb-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {scannedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase italic tracking-tighter">{scannedUser.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: #{scannedUser.id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Plan</span>
                  <span className="font-bold uppercase italic text-[11px]">{scannedUser.plan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification</span>
                  <span className="font-bold text-green-400 text-[11px] uppercase">{scannedUser.expiry}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Check-in Clock</span>
                  <span className="font-bold text-[11px] uppercase">{scannedUser.lastCheckIn}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              {scannedUser.status === 'upcoming' ? (
                <>
                  <Button
                    onClick={() => handleVerify(scannedUser.rawId, 'reject')}
                    className="flex-1 h-14 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl"
                  >
                    Reject Entry
                  </Button>
                  <Button
                    onClick={() => handleVerify(scannedUser.rawId, 'approve')}
                    className="flex-[2] h-14 bg-green-600 text-white hover:bg-green-700 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-lg shadow-green-900/20"
                  >
                    Approve Check-in
                  </Button>
                </>
              ) : (
                <Button
                  onClick={resetScan}
                  className="w-full h-14 bg-white text-gray-900 hover:bg-gray-100 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl"
                >
                  Authorize Next Entry
                </Button>
              )}
            </div>
          </div>
        )}

        {scanState === "error" && (
          <div className="w-full bg-gray-800 rounded-2xl p-6 text-center animate-in slide-in-from-bottom-10 fade-in duration-300 border border-gray-700 shadow-2xl">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto -mt-16 shadow-lg border-4 border-gray-900">
              <XCircle size={40} className="text-white" />
            </div>

            <h2 className="text-2xl font-bold mt-4 text-white italic uppercase tracking-tighter">Invalid Pass</h2>
            <p className="text-red-400 font-black text-[10px] uppercase tracking-[0.2em] mt-1">Status: Access Denied</p>

            <p className="text-gray-400 mt-4 mb-6 text-[11px] font-medium leading-relaxed">
              {errorMessage || "The provided Institutional Authenticator is invalid, expired, or has already been used. Please verify membership status in the hub dashboard."}
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={resetScan}
                className="w-full h-14 bg-white text-gray-900 hover:bg-gray-100 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl"
              >
                Retry Scan
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full h-12 border-gray-700 text-gray-400 hover:bg-gray-800 font-bold uppercase tracking-[0.2em] text-[10px]"
              >
                Exit Verification
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
