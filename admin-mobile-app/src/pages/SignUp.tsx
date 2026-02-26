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
            const res = await register({ ...formData, role: 'admin' });
            if (res.requiresVerification) {
                setShowOTP(true);
                setMessage(res.message || "Clearance required. Code sent to " + formData.email);
            } else if (res.accessToken) {
                navigate('/loading');
            } else {
                setError(res.message || 'Onboarding failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during onboarding');
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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 italic">
                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-black rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl">
                            <ShieldCheck className="text-white w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Identity Check</h2>
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
                            className="w-full text-center text-4xl font-black tracking-[0.5em] py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-black focus:bg-white outline-none"
                            required
                        />
                        <button type="submit" disabled={loading} className="w-full bg-black text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                            {loading && <Loader2 className="animate-spin w-4 h-4" />}
                            Activate Command Access
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
                            className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest text-center"
                        >
                            Request New Clearance
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col p-6 animate-in fade-in duration-700 italic">
            <button
                onClick={() => navigate(-1)}
                title="Go back"
                className="self-start p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors"
            >
                <ArrowLeft className="w-6 h-6 text-black" />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto space-y-8">
                <div className="text-center space-y-2 w-full">
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Recruitment</h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Apply for network oversight clearance</p>
                </div>

                <form onSubmit={handleSignUp} className="w-full space-y-5 animate-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                    {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-black uppercase text-center">{error}</div>}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Full Persona</label>
                            <div className="relative group">
                                <User className="w-5 h-5 absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white focus:border-transparent outline-none transition-all font-black text-xs uppercase tracking-widest"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Secure Link</label>
                            <div className="relative group">
                                <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white focus:border-transparent outline-none transition-all font-black text-xs uppercase tracking-widest"
                                    placeholder="admin@gymkaana.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Emergency Line</label>
                            <div className="relative group">
                                <Phone className="w-5 h-5 absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white focus:border-transparent outline-none transition-all font-black text-xs"
                                    placeholder="98765 43210"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-gray-700 ml-1 uppercase tracking-widest">Master Key</label>
                            <div className="relative group">
                                <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400 group-focus-within:text-black transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white focus:border-transparent outline-none transition-all font-black text-xs"
                                    placeholder="Establish security key"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-black py-4 rounded-xl shadow-lg hover:bg-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-6 uppercase tracking-widest text-xs"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                Request Protocol Entry
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        By applying, you consent to our <span className='text-black cursor-pointer hover:underline'>Protocol</span> and <span className='text-black cursor-pointer hover:underline'>Privacy Directives</span>.
                    </p>
                </form>

                <p className="text-center text-[10px] font-black uppercase text-gray-500 tracking-widest animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                    Already cleared?{' '}
                    <button onClick={() => navigate('/login')} className="font-black text-black hover:underline transition-colors uppercase">
                        Return to gateway
                    </button>
                </p>
            </div>
        </div>
    );
}
