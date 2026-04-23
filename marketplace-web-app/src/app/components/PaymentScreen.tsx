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
import { initiateCheckout } from "../lib/payment";

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

    try {
      // 1. Create Pending Booking in DB
      const bookingData = {
        gymId,
        planId: plan.id || plan._id,
        userId: user._id || user.id,
        memberName: user.name,
        memberEmail: user.email,
        amount: total,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        status: 'upcoming' // This is the default status
      };

      console.log("[Payment] Creating pending booking:", bookingData);
      const booking = await createBooking(bookingData);
      
      if (!booking || !booking._id) {
        throw new Error("Failed to create booking reference in database.");
      }

      // 2. Create Cashfree Order on Backend using the booking ID
      console.log("[Payment] Initializing Cashfree order for booking:", booking._id);
      const response = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('gymkaana_token')}`
        },
        body: JSON.stringify({ bookingId: booking._id })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to initialize payment gateway');
      }

      // 3. Open Cashfree Checkout Modal
      const checkoutResult = await initiateCheckout(result.paymentSessionId);

      // 4. Handle Result
      if (checkoutResult.error) {
        // User closed modal or payment failed
        alert("Payment was not completed: " + (checkoutResult.error.message || 'Verification pending'));
      } else if (checkoutResult.redirect) {
        console.log("Redirecting to: ", checkoutResult.redirect);
      } else {
        console.log("Checkout result:", checkoutResult);
      }

    } catch (err: any) {
      console.error("Payment flow interrupted:", err);
      alert(err.message || "Something went wrong during payment initialization.");
    } finally {
      setIsProcessing(false);
    }
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
          <h2 className="text-xl font-black uppercase italic tracking-tight">Checkout</h2>
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
              onClick={() => window.location.reload()}
              className="px-10 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              Initialize Login
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-gray-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 blur-[60px] rounded-full" />
              <div className="relative z-10 text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Grand Total Duo</div>
                <div className="text-4xl font-black italic tracking-tighter mb-1">{displayPrice}</div>
                <div className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 inline-block px-3 py-1 rounded-lg">Security Verified</div>
              </div>
            </motion.div>

            {/* Plan Summary */}
            <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-400 uppercase">Plan</span>
                        <span className="text-sm font-black text-gray-900 uppercase italic">{plan.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-400 uppercase">Duration</span>
                        <span className="text-sm font-black text-gray-900 uppercase italic">{plan.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-400 uppercase">Start Date</span>
                        <span className="text-sm font-black text-gray-900 uppercase italic">{new Date(startDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white border border-gray-100 rounded-[28px] shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                <Secure className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                Pay with confidence via Cashfree Secure. All major UPI apps, cards and wallets supported.
              </p>
            </div>

            <button
               onClick={handlePayment}
               disabled={isProcessing}
               className="w-full bg-black text-white h-20 rounded-[24px] font-black uppercase italic tracking-widest text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-4"
            >
               {isProcessing ? (
                 <>
                   <Loader2 className="w-6 h-6 animate-spin" />
                   <span>Initializing Gateway...</span>
                 </>
               ) : (
                 <>
                   <span>Proceed to Pay</span>
                   <Right className="w-6 h-6" />
                 </>
               )}
            </button>
          </div>
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
