import { Mail, Lock, User, ArrowLeft, ShieldCheck, Building } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function LoginSignupScreen({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-white flex flex-col"
    >
      {/* Header with Tabs */}
      <div className="pt-6 px-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex bg-gray-100 p-1 rounded-2xl relative">
            <motion.div
              layoutId="auth-tab"
              className="absolute inset-y-1 bg-white rounded-xl shadow-sm"
              initial={false}
              animate={{
                left: isLogin ? 4 : 'calc(50% + 2px)',
                right: isLogin ? 'calc(50% + 2px)' : 4
              }}
            />
            <button
              onClick={() => setIsLogin(true)}
              className={`relative z-10 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isLogin ? 'text-gray-900' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`relative z-10 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${!isLogin ? 'text-gray-900' : 'text-gray-400'}`}
            >
              Signup
            </button>
          </div>
          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 pt-0 flex flex-col">
        <div className="mb-10 text-center">
          <motion.h2
            key={isLogin ? 'login-title' : 'signup-title'}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-black text-gray-900 tracking-tighter mb-2 italic uppercase"
          >
            {isLogin ? "Welcome" : "Get Started"}
          </motion.h2>
          <motion.p
            key={isLogin ? 'login-sub' : 'signup-sub'}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-bold text-gray-400 uppercase tracking-widest"
          >
            {isLogin ? "Enter your credentials" : "Create your fitness account"}
          </motion.p>
        </div>

        {/* Form */}
        <div className="space-y-4 flex-1">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
                  <User className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
            />
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="PASSWORD"
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
            />
          </div>

          {isLogin && (
            <div className="flex justify-end pr-1">
              <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Forgot Password?</button>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            className="w-full bg-primary text-white p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
          >
            {isLogin ? "Login Now" : "Create Account"}
          </motion.button>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure authentication
            </div>

            <button
              onClick={() => window.open('https://gymkaana-owner.vercel.app', '_blank')}
              className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
            >
              <Building className="w-4 h-4" />
              Are you a gym owner?
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
