import { ArrowLeft, TrendingUp, DollarSign, Calendar, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "./ui/button";

interface PayoutsEarningsProps {
  onBack: () => void;
}

export function PayoutsEarnings({ onBack }: PayoutsEarningsProps) {
  const summaryCards = [
    { label: "Total Earnings", value: "₹1,24,500", change: "+15%", trend: "up" },
    { label: "This Month", value: "₹45,200", change: "+8%", trend: "up" },
    { label: "Pending Payouts", value: "₹12,300", change: "-", trend: null },
  ];

  const transactions = [
    {
      type: "credit",
      description: "Monthly membership - Rahul Sharma",
      amount: "+₹2,500",
      date: "Jan 4, 2026",
      time: "10:30 AM",
    },
    {
      type: "credit",
      description: "Daily pass - Priya Singh",
      amount: "+₹150",
      date: "Jan 4, 2026",
      time: "09:15 AM",
    },
    {
      type: "debit",
      description: "Payout to bank account",
      amount: "-₹25,000",
      date: "Jan 3, 2026",
      time: "03:00 PM",
    },
    {
      type: "credit",
      description: "Quarterly plan - Amit Kumar",
      amount: "+₹6,500",
      date: "Jan 3, 2026",
      time: "11:45 AM",
    },
    {
      type: "credit",
      description: "Monthly membership - Neha Patel",
      amount: "+₹2,500",
      date: "Jan 2, 2026",
      time: "07:20 PM",
    },
  ];

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
