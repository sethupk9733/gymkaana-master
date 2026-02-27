import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Wallet, Calendar, Loader2, IndianRupee, Clock, ArrowUpRight, ArrowDownLeft, AlertCircle, Filter, X } from 'lucide-react';
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-gray-900 font-bold text-lg mb-2">Something went wrong</p>
                <p className="text-gray-500 mb-6">{error}</p>
                <button onClick={onBack} className="px-6 py-2 bg-black text-white rounded-full font-bold text-sm">
                    Go Back
                </button>
            </div>
        );
    }

    const { stats } = data;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors" title="Go back">
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Accounting</h1>
                            <p className="text-sm font-medium text-gray-500">Financial Ledger & Reports</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors flex items-center gap-2"
                        title="Toggle Filters"
                    >
                        <Filter className="w-5 h-5 text-gray-700" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">Filters</span>
                        {(selectedGym !== 'all' || dateFilter !== 'month' || payoutFilter !== 'all') && (
                            <span className="ml-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                {[selectedGym !== 'all', dateFilter !== 'month', payoutFilter !== 'all'].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-6 space-y-8 pb-24">
                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Gym Filter */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Gym / Venue</label>
                                <select
                                    value={selectedGym}
                                    onChange={(e) => setSelectedGym(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-gray-900 font-medium"
                                >
                                    <option value="all">All Gyms</option>
                                    {myGyms.map(gym => (
                                        <option key={gym._id} value={gym._id}>{gym.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Payout Status Filter */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Payout Status</label>
                                <select
                                    value={payoutFilter}
                                    onChange={(e) => setPayoutFilter(e.target.value as any)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-gray-900 font-medium"
                                >
                                    <option value="all">All Payouts</option>
                                    <option value="received">Received</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            {/* Date Filter */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Date Range</label>
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value as any)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-black focus:outline-none text-gray-900 font-medium"
                                >
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                    <option value="year">Last 365 Days</option>
                                    <option value="custom">Custom Date</option>
                                </select>
                            </div>
                        </div>

                        {/* Custom Date Range */}
                        {dateFilter === 'custom' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={customDateStart}
                                        onChange={(e) => setCustomDateStart(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-black focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={customDateEnd}
                                        onChange={(e) => setCustomDateEnd(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-black focus:outline-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Revenue */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-24 h-24 text-green-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600">
                                <ArrowDownLeft className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                            <h2 className="text-3xl font-black text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h2>
                        </div>
                    </div>

                    {/* Total Withdrawn */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingDown className="w-24 h-24 text-red-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-600">
                                <ArrowUpRight className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Total Withdrawn</p>
                            <h2 className="text-3xl font-black text-gray-900">₹{stats.totalWithdrawn.toLocaleString()}</h2>
                        </div>
                    </div>

                    {/* Pending Payouts */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wallet className="w-24 h-24 text-blue-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Pending Clearance</p>
                            <h2 className="text-3xl font-black text-gray-900">₹{stats.pendingPayouts.toLocaleString()}</h2>
                        </div>
                    </div>
                </div>

                {/* Transaction Ledger */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                Transaction History
                            </h2>
                            <p className="text-sm text-gray-500 font-medium mt-1">{filteredTransactions.length} Records • Total: ₹{Math.abs(totalAmount).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Filtered Total</p>
                            <p className={`text-2xl font-black ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {totalAmount >= 0 ? '+' : '-'}₹{Math.abs(totalAmount).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                    <th className="px-8 py-4 rounded-tl-2xl">Date</th>
                                    <th className="px-8 py-4">Description</th>
                                    <th className="px-8 py-4">Gym / Venue</th>
                                    <th className="px-8 py-4">Type</th>
                                    <th className="px-8 py-4 text-right rounded-tr-2xl">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx: any) => (
                                        <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 text-sm">{new Date(tx.date).toLocaleDateString()}</span>
                                                    <span className="text-xs text-gray-400 font-medium">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-medium text-gray-900">{tx.description}</div>
                                                {tx.reference && (
                                                    <div className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-wider">Ref: {tx.reference}</div>
                                                )}
                                                <div className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tx.status === 'Paid' || tx.status === 'completed' || tx.status === 'active' ? 'bg-green-100 text-green-700' :
                                                        tx.status === 'Pending' || tx.status === 'upcoming' ? 'bg-orange-100 text-orange-700' :
                                                            tx.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {tx.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-lg text-xs">
                                                    {tx.gymName}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.type === 'IN' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {tx.type === 'IN' ? 'Credit' : 'Debit'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className={`font-mono font-bold text-lg ${tx.type === 'IN' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {tx.type === 'IN' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center text-gray-300">
                                                <Calendar className="w-12 h-12 mb-3 opacity-20" />
                                                <p className="font-bold text-sm">No transactions match your filters</p>
                                                <p className="text-xs text-gray-400 mt-1">Try adjusting your filter criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
