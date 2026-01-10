import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, CreditCard, Save } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function BankDetails() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Mock initial data
    const [formData, setFormData] = useState({
        accountHolder: 'Karthik Gowda',
        bankName: 'HDFC Bank',
        accountNumber: 'XXXXXXXX5432',
        ifsc: 'HDFC0001234',
        upiId: 'karthik@okhdfc'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Show success toast or feedback here
        }, 1500);
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center mb-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Bank Details</h1>
            </div>

            <div className="p-4 max-w-md mx-auto">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <Landmark className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                        These details will be used for your weekly payouts. Please ensure they are correct to avoid delays.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <div>
                            <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                            <input
                                id="accountHolder"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.accountHolder}
                                onChange={e => setFormData({ ...formData, accountHolder: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                            <input
                                id="bankName"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.bankName}
                                onChange={e => setFormData({ ...formData, bankName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                            <input
                                id="accountNumber"
                                type="password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.accountNumber}
                                onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                            <input
                                id="ifsc"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                value={formData.ifsc}
                                onChange={e => setFormData({ ...formData, ifsc: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <h3 className="font-semibold text-gray-900">UPI Information</h3>
                        </div>
                        <div>
                            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                            <input
                                id="upiId"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.upiId}
                                onChange={e => setFormData({ ...formData, upiId: e.target.value })}
                                placeholder="name@upi"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2",
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Details
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
