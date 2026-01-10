import { ArrowLeft, Tag, ReceiptText, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export function CheckoutScreen({
  onBack,
  onProceedToPayment,
  selectedPlan
}: {
  onBack: () => void;
  onProceedToPayment: () => void;
  selectedPlan: string;
}) {
  const planPrices: Record<string, { price: number; discount: number }> = {
    Monthly: { price: 999, discount: 0 },
    Quarterly: { price: 2699, discount: 200 },
    Yearly: { price: 8999, discount: 1000 },
  };

  const plan = planPrices[selectedPlan] || planPrices.Monthly;
  const subtotal = plan.price;
  const discount = plan.discount;
  const tax = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + tax;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black uppercase italic tracking-tight">Checkout</h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
        {/* Order Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-100 rounded-[32px] p-6 mb-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ReceiptText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Order Summary</h3>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Venue</span>
              <span className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">PowerHouse Fitness</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Plan Type</span>
              <span className="text-sm font-black text-gray-900">{selectedPlan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Duration</span>
              <span className="text-sm font-black text-gray-900">
                {selectedPlan === 'Monthly' && '1 Month Access'}
                {selectedPlan === 'Quarterly' && '3 Months Access'}
                {selectedPlan === 'Yearly' && '12 Months Access'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Promo Code */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Tag className="w-5 h-5 text-primary" />
            <input
              type="text"
              placeholder="HAVE A PROMO CODE?"
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300"
            />
            <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors">
              Apply
            </button>
          </div>
        </motion.div>

        {/* Price Breakdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 text-white rounded-[32px] p-8 mb-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />

          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Price Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-white/60 uppercase tracking-wider">Base Price</span>
              <span className="font-black">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="font-bold text-white/60 uppercase tracking-wider">Member Discount</span>
                <span className="font-black text-accent">-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="font-bold text-white/60 uppercase tracking-wider">GST (18%)</span>
              <span className="font-black">₹{tax}</span>
            </div>
            <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-end">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Grand Total</div>
                <span className="text-3xl font-black italic tracking-tighter">₹{total}</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-lg">All Inclusive</div>
            </div>
          </div>
        </motion.div>

        {/* Security Trust */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-gray-400 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Secure 256-bit SSL encrypted payment</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-15px_40px_-20px_rgba(0,0,0,0.1)]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onProceedToPayment}
          className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
        >
          Proceed to Pay ₹{total}
        </motion.button>
      </div>
    </motion.div>
  );
}
