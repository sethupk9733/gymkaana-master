import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { login, googleLogin, verifyOTP, resendOTP, forgotPassword, resetPassword } from '../lib/api';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetStep, setResetStep] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [resetData, setResetData] = useState({ email: '', otp: '', newPassword: '' });

    const handleGoogleSuccess = async (response: any) => {
        setLoading(true);
        setError(null);
        try {
            const result = await googleLogin({ idToken: response.credential, role: 'owner' });
            if (result.accessToken) {
                if (!result.roles?.includes('owner') && !result.roles?.includes('admin')) {
                    setError('Access denied: You must be an owner');
                } else {
                    navigate('/loading');
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const res = await login({ email, password });
            if (res.requiresVerification) {
                setShowOTP(true);
                setMessage("Please verify your account. Code sent to " + email);
            } else if (res.accessToken) {
                if (!res.roles?.includes('owner') && !res.roles?.includes('admin')) {
                    setError('Access denied: You must be an owner');
                } else {
                    navigate('/loading');
                }
            } else {
                setError(res.message || 'Login failed');
            }
        } catch (err: any) {
            console.error(err);
            if (err.message && err.message.includes('Failed to fetch')) {
                setError('Cannot connect to server. Please check your internet or if server is running.');
            } else {
                setError(err.message || 'An error occurred during login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await verifyOTP(email, otp);
            if (res.accessToken) {
                navigate('/loading');
            } else {
                setError(res.message || 'Verification failed');
            }
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordRequest = async (e: React.FormEvent) => {
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

    const handleResetPasswordFinal = async (e: React.FormEvent) => {
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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
                            <ShieldCheck className="text-primary w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight italic uppercase">Verify Identity</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">System checking authorization code sent to {email}</p>
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase text-center">{error}</div>}
                    {message && <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-[10px] font-black uppercase text-center">{message}</div>}

                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="000000"
                            className="w-full text-center text-4xl font-black tracking-[0.5em] py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:bg-white outline-none"
                            required
                        />
                        <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-sm flex items-center justify-center gap-2">
                            {loading && <Loader2 className="animate-spin w-4 h-4" />}
                            Verify Code
                        </button>
                        <div className="flex flex-col gap-4 text-center">
                            <button
                                type="button"
                                onClick={async () => {
                                    setLoading(true);
                                    try {
                                        const res = await resendOTP(email);
                                        setMessage(res.message);
                                    } catch (e: any) { setError(e.message); }
                                    finally { setLoading(false); }
                                }}
                                className="text-[10px] font-black text-primary uppercase tracking-widest"
                            >
                                Re-issue Code
                            </button>
                            <button onClick={() => setShowOTP(false)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Back to Login</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    if (showForgotPassword) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
                            <KeyRound className="text-primary w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight italic uppercase">Recovery</h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {resetStep === 1 ? "Enter email for reset link" : "Establish new security parameters"}
                        </p>
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase text-center">{error}</div>}
                    {message && <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-[10px] font-black uppercase text-center">{message}</div>}

                    {resetStep === 1 ? (
                        <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
                            <input
                                type="email"
                                value={resetData.email}
                                onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                                placeholder="ADMIN@EXAMPLE.COM"
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold text-sm tracking-widest"
                                required
                            />
                            <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-xs">
                                {loading ? <Loader2 className="animate-spin inline mr-2" /> : "Request Protocol"}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPasswordFinal} className="space-y-4">
                            <input
                                type="text"
                                maxLength={6}
                                value={resetData.otp}
                                onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                                placeholder="CLEARANCE CODE"
                                className="w-full text-center text-xl font-black tracking-widest py-3 bg-gray-50 border rounded-xl"
                                required
                            />
                            <input
                                type="password"
                                value={resetData.newPassword}
                                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                placeholder="NEW ACCESS KEY"
                                className="w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold"
                                required
                            />
                            <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-xs">
                                {loading ? <Loader2 className="animate-spin inline mr-2" /> : "Authorize Update"}
                            </button>
                        </form>
                    )}
                    <button onClick={() => setShowForgotPassword(false)} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mt-4">Back to gateway</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                        <span className="text-white text-3xl font-bold font-black italic">G</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight italic uppercase">Welcome</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sign in to manage your empire</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 mt-8 animate-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase text-center italic">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-[10px] font-black uppercase text-center">
                            {message}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1 uppercase tracking-widest text-[10px] font-black">Email Address</label>
                            <div className="relative group">
                                <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/100 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-sm"
                                    placeholder="partner@gymkaana.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Password</label>
                                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-[10px] text-primary font-black hover:text-secondary uppercase tracking-widest hover:underline">Recovery?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/100 focus:bg-white focus:border-transparent outline-none transition-all font-bold text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-secondary hover:shadow-blue-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-xs"
                    >
                        {loading ? 'Accessing...' : (
                            <>
                                Sign In
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

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
                            theme="outline"
                            shape="pill"
                            text="signin_with"
                            width="100%"
                        />
                    </div>
                </form>

                <p className="text-center text-[10px] font-black uppercase text-gray-500 tracking-widest animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                    New partner?{' '}
                    <button onClick={() => navigate('/signup')} className="font-black text-primary hover:text-secondary transition-colors hover:underline">
                        Apply Now
                    </button>
                </p>
                <div className="mt-12 text-center opacity-30 px-6">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] leading-relaxed">
                        © {new Date().getFullYear()} VUEGAM SOLUTIONS.<br />ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>
        </div>
    );
}
