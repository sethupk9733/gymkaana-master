import { Smartphone as Phone, CreditCard as Card, Wallet as WalletIcon, ChevronRight as Right, ArrowLeft as Back, ShieldCheck as Secure, Lock as LockIcon, Loader2, Globe, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const paymentMethods = [
  {
    id: "upi",
    icon: Phone,
    title: "UPI Transfer",
    description: "Instant via GPay, PhonePe, Paytm",
  },
  {
    id: "card",
    icon: Card,
    title: "Credit / Debit Card",
    description: "Secure payment via Visa, MC, Amex",
  },
  {
    id: "wallet",
    icon: WalletIcon,
    title: "Digital Wallets",
    description: "Paytm, PhonePe, Amazon Pay",
  },
];

import { createBooking } from "../lib/api";
import { API_URL } from "../config/api";

export function PaymentScreen({
  gymId,
  plan,
  startDate,
  onBack,
  onPaymentSuccess
}: {
  gymId: string | null;
  plan: any;
  startDate: string | null;
  onBack: () => void;
  onPaymentSuccess: (booking: any) => void;
}) {
  const rawPrice = typeof plan?.price === 'string'
    ? parseInt(plan.price.replace(/[^\d]/g, ''))
    : (plan?.price || 0);

  const subtotal = rawPrice;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const userStr = localStorage.getItem('gymkaana_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!gymId || !plan || !user) return;

    setIsProcessing(true);

    // Calculate endDate based on duration
    const start = new Date(startDate || new Date());
    const end = new Date(start);
    const durationStr = plan.duration.toLowerCase().replace(/[^\d]/g, '');
    const durationNum = parseInt(durationStr) || 1;

    if (plan.duration.toLowerCase().includes('month')) {
      end.setMonth(end.getMonth() + durationNum);
    } else if (plan.duration.toLowerCase().includes('day')) {
      end.setDate(end.getDate() + durationNum);
    } else if (plan.duration.toLowerCase().includes('year')) {
      end.setFullYear(end.getFullYear() + durationNum);
    } else {
      end.setMonth(end.getMonth() + 1); // Default 1 month
    }

    console.log("Web Payment: Creating booking with data:", {
      gymId,
      planId: plan.id || plan._id,
      userId: user._id,
      amount: total,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      status: "upcoming"
    });

    // Simulate payment processing with dummy approval (1.5 second delay)
    setTimeout(async () => {
      try {
        // Use direct booking endpoint to bypass middleware issues
        const bookingPayload = {
          gymId,
          planId: plan.id || plan._id,
          userId: user._id,
          memberName: user.name,
          memberEmail: user.email,
          amount: total,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          status: "upcoming"
        };

        console.log("📤 Sending booking payload:", bookingPayload);

        const response = await fetch(`${API_URL}/bookings/create-direct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingPayload)
        });

        console.log("📥 Response status:", response.status);
        const result = await response.json();
        console.log("📥 Response data:", result);

        if (!response.ok) {
          throw new Error(result.message || `HTTP ${response.status}: Failed to create booking`);
        }

        console.log("✅ Web Payment: Booking created successfully:", result);

        // Store booking details for success screen (with quota safety)
        try {
          localStorage.setItem('latest_booking', JSON.stringify(result));
        } catch (e) {
          console.warn("localStorage quota exceeded, storing minimal booking info");
          try {
            // If full, just store the ID so SuccessScreen fallback can at least show that
            localStorage.setItem('latest_booking', JSON.stringify({ _id: result._id || result.id }));
          } catch (e2) {
            console.error("Critical: Could not store even minimal booking info", e2);
          }
        }

        if (onPaymentSuccess) {
          console.log("Payment Successful, navigating to Success screen", result);
          onPaymentSuccess(result);
        }
      } catch (err) {
        console.error("Payment failed during booking creation:", err);
        console.error("Web Payment error details:", {
          message: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : undefined,
          error: err
        });
        const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
        alert("Payment failed during booking completion. Details: " + errorMsg);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const displayPrice = typeof plan?.price === 'string'
    ? plan.price
    : `₹${plan?.price || 0}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Go back">
            <Back className="w-5 h-5 text-gray-900" />
          </button>
          <h2 className="text-xl font-black uppercase italic tracking-tight">Payment Method</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        {!user ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
              <LockIcon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Secure Gateway Locked</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed mb-8">
              Authentication required to access payment protocols. Please login to continue.
            </p>
            <button
              onClick={() => window.location.reload()} // App.tsx will handle redirecting to login on reload if not authenticated
              className="px-10 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              Initialize Login
            </button>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-8 p-8 bg-gray-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 blur-[60px] rounded-full" />
              <div className="relative z-10 text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Grand Total Duo</div>
                <div className="text-4xl font-black italic tracking-tighter mb-1">{displayPrice}</div>
                <div className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 inline-block px-3 py-1 rounded-lg">Security Verified</div>
              </div>
            </motion.div>

            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">Select Gateway</h3>

            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <motion.button
                  key={method.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-white border border-gray-100 rounded-[24px] p-5 flex items-center gap-4 hover:shadow-xl hover:border-primary/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner">
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <method.icon className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-black text-gray-900 uppercase tracking-tight mb-0.5">{method.title}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{method.description}</div>
                  </div>
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <Right className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="mt-10 p-6 bg-white border border-gray-100 rounded-[28px] shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                <Secure className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                Pay with confidence. Your data is protected by 256-bit AES encryption.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Bottom Footer */}
      <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-center gap-2">
        <LockIcon className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">PCI DSS COMPLIANT GATEWAY</span>
      </div>
    </motion.div>
  );
}
