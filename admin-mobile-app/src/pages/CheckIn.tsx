import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Smartphone, User, Check, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function CheckIn() {
    const navigate = useNavigate();
    const [manualId, setManualId] = useState('');
    const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success'>('idle');

    // Reuse activity data structure or share logic if this was real app
    const RECENT_CHECKINS = [
        { id: 1, user: 'Rahul Sharma', time: '1 min ago', status: 'Approved' },
        { id: 2, user: 'Sneha Gupta', time: '3 mins ago', status: 'Approved' },
        { id: 3, user: 'Unknown User', time: '5 mins ago', status: 'Failed: Expired' },
        { id: 4, user: 'Vikram M', time: '12 mins ago', status: 'Approved' },
    ];

    const handleManualCheckIn = (e: React.FormEvent) => {
        e.preventDefault();
        setCheckInStatus('success');
        // Reset after 2s
        setTimeout(() => {
            setCheckInStatus('idle');
            setManualId('');
        }, 3000);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center mb-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">QR Check-in</h1>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">

                {/* QR Scanner Placeholder */}
                <div className="bg-gray-900 rounded-2xl aspect-square flex flex-col items-center justify-center text-white relative overflow-hidden shadow-lg">
                    {/* Simulated Camera View */}
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2875&auto=format&fit=crop')] bg-cover bg-center"></div>

                    {/* Scanner Frame */}
                    <div className="relative z-10 flex flex-col items-center">
                        <QrCode className="w-16 h-16 mb-4 text-blue-400 animate-pulse" />
                        <p className="font-medium text-lg">Align QR Code within frame</p>
                        <p className="text-sm text-gray-400 mt-1">Scanning automatically...</p>
                    </div>

                    {/* Corner Markers */}
                    <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
                    <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
                </div>

                {/* Manual Check-in */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-gray-500" />
                        Manual Check-in
                    </h3>

                    {checkInStatus === 'success' ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center justify-center gap-2 animate-in fade-in zoom-in">
                            <Check className="w-6 h-6 border-2 border-green-700 rounded-full p-0.5" />
                            <span className="font-bold">Check-in Approved!</span>
                        </div>
                    ) : (
                        <form onSubmit={handleManualCheckIn} className="flex gap-2">
                            <div className="relative flex-1">
                                <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter Customer ID or Phone"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={manualId}
                                    onChange={(e) => setManualId(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Check In
                            </button>
                        </form>
                    )}
                </div>

                {/* Recent Check-ins */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        Recent Check-ins
                    </h3>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                        {RECENT_CHECKINS.map((checkin) => (
                            <div key={checkin.id} className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                        {checkin.user.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{checkin.user}</p>
                                        <p className="text-xs text-gray-400">{checkin.time}</p>
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-xs px-2 py-1 rounded-full font-medium",
                                    checkin.status.includes('Approved') ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}>
                                    {checkin.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
