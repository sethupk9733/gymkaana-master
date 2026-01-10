import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function SignUp() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            navigate('/loading');
        }, 1500);
    };

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
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create Account</h1>
                    <p className="text-gray-500">Join Gymkaana as a Partner</p>
                </div>

                <form onSubmit={handleSignUp} className="w-full space-y-5 animate-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="tel"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                                    placeholder="98765 43210"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-6"
                    >
                        {loading ? 'Creating Account...' : (
                            <>
                                Create Account
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-500">
                        By signing up, you agree to our <span className='text-blue-600 cursor-pointer'>Terms</span> and <span className='text-blue-600 cursor-pointer'>Privacy Policy</span>.
                    </p>
                </form>

                <p className="text-center text-sm text-gray-500 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
}
