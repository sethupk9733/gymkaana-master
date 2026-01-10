import { useState } from 'react';
import {
    Check, X, Building2, MapPin, Eye, FileText, User, Phone, ShieldCheck,
    Dumbbell, Users, Landmark, Award, Shield, Mail, ArrowUpRight,
    ChevronRight, FileCheck, AlertCircle, Trash2, Search, Filter,
    TrendingUp, Star, MoreHorizontal, Activity, Layers, Power, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GymDetail {
    id: number;
    name: string;
    owner: string;
    ownerPhone: string;
    ownerEmail: string;
    location: string;
    address: string;
    joined: string;
    status: 'pending' | 'active' | 'suspended' | 'rejected';
    tier: 'Premium' | 'Gold' | 'Boutique';
    revenue: string;
    members: number;
    rating: number;
    gstNo: string;
    panNo: string;
    description: string;
    facilities: string[];
    images: string[];
    documentation: {
        tradingLicense: string;
        fireSafety: string;
        insurancePolicy: string;
        bankStatement: string;
    };
    staffCount: number;
    areaSize: string;
    establishedYear: string;
    plans: { name: string; price: string; duration: string; features: string[] }[];
    gallery: string[];
}

export function PartnerManagement() {
    const [activeTab, setActiveTab] = useState<'directory' | 'onboarding' | 'suspended'>('onboarding');
    const [selectedGym, setSelectedGym] = useState<GymDetail | null>(null);
    const [detailTab, setDetailTab] = useState<'profile' | 'portfolio' | 'financials' | 'clients' | 'plans' | 'preview'>('profile');
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showOnboardModal, setShowOnboardModal] = useState(false);

    // MOCK DATA FOR THE DEEP DIVE
    const financialHistory = [
        { id: 'TX1', amount: '₹12,400', type: 'Payout', status: 'Success', date: '21 Mar 2024' },
        { id: 'TX2', amount: '₹8,900', type: 'Yield', status: 'Pending', date: '23 Mar 2024' },
        { id: 'TX3', amount: '₹15,100', type: 'Payout', status: 'Hold', date: '25 Mar 2024' },
    ];

    const clientDirectory = [
        { id: 1, name: 'Arjun Reddy', plan: 'Gold Annual', lastActive: '2 hours ago', spend: '₹15,000' },
        { id: 2, name: 'Priya Sharma', plan: 'Platinum Plus', lastActive: 'Just now', spend: '₹22,000' },
        { id: 3, name: 'Rohan Gupta', plan: 'Basic Monthly', lastActive: '1 day ago', spend: '₹2,500' },
        { id: 4, name: 'Sneha Rao', plan: 'Gold Annual', lastActive: '5 hours ago', spend: '₹15,000' },
    ];

    // FORM STATE
    const [newGym, setNewGym] = useState({ name: '', owner: '', tier: 'Premium', location: '' });
    const [gyms, setGyms] = useState<GymDetail[]>([
        {
            id: 1,
            name: "Iron Pump Gym",
            owner: "John Doe",
            ownerPhone: "+91 98765 43210",
            ownerEmail: "john@ironpump.com",
            location: "Indiranagar",
            address: "123, Fitness Lane, Indiranagar, Bangalore",
            joined: "2 days ago",
            status: "active",
            tier: "Premium",
            revenue: "₹45.2L",
            members: 1240,
            rating: 4.8,
            gstNo: "29AAAAA0000A1Z5",
            panNo: "ABCDE1234F",
            description: "Premium facility with high-end iron paradise equipment.",
            facilities: ["Weights", "Cardio", "Steam"],
            images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48"],
            documentation: {
                tradingLicense: "LIC-882910-X",
                fireSafety: "FIRE-2900-B",
                insurancePolicy: "INS-9901-P",
                bankStatement: "STMT-23"
            },
            staffCount: 15,
            areaSize: "8000 sqft",
            establishedYear: "2018",
            plans: [
                { name: "Global Pass", price: "₹2,499", duration: "Monthly", features: ["All HSR Hubs", "Steam", "Trainer Access"] },
                { name: "Pro Athlete", price: "₹18,000", duration: "Annual", features: ["24/7 Access", "Diet Plan", "Personal locker"] }
            ],
            gallery: [
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
                "https://images.unsplash.com/photo-1540497077202-7c8a3999166f",
                "https://images.unsplash.com/photo-1571902251103-d87382d6b79c"
            ]
        },
        {
            id: 2,
            name: "Yoga Zen Center",
            owner: "Sarah Smith",
            ownerPhone: "+91 98765 00000",
            ownerEmail: "sarah@yogazen.com",
            location: "Westside",
            address: "45, Serenity Row, Westside, Bangalore",
            joined: "1 hour ago",
            status: "pending",
            tier: "Boutique",
            revenue: "₹0",
            members: 0,
            rating: 0,
            gstNo: "29BBBBB1111B1Z6",
            panNo: "FGHIJ5678K",
            description: "Find your inner peace with our expert yoga sessions.",
            facilities: ["Meditation", "Yoga Mats"],
            images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"],
            documentation: {
                tradingLicense: "LIC-112233-Y",
                fireSafety: "FIRE-3322-Z",
                insurancePolicy: "INS-4455-Q",
                bankStatement: "STMT-24"
            },
            staffCount: 8,
            areaSize: "3200 sqft",
            establishedYear: "2021",
            plans: [],
            gallery: []
        },
        {
            id: 3,
            name: "Powerhouse Elite",
            owner: "Mike Johnson",
            ownerPhone: "+91 88888 11111",
            ownerEmail: "mike@powerhouse.com",
            location: "Koramangala",
            address: "99, Startup St, Koramangala, Bangalore",
            joined: "5 months ago",
            status: "active",
            tier: "Gold",
            revenue: "₹28.5L",
            members: 850,
            rating: 4.6,
            gstNo: "29CCCCC2222C1Z7",
            panNo: "KLMNO1234G",
            description: "The core of strength and conditioning in Koramangala.",
            facilities: ["Powerlifting", "Boxing", "Cafe"],
            images: ["https://images.unsplash.com/photo-1540497077202-7c8a3999166f"],
            documentation: {
                tradingLicense: "LIC-998877-K",
                fireSafety: "FIRE-1122-M",
                insurancePolicy: "INS-2233-R",
                bankStatement: "STMT-25"
            },
            staffCount: 12,
            areaSize: "5000 sqft",
            establishedYear: "2020",
            plans: [],
            gallery: []
        }
    ]);

    const filteredGyms = gyms.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.location.toLowerCase().includes(searchQuery.toLowerCase());

        if (activeTab === 'directory') return g.status === 'active' && matchesSearch;
        if (activeTab === 'onboarding') return g.status === 'pending' && matchesSearch;
        if (activeTab === 'suspended') return g.status === 'suspended' && matchesSearch;
        return matchesSearch;
    });

    const handleAction = async (id: number, status: 'active' | 'suspended' | 'rejected') => {
        setIsProcessing(true);
        // Simulate institutional sync delay
        await new Promise(r => setTimeout(r, 800));
        setGyms(gyms.map(g => g.id === id ? { ...g, status } : g));
        setIsProcessing(false);
        setSelectedGym(null);
    };

    return (
        <div className="p-10 max-w-[1600px] mx-auto space-y-12 pb-32 font-sans">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-black rounded-2xl shadow-xl shadow-black/10">
                            <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Partner Ecosystem</h2>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Lifecycle management for institutional hub partners</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setShowOnboardModal(true)}
                        className="px-10 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 active:scale-95"
                    >
                        <Plus className="w-5 h-5 text-primary" /> Onboard New Venue
                    </button>
                </div>
            </header>

            {/* TAB NAVIGATION */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex gap-10">
                    <TabLink active={activeTab === 'directory'} label="Active Directory" count={gyms.filter(g => g.status === 'active').length} onClick={() => setActiveTab('directory')} />
                    <TabLink active={activeTab === 'onboarding'} label="Onboarding Queue" count={gyms.filter(g => g.status === 'pending').length} onClick={() => setActiveTab('onboarding')} />
                    <TabLink active={activeTab === 'suspended'} label="Suspension Vault" count={gyms.filter(g => g.status === 'suspended').length} onClick={() => setActiveTab('suspended')} />
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
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredGyms.map((gym) => (
                        <motion.div
                            key={gym.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            onClick={() => setSelectedGym(gym)}
                            className="bg-white border border-gray-200 rounded-[40px] p-8 hover:shadow-2xl hover:border-black transition-all cursor-pointer group flex flex-wrap md:flex-nowrap items-center gap-10 shadow-sm"
                        >
                            <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                <img src={gym.images[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={gym.name} />
                            </div>

                            <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900">{gym.name}</h3>
                                    <TierBadge tier={gym.tier} />
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    <MapPin className="w-3 h-3 text-primary shrink-0" /> {gym.location}
                                    <span className="mx-2 text-gray-200">|</span>
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {gym.rating > 0 ? gym.rating : 'N/A'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 border-l border-gray-50 pl-10">
                                <RowStat label="Revenue" value={gym.revenue} sub="Lifetime GMV" />
                                <RowStat label="Footfall" value={gym.members} sub="Active Users" />
                                <RowStat label="Status" value={gym.status} sub={gym.joined} isStatus />
                            </div>

                            <div className="hidden lg:flex items-center gap-4 border-l border-gray-50 pl-10">
                                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:text-black group-hover:bg-primary transition-all" title="View details">
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all" title="More options">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

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
                                        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 blur-[130px] rounded-full" />

                                        <div className="relative z-10">
                                            <div className="aspect-square w-full rounded-[48px] overflow-hidden border-4 border-white/5 shadow-3xl mb-10">
                                                <img src={selectedGym.images[0]} className="w-full h-full object-cover" alt="Hub" />
                                            </div>

                                            <div className="mb-12">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.9]">{selectedGym.name}</h3>
                                                    <TierBadge tier={selectedGym.tier} large />
                                                </div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-4">Hub Intelligence V4.2</p>
                                            </div>

                                            <div className="space-y-4">
                                                <HubProp label="Platform ID" value={`GYM-H${selectedGym.id}X9`} />
                                                <HubProp label="Contract State" value={selectedGym.status.toUpperCase()} />
                                                <HubProp label="Onboarded" value={selectedGym.joined} />
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-white/10 relative z-10 flex gap-4">
                                            <button className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                                <Mail className="w-4 h-4 text-primary" /> Reach Owner
                                            </button>
                                            <button className="flex-1 py-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                                                <Phone className="w-4 h-4 text-primary" /> Urgent Line
                                            </button>
                                        </div>
                                    </div>

                                    {/* Main Body: Docs & Data */}
                                    <div className="lg:col-span-8 p-12 space-y-12 bg-white overflow-hidden relative flex flex-col">
                                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />

                                        {/* DETAIL TABS */}
                                        <div className="flex gap-10 border-b border-gray-100 relative z-10 flex-shrink-0">
                                            <button onClick={() => setDetailTab('profile')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'profile' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Hub Profile {detailTab === 'profile' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('plans')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'plans' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Membership Plans {detailTab === 'plans' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('portfolio')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'portfolio' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Owner Portfolio {detailTab === 'portfolio' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('financials')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'financials' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Financials {detailTab === 'financials' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('clients')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'clients' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Client Base {detailTab === 'clients' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                            </button>
                                            <button onClick={() => setDetailTab('preview')} className={`pb-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${detailTab === 'preview' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>
                                                Live Preview {detailTab === 'preview' && <motion.div layoutId="det-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                            </button>
                                        </div>

                                        <div className="flex-1 space-y-12 relative z-10 overflow-y-auto pr-4 custom-scrollbar">
                                            {detailTab === 'profile' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 pb-12">
                                                    <div className="grid grid-cols-3 gap-10">
                                                        <MetricBox label="Avg Quality Score" value="9.4" icon={Star} color="text-yellow-500" />
                                                        <MetricBox label="Revenue Yield" value={selectedGym.revenue} icon={TrendingUp} color="text-emerald-500" />
                                                        <MetricBox label="Platform Units" value={selectedGym.members} icon={Users} color="text-blue-500" />
                                                    </div>

                                                    <section className="space-y-8">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1 flex items-center gap-3">
                                                            <Layers className="w-4 h-4" /> Facility Gallery
                                                        </h4>
                                                        <div className="grid grid-cols-3 gap-6 h-64">
                                                            {(selectedGym.gallery || selectedGym.images).slice(0, 3).map((img, i) => (
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
                                                            <AssetCard label="Trading License" val={selectedGym.documentation.tradingLicense} color="indigo" />
                                                            <AssetCard label="Fire Safety NoC" val={selectedGym.documentation.fireSafety} color="orange" />
                                                            <AssetCard label="GST Certificate" val={selectedGym.gstNo} color="emerald" />
                                                            <AssetCard label="Insurance Desk" val={selectedGym.documentation.insurancePolicy} color="blue" />
                                                        </div>
                                                    </section>
                                                </motion.div>
                                            )}

                                            {detailTab === 'plans' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                                    <h4 className="text-2xl font-black italic uppercase tracking-tighter">Live Membership Offerings</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {(selectedGym.plans || [
                                                            { name: "Monthly Pass", price: "₹2,999", duration: "1 Month", features: ["All weights", "Steam"] },
                                                            { name: "Annual Core", price: "₹24,000", duration: "12 Months", features: ["Personal Trainer", "Dietician"] }
                                                        ]).map((plan, i) => (
                                                            <div key={i} className="p-10 bg-gray-900 text-white rounded-[48px] border border-white/10 relative overflow-hidden group hover:border-primary/50 transition-all">
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all" />
                                                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{plan.duration}</p>
                                                                <h3 className="text-3xl font-black italic uppercase mb-6">{plan.name}</h3>
                                                                <div className="text-4xl font-black italic text-white mb-8">{plan.price}</div>
                                                                <div className="space-y-4">
                                                                    {plan.features.map(f => (
                                                                        <div key={f} className="flex items-center gap-3 text-[10px] font-bold text-white/50 uppercase tracking-widest">
                                                                            <Check className="w-4 h-4 text-primary" /> {f}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {detailTab === 'portfolio' && (
                                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                                    <div className="bg-gray-50 p-10 rounded-[48px] border border-gray-100 space-y-8">
                                                        <h4 className="text-xl font-black italic uppercase tracking-tighter">Business Application Data</h4>
                                                        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                                            <DetailRow label="Entity Owner" value={selectedGym.owner} icon={User} />
                                                            <DetailRow label="Contact Line" value={selectedGym.ownerPhone} icon={Phone} />
                                                            <DetailRow label="Institutional Email" value={selectedGym.ownerEmail} icon={Mail} />
                                                            <DetailRow label="Established" value={selectedGym.establishedYear} icon={Activity} />
                                                            <DetailRow label="PAN Account" value={selectedGym.panNo} icon={ShieldCheck} />
                                                            <DetailRow label="Base Location" value={selectedGym.address} icon={MapPin} />
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
                                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Platform Balance</p>
                                                            <h3 className="text-4xl font-black italic uppercase mb-2">₹8.24L</h3>
                                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Awaiting scheduled payout</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-10 rounded-[48px] border border-gray-100">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Gross Platform Yield</p>
                                                            <h3 className="text-4xl font-black italic uppercase mb-2">₹1.15L</h3>
                                                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">15% commission applied</p>
                                                        </div>
                                                    </div>


                                                    <div className="space-y-6">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Transaction Telemetry</h4>
                                                        <div className="space-y-3">
                                                            {financialHistory.map(tx => (
                                                                <div key={tx.id} className="p-6 bg-gray-50 border border-gray-100 rounded-[32px] flex items-center justify-between group hover:border-black transition-all">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black italic text-[10px]">{tx.id}</div>
                                                                        <div>
                                                                            <p className="font-black text-xs uppercase tracking-tight">{tx.type} Initialization</p>
                                                                            <p className="text-[9px] font-bold text-gray-400 uppercase">{tx.date}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-8">
                                                                        <p className="font-black italic text-lg">{tx.amount}</p>
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
                                                                            <span className="font-black italic text-xs uppercase">#MBR-{client.id}X</span>
                                                                        </td>
                                                                        <td className="p-6">
                                                                            <p className="font-black uppercase italic tracking-tight text-gray-900">{client.name}</p>
                                                                            <p className="text-[9px] font-bold text-primary uppercase">{client.plan}</p>
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

                                            {detailTab === 'preview' && (
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-[600px] flex items-center justify-center p-10 bg-gray-50 rounded-[48px] border border-gray-100 overflow-hidden relative">
                                                    <div className="absolute top-10 left-10">
                                                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Marketplace Simulation</h4>
                                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Visualizing {selectedGym.name} as seen by users</p>
                                                    </div>

                                                    {/* Simulated Mobile Frame */}
                                                    <div className="w-[340px] h-[580px] bg-white rounded-[40px] shadow-2xl border-[8px] border-black overflow-hidden relative flex flex-col scale-90">
                                                        <div className="h-48 bg-gray-200 relative flex-shrink-0">
                                                            <img src={selectedGym.images[0]} className="w-full h-full object-cover" alt="Preview" />
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
                                                                    <span className="text-[10px] font-black text-emerald-600">4.8</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 flex-wrap">
                                                                <span className="px-2 py-1 bg-gray-100 rounded-md text-[8px] font-black uppercase">Weights</span>
                                                                <span className="px-2 py-1 bg-gray-100 rounded-md text-[8px] font-black uppercase">Steam</span>
                                                                <span className="px-2 py-1 bg-gray-100 rounded-md text-[8px] font-black uppercase">Free WiFi</span>
                                                            </div>
                                                            <div className="pt-4 border-t border-gray-50 mt-4">
                                                                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Starts from</p>
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <p className="text-xl font-black text-gray-900 italic">₹199 <span className="text-[10px] font-medium text-gray-400">/visit</span></p>
                                                                    <button className="px-6 py-2 bg-black text-primary rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/10">Book</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-auto p-6 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                                                            <div className="flex gap-4">
                                                                <div className="flex-1 h-3 bg-gray-200 rounded-full" />
                                                                <div className="w-12 h-3 bg-primary/20 rounded-full" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* MANAGEMENT CONTROLS */}
                                        <section className="pt-10 border-t border-gray-100 flex gap-4 relative z-60">
                                            {selectedGym.status === 'pending' ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(selectedGym.id, 'rejected')}
                                                        disabled={isProcessing}
                                                        className="px-10 py-5 bg-white border border-red-100 text-red-500 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-50 transition-all flex items-center gap-3 disabled:opacity-50"
                                                    >
                                                        {isProcessing ? 'SYNCING...' : <><X className="w-5 h-5" /> Deny Access</>}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(selectedGym.id, 'active')}
                                                        disabled={isProcessing}
                                                        className="flex-1 py-5 bg-black text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] hover:shadow-2xl hover:shadow-black/30 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                                    >
                                                        {isProcessing ? (
                                                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                                                <Activity className="w-6 h-6 text-primary" />
                                                            </motion.div>
                                                        ) : (
                                                            <><FileCheck className="w-6 h-6 text-primary" /> Authorize & Launch Hub</>
                                                        )}
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(selectedGym.id, selectedGym.status === 'active' ? 'suspended' : 'active')}
                                                        disabled={isProcessing}
                                                        className={`px-10 py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 disabled:opacity-50 ${selectedGym.status === 'active'
                                                            ? 'bg-red-50 text-red-500 hover:bg-red-600 hover:text-white'
                                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                            }`}
                                                    >
                                                        <Power className="w-6 h-6" /> {selectedGym.status === 'active' ? 'Operational Suspend' : 'Resume Hub'}
                                                    </button>
                                                    <button className="flex-1 py-5 bg-black text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 border border-white/10 active:scale-95 transition-all">
                                                        <Activity className="w-5 h-5 text-primary" /> Sync Hub State
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

                            <div className="mb-10">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-1">New Hub Onboarding</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initialization of institutional partnership</p>
                            </div>

                            <div className="space-y-6">
                                <FormInput label="Official Hub Name" placeholder="e.g. Iron Paradise Indiranagar" value={newGym.name} onChange={(v) => setNewGym({ ...newGym, name: v })} />
                                <FormInput label="Owner Name / Entity" placeholder="e.g. Arjan Singh" value={newGym.owner} onChange={(v) => setNewGym({ ...newGym, owner: v })} />
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Platform Tier</label>
                                        <select
                                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-sm focus:ring-2 focus:ring-primary outline-none transition-all uppercase tracking-wider"
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

                                <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/10">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-primary">Pre-Audit Checklist</h4>
                                    <div className="space-y-3">
                                        <CheckItem label="GST Registration Certificate" />
                                        <CheckItem label="Trade License / NOC" />
                                        <CheckItem label="Facility Quality High-Res Images" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        // Mock adding
                                        setShowOnboardModal(false);
                                    }}
                                    className="w-full py-6 bg-black text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/30 hover:bg-gray-800 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                                >
                                    <FileCheck className="w-6 h-6 text-primary" /> Initialize Onboarding Request
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
                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl font-bold text-sm focus:ring-2 focus:ring-primary outline-none transition-all uppercase tracking-wider placeholder:text-gray-300"
                title={label}
            />
        </div>
    )
}

function CheckItem({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-white border border-primary/20 rounded-md flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-primary rounded-[2px]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">{label}</span>
        </div>
    )
}

function ManagementStat({ label, value, sub, icon: Icon, color }: any) {
    const colorClasses: any = {
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        primary: 'bg-primary/10 text-primary border-primary/20',
        blue: 'bg-blue-50 text-blue-600 border-blue-100'
    };

    return (
        <div className={`px-8 py-4 rounded-[32px] border flex items-center gap-5 shadow-sm min-w-[240px] ${colorClasses[color]}`}>
            <div className={`p-3 rounded-2xl bg-white shadow-sm`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">{label}</p>
                <div className="flex items-end gap-2">
                    <p className="text-2xl font-black italic tracking-tighter leading-none">{value}</p>
                    <p className="text-[8px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap mb-0.5">{sub}</p>
                </div>
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
            <span className={`text-[9px] font-black p-1 px-2 rounded-lg transition-all ${active ? 'bg-primary text-black' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>{count}</span>
            {active && (
                <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full" />
            )}
        </button>
    )
}

function TierBadge({ tier, large }: any) {
    const colors: any = {
        Premium: 'bg-black text-primary border-primary/30',
        Gold: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        Boutique: 'bg-purple-50 text-purple-700 border-purple-200'
    };

    return (
        <span className={`px-3 py-1.5 rounded-xl border font-black uppercase tracking-widest shadow-sm ${large ? 'text-[10px]' : 'text-[8px]'} ${colors[tier]}`}>
            {tier}
        </span>
    )
}

function RowStat({ label, value, sub, isStatus }: any) {
    return (
        <div className="space-y-1">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">{label}</p>
            <p className={`font-black italic text-sm tracking-tight leading-none uppercase ${isStatus ? (value === 'active' ? 'text-emerald-500' : value === 'pending' ? 'text-yellow-500' : 'text-red-500') : 'text-gray-900'}`}>{value}</p>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.1em]">{sub}</p>
        </div>
    )
}

function HubProp({ label, value }: any) {
    return (
        <div className="flex justify-between items-center py-4 border-b border-white/5 group hover:border-primary/30 transition-all">
            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest group-hover:text-white/80 transition-colors">{label}</p>
            <p className="font-bold text-white text-sm tracking-wider">{value}</p>
        </div>
    )
}

function MetricBox({ label, value, icon: Icon, color }: any) {
    return (
        <div className="p-8 bg-gray-50 border border-transparent rounded-[48px] hover:bg-white hover:border-gray-100 hover:shadow-2xl transition-all group">
            <Icon className={`w-8 h-8 ${color} mb-6`} />
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</p>
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
            <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="font-black italic text-gray-900 text-xs tracking-tight">{val}</p>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
            </div>
        </div>
    )
}

function SpecItem({ label, value }: any) {
    return (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 font-bold text-sm text-gray-900">
                {value}
            </div>
        </div>
    )
}

function DetailRow({ label, value, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:border-primary transition-all">
                <Icon className="w-5 h-5 text-gray-500 group-hover:text-primary" />
            </div>
            <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="font-bold text-gray-900 text-sm">{value}</p>
            </div>
        </div>
    )
}
