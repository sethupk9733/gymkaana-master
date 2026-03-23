import { Mail, Lock, User, ArrowLeft, ShieldCheck, Building, Loader2, KeyRound } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { login, register, googleLogin, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../lib/api";
import { GoogleLogin } from '@react-oauth/google';

export function LoginSignupScreen({ onLogin, onBack, onTerms }: { onLogin: () => void; onBack: () => void; onTerms: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [resetData, setResetData] = useState({ email: "", otp: "", newPassword: "" });

  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    try {
      const result = await googleLogin({ idToken: response.credential });
      if (result.accessToken) {
        onLogin();
      } else {
        setError(result.message || "Google login failed");
      }
    } catch (err: any) {
      setError(err.message || "Google login error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isLogin) {
        const res = await login({ email: formData.email, password: formData.password });
        if (res.requiresVerification) {
          setShowOTP(true);
          setMessage("Verification required. Enter OTP.");
        } else if (res.accessToken) {
          onLogin();
        } else {
          setError(res.message || 'Login failed');
        }
      } else {
        const res = await register({ ...formData, role: 'user' });
        if (res.requiresVerification) {
          setShowOTP(true);
          setMessage(res.message || "Verification code sent.");
        } else if (res.accessToken) {
          onLogin();
        } else {
          setError(res.message || 'Signup failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await verifyOTP(formData.email, otp);
      if (res.accessToken) {
        onLogin();
      } else {
        setError(res.message || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await forgotPassword(resetData.email);
      setMessage(res.message);
      setResetStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await resetPassword(resetData);
      setMessage(res.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetStep(1);
        setMessage(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-white flex flex-col p-8 pt-12 items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mb-6 flex items-center justify-center">
          <ShieldCheck className="text-primary w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Verify</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-10">
          Enter code sent to {formData.email}
        </p>

        {error && <div className="w-full mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black uppercase text-red-500 tracking-widest text-center">{error}</div>}
        {message && <div className="w-full mb-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black uppercase text-primary tracking-widest text-center">{message}</div>}

        <form onSubmit={handleVerifyOTP} className="w-full space-y-6">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-inner">
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              className="w-full text-center text-4xl font-black tracking-[0.5em] bg-transparent outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Access"}
          </motion.button>
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              try {
                const res = await resendOTP(formData.email);
                setMessage(res.message);
              } catch (e: any) {
                setError(e.message);
              } finally {
                setLoading(false);
              }
            }}
            className="w-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pt-4"
          >
            Resend Code
          </button>
          <button onClick={() => setShowOTP(false)} className="w-full text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Back to Login</button>
        </form>
      </motion.div>
    );
  }

  if (showForgotPassword) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-white flex flex-col p-8 pt-12 items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mb-6 flex items-center justify-center">
          <KeyRound className="text-primary w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Recovery</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center mb-10">
          {resetStep === 1 ? "Enter email for reset link" : "Create new secure password"}
        </p>

        {error && <div className="w-full mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black uppercase text-red-500 tracking-widest text-center">{error}</div>}
        {message && <div className="w-full mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-[10px] font-black uppercase text-emerald-600 tracking-widest text-center">{message}</div>}

        {resetStep === 1 ? (
          <form onSubmit={handleForgotPassword} className="w-full space-y-4">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-inner">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
                value={resetData.email}
                onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-white p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Request Reset"}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="w-full space-y-4">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-inner mb-2">
              <input
                type="text"
                maxLength={6}
                placeholder="CODE"
                className="w-full text-center text-2xl font-black tracking-widest bg-transparent outline-none"
                value={resetData.otp}
                onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                required
              />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-inner">
              <Lock className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="NEW PASSWORD"
                className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-white p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
            </motion.button>
          </form>
        )}
        <button onClick={() => setShowForgotPassword(false)} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] pt-8">Back to Login</button>
      </motion.div>
    );
  }

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
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Go back" title="Go back">
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
              onClick={() => { setIsLogin(true); setError(null); setMessage(null); }}
              className={`relative z-10 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isLogin ? 'text-gray-900' : 'text-gray-400'}`}
            >
              Login
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); setMessage(null); }}
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
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 text-center">
              {error}
            </div>
          )}
          {message && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary text-center">
              {message}
            </div>
          )}
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
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="EMAIL ADDRESS"
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
            />
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="PASSWORD"
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-gray-300 bg-transparent"
            />
          </div>

          {isLogin && (
            <div className="flex justify-end pr-1">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                title="Forgot Password"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-primary text-white p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Login Now" : "Create Account")}
          </motion.button>

          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-[1px] bg-gray-100" />
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">OR</span>
            <div className="flex-1 h-[1px] bg-gray-100" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
              useOneTap
              theme="filled_black"
              shape="pill"
              text={isLogin ? "signin_with" : "signup_with"}
              width="100%"
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure authentication
            </div>

            {!isLogin && (
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center max-w-[240px]">
                By signing up, you agree to our <button onClick={onTerms} className="text-primary underline">Terms & Conditions</button>
              </p>
            )}

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
