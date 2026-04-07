import { useState, useEffect } from 'react';
import {
    Check, X, Building2, MapPin, Eye, FileText, User, Phone, ShieldCheck,
    Dumbbell, Users, Landmark, Award, Shield, Mail, ArrowUpRight,
    ChevronRight, FileCheck, AlertCircle, Trash2, Search, Filter,
    TrendingUp, Star, MoreHorizontal, Activity, Layers, Power, Plus, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchGyms, updateGymStatus, createGym, fetchBookingsByGym, fetchPlansByGym, fetchAllPayouts, processPayout } from '../lib/api';

interface GymDetail {
    _id: string;
    name: string;
    ownerName?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    location: string;
    address: string;
    createdAt: string;
    status: string;
    tier?: string;
    revenues?: string;
    members?: number;
    rating?: number;
    description: string;
    facilities: string[];
    images: string[];
    documentation?: {
        tradingLicense: string;
        fireSafety: string;
        insurancePolicy: string;
        bankStatement: string;
    };
    staffCount?: number;
    areaSize?: string;
    establishedYear?: string;
    plans?: { name: string; price: string; duration: string; features: string[] }[];
    trainerDetails?: { name: string; experience: string; specialization: string; photo?: string }[];
    houseRules?: string[];
    gallery?: string[];
    liveFootfall?: number;
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        ifscCode: string;
        bankName: string;
    };
}

