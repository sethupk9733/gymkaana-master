import { Search, DollarSign, Download, Filter, ArrowUpRight, ArrowDownRight, Printer, MoreHorizontal, Calendar, CreditCard, Wallet, Banknote } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Transaction {
    id: string;
    user: string;
    email: string;
    gym: string;
    amount: string;
    date: string;
    time: string;
    status: 'Completed' | 'Refunded' | 'Pending' | 'Failed';
    type: string;
    method: 'UPI' | 'Card' | 'Wallet' | 'Net Banking';
    commission: string;
    netPayout: string;
}

export function RefundManagement() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

    const transactions: Transaction[] = [
        {
            id: "TXN-8821901",
            user: "Alice Johnson",
            email: "alice@example.com",
            gym: "Iron Pump Gym",
            amount: "₹1,499.00",
            date: "Jan 5, 2026",
            time: "14:20 PM",
            status: "Completed",
            type: "Monthly Subscription",
            method: "UPI",
            commission: "₹224.85",
            netPayout: "₹1,274.15"
        },
        {
            id: "TXN-8821902",
            user: "Bob Smith",
            email: "bob@gym.com",
            gym: "Elite CrossFit",
            amount: "₹999.00",
            date: "Jan 4, 2026",
            time: "09:30 AM",
            status: "Refunded",
            type: "Single Entry Pass",
            method: "Card",
            commission: "₹149.85",
            netPayout: "₹0.00"
        },
        {
            id: "TXN-8821903",
            user: "Charlie Brown",
            email: "charlie@fit.com",
            gym: "Yoga Zen Center",
            amount: "₹499.00",
            date: "Jan 3, 2026",
            time: "18:45 PM",
            status: "Pending",
            type: "Trial Session",
            method: "UPI",
            commission: "₹74.85",
            netPayout: "₹424.15"
        },
        {
            id: "TXN-8821904",
            user: "David Lee",
            email: "david@lee.com",
            gym: "Iron Pump Gym",
            amount: "₹2,999.00",
            date: "Jan 1, 2026",
            time: "11:00 AM",
            status: "Completed",
            type: "Annual Plan",
            method: "Net Banking",
            commission: "₹449.85",
            netPayout: "₹2,549.15"
        },
    ];

    const filteredTransactions = transactions.filter(txn => {
        const matchesSearch = txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            txn.gym.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "All" || txn.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Financial Ledger</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time transaction monitoring & refund control</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">
                        <Download className="w-4 h-4" /> Export Ledger
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                        <Printer className="w-4 h-4 text-primary" /> Print Monthly Summary
                    </button>
                </div>
            </header>

            {/* Platform Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FinanceStat label="Gross Revenue" value="₹45.28L" trend="+8%" sub="MTD Performance" color="black" />
                <FinanceStat label="Total Commission" value="₹6.79L" trend="+12%" sub="Platform Earnings" color="primary" />
                <FinanceStat label="Total Refunds" value="₹12.5K" trend="-2%" sub="User Reversals" color="red" />
                <FinanceStat label="Settled Payouts" value="₹38.4L" trend="+5%" sub="Paid to Gyms" color="emerald" />
            </div>

            {/* Custom Search & Filters */}
            <div className="bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm space-y-8">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="relative w-full lg:w-[400px] group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by ID, Customer Name or Gym..."
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-[24px] text-xs font-bold outline-none focus:ring-4 focus:ring-black/5 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar w-full lg:w-auto">
                        {['All', 'Completed', 'Refunded', 'Pending', 'Failed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 uppercase">
                                <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-gray-400">Transaction ID</th>
                                <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-gray-400">Recipient Hub</th>
                                <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-gray-400">Total Value</th>
                                <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-gray-400">Commission</th>
                                <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-gray-400">Status</th>
                                <th className="pb-6 px-4 text-[10px] font-black tracking-widest text-gray-400 text-right">Ledger Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTransactions.map((txn) => (
                                <tr key={txn.id} className="group hover:bg-gray-50/50 transition-all cursor-pointer" onClick={() => setSelectedTxn(txn)}>
                                    <td className="py-6 px-4">
                                        <p className="font-black italic text-gray-900 tracking-tight">{txn.id}</p>
                                        <p className="text-[10px] font-bold text-gray-400">{txn.date} • {txn.time}</p>
                                    </td>
                                    <td className="py-6 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[10px] font-black italic">
                                                {txn.gym.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{txn.gym}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{txn.user}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <p className="font-black text-gray-900">{txn.amount}</p>
                                        <p className="text-[10px] font-bold text-gray-400">{txn.method}</p>
                                    </td>
                                    <td className="py-6 px-4">
                                        <p className="font-black text-primary">{txn.commission}</p>
                                        <p className="text-[10px] font-bold text-gray-400">PLATFORM FEE</p>
                                    </td>
                                    <td className="py-6 px-4">
                                        <StatusBadge status={txn.status} />
                                    </td>
                                    <td className="py-6 px-4 text-right">
                                        <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100 shadow-sm" title="View Detail">
                                            <MoreHorizontal className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Detail Panel */}
            <AnimatePresence>
                {selectedTxn && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden flex flex-col relative shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
                        >
                            <button
                                onClick={() => setSelectedTxn(null)}
                                className="absolute top-8 right-8 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all z-10"
                                title="Close"
                            >
                                <Printer className="w-5 h-5" />
                            </button>

                            <div className="p-12 overflow-y-auto custom-scrollbar">
                                <div className="text-center mb-10">
                                    <div className={`w-20 h-20 rounded-[32px] mx-auto flex items-center justify-center mb-4 ${selectedTxn.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                        <CreditCard className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Transaction Detail</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Receipt ID: {selectedTxn.id}</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 grid grid-cols-2 gap-8">
                                        <SummaryItem label="Customer" value={selectedTxn.user} sub={selectedTxn.email} />
                                        <SummaryItem label="Gym Venue" value={selectedTxn.gym} sub="Primary Partner" />
                                        <SummaryItem label="Payment Info" value={selectedTxn.method} sub={selectedTxn.type} />
                                        <SummaryItem label="Timestamp" value={selectedTxn.date} sub={selectedTxn.time} />
                                    </div>

                                    <div className="p-8 bg-black text-white rounded-[32px] space-y-4">
                                        <div className="flex justify-between items-center text-white/40 font-black text-[10px] uppercase tracking-widest border-b border-white/5 pb-4">
                                            <span>Ledger Breakdown</span>
                                            <span>Amount (INR)</span>
                                        </div>
                                        <LedgerLine label="Order Amount" value={selectedTxn.amount} />
                                        <LedgerLine label="Platform Commission (15%)" value={`- ${selectedTxn.commission}`} color="text-primary" />
                                        <LedgerLine label="GST @ 18%" value="- ₹89.00" />
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-white/40">Net Partner Payout</p>
                                                <p className="text-3xl font-black italic tracking-tighter text-primary">{selectedTxn.netPayout}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase text-white/40">Settlement Code</p>
                                                <p className="font-mono text-xs font-bold">SET-90129XP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    {selectedTxn.status === 'Completed' && (
                                        <button className="flex-1 py-5 bg-red-50 text-red-600 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-100 transition-all flex items-center justify-center gap-3">
                                            Reverse Payment (Refund)
                                        </button>
                                    )}
                                    <button onClick={() => setSelectedTxn(null)} className="px-10 py-5 bg-gray-50 text-gray-900 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-100 transition-all">
                                        Close Ledger
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FinanceStat({ label, value, trend, sub, color }: any) {
    const textColor = color === 'primary' ? 'text-primary' : color === 'red' ? 'text-red-500' : color === 'emerald' ? 'text-emerald-500' : 'text-gray-900';
    return (
        <div className="bg-white p-7 rounded-[32px] border border-gray-100 shadow-sm flex flex-col group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {trend}
                </div>
                <div className="p-2 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
            </div>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
                <h3 className={`text-3xl font-black tracking-tighter italic ${textColor}`}>{value}</h3>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">{sub}</p>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const colors: any = {
        Completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        Refunded: 'bg-red-50 text-red-600 border-red-100 line-through',
        Pending: 'bg-orange-50 text-orange-600 border-orange-100',
        Failed: 'bg-gray-50 text-gray-400 border-gray-100',
    };
    return (
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${colors[status]}`}>
            {status}
        </span>
    );
}

function SummaryItem({ label, value, sub }: any) {
    return (
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
            <p className="font-black text-gray-900 italic">{value}</p>
            <p className="text-[10px] font-bold text-gray-400">{sub}</p>
        </div>
    )
}

function LedgerLine({ label, value, color }: any) {
    return (
        <div className="flex justify-between items-center">
            <p className="text-xs font-bold text-white/70">{label}</p>
            <p className={`font-black italic px-2 ${color || 'text-white'}`}>{value}</p>
        </div>
    )
}
