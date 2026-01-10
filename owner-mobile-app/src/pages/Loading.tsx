import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Loading() {
    const navigate = useNavigate();

    useEffect(() => {
        // Mock loading process
        const timer = setTimeout(() => {
            navigate('/dashboard');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-70 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-70 animate-pulse delay-700"></div>

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 animate-[bounce_1s_infinite]">
                    <span className="text-white text-4xl font-bold">G</span>
                </div>

                <h2 className="mt-8 text-xl font-bold text-gray-900 tracking-tight animate-pulse">
                    Gymkaana
                    <span className="text-blue-600">.</span>
                </h2>
                <p className="text-gray-400 text-sm mt-1">Partner Portal</p>

                <div className="mt-12 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-[loading_2s_ease-in-out_infinite] w-[40%]"></div>
                </div>
            </div>

            <style>{`
                @keyframes loading {
                    0% { transform: translateX(-150%); }
                    50% { transform: translateX(50%); width: 60%; }
                    100% { transform: translateX(250%); }
                }
            `}</style>
        </div>
    );
}
