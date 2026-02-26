import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    QrCode,
    Smartphone,
    User,
    Check,
    X,
    ShieldCheck,
    History
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { fetchActivities, lookupQR, confirmQRCheckIn } from '../lib/api';
import { Html5Qrcode } from 'html5-qrcode';

export default function CheckIn() {
    const navigate = useNavigate();
    const [manualId, setManualId] = useState('');
    const [checkInStatus, setCheckInStatus] = useState<'idle' | 'success' | 'checking' | 'error' | 'review' | 'rejecting'>('idle');
    const [scannedUser, setScannedUser] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [isScannerActive, setIsScannerActive] = useState(false);
    const [scannerInitialized, setScannerInitialized] = useState(false);

    useEffect(() => {
        loadActivities();
    }, []);

    useEffect(() => {
        let html5QrCode: Html5Qrcode | null = null;

        if (isScannerActive) {
            const startScanner = async () => {
                try {
                    html5QrCode = new Html5Qrcode("reader");
                    setScannerInitialized(true);

                    const config = {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0
                    };

                    await html5QrCode.start(
                        { facingMode: "environment" },
                        config,
                        async (decodedText) => {
                            if (html5QrCode?.isScanning) {
                                await html5QrCode.stop();
                                setScannerInitialized(false);
                                setIsScannerActive(false);
                                handleScanSuccess(decodedText);
                            }
                        },
                        undefined
                    );
                } catch (err) {
                    console.error("Scanner error:", err);
                    setErrorMessage("Camera access denied or unavailable");
                    setCheckInStatus('error');
                    setIsScannerActive(false);
                    setScannerInitialized(false);
                }
            };

            startScanner();
        }

        return () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(err => console.error("Cleanup stop error:", err));
            }
        };
    }, [isScannerActive]);

    const handleScanSuccess = async (decodedText: string) => {
        const cleanText = decodedText.trim();
        setCheckInStatus('checking');
        setErrorMessage('');
        try {
            const idToVerify = cleanText.toUpperCase().includes('GYMKAANA-')
                ? cleanText.split(/GYMKAANA-/i)[1].trim()
                : cleanText;

            const result = await lookupQR(idToVerify);
            setScannedUser(result.booking);
            setCheckInStatus('review');
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || "Invalid or Expired ID");
            setCheckInStatus('error');
            setTimeout(() => setCheckInStatus('idle'), 4000);
        }
    };

    const handleAccept = async () => {
        if (!scannedUser) return;
        setCheckInStatus('checking');
        try {
            await confirmQRCheckIn(scannedUser._id, 'accept');
            setCheckInStatus('success');
            loadActivities();
            setTimeout(() => {
                setCheckInStatus('idle');
                setScannedUser(null);
            }, 3000);
        } catch (err: any) {
            setErrorMessage(err.message);
            setCheckInStatus('error');
            setTimeout(() => setCheckInStatus('idle'), 4000);
        }
    };

    const handleReject = async () => {
        if (!scannedUser) return;
        const finalReason = rejectionReason === 'Other' ? customReason : rejectionReason;
        if (!finalReason) return;

        setCheckInStatus('checking');
        try {
            await confirmQRCheckIn(scannedUser._id, 'reject', finalReason);
            setCheckInStatus('idle');
            setScannedUser(null);
            setRejectionReason("");
            setCustomReason("");
            loadActivities();
            alert("Entry rejected and logged.");
        } catch (err: any) {
            setErrorMessage(err.message);
            setCheckInStatus('error');
            setTimeout(() => setCheckInStatus('idle'), 4000);
        }
    };

    const loadActivities = async () => {
        try {
            const data = await fetchActivities();
            setRecentActivities(data.slice(0, 4));
        } catch (err) {
            console.error(err);
        }
    };

    const handleManualCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanId = manualId.trim();
        if (!cleanId) return;

        setCheckInStatus('checking');
        setErrorMessage('');
        try {
            const idToVerify = cleanId.toUpperCase().includes('GYMKAANA-')
                ? cleanId.split(/GYMKAANA-/i)[1].trim()
                : cleanId;
            const result = await lookupQR(idToVerify);
            setScannedUser(result.booking);
            setCheckInStatus('review');
            setManualId('');
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || "Invalid or Expired ID");
            setCheckInStatus('error');
            setTimeout(() => setCheckInStatus('idle'), 4000);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20 overflow-x-hidden">
            {/* Header Area */}
            <div className="bg-white p-6 shadow-sm flex items-center justify-between sticky top-0 z-30 border-b border-gray-100">
                <div className="flex items-center">
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 bg-gray-50 rounded-xl text-gray-900"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </motion.button>
                    <div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Access Control</h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Live Entry System</p>
                    </div>
                </div>
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6 mt-2">
                {/* Scanner Interface */}
                <div className="bg-black rounded-[40px] aspect-square flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
                    {!isScannerActive ? (
                        <>
                            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center grayscale scale-110"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsScannerActive(true)}
                                    className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all group"
                                >
                                    <QrCode className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                                </motion.button>
                                <p className="font-black italic uppercase tracking-widest text-white mt-8 text-sm">Initialize Lens</p>
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mt-2 text-center px-8 leading-relaxed">System awaiting digital scan command</p>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full relative flex flex-col items-center justify-center">
                            {!scannerInitialized && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
                                    <div className="w-10 h-10 border-4 border-white/10 border-t-primary/100 rounded-full animate-spin mb-4"></div>
                                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Waking Sensor...</p>
                                </div>
                            )}
                            <div id="reader" className="w-full h-full overflow-hidden"></div>
                            <button
                                onClick={() => setIsScannerActive(false)}
                                className="absolute bottom-6 px-6 py-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest z-20 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                            >
                                Abort Scan
                            </button>
                        </div>
                    )}

                    <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-primary/100/50 rounded-tl-3xl z-20 pointer-events-none"></div>
                    <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-primary/100/50 rounded-tr-3xl z-20 pointer-events-none"></div>
                    <div className="absolute bottom-10 left-10 w-16 h-16 border-b-2 border-l-2 border-primary/100/50 rounded-bl-3xl z-20 pointer-events-none"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 border-b-2 border-r-2 border-primary/100/50 rounded-br-3xl z-20 pointer-events-none"></div>
                </div>

                {/* Manual Input Intelligence */}
                <div className="bg-white p-6 rounded-[32px] border-2 border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Smartphone className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Manual Validation</h3>
                    </div>

                    <AnimatePresence mode="wait">
                        {checkInStatus === 'success' ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="bg-green-500 text-white p-5 rounded-2xl flex items-center justify-center gap-4 shadow-lg shadow-green-200"
                            >
                                <Check className="w-8 h-8 font-black" />
                                <span className="text-sm font-black uppercase tracking-widest italic">Entry Approved</span>
                            </motion.div>
                        ) : checkInStatus === 'error' ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-red-500 text-white p-5 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-red-200"
                            >
                                <div className="flex items-center gap-4">
                                    <X className="w-8 h-8 font-black" />
                                    <span className="text-sm font-black uppercase tracking-widest italic text-center">Verification Failed</span>
                                </div>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{errorMessage}</p>
                            </motion.div>
                        ) : checkInStatus === 'checking' ? (
                            <motion.div
                                key="checking"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-2"
                            >
                                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest mt-2 text-gray-400">Processing Request...</span>
                            </motion.div>
                        ) : checkInStatus === 'review' && scannedUser ? (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    {scannedUser.userId?.profileImage || scannedUser.userId?.photo ? (
                                        <img
                                            src={scannedUser.userId?.profileImage || scannedUser.userId?.photo}
                                            alt={scannedUser.memberName}
                                            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center text-xl font-black italic">
                                            {scannedUser.memberName?.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="font-black italic uppercase tracking-tighter text-gray-900 leading-none">{scannedUser.memberName}</p>
                                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">{scannedUser.planId?.name || 'Hub Plan'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Status</p>
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">{scannedUser.status}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setCheckInStatus('rejecting')}
                                        className="flex-1 py-4 bg-gray-100 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={handleAccept}
                                        className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/20"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </motion.div>
                        ) : checkInStatus === 'rejecting' ? (
                            <motion.div
                                key="rejecting"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Select Rejection Reason</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {["Invalid Dress Code", "Behavioral Issue", "Capacity Full", "Other"].map(reason => (
                                        <button
                                            key={reason}
                                            onClick={() => setRejectionReason(reason)}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest text-left transition-all",
                                                rejectionReason === reason ? "bg-red-500 border-red-500 text-white" : "bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-300"
                                            )}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>

                                {rejectionReason === 'Other' && (
                                    <input
                                        type="text"
                                        placeholder="Type reason..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-red-500"
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                    />
                                )}

                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => setCheckInStatus('review')} className="flex-1 py-3 text-[10px] font-black uppercase text-gray-400">Cancel</button>
                                    <button
                                        onClick={handleReject}
                                        disabled={!rejectionReason || (rejectionReason === 'Other' && !customReason)}
                                        className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleManualCheckIn} className="space-y-4">
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-black transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Member ID or Phone"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-sm font-black placeholder:text-gray-300 focus:border-black transition-all outline-none"
                                        value={manualId}
                                        onChange={(e) => setManualId(e.target.value)}
                                    />
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all"
                                >
                                    Authorize Entry
                                </motion.button>
                            </form>
                        )}
                    </AnimatePresence>
                </div>

                {/* Audit Log */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                            <History size={16} className="text-gray-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 leading-none">Security Audit Log</h3>
                        </div>
                        <span className="text-[8px] font-black text-primary/100 px-2 py-1 bg-primary/10 rounded-full uppercase tracking-tighter">Live Feed</span>
                    </div>

                    <div className="bg-white rounded-[32px] border-2 border-gray-100 shadow-sm overflow-hidden pb-4">
                        {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                            <motion.div
                                key={activity._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-all",
                                    index !== recentActivities.length - 1 && "border-b border-gray-50"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors",
                                        activity.type === 'info' || activity.type === 'success' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                    )}>
                                        {activity.action?.charAt(0) || 'A'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors truncate">{activity.description}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <span className="text-gray-200">/</span>
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{activity.gymId?.name || 'Hub'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm shrink-0 ml-4",
                                    activity.type === 'info' || activity.type === 'success' ? "bg-green-500 text-white shadow-green-100" : "bg-red-500 text-white shadow-red-100"
                                )}>
                                    {activity.type === 'info' || activity.type === 'success' ? 'Verifed' : 'Denied'}
                                </div>
                            </motion.div>
                        )) : (
                            <div className="p-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">No Recent Activity logs</div>
                        )}
                    </div>
                    <button className="w-full py-4 bg-gray-100/50 rounded-2xl text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-100 transition-all">
                        Fetch Older Logs
                    </button>
                </div>
            </div>
        </div>
    );
}
