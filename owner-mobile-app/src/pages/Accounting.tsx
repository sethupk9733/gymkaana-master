import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Calendar, Loader2, AlertCircle, ArrowUpRight, ArrowDownLeft, Filter, X } from 'lucide-react';
import { fetchAccountingData, fetchGyms } from '../lib/api';

interface AccountingProps {
    onBack: () => void;
}

export function Accounting({ onBack }: AccountingProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [myGyms, setMyGyms] = useState<any[]>([]);
    const [selectedGym, setSelectedGym] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<'week' | 'month' | 'year' | 'custom'>('month');
    const [customDateStart, setCustomDateStart] = useState<string>('');
    const [customDateEnd, setCustomDateEnd] = useState<string>('');
    const [payoutFilter, setPayoutFilter] = useState<'all' | 'received' | 'pending'>('all');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [accountingData, gymsData] = await Promise.all([
                    fetchAccountingData(),
                    fetchGyms()
                ]);
                console.log('Accounting Data:', accountingData);
                console.log('Gyms Data:', gymsData);
                setData(accountingData);
                if (gymsData) setMyGyms(gymsData);
            } catch (err: any) {
                console.error('Error loading data:', err);
                setError(err.message || 'Failed to load accounting data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const getDateRange = () => {
        const now = new Date();
        let startDate = new Date();
        
        switch (dateFilter) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            case 'custom':
                return {
                    start: customDateStart ? new Date(customDateStart) : now,
                    end: customDateEnd ? new Date(customDateEnd) : now
                };
        }
        return { start: startDate, end: now };
    };

    const filterTransactions = () => {
        if (!data?.transactions) {
            console.warn('No transactions available');
            return [];
        }
        
        console.log('Filtering transactions:', {
            total: data.transactions.length,
            selectedGym,
            dateFilter,
            payoutFilter,
            myGymsCount: myGyms.length
        });
        
        let filtered = [...data.transactions];
        const { start, end } = getDateRange();
        
        // Filter by gym - match against gym name
        if (selectedGym !== 'all') {
            const selectedGymObj = myGyms.find(g => g._id === selectedGym);
            const selectedGymName = selectedGymObj?.name;
            
            console.log('Gym filter:', { selectedGym, selectedGymName });
            
            if (selectedGymName) {
                filtered = filtered.filter((tx: any) => {
                    return tx.gymName === selectedGymName || tx.gymId === selectedGym;
                });
            }
        }
        
        // Filter by date range
        filtered = filtered.filter((tx: any) => {
            try {
                const txDate = new Date(tx.date);
                return txDate >= start && txDate <= end;
            } catch (e) {
                console.warn('Invalid date:', tx.date);
                return true;
            }
        });
        
        // Filter by payout status
        if (payoutFilter !== 'all') {
            filtered = filtered.filter((tx: any) => {
                const status = (tx.status || '').trim().toLowerCase();
                if (payoutFilter === 'received') {
                    return status === 'paid' || status === 'completed' || status === 'active';
                } else if (payoutFilter === 'pending') {
                    return status === 'pending' || status === 'processing' || status === 'upcoming';
                }
                return true;
            });
        }
        
        console.log('Filtered result count:', filtered.length);
        return filtered;
    };

    const filteredTransactions = filterTransactions();
    const totalAmount = filteredTransactions.reduce((sum: number, tx: any) => sum + (tx.type === 'IN' ? tx.amount : -tx.amount), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button onClick={onBack} className="px-6 py-3 bg-black text-white rounded-full font-bold">
                    Go Back
                </button>
            </div>
        );
    }

    const { stats } = data;

    return (
        <div className="min-h-screen bg-gray-50 pb-safe">
            <div className="px-6 pt-12 pb-6 flex items-center justify-between bg-white sticky top-0 z-10 border-b border-gray-50">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100" title="Go back">
                        <ArrowLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Accounting</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Financial Ledger</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center justify-center relative"
                    title="Toggle Filters"
                >
                    <Filter className="w-5 h-5 text-gray-700" />
                    {(selectedGym !== 'all' || dateFilter !== 'month' || payoutFilter !== 'all') && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border border-white">
                            {[selectedGym !== 'all', dateFilter !== 'month', payoutFilter !== 'all'].filter(Boolean).length}
                        </span>
                    )}
                </button>
            </div>

            <div className="p-6 space-y-6">
                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-gray-900">Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Gym Filter */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">Gym / Venue</label>
                            <select
                                value={selectedGym}
                                onChange={(e) => setSelectedGym(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-gray-900 font-medium text-sm"
                            >
                                <option value="all">All Gyms</option>
                                {myGyms.map(gym => (
                                    <option key={gym._id} value={gym._id}>{gym.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Payout Status Filter */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">Payout Status</label>
                            <select
                                value={payoutFilter}
                                onChange={(e) => setPayoutFilter(e.target.value as any)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-gray-900 font-medium text-sm"
                            >
                                <option value="all">All Payouts</option>
                                <option value="received">Received</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">Date Range</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value as any)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-gray-900 font-medium text-sm"
                            >
                                <option value="week">Last 7 Days</option>
                                <option value="month">Last 30 Days</option>
                                <option value="year">Last 365 Days</option>
                                <option value="custom">Custom Date</option>
                            </select>
                        </div>

                        {/* Custom Date Range */}
                        {dateFilter === 'custom' && (
                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">Start Date</label>
                                    <input
                                        type="date"
                                        value={customDateStart}
                                        onChange={(e) => setCustomDateStart(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-widest">End Date</label>
                                    <input
                                        type="date"
                                        value={customDateEnd}
                                        onChange={(e) => setCustomDateEnd(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {/* Stats Carousel */}
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 snap-x">
                    <div className="snap-center shrink-0 w-[85%] bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-4">
                            <ArrowDownLeft className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Revenue</p>
                            <h2 className="text-3xl font-black italic tracking-tighter text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="snap-center shrink-0 w-[85%] bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <TrendingDown className="w-32 h-32" />
                        </div>
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600 mb-4">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Withdrawn</p>
                            <h2 className="text-3xl font-black italic tracking-tighter text-gray-900">₹{stats.totalWithdrawn.toLocaleString()}</h2>
                        </div>
                    </div>

                    <div className="snap-center shrink-0 w-[85%] bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Wallet className="w-32 h-32" />
                        </div>
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending Clearance</p>
                            <h2 className="text-3xl font-black italic tracking-tighter text-gray-900">₹{stats.pendingPayouts.toLocaleString()}</h2>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black italic uppercase tracking-tight text-gray-900">All Transactions</h3>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total</p>
                            <p className={`text-xl font-black ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalAmount >= 0 ? '+' : '-'}₹{Math.abs(totalAmount).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((tx: any) => (
                                <div key={tx._id} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex justify-between items-center group active:scale-95 transition-transform">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {tx.type === 'IN' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 mb-0.5 max-w-[150px] truncate">{tx.description}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{tx.gymName}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] text-gray-400 font-medium">{new Date(tx.date).toLocaleDateString()}</span>
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${tx.status === 'Paid' || tx.status === 'completed' || tx.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    tx.status === 'Pending' || tx.status === 'upcoming' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-black italic tracking-tighter ${tx.type === 'IN' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {tx.type === 'IN' ? '+' : '-'}₹{tx.amount}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-400 font-bold text-sm">No transactions match your filters</p>
                                <p className="text-xs text-gray-300 mt-1">Try adjusting your filter criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
