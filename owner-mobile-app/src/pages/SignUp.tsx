import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowLeft, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { register, verifyOTP, resendOTP } from '../lib/api';

export default function SignUp() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await register({ ...formData, role: 'owner' });
            if (res.requiresVerification) {
                setShowOTP(true);
                setMessage(res.message || "Verification code sent to " + formData.email);
            } else if (res.accessToken) {
                navigate('/loading');
            } else {
                setError(res.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await verifyOTP(formData.email, otp);
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

    if (showOTP) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-6">
                            <ShieldCheck className="text-primary w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight italic uppercase">Finalize</h2>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed text-center">Security verification dispatched to<br />{formData.email}</p>
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase text-center">{error}</div>}
                    {message && <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-[10px] font-black uppercase text-center">{message}</div>}

                    <form onSubmit={handleVerify} className="space-y-6">
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="000000"
                            className="w-full text-center text-4xl font-black tracking-[0.5em] py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary focus:bg-white outline-none"
                            required
                        />
                        <button type="submit" disabled={loading} className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                            {loading && <Loader2 className="animate-spin w-4 h-4" />}
                            Activate Account
                        </button>
                        <button
                            type="button"
                            onClick={async () => {
                                setLoading(true);
                                try {
                                    const res = await resendOTP(formData.email);
                                    setMessage(res.message);
                                } catch (e: any) { setError(e.message); }
                                finally { setLoading(false); }
                            }}
                            className="w-full text-[10px] font-black text-primary uppercase tracking-widest text-center"
                        >
                            Request New Code
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col p-6 animate-in fade-in duration-700">
            <button
                onClick={() => navigate(-1)}
                title="Go back"
                className="self-start p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors"
            >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto space-y-8">
                <div className="text-center space-y-2 w-full">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight italic uppercase">Join Network</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Apply for partner credentials</p>
                </div>

                <form onSubmit={handleSignUp} className="w-full space-y-5 animate-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                    {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase text-center">{error}</div>}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Full Identity</label>
                            <div className="relative group">
                                <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/100 focus:bg-white focus:border-transparent outline-none transition-all font-bold"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Email Access</label>
                            <div className="relative group">
                                <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/100 focus:bg-white focus:border-transparent outline-none transition-all font-bold"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Secure Line</label>
                            <div className="relative group">
                                <Phone className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/100 focus:bg-white focus:border-transparent outline-none transition-all font-bold"
                                    placeholder="98765 43210"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Access Key</label>
                            <div className="relative group">
                                <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/100 focus:bg-white focus:border-transparent outline-none transition-all font-bold"
                                    placeholder="Create security key"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-secondary hover:shadow-blue-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-6 uppercase tracking-widest text-xs"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                Initiate Onboarding
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        By onboarding, you consent to our <span className='text-primary cursor-pointer hover:underline'>Protocol</span> and <span className='text-primary cursor-pointer hover:underline'>Privacy Directives</span>.
                    </p>
                </form>

                <p className="text-center text-[10px] font-black uppercase text-gray-500 tracking-widest animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                    Already a partner?{' '}
                    <button onClick={() => navigate('/login')} className="font-black text-primary hover:text-secondary transition-colors hover:underline">
                        Return to gateway
                    </button>
                </p>
            </div>
        </div>
    );
}