export function PartnerManagement() {
    const [activeTab, setActiveTab] = useState<'directory' | 'onboarding' | 'suspended' | 'payouts'>('onboarding');
    const [selectedGym, setSelectedGym] = useState<GymDetail | null>(null);
    const [detailTab, setDetailTab] = useState<'profile' | 'portfolio' | 'financials' | 'clients' | 'plans' | 'preview' | 'ops'>('profile');
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnboardModal, setShowOnboardModal] = useState(false);
    const [gyms, setGyms] = useState<GymDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [gymBookings, setGymBookings] = useState<any[]>([]);
    const [isFetchingBookings, setIsFetchingBookings] = useState(false);
    const [payoutRequests, setPayoutRequests] = useState<any[]>([]);
    const [processingPayoutId, setProcessingPayoutId] = useState<string | null>(null);
    const [selectedPayout, setSelectedPayout] = useState<any>(null);

    const [error, setError] = useState<string | null>(null);
    const [selectedGymPlans, setSelectedGymPlans] = useState<any[]>([]);
    const [isFetchingPlans, setIsFetchingPlans] = useState(false);

    const loadGyms = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchGyms();
            // Map populated ownerId to flat fields for UI compatibility
            const mappedData = data.map((g: any) => ({
                ...g,
                ownerName: g.ownerId?.name || g.ownerName || 'Unknown Owner',
                ownerEmail: g.ownerId?.email || g.ownerEmail,
                ownerPhone: g.ownerId?.phoneNumber || g.ownerId?.phone || g.ownerPhone
            }));
            setGyms(mappedData);
        } catch (err: any) {
            console.error('Fetch Error:', err);
            setError(err.message || 'Failed to sync with global directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGyms();
    }, []);

    useEffect(() => {
        const loadGymData = async () => {
            if (selectedGym) {
                setIsFetchingBookings(true);
                setIsFetchingPlans(true);
                try {
                    const [bookingsData, plansData] = await Promise.all([
                        fetchBookingsByGym(selectedGym._id),
                        fetchPlansByGym(selectedGym._id)
                    ]);
                    setGymBookings(bookingsData);
                    setSelectedGymPlans(plansData);
                } catch (err) {
                    console.error('Failed to fetch gym data:', err);
                } finally {
                    setIsFetchingBookings(false);
                    setIsFetchingPlans(false);
                }
            } else {
                setGymBookings([]);
                setSelectedGymPlans([]);
            }
        };
        loadGymData();
    }, [selectedGym]);

    const financialHistory = gymBookings.slice(0, 5).map(b => ({
        id: b._id.slice(-6).toUpperCase(),
        amount: `₹${b.amount}`,
        type: 'Booking',
        status: (b.status === 'active' || b.status === 'completed') ? 'Success' : b.status === 'cancelled' ? 'Hold' : 'Pending',
        date: new Date(b.bookingDate).toLocaleDateString()
    }));

    const clientDirectory = gymBookings.map(b => ({
        id: b._id.slice(-4),
        name: b.memberName,
        plan: b.planId?.name || 'Standard Plan',
        lastActive: new Date(b.bookingDate).toLocaleDateString(),
        spend: `₹${b.amount}`
    }));

    const totalRevenue = gymBookings
        .filter(b => b.status?.toLowerCase() === 'active' || b.status?.toLowerCase() === 'completed' || b.status?.toLowerCase() === 'upcoming')
        .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    const platformCommission = totalRevenue * 0.15;

    // FORM STATE
    const [newGym, setNewGym] = useState({
        name: '',
        ownerName: '',
        ownerPhone: '',
        ownerEmail: '',
        tier: 'Premium',
        location: '',
        address: '',
        description: 'Elite fitness facility powered by Gymkaana'
    });

    const filteredGyms = gyms.filter(g => {
        const matchesSearch = (g.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (g.location || '').toLowerCase().includes(searchQuery.toLowerCase());

        const status = (g.status || '').toLowerCase();
        if (activeTab === 'directory') return (status === 'active' || status === 'approved') && matchesSearch;
        if (activeTab === 'onboarding') return (status === 'pending' || status === 'review') && matchesSearch;
        if (activeTab === 'suspended') return (status === 'suspended' || status === 'inactive') && matchesSearch;
        return matchesSearch;
    });

    const loadPayouts = async () => {
        setLoading(true);
        try {
            const data = await fetchAllPayouts();
            setPayoutRequests(data);
        } catch (err: any) {
            console.error("Failed to load payouts:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'payouts') {
            loadPayouts();
        }
    }, [activeTab]);

    const handlePayoutAction = async (id: string, action: 'Paid' | 'Rejected') => {
        setProcessingPayoutId(id);
        try {
            await processPayout(id, action, action === 'Paid' ? `TXN-${Date.now()}` : undefined);
            await loadPayouts();
        } catch (err) {
            console.error("Failed to process payout:", err);
            alert("Failed to process payout");
        } finally {
            setProcessingPayoutId(null);
        }
    };

    const handleAction = async (id: string, status: string) => {
        setIsProcessing(true);
        try {
            await updateGymStatus(id, status);
            await loadGyms();
            setIsProcessing(false);
            setSelectedGym(null);
        } catch (err) {
            console.error(err);
            alert('Failed to update hub status');
            setIsProcessing(false);
        }
    };

    return (
        <div className="p-10 max-w-[1600px] mx-auto space-y-12 pb-32 font-sans">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-black rounded-2xl shadow-xl shadow-black/10">
                            <Building2 className="w-6 h-6 text-[#A3E635]" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Partner Ecosystem</h2>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Lifecycle management for institutional hub partners</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={loadGyms}
                        disabled={loading}
                        className="px-6 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                        title="Force cloud sync"
                    >
                        <Activity className={`w-4 h-4 ${loading ? 'animate-spin text-[#A3E635]' : ''}`} /> Sync Database
                    </button>
                    <button
                        onClick={() => setShowOnboardModal(true)}
                        className="px-10 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 active:scale-95"
                    >
                        <Plus className="w-5 h-5 text-[#A3E635]" /> Onboard New Venue
                    </button>
                </div>
            </header>

            {/* TAB NAVIGATION */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex gap-10">
                    <TabLink active={activeTab === 'directory'} label="Active Directory" count={gyms.filter(g => (g.status || '').toLowerCase() === 'active' || (g.status || '').toLowerCase() === 'approved').length} onClick={() => setActiveTab('directory')} />
                    <TabLink active={activeTab === 'onboarding'} label="Onboarding Queue" count={gyms.filter(g => (g.status || '').toLowerCase() === 'pending').length} onClick={() => setActiveTab('onboarding')} />
                    <TabLink active={activeTab === 'suspended'} label="Suspension Vault" count={gyms.filter(g => (g.status || '').toLowerCase() === 'suspended' || (g.status || '').toLowerCase() === 'inactive').length} onClick={() => setActiveTab('suspended')} />
                    <TabLink active={activeTab === 'payouts'} label="Payout Requests" count={payoutRequests.filter(p => p.status === 'Pending').length} onClick={() => setActiveTab('payouts')} />
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl w-full md:w-96 border border-gray-100">
                    <Search className="w-5 h-5 text-gray-400 ml-4" />
                    <input
                        type="text"
                        placeholder="Search Hubs, Locations, or Keys..."
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-wider w-full placeholder:text-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        title="Search partners"
                    />
                    <button title="Filter results" className="p-2 bg-white rounded-xl shadow-sm hover:bg-black hover:text-white transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* DIRECTORY LIST */}
            {activeTab === 'payouts' ? (
                <div className="space-y-6">
                    {payoutRequests.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                            <Landmark className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-400">No Payout Requests</h3>
                            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Check back later for partner withdrawals</p>
                        </div>
                    ) : (
                        payoutRequests.map(payout => (
                            <div
                                key={payout._id}
                                onClick={() => setSelectedPayout(payout)}
                                className="bg-white border border-gray-200 rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:border-black transition-all cursor-pointer relative group"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-black italic uppercase text-gray-900">{payout.gymId?.name || 'Unknown Gym'}</h3>
                                        <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${payout.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' :
                                            payout.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>{payout.status}</span>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        Requested: {new Date(payout.requestedAt).toLocaleDateString()}
                                    </p>
                                    {payout.bankDetails && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl flex flex-wrap gap-8">
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                                <p className="font-mono font-bold text-sm text-gray-900">{payout.bankDetails.accountNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">IFSC</p>
                                                <p className="font-mono font-bold text-sm text-gray-900">{payout.bankDetails.ifscCode}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bank</p>
                                                <p className="font-bold text-sm text-gray-900">{payout.bankDetails.bankName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                        <p className="text-3xl font-black italic text-gray-900">₹{payout.amount}</p>
                                    </div>
                                    {payout.status === 'Pending' && (
                                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => handlePayoutAction(payout._id, 'Rejected')}
                                                disabled={processingPayoutId === payout._id}
                                                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                                title="Reject"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handlePayoutAction(payout._id, 'Paid')}
                                                disabled={processingPayoutId === payout._id}
                                                className="px-6 py-4 bg-black text-[#A3E635] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {processingPayoutId === payout._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                Approve
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[32px]" />
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredGyms.map((gym) => (
                            <motion.div
                                key={gym._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                                onClick={() => setSelectedGym(gym)}
                                className="bg-white border border-gray-200 rounded-[40px] p-8 hover:shadow-2xl hover:border-black transition-all cursor-pointer group flex flex-wrap md:flex-nowrap items-center gap-10 shadow-sm"
                            >
                                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                    <img src={gym.images[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={gym.name} />
                                </div>

                                <div className="flex-1 min-w-[200px]">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">{gym.name}</h3>
                                        <TierBadge tier={gym.tier || 'Gold'} />
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">
                                        <MapPin className="w-3 h-3 text-[#A3E635] shrink-0" /> {gym.location}
                                        <span className="mx-2 text-gray-200">|</span>
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {gym.rating && gym.rating > 0 ? gym.rating : 'N/A'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 border-l border-gray-50 pl-10">
                                    <RowStat label="Revenue" value={gym.revenues || '₹0'} sub="Lifetime GMV" />
                                    <RowStat label="Footfall" value={gym.liveFootfall ?? gym.members ?? 0} sub="Active Users" />
                                    <RowStat label="Status" value={gym.status} sub={new Date(gym.createdAt).toLocaleDateString()} isStatus />
                                </div>

                                <div className="hidden lg:flex items-center gap-4 border-l border-gray-50 pl-10">
                                    <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-black group-hover:bg-[#A3E635] transition-all" title="View details">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all" title="More options">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredGyms.length === 0 && !loading && !error && (
                        <div className="py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                            <Building2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-400">No Venues Found in {activeTab}</h3>
                            <p className="text-xs font-bold text-gray-300 uppercase tracking-widest mt-1">Check other tabs or try a different search</p>
                        </div>
                    )}
                    {error && !loading && (
                        <div className="py-20 text-center bg-red-50 rounded-[40px] border-2 border-dashed border-red-100">
                            <AlertCircle className="w-16 h-16 text-red-200 mx-auto mb-4" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-red-400">Sync Interrupted</h3>
                            <p className="text-xs font-bold text-red-300 uppercase tracking-widest mt-1 mb-6">{error}</p>
                            <button onClick={loadGyms} className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">Retry Sync</button>
                        </div>
                    )}
                    {loading && (
                        <div className="py-20 text-center">
                            <div className="w-12 h-12 border-4 border-black border-t-[#A3E635] rounded-full animate-spin mx-auto mb-6" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">Syncing Global Directory</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-2">Connecting to institutional cloud nexus...</p>
                        </div>
                    )}
                </div>
            )}

            {/* HUB INTELLIGENCE MODAL */}
            <AnimatePresence>
                {selectedGym && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            className="bg-white w-full max-w-7xl h-[92vh] rounded-[64px] overflow-hidden flex flex-col relative shadow-[0_32px_96px_rgba(0,0,0,0.6)] border border-white/20"
                        >
                            <button
                                onClick={() => setSelectedGym(null)}
                                className="absolute top-10 right-10 p-5 bg-gray-50 hover:bg-black hover:text-white rounded-[24px] transition-all z-[110] shadow-sm"
                                title="Close Intelligence Review"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                                    {/* Left Sidebar: Performance & Context */}
                                    <div className="lg:col-span-4 bg-gray-900 p-12 text-white flex flex-col justify-between relative overflow-y-auto custom-scrollbar-dark min-h-0 h-full">
                                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#A3E635]/20 blur-[130px] rounded-full" />

                                        <div className="relative z-10">
                                            <div className="aspect-square w-full rounded-[48px] overflow-hidden border-4 border-white/5 shadow-3xl mb-10">
                                                <img src={selectedGym.images[0] || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48'} className="w-full h-full object-cover" alt="Hub" />
                                            </div>

                                            <div className="mb-12">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.9]">{selectedGym.name}</h3>
                                                    <TierBadge tier={selectedGym.tier || 'Gold'} large />
                                                </div>
                                                <p className="text-[10px] font-black text-[#A3E635] uppercase tracking-[0.4em] mt-4">Hub Intelligence V4.2</p>
                                            </div>

                                            <div className="space-y-4">
                                                <HubProp label="Platform ID" value={selectedGym._id.slice(-8).toUpperCase()} />
                                                <HubProp label="Contract State" value={selectedGym.status.toUpperCase()} />
                                                <HubProp label="Onboarded" value={new Date(selectedGym.createdAt).toLocaleDateString()} />
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-white/10 relative z-10 flex gap-4 text-center">
                                            <button className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                                <Mail className="w-4 h-4 text-[#A3E635]" /> Reach Owner
                                            </button>
                                            <button className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                                <Phone className="w-4 h-4 text-[#A3E635]" /> Urgent Line
                                            </button>
                                        </div>
                                    </div>

                                    {/* Main Body: Docs & Data */}
                                    <div className="lg:col-span-8 p-12 space-y-12 bg-white overflow-hidden relative flex flex-col">
                                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#A3E635]/5 blur-[120px] rounded-full -mr-64 -mt-64" />

                                        {/* DETAIL TABS */}
                                        <div className="flex gap-10 border-b border-gray-100 relative z-10 flex-shrink-0">
                                            <button onClick={() => setDetailTab('profile')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'profile' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Hub Profile {detailTab === 'profile' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#A3E635] rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('plans')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'plans' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Membership Plans {detailTab === 'plans' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#A3E635] rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('portfolio')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'portfolio' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Owner Portfolio {detailTab === 'portfolio' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#A3E635] rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('financials')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'financials' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Financials {detailTab === 'financials' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#A3E635] rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('clients')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'clients' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Client Base {detailTab === 'clients' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#A3E635] rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('ops')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'ops' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Staff & Ops {detailTab === 'ops' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#A3E635] rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('preview')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'preview' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Live Preview {detailTab === 'preview' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-[#A3E635] rounded-full" />}
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-12 relative z-10 overflow-y-auto pr-4 custom-scrollbar">
                                            {detailTab === 'profile' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 pb-12">
                                                    <div className="grid grid-cols-3 gap-10">
                                                        <MetricBox label="Avg Quality Score" value={selectedGym.rating?.toString() || "N/A"} icon={Star} color="text-yellow-500" />
                                                        <MetricBox label="Revenue Yield" value={selectedGym.revenues || "₹0"} icon={TrendingUp} color="text-emerald-500" />
                                                        <MetricBox label="Platform Units" value={(selectedGym.liveFootfall ?? selectedGym.members ?? 0).toString()} icon={Users} color="text-blue-500" />
                                                    </div>

                                                    <section className="space-y-8">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1 flex items-center gap-3">
                                                            <Layers className="w-4 h-4" /> Facility Gallery
                                                        </h4>
                                                        <div className="grid grid-cols-3 gap-6 h-64">
                                                            {(selectedGym.gallery || selectedGym.images || []).slice(0, 3).map((img, i) => (
                                                                <div key={i} className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group">
                                                                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Facility" />
                                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </section>

                                                    <section className="space-y-8">
                                                        <header className="flex justify-between items-end">
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1 flex items-center gap-3">
                                                                    <ShieldCheck className="w-4 h-4" /> Compliance Portfolio
                                                                </h4>
                                                                <p className="text-xl font-black italic tracking-tighter uppercase">Document Verification Vault</p>
                                                            </div>
                                                        </header>

                                                        <div className="grid grid-cols-2 gap-6">
                                                            <AssetCard label="Trading License" val={selectedGym.documentation?.tradingLicense || "VERIFIED"} color="indigo" />
                                                            <AssetCard label="Fire Safety NoC" val={selectedGym.documentation?.fireSafety || "VERIFIED"} color="orange" />
                                                            <AssetCard label="GST Certificate" val="29AAAAA0000A1Z5" color="emerald" />
                                                            < AssetCard label="Insurance Desk" val={selectedGym.documentation?.insurancePolicy || "VERIFIED"} color="blue" />
                                                        </div>
                                                    </section>
                                                </motion.div>
                                            )}

                                            {detailTab === 'plans' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                                    <div className="flex justify-between items-end">
                                                        <h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Live Membership Offerings</h4>
                                                        {isFetchingPlans && <Loader2 className="w-6 h-6 animate-spin text-gray-300" />}
                                                    </div>

                                                    {selectedGymPlans.length > 0 ? (
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            {selectedGymPlans.map((plan, i) => (
                                                                <div key={plan._id || i} className="p-10 bg-gray-900 text-white rounded-[48px] border border-white/10 relative overflow-hidden group hover:border-[#A3E635]/50 transition-all">
                                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#A3E635]/10 blur-3xl rounded-full group-hover:bg-[#A3E635]/20 transition-all" />
                                                                    <p className="text-[10px] font-black text-[#A3E635] uppercase tracking-widest mb-2">{plan.duration}</p>
                                                                    <h3 className="text-3xl font-black italic uppercase mb-6 leading-none">{plan.name}</h3>
                                                                    <div className="text-4xl font-black italic text-white mb-8">₹{plan.price}</div>
                                                                    <div className="space-y-4">
                                                                        {plan.features?.map((f: string) => (
                                                                            <div key={f} className="flex items-center gap-3 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                                                                <Check className="w-4 h-4 text-[#A3E635]" /> {f}
                                                                            </div>
                                                                        )) || <p className="text-white/30 text-[10px] uppercase font-bold">Standard Features Applied</p>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : !isFetchingPlans ? (
                                                        <div className="p-20 text-center bg-gray-50 rounded-[48px] border-2 border-dashed border-gray-100">
                                                            <Layers className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No active plans detected for this hub</p>
                                                        </div>
                                                    ) : null}
                                                </motion.div>
                                            )}

                                            {detailTab === 'portfolio' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                                    <div className="bg-gray-50 p-10 rounded-[48px] border border-gray-100 space-y-8">
                                                        <h4 className="text-xl font-black italic uppercase tracking-tighter">Business Application Data</h4>
                                                        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                                            <DetailRow label="Entity Owner" value={selectedGym.ownerName || "Institutional Partner"} icon={User} />
                                                            <DetailRow label="Contact Line" value={selectedGym.ownerPhone || "NOT SECURED"} icon={Phone} />
                                                            <DetailRow label="Institutional Email" value={selectedGym.ownerEmail || "NOT SECURED"} icon={Mail} />
                                                            <DetailRow label="Established" value={selectedGym.establishedYear || "2020"} icon={Activity} />
                                                            <DetailRow label="PAN Account" value="ABCDE1234F" icon={ShieldCheck} />
                                                            <RowStat label="Base Location" value={selectedGym.address} icon={MapPin} />
                                                        </div>
                                                    </div>

                                                    <div className="p-10 border border-gray-100 rounded-[48px] space-y-6">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Hub Description</h4>
                                                        <p className="text-gray-600 italic font-medium leading-[1.8] text-lg">"{selectedGym.description}"</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {detailTab === 'financials' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                                    <div className="grid grid-cols-2 gap-8">
                                                        <div className="bg-black text-white p-10 rounded-[48px] border border-white/10">
                                                            <p className="text-[10px] font-black text-[#A3E635] uppercase tracking-[0.3em] mb-2">Total Gross Revenue</p>
                                                            <h3 className="text-4xl font-black italic uppercase mb-2">
                                                                {totalRevenue >= 100000
                                                                    ? `₹${(totalRevenue / 100000).toFixed(2)}L`
                                                                    : `₹${totalRevenue.toLocaleString()}`}
                                                            </h3>
                                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Calculated from {gymBookings.length} synced bookings</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-10 rounded-[48px] border border-gray-100">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Platform Yield (15%)</p>
                                                            <h3 className="text-4xl font-black italic uppercase mb-2">₹{(platformCommission / 1000).toFixed(1)}K</h3>
                                                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Commission applied to active state</p>
                                                        </div>
                                                    </div>



                                                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />

                                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1 flex items-center gap-3">
                                                                    <Landmark className="w-4 h-4" /> Settlement Account
                                                                </h4>
                                                                <p className="text-xl font-black italic tracking-tighter uppercase">Bank Verification</p>
                                                            </div>
                                                            {selectedGym.documentation?.bankStatement && (
                                                                <a
                                                                    href={selectedGym.documentation.bankStatement}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-6 py-3 bg-gray-50 hover:bg-black hover:text-white border border-gray-200 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
                                                                >
                                                                    <FileText className="w-3 h-3" /> View Proof
                                                                </a>
                                                            )}
                                                        </div>

                                                        {selectedGym.bankDetails?.accountNumber ? (
                                                            <div className="grid grid-cols-2 gap-8 relative z-10">
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Beneficiary Name</p>
                                                                    <p className="font-black text-lg uppercase text-gray-900">{selectedGym.bankDetails.accountName}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bank Name</p>
                                                                    <p className="font-black text-lg uppercase text-gray-900">{selectedGym.bankDetails.bankName}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                                                                    <p className="font-mono font-bold text-lg text-gray-900 tracking-wider">
                                                                        {selectedGym.bankDetails.accountNumber.replace(/.(?=.{4})/g, '•')}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">IFSC / Code</p>
                                                                    <p className="font-mono font-bold text-lg text-gray-900">{selectedGym.bankDetails.ifscCode}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="p-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                                                                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No banking details configured</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-6">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Transaction Telemetry</h4>
                                                        <div className="space-y-3">
                                                            {financialHistory.map(tx => (
                                                                <div key={tx.id} className="p-6 bg-gray-50 border border-gray-100 rounded-[32px] flex items-center justify-between group hover:border-black transition-all">
                                                                    <div className="flex items-center gap-4 text-left">
                                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black italic text-[10px]">{tx.id}</div>
                                                                        <div>
                                                                            <p className="font-black text-xs uppercase tracking-tight text-gray-900">{tx.type} Initialization</p>
                                                                            <p className="text-[9px] font-bold text-gray-400 uppercase">{tx.date}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-8">
                                                                        <p className="font-black italic text-lg text-gray-900">{tx.amount}</p>
                                                                        <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${tx.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : tx.status === 'Hold' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{tx.status}</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {detailTab === 'clients' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                                    <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden">
                                                        <table className="w-full text-left">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">Member ID</th>
                                                                    <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400">Name / Plan</th>
                                                                    <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Spend</th>
                                                                    <th className="p-6 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Last Sync</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-50">
                                                                {clientDirectory.map(client => (
                                                                    <tr key={client.id} className="hover:bg-gray-50 transition-all cursor-pointer">
                                                                        <td className="p-6">
                                                                            <span className="font-black italic text-xs uppercase text-gray-900">#MBR-{client.id}X</span>
                                                                        </td>
                                                                        <td className="p-6">
                                                                            <p className="font-black uppercase italic tracking-tight text-gray-900">{client.name}</p>
                                                                            <p className="text-[9px] font-bold text-[#A3E635] uppercase">{client.plan}</p>
                                                                        </td>
                                                                        <td className="p-6 text-center font-black italic text-gray-900">{client.spend}</td>
                                                                        <td className="p-6 text-right">
                                                                            <span className="text-[9px] font-bold text-gray-400 uppercase">{client.lastActive}</span>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {detailTab === 'ops' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                                                    <section className="space-y-8">
                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1 flex items-center gap-3">
                                                                    <Users className="w-4 h-4" /> Personnel Roster
                                                                </h4>
                                                                <p className="text-xl font-black italic tracking-tighter uppercase">Certified Staff & Trainers</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-6">
                                                            {selectedGym.trainerDetails && selectedGym.trainerDetails.length > 0 ? (
                                                                selectedGym.trainerDetails.map((t, i) => (
                                                                    <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-[32px] flex items-center gap-6 group hover:border-black transition-all">
                                                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                                                                            <User className="w-8 h-8 text-gray-200" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-black uppercase italic tracking-tight text-gray-900 leading-none">{t.name}</p>
                                                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 italic">{t.specialization}</p>
                                                                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-2">{t.experience} Experience</p>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-2 p-10 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100 text-center">
                                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No staff data synchronized for this hub</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </section>

                                                    <section className="space-y-8">
                                                        <div>
                                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1 flex items-center gap-3">
                                                                <Shield className="w-4 h-4" /> Operational Protocols
                                                            </h4>
                                                            <p className="text-xl font-black italic tracking-tighter uppercase">House Rules & Compliance</p>
                                                        </div>

                                                        <div className="space-y-4">
                                                            {selectedGym.houseRules && selectedGym.houseRules.length > 0 ? (
                                                                selectedGym.houseRules.map((rule, i) => (
                                                                    <div key={i} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm">
                                                                        <div className="w-8 h-8 bg-black text-white text-[10px] font-black italic flex items-center justify-center rounded-xl shrink-0">
                                                                            {String(i + 1).padStart(2, '0')}
                                                                        </div>
                                                                        <span className="text-xs font-black uppercase tracking-tight text-gray-700 italic">{rule}</span>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="p-10 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100 text-center">
                                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Standard operating procedures applied</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </section>
                                                </motion.div>
                                            )}

                                            {detailTab === 'preview' && (
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[600px] flex items-center justify-center p-10 bg-gray-50 rounded-[48px] border border-gray-100 overflow-hidden relative">
                                                    <div className="absolute top-10 left-10 text-left">
                                                        <h4 className="text-[10px] font-black text-[#A3E635] uppercase tracking-[0.4em]">Marketplace Simulation</h4>
                                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Visualizing {selectedGym.name} as seen by users</p>
                                                    </div>

                                                    {/* Simulated Mobile Frame */}
                                                    <div className="w-[340px] h-[580px] bg-white rounded-[40px] shadow-2xl border-[8px] border-black overflow-hidden relative flex flex-col scale-90 text-left">
                                                        <div className="h-48 bg-gray-200 relative flex-shrink-0">
                                                            <img src={selectedGym.images[0] || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f'} className="w-full h-full object-cover" alt="Preview" />
                                                            <div className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-xl"><ChevronRight className="w-4 h-4 text-white rotate-180" /></div>
                                                        </div>
                                                        <div className="p-6 space-y-4 overflow-y-auto overflow-x-hidden">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h5 className="font-black text-lg text-gray-900 leading-none">{selectedGym.name}</h5>
                                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{selectedGym.location}</p>
                                                                </div>
                                                                <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                                                                    <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                                                                    <span className="text-[10px] font-black text-emerald-600">{selectedGym.rating || "N/A"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 flex-wrap">
                                                                {(selectedGym.facilities || ["Weights", "Steam"]).slice(0, 3).map(f => (
                                                                    <span key={f} className="px-2 py-1 bg-gray-100 rounded-md text-[8px] font-black uppercase text-gray-900">{f}</span>
                                                                ))}
                                                            </div>
                                                            <div className="pt-4 border-t border-gray-50 mt-4">
                                                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Starts from</p>
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <p className="text-xl font-black text-gray-900 italic">₹199 <span className="text-[10px] font-medium text-gray-400">/visit</span></p>
                                                                    <button className="px-6 py-2 bg-black text-[#A3E635] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/10">Book</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-auto p-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                                                            <div className="flex gap-4">
                                                                <div className="flex-1 h-3 bg-gray-200 rounded-full" />
                                                                <div className="w-12 h-3 bg-[#A3E635]/20 rounded-full" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* MANAGEMENT CONTROLS */}
                                        <section className="pt-10 border-t border-gray-100 flex gap-4 relative z-60">
                                            {selectedGym.status.toLowerCase() === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(selectedGym._id, 'Rejected')}
                                                        disabled={isProcessing}
                                                        className="px-10 py-5 bg-white border border-red-100 text-red-500 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-50 transition-all flex items-center gap-3 disabled:opacity-50"
                                                    >
                                                        {isProcessing ? 'SYNCING...' : <><X className="w-5 h-5" /> Deny Access</>}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(selectedGym._id, 'Approved')}
                                                        disabled={isProcessing}
                                                        className="flex-1 py-5 bg-black text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] hover:shadow-2xl hover:shadow-black/30 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                                    >
                                                        {isProcessing ? (
                                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                                                <Activity className="w-6 h-6 text-[#A3E635]" />
                                                            </motion.div>
                                                        ) : (
                                                            <><FileCheck className="w-6 h-6 text-[#A3E635]" /> Authorize & Launch Hub</>
                                                        )}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(selectedGym._id, selectedGym.status === 'Approved' ? 'Inactive' : 'Approved')}
                                                        disabled={isProcessing}
                                                        className={`px-10 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 disabled:opacity-50 ${selectedGym.status === 'Approved'
                                                            ? 'bg-red-50 text-red-500 hover:bg-red-600 hover:text-white'
                                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                            }`}
                                                    >
                                                        <Power className="w-6 h-6" /> {selectedGym.status === 'Approved' ? 'Operational Suspend' : 'Resume Hub'}
                                                    </button>
                                                    <button className="flex-1 py-5 bg-black text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 border border-white/10 active:scale-95 transition-all">
                                                        <Activity className="w-5 h-5 text-[#A3E635]" /> Sync Hub State
                                                    </button>
                                                    <button className="px-10 py-5 bg-gray-50 text-black border border-gray-100 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] transition-all">
                                                        Hold Payouts
                                                    </button>
                                                </>
                                            )}
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* PAYOUT DETAIL MODAL */}
            <AnimatePresence>
                {selectedPayout && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden p-12 shadow-3xl relative"
                        >
                            <button
                                onClick={() => setSelectedPayout(null)}
                                className="absolute top-8 right-8 p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all"
                                title="Close Details"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-10 text-left">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-1 text-gray-900 leading-none">Payout Intelligence</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">TRANSACTION ID: {selectedPayout._id.slice(-8).toUpperCase()}</p>
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <h2 className="text-4xl font-black italic tracking-tighter text-gray-900">₹{selectedPayout.amount.toLocaleString()}</h2>
                                    </div>
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${selectedPayout.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' :
                                        selectedPayout.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                                            selectedPayout.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                                'bg-orange-100 text-orange-600'
                                        }`}>
                                        {selectedPayout.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Timeline</h4>
                                        <div className="p-6 bg-white border border-gray-100 rounded-[24px]">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Requested</p>
                                                    <p className="text-sm font-black uppercase text-gray-900">{new Date(selectedPayout.requestedAt).toLocaleString()}</p>
                                                </div>
                                                {selectedPayout.paidAt && (
                                                    <div>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Processed</p>
                                                        <p className="text-sm font-black uppercase text-gray-900">{new Date(selectedPayout.paidAt).toLocaleString()}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Reference</h4>
                                        <div className="p-6 bg-white border border-gray-100 rounded-[24px] h-full">
                                            {selectedPayout.transactionId ? (
                                                <div>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Conf. ID</p>
                                                    <p className="font-mono text-sm font-black text-gray-900 break-all">{selectedPayout.transactionId}</p>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] font-black text-gray-300 uppercase italic">Pending Generation</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Beneficiary Data</h4>
                                    <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Bank Name</p>
                                            <p className="text-sm font-black uppercase text-gray-900">{selectedPayout.bankDetails?.bankName}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Account Number</p>
                                            <p className="font-mono text-sm font-black text-gray-900">{selectedPayout.bankDetails?.accountNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">IFSC Code</p>
                                            <p className="font-mono text-sm font-black text-gray-900">{selectedPayout.bankDetails?.ifscCode}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Beneficiary</p>
                                            <p className="text-sm font-black uppercase text-gray-900">{selectedPayout.bankDetails?.accountName}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedPayout.status === 'Pending' && (
                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <button
                                            onClick={() => {
                                                handlePayoutAction(selectedPayout._id, 'Rejected');
                                                setSelectedPayout(null);
                                            }}
                                            className="py-5 bg-red-50 text-red-500 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
                                        >
                                            <X className="w-5 h-5" /> Reject
                                        </button>
                                        <button
                                            onClick={() => {
                                                handlePayoutAction(selectedPayout._id, 'Paid');
                                                setSelectedPayout(null);
                                            }}
                                            className="py-5 bg-black text-[#A3E635] rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-xl transition-all flex items-center justify-center gap-3"
                                        >
                                            <Check className="w-5 h-5" /> Approve Payout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ONBOARDING MODAL */}
            <AnimatePresence>
                {showOnboardModal && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            className="bg-white w-full max-w-2xl rounded-[48px] overflow-hidden p-12 shadow-3xl relative"
                        >
                            <button
                                onClick={() => setShowOnboardModal(false)}
                                className="absolute top-8 right-8 p-3 bg-gray-50 rounded-xl hover:bg-black hover:text-white transition-all"
                                title="Close Form"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mb-10 text-left">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-1 text-gray-900 leading-none">New Hub Onboarding</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initialization of institutional partnership</p>
                            </div>

                            <div className="space-y-6 text-left">
                                <FormInput label="Official Hub Name" placeholder="e.g. Iron Paradise Indiranagar" value={newGym.name} onChange={(v) => setNewGym({ ...newGym, name: v })} />
                                <FormInput label="Owner Name / Entity" placeholder="e.g. Arjan Singh" value={newGym.ownerName} onChange={(v) => setNewGym({ ...newGym, ownerName: v })} />
                                <div className="grid grid-cols-2 gap-6">
                                    <FormInput label="Owner Phone" placeholder="9876543210" value={newGym.ownerPhone} onChange={(v) => setNewGym({ ...newGym, ownerPhone: v })} />
                                    <FormInput label="Owner Email" placeholder="owner@gym.com" value={newGym.ownerEmail} onChange={(v) => setNewGym({ ...newGym, ownerEmail: v })} />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Platform Tier</label>
                                        <select
                                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#A3E635] outline-none transition-all uppercase tracking-wider text-gray-900"
                                            title="Select Hub Tier"
                                            value={newGym.tier}
                                            onChange={(e) => setNewGym({ ...newGym, tier: e.target.value })}
                                        >
                                            <option>Premium</option>
                                            <option>Gold</option>
                                            <option>Boutique</option>
                                        </select>
                                    </div>
                                    <FormInput label="Base Location" placeholder="e.g. Indiranagar" value={newGym.location} onChange={(v) => setNewGym({ ...newGym, location: v })} />
                                </div>
                                <FormInput label="Detailed Address" placeholder="Door No, Street, Landmark" value={newGym.address} onChange={(v) => setNewGym({ ...newGym, address: v })} />

                                <div className="p-8 bg-[#A3E635]/5 rounded-[32px] border border-[#A3E635]/10">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-[#A3E635]">Pre-Audit Checklist</h4>
                                    <div className="space-y-3">
                                        <CheckItem label="GST Registration Certificate" />
                                        <CheckItem label="Trade License / NOC" />
                                        <CheckItem label="Facility Quality High-Res Images" />
                                    </div>
                                </div>

                                <button
                                    onClick={async () => {
                                        setIsProcessing(true);
                                        try {
                                            await createGym({
                                                ...newGym,
                                                status: 'Pending',
                                                images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48'],
                                                facilities: ['Weights', 'Cardio', 'Steam'],
                                                establishedYear: '2024'
                                            });
                                            setShowOnboardModal(false);
                                            await loadGyms();
                                            setNewGym({
                                                name: '', ownerName: '', ownerPhone: '', ownerEmail: '',
                                                tier: 'Premium', location: '', address: '', description: 'Elite fitness facility powered by Gymkaana'
                                            });
                                        } catch (err) {
                                            console.error(err);
                                            alert('Failed to initialize onboarding');
                                        } finally {
                                            setIsProcessing(false);
                                        }
                                    }}
                                    disabled={isProcessing}
                                    className="w-full py-6 bg-black text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/30 hover:bg-gray-800 transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isProcessing ? 'INITIALIZING...' : <><FileCheck className="w-6 h-6 text-[#A3E635]" /> Initialize Onboarding Request</>}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FormInput({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-sm focus:ring-2 focus:ring-[#A3E635] outline-none transition-all uppercase tracking-wider placeholder:text-gray-300 text-gray-900"
                title={label}
            />
        </div>
    )
}

function CheckItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-white border border-[#A3E635]/20 rounded-md flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-[#A3E635] rounded-[2px]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">{label}</span>
        </div>
    )
}

function DetailRow({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
    return (
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white shadow-sm rounded-xl border border-gray-100">
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">{label}</p>
                <p className="text-sm font-black uppercase italic tracking-tight text-gray-900">{value}</p>
            </div>
        </div>
    )
}

function RowStat({ label, value, sub, isStatus, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-4">
            {Icon && (
                <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="w-4 h-4 text-gray-400" />
                </div>
            )}
            <div className="space-y-0.5">
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">{label}</p>
                <p className={`font-black italic text-sm tracking-tight leading-none uppercase ${isStatus ? ((value || '').toLowerCase() === 'active' || (value || '').toLowerCase() === 'approved' ? 'text-emerald-500' : (value || '').toLowerCase() === 'pending' ? 'text-yellow-500' : 'text-red-500') : 'text-gray-900'}`}>{value}</p>
                <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.1em]">{sub}</p>
            </div>
        </div>
    )
}

function HubProp({ label, value }: any) {
    return (
        <div className="flex justify-between items-center py-4 border-b border-white/5 group hover:border-[#A3E635]/30 transition-all">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest group-hover:text-white/80 transition-colors">{label}</p>
            <p className="font-bold text-white text-sm tracking-wider">{value}</p>
        </div>
    )
}

function MetricBox({ label, value, icon: Icon, color }: any) {
    return (
        <div className="p-8 bg-gray-50 border border-transparent rounded-[48px] hover:bg-white hover:border-gray-100 hover:shadow-2xl transition-all group text-left">
            <Icon className={`w-8 h-8 ${color} mb-6`} />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-3xl font-black italic tracking-tighter uppercase text-gray-900 leading-none">{value}</p>
        </div>
    )
}

function AssetCard({ label, val, color }: any) {
    const colors: any = {
        indigo: 'text-indigo-500 bg-indigo-50 border-indigo-100',
        orange: 'text-orange-500 bg-orange-50 border-orange-100',
        emerald: 'text-emerald-500 bg-emerald-50 border-emerald-100',
        blue: 'text-blue-500 bg-blue-50 border-blue-100'
    }

    return (
        <div className="flex items-center gap-4 p-5 border border-gray-100 rounded-3xl group hover:border-black transition-all">
            <div className={`p-4 rounded-2xl ${colors[color]}`}>
                <FileText className="w-6 h-6" />
            </div>
            <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">{label}</p>
                <p className="text-xs font-black uppercase italic tracking-tight text-gray-900">{val}</p>
            </div>
        </div>
    )
}

function TabLink({ active, label, count, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-2 py-4 relative group transition-all`}
        >
            <span className={`text-xs font-black uppercase tracking-[0.2em] transition-all ${active ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>{label}</span>
            <span className={`text-[9px] font-black p-1 px-2 rounded-lg transition-all ${active ? 'bg-[#A3E635] text-black' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>{count}</span>
            {active && (
                <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full" />
            )}
        </button>
    )
}

function TierBadge({ tier, large }: any) {
    const colors: any = {
        Premium: 'bg-black text-[#A3E635] border-[#A3E635]/30',
        Gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        Boutique: 'bg-purple-50 text-purple-700 border-purple-200'
    };

    return (
        <span className={`px-3 py-1.5 rounded-xl border font-black uppercase tracking-widest shadow-sm ${large ? 'text-[10px]' : 'text-[8px]'} ${colors[tier] || colors.Gold}`}>
            {tier}
        </span>
    )
}
