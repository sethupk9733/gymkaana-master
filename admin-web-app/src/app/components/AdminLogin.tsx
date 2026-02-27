import { useState } from "react";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { login, googleLogin, verifyOTP, resendOTP, forgotPassword, resetPassword } from "../lib/api";
import { GoogleLogin } from '@react-oauth/google';

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

    const handleGoogleSuccess = async (response: any) => {
        setLoading(true);
        setError(null);
        try {
            const result = await googleLogin({ idToken: response.credential, role: 'admin' });
            if (result.accessToken) {
                if (!result.roles?.includes('admin')) {
                    setError('Access denied: You must be an administrator');
                } else {
                    onLogin();
                }
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

                        <div className="mt-6 flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError("Google Login Failed")}
                                useOneTap
                                theme="filled_black"
                                shape="rectangular"
                                width="100%"
                            />
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
