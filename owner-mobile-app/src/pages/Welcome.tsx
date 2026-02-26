import { useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, ShieldCheck } from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-between p-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] opacity-60"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>

            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm space-y-12 relative z-10">
                {/* Logo Section */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-200 rotate-3">
                        <span className="text-white text-4xl font-bold -rotate-3">G</span>
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Gymkaana</h1>
                        <p className="text-primary font-semibold tracking-widest text-xs uppercase mt-1">Partner Portal</p>
                    </div>
                </div>

                {/* Tagline Section */}
                <div className="space-y-6 w-full">
                    <h2 className="text-2xl font-bold text-gray-800 text-center leading-tight">
                        Empower Your Gym <br />
                        <span className="text-gray-400 font-medium">Manage growth effortlessly.</span>
                    </h2>

                    <div className="grid grid-cols-1 gap-4 mt-8">
                        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Multi-Gym Support</h3>
                                <p className="text-xs text-gray-500">Manage all locations in one place</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Secure Payments</h3>
                                <p className="text-xs text-gray-500">Fast and reliable weekly payouts</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-sm space-y-4 relative z-10 mt-12">
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-secondary hover:shadow-blue-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    className="w-full bg-white text-gray-900 border-2 border-gray-100 font-bold py-4 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all"
                >
                    Create Account
                </button>
                <p className="text-center text-[10px] font-black uppercase text-gray-400 mt-6 tracking-widest opacity-40">
                    © {new Date().getFullYear()} VUEGAM SOLUTIONS. ALL RIGHTS RESERVED.
                </p>
            </div>
        </div>
    );
}
