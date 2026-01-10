import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            navigate('/loading'); // Go to loading screen which redirects to dashboard
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                        <span className="text-white text-3xl font-bold">G</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to manage your gyms</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 mt-8 animate-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
                    <div className="space-y-4">
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
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <button type="button" className="text-xs text-blue-600 font-medium hover:text-blue-700">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? 'Signing in...' : (
                            <>
                                Sign In
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
                    Don't have an account?{' '}
                    <button onClick={() => navigate('/signup')} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
}
