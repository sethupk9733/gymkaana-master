import { Mail, Lock, User, ArrowLeft, ShieldCheck, Building, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { login, register } from "../lib/api";

export function LoginSignupScreen({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setError("Please enter email and password");
          setLoading(false);
          return;
        }
        const result = await login({
          email: formData.email,
          password: formData.password
        });

        if (result.error) {
          setError(result.error || "Login failed");
        } else {
          // Login successful
          onLogin();
        }
      } else {
        // Signup
        if (!formData.name || !formData.email || !formData.password) {
          setError("Please fill all fields");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        if (result.error) {
          setError(result.error || "Signup failed");
        } else {
          // Signup successful
          onLogin();
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`relative z-10 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isLogin ? 'text-gray-900' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
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

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
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
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
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
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
            />
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
            />
          </div>

          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
                exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="CONFIRM PASSWORD"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLogin && (
            <div className="flex justify-end pr-1">
              <button type="button" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Forgot Password?</button>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-white p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isLogin ? "Login Now" : "Create Account"}
            </motion.button>

            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure authentication
              </div>

              <button
                type="button"
                onClick={() => window.open('https://gymkaana-owner.vercel.app', '_blank')}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
              >
                <Building className="w-4 h-4" />
                Are you a gym owner?
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
