import { Smartphone as Phone, CreditCard as Card, Wallet as WalletIcon, ChevronRight as Right, ArrowLeft as Back, ShieldCheck as Secure, Lock as LockIcon } from "lucide-react";
import { motion } from "motion/react";

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

export function PaymentScreen({
  onBack,
  onPaymentSuccess
}: {
  onBack: () => void;
  onPaymentSuccess: () => void;
}) {
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
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-8 bg-gray-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 blur-[60px] rounded-full" />
          <div className="relative z-10 text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Grand Total Duo</div>
            <div className="text-4xl font-black italic tracking-tighter mb-1">₹2,879</div>
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
              onClick={onPaymentSuccess}
              className="w-full bg-white border border-gray-100 rounded-[24px] p-5 flex items-center gap-4 hover:shadow-xl hover:border-primary/20 transition-all group"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner">
                <method.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-black text-gray-900 uppercase tracking-tight mb-0.5">{method.title}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{method.description}</div>
              </div>
              <Right className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
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
      </div>

      {/* Bottom Footer */}
      <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-center gap-2">
        <LockIcon className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">PCI DSS COMPLIANT GATEWAY</span>
      </div>
    </motion.div>
  );
}
