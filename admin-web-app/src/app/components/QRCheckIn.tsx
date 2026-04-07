import { ArrowLeft, QrCode, Keyboard, ScanLine } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface QRCheckInProps {
  onBack: () => void;
}

export function QRCheckIn({ onBack }: QRCheckInProps) {
  const [manualEntry, setManualEntry] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 mb-4">
          <ArrowLeft size={20} />
          <span>QR Check-in</span>
        </button>
        <p className="text-sm text-gray-500">Scan member QR code</p>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {!manualEntry ? (
          <div className="space-y-6">
            {/* QR Scanner Frame */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <div className="aspect-square bg-gray-100 rounded-lg border-4 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Scanner Animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border-4 border-gray-400 rounded-lg relative">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-gray-900"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-gray-900"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-gray-900"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-gray-900"></div>
                  </div>
                </div>

                {/* Scanning line */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-1 bg-gray-900 opacity-50"></div>

                {/* Icon */}
                <QrCode size={48} className="text-gray-400 relative z-10" />
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-600">Position QR code within the frame</p>
                <p className="text-xs text-gray-500 mt-1">Scanning will happen automatically</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <h3 className="text-base mb-3">Instructions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-gray-900">1.</span>
                  <span>Ask member to open their QR code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900">2.</span>
                  <span>Position the QR code within the frame</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900">3.</span>
                  <span>Wait for automatic check-in confirmation</span>
                </li>
              </ul>
            </div>

            {/* Manual Entry Button */}
            <Button
              onClick={() => setManualEntry(true)}
              variant="outline"
              className="w-full h-12 border-2 border-gray-300"
            >
              <Keyboard size={18} className="mr-2" />
              Enter Member ID Manually
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Manual Entry Form */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Keyboard size={24} className="text-gray-600" />
              </div>

              <h3 className="text-base text-center mb-6">Enter Member ID</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-600">Member ID or Phone</label>
                  <Input
                    type="text"
                    placeholder="Enter ID or phone number"
                    className="h-12 border-2 border-gray-300 text-center text-lg"
                    autoFocus
                  />
                </div>

                <Button className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800">
                  Verify & Check-in
                </Button>
              </div>
            </div>

            {/* Back to Scanner Button */}
            <Button
              onClick={() => setManualEntry(false)}
              variant="outline"
              className="w-full h-12 border-2 border-gray-300"
            >
              <ScanLine size={18} className="mr-2" />
              Back to QR Scanner
            </Button>
          </div>
        )}

        {/* Recent Check-ins */}
        <div className="mt-6">
          <h3 className="text-base mb-3">Recent Check-ins</h3>
          <div className="bg-white border-2 border-gray-300 rounded-lg divide-y-2 divide-gray-300">
            {[
              { name: "Rahul Sharma", time: "2 min ago", plan: "Monthly" },
              { name: "Priya Singh", time: "15 min ago", plan: "Daily Pass" },
              { name: "Amit Kumar", time: "45 min ago", plan: "Quarterly" },
            ].map((checkin, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600">{checkin.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm">{checkin.name}</p>
                    <p className="text-xs text-gray-500">{checkin.plan}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{checkin.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
