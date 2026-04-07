import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, TrendingUp, CreditCard, Calendar, Loader2, IndianRupee, Clock, CheckCircle2, AlertCircle, X, Download } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { fetchDashboardStats, fetchGyms, fetchPayoutHistory, requestPayout } from '../lib/api';

interface PayoutsEarningsProps {
  onBack: () => void;
}

export function PayoutsEarnings({ onBack }: PayoutsEarningsProps) {
  const [selectedGymId, setSelectedGymId] = useState<string>('all');
  const [statsData, setStatsData] = useState<any>(null);
  const [myGyms, setMyGyms] = useState<any[]>([]);
  const [payoutHistory, setPayoutHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);

  useEffect(() => {
    const loadGyms = async () => {
      try {
        const gymsData = await fetchGyms();
        setMyGyms(gymsData);
      } catch (err) {
        console.error("Failed to fetch gyms:", err);
      }
    };
    loadGyms();
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
        console.error("Failed to fetch earnings stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [selectedGymId]);

  const handleRequestPayout = async () => {
    if (selectedGymId === 'all') {
      alert('Please select a specific gym to request a payout.');
      return;
    }

    const amountStr = prompt('Enter amount to withdraw:');
    if (!amountStr) return;

    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    setRequestingPayout(true);
    try {
      await requestPayout(selectedGymId, amount);
      alert('Payout request submitted successfully!');
      // Refresh data
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

  const gyms = statsData?.gymPerformance || [];

  const totals = {
    revenue: statsData?.totalRevenue || 0,
    members: statsData?.totalMembers || 0,
    checkins: statsData?.dailyCheckins || 0
  };

  const chartData = gyms.map((g: any) => ({
    name: g.name.length > 8 ? g.name.substring(0, 8) + '...' : g.name,
    value: g.revenue
  }));

  const formatCurrency = (amt: number) => {
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(2)}L`;
    return `₹${amt.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors" title="Go back">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Earnings</h1>
              <p className="text-sm text-gray-500">Revenue & Payouts</p>
            </div>
          </div>

          <div className="relative">
            <select
              aria-label="Select Gym"
              title="Select Gym"
              value={selectedGymId}
              onChange={(e) => setSelectedGymId(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm"
            >
              <option value="all">All Gyms</option>
              {myGyms.map((g: any) => (
                <option key={g._id} value={g._id}>{g.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-4xl mx-auto pb-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-blue-100 font-medium mb-1">Total Revenue</p>
            <h2 className="text-3xl font-bold">{formatCurrency(totals.revenue)}</h2>
            <div className="mt-4 flex items-center text-sm text-blue-100 bg-blue-500/30 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              Live Sync
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-500 font-medium">Daily Checkins</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totals.checkins}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-gray-500 font-medium">Pending Payout</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency((totals.revenue * 0.85) - payoutHistory.reduce((acc, curr) => acc + (['Paid', 'Processing', 'Pending'].includes(curr.status) ? curr.amount : 0), 0))}
              </p>
            </div>
            {selectedGymId !== 'all' && (
              <button
                onClick={handleRequestPayout}
                disabled={requestingPayout}
                className="mt-4 w-full bg-black text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {requestingPayout ? 'Processing...' : 'Withdraw Funds'}
              </button>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Venue Contribution (Revenue)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction History with Detailed Receipt View */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Financial History</h3>
          <div className="space-y-3">
            {payoutHistory.length > 0 ? (
              payoutHistory.map((tx) => (
                <div
                  key={tx._id}
                  onClick={() => setSelectedPayout(tx)}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer relative group"
                >
                  <div className="flex justify-between items-center p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border ${tx.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' :
                        tx.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          tx.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                            'bg-yellow-50 text-yellow-600 border-yellow-100'
                        }`}>
                        <IndianRupee size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Payout to {tx.gymId?.name || 'Venue'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(tx.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {tx.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">₹{tx.amount.toLocaleString()}</p>
                      <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block ${tx.status === 'Paid' ? 'text-green-600 bg-green-50' :
                        tx.status === 'Processing' ? 'text-blue-600 bg-blue-50' :
                          tx.status === 'Rejected' ? 'text-red-600 bg-red-50' :
                            'text-yellow-600 bg-yellow-50'
                        }`}>
                        {tx.status}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                    <div className="text-gray-500">
                      <span>Dest: </span>
                      <span className="text-gray-900">{tx.bankDetails.bankName} •••• {tx.bankDetails.accountNumber.slice(-4)}</span>
                    </div>
                    {tx.transactionId ? (
                      <span className="text-gray-400">TXN: {tx.transactionId}</span>
                    ) : (
                      <span className="text-gray-400">Pending Approval</span>
                    )}
                  </div>

                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white border-2 border-dashed border-gray-100 rounded-2xl">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No payout history found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payout Details Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Payout Details</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">ID: {selectedPayout._id.slice(-8).toUpperCase()}</p>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">₹{selectedPayout.amount.toLocaleString()}</h2>
                <div className={`mt-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedPayout.status === 'Paid' ? 'bg-green-100 text-green-700' :
                    selectedPayout.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                      selectedPayout.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                  }`}>
                  {selectedPayout.status}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Requested Date</span>
                  <span className="text-sm font-bold text-gray-900">{new Date(selectedPayout.requestedAt).toLocaleString()}</span>
                </div>
                {selectedPayout.paidAt && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Processed Date</span>
                    <span className="text-sm font-bold text-gray-900">{new Date(selectedPayout.paidAt).toLocaleString()}</span>
                  </div>
                )}
                {selectedPayout.transactionId && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Transaction ID</span>
                    <span className="text-sm font-mono font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded">{selectedPayout.transactionId}</span>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bank Details</p>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Bank Name</span>
                      <span className="text-xs font-bold text-gray-900">{selectedPayout.bankDetails?.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Account Number</span>
                      <span className="text-xs font-mono font-bold text-gray-900">{selectedPayout.bankDetails?.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">IFSC Code</span>
                      <span className="text-xs font-mono font-bold text-gray-900">{selectedPayout.bankDetails?.ifscCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-gray-500">Beneficiary</span>
                      <span className="text-xs font-bold text-gray-900">{selectedPayout.bankDetails?.accountName}</span>
                    </div>
                  </div>
                </div>

                {selectedPayout.remarks && (
                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Remarks</p>
                    <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-xl border border-yellow-100 italic">
                      "{selectedPayout.remarks}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedPayout(null)}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
