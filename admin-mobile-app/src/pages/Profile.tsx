import { Mail, Phone, LogOut, ChevronRight, Building2, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_PROFILE = {
    name: 'Karthik Gowda',
    email: 'karthik.gowda@gymkaana.com',
    phone: '+91 98765 43210',
    role: 'Gym Owner',
    stats: {
        totalGyms: 4,
        totalRevenue: '₹2.4 Lakhs',
        activeMembers: 342
    }
};

export default function Profile() {
    const navigate = useNavigate();
    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-6 pb-8 sticky top-0 z-10 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {MOCK_PROFILE.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{MOCK_PROFILE.name}</h1>
                        <p className="text-gray-500 text-sm">{MOCK_PROFILE.role}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4 -mt-4 relative z-20">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-5 h-5 text-blue-500" />
                            <span className="text-xs text-gray-500 font-medium">GYMS OWNED</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{MOCK_PROFILE.stats.totalGyms}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-5 h-5 text-green-500" />
                            <span className="text-xs text-gray-500 font-medium">TOTAL REVENUE</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{MOCK_PROFILE.stats.totalRevenue}</p>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-100">Contact Details</h3>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Email Address</p>
                                <p className="text-sm font-medium text-gray-900">{MOCK_PROFILE.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500">Phone Number</p>
                                <p className="text-sm font-medium text-gray-900">{MOCK_PROFILE.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <span className="text-sm font-medium text-gray-700">Settings</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        onClick={() => navigate('/bank-details')}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <span className="text-sm font-medium text-gray-700">Bank Details</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100" onClick={() => navigate('/edit-profile')}>
                        <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100" onClick={() => navigate('/help-support')}>
                        <span className="text-sm font-medium text-gray-700">Help & Support</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                        className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors group"
                        onClick={() => navigate('/login')}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-5 h-5 text-red-500" />
                            <span className="text-sm font-medium text-red-600">Logout</span>
                        </div>
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">Version 1.0.2</p>
            </div>
        </div>
    );
}
