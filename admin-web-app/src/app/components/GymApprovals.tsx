import { useState } from 'react';
import { Check, X, Building2, MapPin, Eye, FileText, User, Phone, ShieldCheck, Dumbbell, Users, Landmark, Award, Shield, Mail, ArrowUpRight, ChevronRight, FileCheck, AlertCircle, Trash2 } from "lucide-react";
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
    status: 'pending' | 'approved' | 'rejected';
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
}

export function GymApprovals() {
    const [selectedGym, setSelectedGym] = useState<GymDetail | null>(null);
    const [gyms, setGyms] = useState<GymDetail[]>([
        {
            id: 1,
            name: "Iron Pump Gym",
            owner: "John Doe",
            ownerPhone: "+91 98765 43210",
            ownerEmail: "john@ironpump.com",
            location: "Downtown, City",
            address: "123, Fitness Lane, Downtown, Bangalore - 560001",
            joined: "2 mins ago",
            status: "pending",
            gstNo: "29AAAAA0000A1Z5",
            panNo: "ABCDE1234F",
            description: "A premium fitness facility with state-of-the-art equipment and certified trainers. We focus on strength training and community building.",
            facilities: ["Weights", "Cardio", "Locker Room", "Steam Bath", "Personal Training"],
            images: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48", "https://images.unsplash.com/photo-1540497077202-7c8a3999166f"],
            documentation: {
                tradingLicense: "LIC-882910-X",
                fireSafety: "FIRE-2900-B",
                insurancePolicy: "INS-9901-P",
                bankStatement: "STMT-2026-JAN"
            },
            staffCount: 12,
            areaSize: "5500 sqft",
            establishedYear: "2018"
        },
        {
            id: 2,
            name: "Yoga Zen Center",
            owner: "Sarah Smith",
            ownerPhone: "+91 98765 00000",
            ownerEmail: "sarah@yogazen.com",
            location: "Westside",
            address: "45, Serenity Row, Westside, Bangalore - 560032",
            joined: "10 mins ago",
            status: "pending",
            gstNo: "29BBBBB1111B1Z6",
            panNo: "FGHIJ5678K",
            description: "Find your inner peace with our expert yoga sessions. We offer Hatha, Vinyasa, and Ashtanga yoga styles.",
            facilities: ["Yoga Mats", "Meditation Hall", "Organic Juice Bar", "Aroma Therapy"],
            images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b", "https://images.unsplash.com/photo-1552196562-790757a41925"],
            documentation: {
                tradingLicense: "LIC-112233-Y",
                fireSafety: "FIRE-3322-Z",
                insurancePolicy: "INS-4455-Q",
                bankStatement: "STMT-2026-FEB"
            },
            staffCount: 8,
            areaSize: "3200 sqft",
            establishedYear: "2021"
        },
    ]);

    const handleAction = (id: number, action: 'approve' | 'reject') => {
        setGyms(gyms.map(g => g.id === id ? { ...g, status: action === 'approve' ? 'approved' : 'rejected' } : g));
        if (selectedGym?.id === id) {
            setSelectedGym(null);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Institutional Onboarding</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Vetting facility standards & legal documentation</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-emerald-50 px-6 py-4 rounded-3xl border border-emerald-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Requests</p>
                            <p className="text-xl font-black italic tracking-tighter">{gyms.filter(g => g.status === 'pending').length}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {gyms.filter(g => g.status === 'pending').map((gym) => (
                    <motion.div
                        key={gym.id}
                        layoutId={`gym-${gym.id}`}
                        onClick={() => setSelectedGym(gym)}
                        className="bg-white border border-gray-100 rounded-[48px] p-8 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col md:flex-row gap-8 items-center"
                    >
                        <div className="w-40 h-40 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0 relative">
                            <img src={gym.images[0]} alt={gym.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-4">
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">{gym.name}</h3>
                                <span className="bg-yellow-50 text-yellow-600 text-[9px] font-black px-3 py-1.5 rounded-full border border-yellow-100 uppercase tracking-widest">Awaiting Verification</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <MiniStat label="Owner Name" value={gym.owner} icon={User} />
                                <MiniStat label="GST Number" value={gym.gstNo} icon={FileText} />
                                <MiniStat label="Area Size" value={gym.areaSize} icon={Building2} />
                                <MiniStat label="Total Staff" value={`${gym.staffCount} Pro`} icon={Users} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedGym(gym); }}
                                className="px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all hover:bg-gray-800 shadow-xl shadow-black/10"
                            >
                                <Eye className="w-4 h-4 text-primary" /> Full Audit
                            </button>
                            <p className="text-center text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">{gym.joined}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Verification Detail Modal */}
            <AnimatePresence>
                {selectedGym && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 100 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 100 }}
                            className="bg-white w-full max-w-6xl h-[92vh] rounded-[64px] overflow-hidden flex flex-col relative shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/20"
                        >
                            <button
                                onClick={() => setSelectedGym(null)}
                                className="absolute top-10 right-10 p-4 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-all z-20 shadow-sm"
                                title="Close Audit"
                            >
                                <X className="w-8 h-8 text-black" />
                            </button>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                                    {/* Left: Branding & Specs */}
                                    <div className="lg:col-span-4 bg-gray-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[90px] rounded-full" />

                                        <div className="relative z-10 space-y-12">
                                            <div className="aspect-square w-full rounded-[48px] overflow-hidden border-4 border-white/5 shadow-2xl">
                                                <img src={selectedGym.images[0]} className="w-full h-full object-cover" alt="Gym" />
                                            </div>

                                            <div>
                                                <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-4">{selectedGym.name}</h3>
                                                <p className="text-xs font-bold text-primary uppercase tracking-[0.3em]">Institutional Grade Verification</p>
                                            </div>

                                            <div className="space-y-6">
                                                <SideInfoLine label="Entity Type" value="Partnership Firm" icon={Building2} />
                                                <SideInfoLine label="Est. Year" value={selectedGym.establishedYear} icon={Landmark} />
                                                <SideInfoLine label="Verification Level" value="Level 4 (High)" icon={Award} />
                                            </div>
                                        </div>

                                        <div className="pt-12 border-t border-white/10 relative z-10">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Official Contact</p>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="p-3 bg-white/10 rounded-xl"><Mail className="w-5 h-5 text-primary" /></div>
                                                <p className="font-bold text-sm">{selectedGym.ownerEmail}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white/10 rounded-xl"><Phone className="w-5 h-5 text-primary" /></div>
                                                <p className="font-bold text-sm">{selectedGym.ownerPhone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Docs & Compliance */}
                                    <div className="lg:col-span-8 p-16 space-y-12 bg-white">
                                        <section>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                                                <ShieldCheck className="w-4 h-4" /> Legal Compliance Portfolio
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <DocCard label="Trading License" id={selectedGym.documentation.tradingLicense} status="VERIFIED" icon={FileText} />
                                                <DocCard label="NoC - Fire Safety" id={selectedGym.documentation.fireSafety} status="EXPIRES 2027" icon={Shield} />
                                                <DocCard label="GST Verification" id={selectedGym.gstNo} status="ACTIVE" icon={Landmark} />
                                                <DocCard label="Insurance Policy" id={selectedGym.documentation.insurancePolicy} status="GOLD COVER" icon={ShieldCheck} />
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8 flex items-center gap-3">
                                                <Dumbbell className="w-4 h-4" /> Facility Profile
                                            </h4>
                                            <p className="text-lg font-medium text-gray-600 leading-relaxed italic mb-8">
                                                "{selectedGym.description}"
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedGym.facilities.map((fac, i) => (
                                                    <span key={i} className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-600 flex items-center gap-2">
                                                        <Check className="w-4 h-4 text-emerald-500" /> {fac}
                                                    </span>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="bg-red-50 p-10 rounded-[48px] border border-red-100">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                                                    <AlertCircle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-black uppercase italic tracking-tighter text-red-900 line-none">Executive Decision</h4>
                                                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Final onboarding authorization required</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleAction(selectedGym.id, 'reject')}
                                                    className="px-10 py-5 bg-white border border-red-200 text-red-600 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:bg-red-500 hover:text-white transition-all flex items-center gap-3"
                                                >
                                                    <Trash2 className="w-5 h-5" /> Deny Access
                                                </button>
                                                <button
                                                    onClick={() => handleAction(selectedGym.id, 'approve')}
                                                    className="flex-1 py-5 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                                                >
                                                    <Check className="w-5 h-5 text-primary" /> Authorize & Launch Venue
                                                </button>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MiniStat({ label, value, icon: Icon }: any) {
    return (
        <div className="space-y-1">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-3 h-3" /> {label}
            </p>
            <p className="font-black italic text-gray-900 uppercase text-xs tracking-tight">{value}</p>
        </div>
    )
}

function SideInfoLine({ label, value, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl"><Icon className="w-5 h-5 text-primary" /></div>
            <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="font-bold text-sm text-white">{value}</p>
            </div>
        </div>
    )
}

function DocCard({ label, id, status, icon: Icon }: any) {
    return (
        <div className="p-6 bg-gray-50 border border-transparent rounded-[32px] hover:bg-white hover:border-gray-100 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 group-hover:text-black transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-lg">{status}</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="font-black italic text-gray-900 text-sm tracking-tight">{id}</p>
        </div>
    )
}
