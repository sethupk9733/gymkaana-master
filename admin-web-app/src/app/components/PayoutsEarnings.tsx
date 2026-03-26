import { ArrowLeft, TrendingUp, DollarSign, Calendar, Download, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from 'react';
import { fetchAdminAccounting, fetchAllPayouts } from '../lib/api';

interface PayoutsEarningsProps {
  onBack: () => void;
}

export function PayoutsEarnings({ onBack }: PayoutsEarningsProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accountingData, payoutsData] = await Promise.all([
        fetchAdminAccounting(),
        fetchAllPayouts()
      ]);
      setStats(accountingData);
      setPayouts(payoutsData);
    } catch (err) {
      console.error('Failed to load financial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    { label: "Total Platform Revenue", value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : "₹0", change: stats?.revenueTrend || "+0%", trend: stats?.revenueTrend?.includes('-') ? "down" : "up" },
    { label: "Net Platform Commission", value: stats?.netCommission ? `₹${stats.netCommission.toLocaleString()}` : "₹0", change: stats?.commissionTrend || "+0%", trend: stats?.commissionTrend?.includes('-') ? "down" : "up" },
    { label: "Pending Payouts", value: stats?.totalPendingPayout ? `₹${stats.totalPendingPayout.toLocaleString()}` : "₹0", change: "-", trend: null },
  ];

  const transactions = payouts.map(p => ({
    type: "debit",
    description: `Payout to ${p.gymId?.name || 'Partner'}`,
    amount: `-₹${p.amount?.toLocaleString()}`,
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A',
    time: p.createdAt ? new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    status: p.status
  })).slice(0, 10);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black mb-4" />
        <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Syncing Financial Ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 mb-4">
          <ArrowLeft size={20} />
          <span>Payouts & Earnings</span>
        </button>
        <p className="text-sm text-gray-500">Track your revenue and withdrawals</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">{card.label}</p>
                {card.trend && (
                  <span
                    className={`text-xs flex items-center gap-1 ${
                      card.trend === "up" ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {card.trend === "up" ? (
                      <TrendingUp size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-2xl">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Graph Placeholder */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base">Monthly Earnings</h3>
            <button className="flex items-center gap-1 text-xs text-gray-600">
              <Calendar size={14} />
              Last 6 months
            </button>
          </div>

          {/* Simple bar graph visualization */}
          <div className="h-40 flex items-end justify-between gap-2">
            {[65, 45, 78, 52, 88, 72].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gray-900 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs text-gray-500">
                  {["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Withdraw Button */}
        <Button className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800">
          <DollarSign size={18} className="mr-2" />
          Withdraw Funds
        </Button>

        {/* Transaction History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base">Transaction History</h3>
            <button className="text-sm text-gray-600 underline">View All</button>
          </div>

          <div className="bg-white border-2 border-gray-300 rounded-lg divide-y-2 divide-gray-300">
            {transactions.map((transaction, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        transaction.type === "credit" ? "bg-gray-900" : "bg-gray-200"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownRight
                          size={18}
                          className="text-white rotate-180"
                        />
                      ) : (
                        <ArrowUpRight size={18} className="text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-1">{transaction.description}</p>
                      <p className="text-xs text-gray-500">
                        {transaction.date} • {transaction.time}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm ${
                      transaction.type === "credit" ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {transaction.amount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Report */}
        <Button
          variant="outline"
          className="w-full h-12 border-2 border-gray-300"
        >
          <Download size={18} className="mr-2" />
          Download Report
        </Button>
      </div>
    </div>
  );
}
