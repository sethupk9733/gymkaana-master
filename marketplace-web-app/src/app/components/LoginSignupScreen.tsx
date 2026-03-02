import { Mail, Lock, User, ArrowLeft, ShieldCheck, Building, Loader2, KeyRound } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { login, register, googleLogin, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../lib/api";
import { GoogleLogin } from '@react-oauth/google';
import { OWNER_URL } from "../config/api";

export function LoginSignupScreen({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState("");
  const [resetData, setResetData] = useState({ email: "", otp: "", newPassword: "" });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError(""); // Clear error on input change
    setMessage("");
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

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

        if (result.requiresVerification) {
          setShowOTP(true);
          setMessage("Please verify your account first.");
        } else if (result.error || !result.accessToken) {
          setError(result.error || result.message || "Login failed");
        } else {
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

        if (result.requiresVerification) {
          setShowOTP(true);
          setMessage(result.message);
        } else if (result.error || !result.accessToken) {
          setError(result.error || result.message || "Signup failed");
        } else {
          onLogin();
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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
    setError("");
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
    setError("");
    try {
      const res = await resetPassword(resetData);
      setMessage(res.message);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetStep(1);
        setMessage("");
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-background flex flex-col p-8 pt-12 items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mb-6 flex items-center justify-center">
          <ShieldCheck className="text-primary w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Verify</h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-10">
          Enter code sent to {formData.email}
        </p>

        {error && <div className="w-full mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-[10px] font-black uppercase text-destructive tracking-widest text-center">{error}</div>}
        {message && <div className="w-full mb-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black uppercase text-primary tracking-widest text-center">{message}</div>}

        <form onSubmit={handleVerifyOTP} className="w-full space-y-6">
          <div className="bg-muted border border-border rounded-2xl p-6 shadow-inner">
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
            className="w-full bg-primary text-primary-foreground p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Start"}
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
            className="w-full text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pt-4"
          >
            Resend Code
          </button>
          <button onClick={() => setShowOTP(false)} className="w-full text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Back to Login</button>
        </form>
      </motion.div>
    );
  }

  if (showForgotPassword) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full bg-background flex flex-col p-8 pt-12 items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl mb-6 flex items-center justify-center">
          <KeyRound className="text-primary w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Recovery</h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-10">
          {resetStep === 1 ? "Enter email for reset code" : "Complete security protocol"}
        </p>

        {error && <div className="w-full mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-[10px] font-black uppercase text-destructive tracking-widest text-center">{error}</div>}
        {message && <div className="w-full mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase text-emerald-600 tracking-widest text-center">{message}</div>}

        {resetStep === 1 ? (
          <form onSubmit={handleForgotPassword} className="w-full space-y-4">
            <div className="bg-muted border border-border rounded-2xl p-5 flex items-center gap-4 shadow-inner">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/30 bg-transparent"
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
              className="w-full bg-primary text-primary-foreground p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Code"}
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="w-full space-y-4">
            <div className="bg-muted border border-border rounded-2xl p-5 shadow-inner mb-2">
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
            <div className="bg-muted border border-border rounded-2xl p-5 flex items-center gap-4 shadow-inner">
              <Lock className="w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                placeholder="NEW PASSWORD"
                className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/30 bg-transparent"
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
              className="w-full bg-primary text-primary-foreground p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Protocol"}
            </motion.button>
          </form>
        )}
        <button onClick={() => setShowForgotPassword(false)} className="w-full text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pt-8">Back to Login</button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-background flex flex-col"
    >
      {/* Header with Tabs */}
      <div className="pt-6 px-4">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors" aria-label="Go back">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex bg-muted p-1 rounded-2xl relative">
            <motion.div
              layoutId="auth-tab"
              className="absolute inset-y-1 bg-card rounded-xl shadow-sm"
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
              className={`relative z-10 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${isLogin ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`relative z-10 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${!isLogin ? 'text-foreground' : 'text-muted-foreground'}`}
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
            className="text-4xl font-black text-foreground tracking-tighter mb-2 italic uppercase"
          >
            {isLogin ? "Welcome" : "Get Started"}
          </motion.h2>
          <motion.p
            key={isLogin ? 'login-sub' : 'signup-sub'}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest"
          >
            {isLogin ? "Enter your credentials" : "Create your fitness account"}
          </motion.p>
        </div>

        {/* Error/Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl"
          >
            <p className="text-xs font-bold text-destructive uppercase tracking-wider">{error}</p>
          </motion.div>
        )}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl"
          >
            <p className="text-xs font-bold text-primary uppercase tracking-wider">{message}</p>
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
                <div className="bg-muted border border-border rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="FULL NAME"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/30 bg-transparent text-foreground"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-muted border border-border rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/30 bg-transparent text-foreground"
            />
          </div>

          <div className="bg-muted border border-border rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/30 bg-transparent text-foreground"
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
                <div className="bg-muted border border-border rounded-2xl p-5 flex items-center gap-4 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-inner">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="CONFIRM PASSWORD"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="flex-1 outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/30 bg-transparent text-foreground"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLogin && (
            <div className="flex justify-end pr-1">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-primary-foreground p-5 rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:opacity-90 transition-all shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isLogin ? "Login Now" : "Create Account"}
            </motion.button>

            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-[1px] bg-border" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">OR</span>
              <div className="flex-1 h-[1px] bg-border" />
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
              <div className="flex items-center justify-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure authentication
              </div>

              <button
                type="button"
                onClick={() => window.open(OWNER_URL, '_blank')}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
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
