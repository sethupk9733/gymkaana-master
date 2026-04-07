import { useState } from "react";
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GoogleLogin } from '@react-oauth/google';

import { login, register, googleLogin, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../lib/api";

interface OwnerLoginProps {
  onLogin: (isNew?: boolean) => void;
}

export function OwnerLogin({ onLogin }: OwnerLoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [resetData, setResetData] = useState({ email: "", otp: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setMessage(null);
  };

  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Google Auth Response:', response);
      const res = await googleLogin({ idToken: response.credential, role: 'owner' });
      if (res.accessToken) {
        localStorage.setItem('gymkaana_token', res.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(res));
        onLogin(false); // Can't easily determine if new without backend flag, assume default
      } else {
        setError(res.message || "Google Authentication failed");
      }
    } catch (err: any) {
      setError(err.message || "Google login encountered an error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (isSignUp) {
          const regRes = await register({ ...formData, role: 'owner' });
          if ((regRes as any).requiresVerification) {
            setShowOTP(true);
            setMessage('Registration successful. Please verify your email.');
            setLoading(false);
            return;
          }
          // Immediately log them in if no verification
          const loginRes = await login({ email: formData.email, password: formData.password });
          if (loginRes.accessToken) {
              localStorage.setItem('gymkaana_token', loginRes.accessToken);
              localStorage.setItem('gymkaana_user', JSON.stringify(loginRes));
              onLogin(true); // Is a new registration
          } else {
              setError(loginRes.message || "Authentication failed after registration");
          }
      } else {
          const res = await login({ email: formData.email, password: formData.password });
          if ((res as any).requiresVerification) {
            setShowOTP(true);
            setMessage("Please verify your account first.");
          } else if (res.accessToken) {
            localStorage.setItem('gymkaana_token', res.accessToken);
            localStorage.setItem('gymkaana_user', JSON.stringify(res));
            onLogin(false);
          } else {
            setError(res.message || "Authentication failed");
          }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication");
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
        localStorage.setItem('gymkaana_token', res.accessToken);
        localStorage.setItem('gymkaana_user', JSON.stringify(res));
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Lock className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Verify Identity</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
            Enter code sent to {formData.email}
          </p>

          {error && <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-[10px] font-bold uppercase tracking-tight text-left">{error}</div>}
          {message && <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-700 text-[10px] font-bold uppercase tracking-tight text-left">{message}</div>}

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
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
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] shadow-xl transition-all"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Access"}
            </Button>
            <div className="flex flex-col gap-4 mt-6">
              <button
                type="button"
                className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-blue-600 transition-colors"
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
              >
                Resend Protocol
              </button>
              <button
                type="button"
                onClick={() => setShowOTP(false)}
                className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Return to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <User className="text-blue-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Recovery</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">
            {resetStep === 1 ? "Enter email for reset link" : "Create new security protocol"}
          </p>

          {error && <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-[10px] font-bold uppercase tracking-tight text-left">{error}</div>}
          {message && <div className="mb-6 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded text-emerald-700 text-[10px] font-bold uppercase tracking-tight text-left">{message}</div>}

          {resetStep === 1 ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 bg-gray-50/50 font-bold text-xs tracking-widest"
                  value={resetData.email}
                  onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] shadow-xl transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="CODE"
                  className="w-full text-center text-2xl font-black tracking-[0.5em] bg-transparent outline-none"
                  value={resetData.otp}
                  onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                  required
                />
              </div>
              <div className="relative group mt-4">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="password"
                  placeholder="NEW PASSWORD"
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 bg-gray-50/50 font-bold text-xs tracking-widest"
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] shadow-xl mt-4 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
              </Button>
            </form>
          )}
          <button
            type="button"
            onClick={() => setShowForgotPassword(false)}
            className="w-full mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl mx-auto mb-4 flex items-center justify-center border border-white/30">
              <User className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">Gymkaana Partner</h1>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">
              {isSignUp ? "Join the fitness revolution" : "Business Management Gateway"}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-8 py-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-[10px] font-bold uppercase tracking-tight">
              ⚠️ {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500 rounded text-blue-700 text-[10px] font-bold uppercase tracking-tight">
              ℹ️ {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Identity</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <Input
                      name="name"
                      type="text"
                      placeholder="ENTER NAME"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 font-bold text-xs tracking-widest"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Contact Protocol</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <Input
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 font-bold text-xs tracking-widest"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Digital Coordinates</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  name="email"
                  type="email"
                  placeholder="PARTNER@GYMKAANA.COM"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 font-bold text-xs tracking-widest"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-gray-50/50 font-bold"
                  required
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
                >
                  Recovery Mode?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-black hover:bg-zinc-800 text-white font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] mt-2 group text-xs"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : (isSignUp ? "Initialize Account" : "Access Console")}
              {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">or authorize via</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="mt-6">
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login link failed")}
                useOneTap
                theme="outline"
                shape="rectangular"
                width="100%"
              />
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            {isSignUp ? "Already recognized? " : "New partner applicant? "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="font-black text-blue-600 hover:underline transition-all uppercase tracking-widest ml-1"
            >
              {isSignUp ? "Sign In" : "Apply Here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
