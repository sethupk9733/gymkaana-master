import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import { MOCK_GYMS } from '../lib/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Earnings() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialGymId = searchParams.get('gymId');

    const [selectedGymId, setSelectedGymId] = useState<string | 'all'>(initialGymId || 'all');

    // Handle URL sync
    useEffect(() => {
        if (selectedGymId === 'all') {
            searchParams.delete('gymId');
            setSearchParams(searchParams);
        } else {
            setSearchParams({ gymId: selectedGymId });
        }
    }, [selectedGymId, setSearchParams]);

    const stats = {
        total: selectedGymId === 'all' ? '₹8.5L' : (selectedGymId === '1' ? '₹4.5L' : '₹4.0L'),
        monthly: selectedGymId === 'all' ? '₹1.2L' : '₹65k',
        transactions: selectedGymId === 'all' ? 142 : 85
    };

    // Mock Chart Data
    const data = [
        { name: 'Jan', value: 4000 },
        { name: 'Feb', value: 3000 },
        { name: 'Mar', value: 2000 },
        { name: 'Apr', value: 2780 },
        { name: 'May', value: 1890 },
        { name: 'Jun', value: 2390 },
    ];

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
                        {MOCK_GYMS.filter(g => g.status === 'Active').map(g => (
                            <option key={g.id} value={g.id.toString()}>{g.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-primary/20 font-medium mb-1">Total Earnings</p>
                    <h2 className="text-3xl font-bold">{stats.total}</h2>
                    <div className="mt-4 flex items-center text-sm text-primary/20 bg-primary/100/30 w-fit px-3 py-1 rounded-full">
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
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Transaction List (Mock) */}
            <div>
                <h3 className="font-bold text-gray-900 mb-4">Recent Payouts</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                                    ₹
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Weekly Payout</p>
                                    <p className="text-xs text-gray-500">Credited to Bank Account •••• 1234</p>
                                </div>
                            </div>
                            <span className="font-bold text-gray-900">₹12,450.00</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
