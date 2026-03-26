import { useState } from "react";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { login, googleLogin, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../lib/api";
import { auth, googleProvider, signInWithPopup } from "../lib/firebase";

interface AdminLoginProps {
    onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetStep, setResetStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [otp, setOtp] = useState('');
    const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '' });

    const handleFirebaseGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            
            const apiResult = await googleLogin({ idToken, role: 'admin' });
            if (apiResult.accessToken) {
                if (!apiResult.roles?.includes('admin')) {
                    setError('Access denied: You must be an administrator');
                    await auth.signOut();
                } else {
                    onLogin();
                }
            } else {
                setError(apiResult.message || "Google login failed");
            }
        } catch (err: any) {
            console.error("Firebase/API Google Auth Error:", err);
            setError(err.message || "Google login error");
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
            const res = await login({ email: formData.email, password: formData.password });
            if (res.requiresVerification) {
                setShowOTP(true);
                setMessage("System verification required. Please enter OTP.");
            } else if (res.accessToken) {
                if (!res.roles?.includes('admin')) {
                    setError('Access denied: You must be an administrator');
                } else {
                    onLogin();
                }
            } else {
                setError(res.message || 'Login failed');
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
                if (!res.roles?.includes('admin')) {
                    setError('Access denied: You must be an administrator');
                } else {
                    onLogin();
                }
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
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-black rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <ShieldCheck className="text-[#A3E635] w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Identity Verification</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 px-8">Confirm your administrative clearance code sent to {formData.email}</p>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">{error}</div>}
                    {message && <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-[10px] font-black uppercase tracking-widest text-center">{message}</div>}

                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <Input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="CLEARANCE CODE"
                            className="text-center text-2xl tracking-[0.5em] font-black h-16 border-2 focus:border-black"
                            required
                        />
                        <Button type="submit" className="w-full h-12 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-[0.2em] text-xs" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "Verify Clearance"}
                        </Button>
                        <div className="pt-4 flex flex-col gap-3">
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
                                className="text-[9px] font-black text-black uppercase tracking-widest hover:underline"
                            >
                                Re-issue clearance code
                            </button>
                            <button onClick={() => setShowOTP(false)} className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-black">Return to gateway</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (showForgotPassword) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-black rounded-xl mx-auto mb-4 flex items-center justify-center">
                            <KeyRound className="text-[#A3E635] w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Protocol Recovery</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                            {resetStep === 1 ? "Initialize secure password reset sequence" : "Establish new authentication parameters"}
                        </p>
                    </div>

                    {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">{error}</div>}
                    {message && <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-[10px] font-black uppercase tracking-widest text-center">{message}</div>}

                    {resetStep === 1 ? (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <Input
                                type="email"
                                value={resetData.email}
                                onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                                placeholder="REGISTERED ADMIN EMAIL"
                                className="h-12 border-2 focus:border-black font-bold uppercase text-[10px] tracking-widest"
                                required
                            />
                            <Button type="submit" className="w-full h-12 bg-black text-white font-bold uppercase tracking-[0.2em] text-xs" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : "Request Reset Protocol"}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    maxLength={6}
                                    value={resetData.otp}
                                    onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                                    placeholder="RESET CODE"
                                    className="text-center font-black tracking-widest border-2 focus:border-black"
                                    required
                                />
                                <Input
                                    type="password"
                                    value={resetData.newPassword}
                                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                    placeholder="NEW ACCESS KEY"
                                    className="h-12 border-2 focus:border-black font-bold"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full h-12 bg-black text-white font-bold uppercase tracking-[0.2em] text-xs" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : "Authorize Parameter Update"}
                            </Button>
                        </form>
                    )}
                    <button onClick={() => setShowForgotPassword(false)} className="w-full text-[9px] text-gray-400 font-black uppercase tracking-widest mt-6 hover:text-black">Return to gateway</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className="bg-black px-8 py-8 text-center">
                    <div className="w-16 h-16 bg-[#A3E635] rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-[#A3E635]/20">
                        <User className="text-black w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Gymkaana Admin</h1>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        System Command Center
                    </p>
                </div>

                {/* Form Section */}
                <div className="px-8 py-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center italic uppercase tracking-tight">
                        Administrative Login
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium text-center">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-xs font-medium text-center">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Admin Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@gymkaana.com"
                                    className="pl-10 h-11 border-gray-200 focus:border-black focus:ring-black/5 bg-gray-50/50"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                                <Input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="pl-10 h-11 border-gray-200 focus:border-black focus:ring-black/5 bg-gray-50/50"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                            >
                                Protocol Recovery?
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-black hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs transition-all active:scale-[0.98] mt-2 group"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Access Portal"}
                            {!loading && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                                <span className="bg-white px-2 text-gray-400">Admin SSO Access</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button 
                                onClick={handleFirebaseGoogleLogin}
                                disabled={loading}
                                className="w-full h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all font-bold text-sm shadow-sm disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                                        </svg>
                                        Sign in with Google (Firebase)
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        Authorized personnel only.<br />All access attempts are logged and monitored.
                    </div>
                    <div className="mt-12 text-center opacity-30">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            © {new Date().getFullYear()} VUEGAM SOLUTIONS. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
