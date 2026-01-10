import { useState } from 'react';
import { ArrowLeft, ChevronDown, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface PayoutsEarningsProps {
  onBack: () => void;
}

export function PayoutsEarnings({ onBack }: PayoutsEarningsProps) {
  const [selectedGymId, setSelectedGymId] = useState<string>('all');

  const MOCK_GYMS = [
    { id: 1, name: 'Main Branch', status: 'Active' },
    { id: 2, name: 'Downtown Gym', status: 'Active' }
  ];

  const stats = {
    total: selectedGymId === 'all' ? '₹8.5L' : (selectedGymId === '1' ? '₹4.5L' : '₹4.0L'),
    monthly: selectedGymId === 'all' ? '₹1.2L' : '₹65k',
    transactions: selectedGymId === 'all' ? 142 : 85
  };

  const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

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
              {MOCK_GYMS.map(g => (
                <option key={g.id} value={g.id.toString()}>{g.name}</option>
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
            <p className="text-blue-100 font-medium mb-1">Total Earnings</p>
            <h2 className="text-3xl font-bold">{stats.total}</h2>
            <div className="mt-4 flex items-center text-sm text-blue-100 bg-blue-500/30 w-fit px-3 py-1 rounded-full">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% vs last month
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-500 font-medium">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.monthly}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-500 font-medium">Transactions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.transactions}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Revenue Overview</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transaction History with Detailed Receipt View */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Payout History</h3>
          <div className="space-y-3">
            {[
              { id: 101, amount: "₹12,450.00", date: "Jan 07, 2026", bookings: 45, account: "**** 1234", status: "Processed" },
              { id: 102, amount: "₹8,200.00", date: "Dec 30, 2025", bookings: 28, account: "**** 1234", status: "Processed" },
              { id: 103, amount: "₹15,600.00", date: "Dec 23, 2025", bookings: 52, account: "**** 1234", status: "Processed" }
            ].map((tx) => (
              <div key={tx.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-bold border border-green-100">
                      ₹
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Weekly Payout #{tx.id}</p>
                      <p className="text-sm text-gray-500">{tx.date} • {tx.bookings} Bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">{tx.amount}</p>
                    <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full inline-block">{tx.status}</p>
                  </div>
                </div>

                {/* Expanded Details / Receipt */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center text-sm">
                  <div className="text-gray-500">
                    <span>Credited to: </span>
                    <span className="font-medium text-gray-900">HDFC Bank {tx.account}</span>
                  </div>
                  <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors flex items-center">
                    View Detailed Receipt
                    <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
