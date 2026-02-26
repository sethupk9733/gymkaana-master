import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, TrendingUp, Loader2, IndianRupee, AlertCircle, X } from 'lucide-react';
import { fetchGyms, fetchDashboardStats, fetchPayoutHistory, requestPayout } from '../lib/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Earnings() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialGymId = searchParams.get('gymId');

    const [selectedGymId, setSelectedGymId] = useState<string | 'all'>(initialGymId || 'all');
    const [gyms, setGyms] = useState<any[]>([]);
    const [statsData, setStatsData] = useState<any>(null);
    const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [requestingPayout, setRequestingPayout] = useState(false);
    const [selectedPayout, setSelectedPayout] = useState<any>(null);

    // Handle URL sync
    useEffect(() => {
        if (selectedGymId === 'all') {
            searchParams.delete('gymId');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ gymId: selectedGymId });
        }
    }, [selectedGymId, setSearchParams]);

    useEffect(() => {
        const loadGymsData = async () => {
            try {
                const data = await fetchGyms();
                setGyms(data);
            } catch (err) {
                console.error(err);
            }
        };
        loadGymsData();
    }, []);

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const [stats, history] = await Promise.all([
                    fetchDashboardStats(selectedGymId),
                    fetchPayoutHistory(selectedGymId)
                ]);
                setStatsData(stats);
                setPayoutHistory(history);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [selectedGymId]);

    const handleRequestPayout = async () => {
        if (selectedGymId === 'all') {
            alert('Please select a specific gym');
            return;
        }

        const amountStr = prompt('Enter withdraw amount:');
        if (!amountStr) return;

        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            alert('Invalid amount');
            return;
        }

        setRequestingPayout(true);
        try {
            await requestPayout(selectedGymId, amount);
            alert('Payout requested!');
            const [stats, history] = await Promise.all([
                fetchDashboardStats(selectedGymId),
                fetchPayoutHistory(selectedGymId)
            ]);
            setStatsData(stats);
            setPayoutHistory(history);
        } catch (err: any) {
            alert(err.message || 'Failed to request payout');
        } finally {
            setRequestingPayout(false);
        }
    };

    const chartData = (statsData?.gymPerformance || []).map((g: any) => ({
        name: g.name.substring(0, 6),
        value: g.revenue
    }));

    const totalRevenue = statsData?.totalRevenue || 0;
    const pendingPayout = (totalRevenue * 0.85) - payoutHistory.reduce((acc, curr) => acc + (['Paid', 'Processing', 'Pending'].includes(curr.status) ? curr.amount : 0), 0);

    if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />Loading earnings...</div>;

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto pb-24">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>

                <div className="relative">
                    <select
                        aria-label="Select Gym"
                        title="Select Gym"
                        value={selectedGymId}
                        onChange={(e) => setSelectedGymId(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary/100 shadow-sm"
                    >
                        <option value="all">All Gyms</option>
                        {gyms.map(g => (
                            <option key={g._id} value={g._id}>{g.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
                    <p className="text-primary/20 font-medium mb-1 uppercase tracking-widest text-[10px] font-black opacity-80">Net Revenue</p>
                    <h2 className="text-3xl font-black italic tracking-tighter">₹{totalRevenue.toLocaleString()}</h2>
                    <div className="mt-4 flex items-center text-[8px] font-black uppercase tracking-widest text-primary/20 bg-white/10 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-white/10">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Platform Commission 15%
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-xl">
                                <IndianRupee className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available Payout</span>
                        </div>
                        <p className="text-2xl font-black text-gray-900 italic tracking-tighter">₹{pendingPayout.toLocaleString()}</p>
                    </div>
                    {selectedGymId !== 'all' && (
                        <button
                            onClick={handleRequestPayout}
                            disabled={requestingPayout}
                            className="mt-4 w-full bg-black text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-95 transition-all shadow-lg shadow-black/20"
                        >
                            {requestingPayout ? '...' : 'Withdraw Funds'}
                        </button>
                    )}
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/100"></div>
                    Revenue Overview (Last 6 Months)
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 900 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 900 }} />
                            <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }} />
                            <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Settlement History */}
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    Settlement History
                </h3>
                <div className="space-y-3">
                    {payoutHistory.length > 0 ? (
                        payoutHistory.map(tx => (
                            <div
                                key={tx._id}
                                onClick={() => setSelectedPayout(tx)}
                                className="p-5 bg-white rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden group active:scale-95 transition-all"
                            >
                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black italic shadow-inner ${tx.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
                                            tx.status === 'Processing' ? 'bg-primary/10 text-primary' :
                                                'bg-orange-50 text-orange-600'
                                            }`}>
                                            ₹
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{tx.status}</p>
                                            <p className="text-sm font-black uppercase italic text-gray-900">{tx.gymId?.name || 'Venue'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black italic tracking-tighter text-gray-900">₹{tx.amount.toLocaleString()}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                            {new Date(tx.requestedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                                    <span className="text-gray-400">Account: •••• {tx.bankDetails?.accountNumber?.slice(-4)}</span>
                                    {tx.status === 'Paid' && <span className="text-emerald-500">Ref: {tx.transactionId?.substring(0, 8)}</span>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                            <AlertCircle className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No payout history</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Sheet Details */}
            {selectedPayout && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPayout(null)}>
                    <div
                        className="bg-white w-full rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden animate-in slide-in-from-bottom duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-8 pb-12 space-y-8 max-h-[85vh] overflow-y-auto">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Payout Details</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">ID: {selectedPayout._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPayout(null)}
                                    className="p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all"
                                    title="Close Details"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Withdrawal Amount</p>
                                <h2 className="text-5xl font-black italic tracking-tighter text-gray-900 mb-4">₹{selectedPayout.amount.toLocaleString()}</h2>
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${selectedPayout.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' :
                                    selectedPayout.status === 'Processing' ? 'bg-primary/20 text-primary' :
                                        selectedPayout.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                            'bg-orange-100 text-orange-600'
                                    }`}>
                                    {selectedPayout.status}
                                </span>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-5 bg-white border border-gray-100 rounded-3xl">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Requested</p>
                                        <p className="text-sm font-black uppercase text-gray-900">{new Date(selectedPayout.requestedAt).toLocaleDateString()}</p>
                                    </div>
                                    {selectedPayout.paidAt && (
                                        <div className="p-5 bg-white border border-gray-100 rounded-3xl">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Processed</p>
                                            <p className="text-sm font-black uppercase text-gray-900">{new Date(selectedPayout.paidAt).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>

                                {selectedPayout.transactionId && (
                                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-3xl">
                                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">Transaction Reference</p>
                                        <p className="font-mono text-sm font-black text-emerald-700">{selectedPayout.transactionId}</p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Deposit Account</h4>
                                    <div className="bg-gray-50 p-6 rounded-[32px] space-y-4 border border-gray-100">
                                        <div className="flex justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bank Name</span>
                                            <span className="text-xs font-black uppercase text-gray-900">{selectedPayout.bankDetails?.bankName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</span>
                                            <span className="text-xs font-black font-mono text-gray-900">{selectedPayout.bankDetails?.accountNumber}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IFSC</span>
                                            <span className="text-xs font-black font-mono text-gray-900">{selectedPayout.bankDetails?.ifscCode}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Beneficiary</span>
                                            <span className="text-xs font-black uppercase text-gray-900">{selectedPayout.bankDetails?.accountName}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedPayout.remarks && (
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Admin Remarks</h4>
                                        <div className="p-5 bg-yellow-50 border border-yellow-100 rounded-3xl">
                                            <p className="text-xs font-medium italic text-yellow-800">"{selectedPayout.remarks}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedPayout(null)}
                                className="w-full py-5 bg-black text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:scale-[0.98] transition-all"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
