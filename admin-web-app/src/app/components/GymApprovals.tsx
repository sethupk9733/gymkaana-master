import { useState, useEffect, useMemo } from 'react';
import { Check, X, Building2, FileText, User, Phone, ShieldCheck, Dumbbell, Users, Landmark, Award, Shield, Mail, FileCheck, AlertCircle, Trash2, Loader2, Eye } from "lucide-react";
import { fetchGyms, updateGymStatus } from '../lib/api';

interface GymDetail {
    id: string | number;
    name: string;
    owner: string;
    ownerPhone: string;
    ownerEmail: string;
    location: string;
    address: string;
    joined: string;
    status: string;
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gyms, setGyms] = useState<GymDetail[]>([]);
    const [internalError, setInternalError] = useState<string | null>(null);

    useEffect(() => {
        console.log("🛡️ GymApprovals: Component Initialized");
        loadGyms();
    }, []);

    const loadGyms = async () => {
        setLoading(true);
        setError(null);
        setInternalError(null);
        try {
            console.log("🛡️ GymApprovals: Starting Data Sync...");
            const data = await fetchGyms();
            console.log("🛡️ GymApprovals: Data Ingress Success", { type: Array.isArray(data) ? 'array' : typeof data, length: data?.length });

            if (!data || !Array.isArray(data)) {
                console.error("🛡️ GymApprovals: Protocol Error - Invalid Data Format");
                setGyms([]);
                setError("Protocol Error: Received invalid intelligence package from server.");
                return;
            }

            const FALLBACK_IMG = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48";

            const mapped = data.map((g: any, index: number) => {
                try {
                    const safeName = String(g?.name || "Unknown Venue");
                    const safeAddress = String(g?.address || "");
                    const parts = safeAddress.split(',');
                    const loc = parts.length > 0 ? parts[parts.length - 1].trim() : "N/A";

                    let safeImages: string[];
                    if (Array.isArray(g?.images) && g.images.length > 0) {
                        safeImages = g.images.map((img: any) => String(img || FALLBACK_IMG));
                    } else if (g?.image) {
                        safeImages = [String(g.image)];
                    } else {
                        safeImages = [FALLBACK_IMG];
                    }

                    return {
                        id: g?._id || `fallback-${index}-${Math.random()}`,
                        name: safeName,
                        owner: String(g?.ownerId?.name || "System Record"),
                        ownerPhone: String(g?.ownerId?.phoneNumber || "N/A"),
                        ownerEmail: String(g?.ownerId?.email || "N/A"),
                        location: loc,
                        address: safeAddress || "No coordinates provided.",
                        joined: g?.createdAt ? new Date(g.createdAt).toLocaleDateString() : "Historical",
                        status: String(g?.status || 'pending').toLowerCase(),
                        gstNo: String(g?.gstNo || "PENDING"),
                        panNo: String(g?.panNo || "PENDING"),
                        description: String(g?.description || "No mission brief provided."),
                        facilities: Array.isArray(g?.facilities) ? g.facilities.map(String) : [],
                        images: safeImages,
                        documentation: {
                            tradingLicense: String(g?.documentation?.tradingLicense || "PENDING"),
                            fireSafety: String(g?.documentation?.fireSafety || "PENDING"),
                            insurancePolicy: String(g?.documentation?.insurancePolicy || "PENDING"),
                            bankStatement: String(g?.documentation?.bankStatement || "PENDING")
                        },
                        staffCount: Number(g?.staffCount || 0),
                        areaSize: String(g?.areaSize || "N/A"),
                        establishedYear: String(g?.establishedYear || "N/A")
                    };
                } catch (e: any) {
                    console.warn(`🛡️ GymApprovals: Failed to decrypt hub at index ${index}`, e);
                    return null;
                }
            }).filter(Boolean) as GymDetail[];

            setGyms(mapped);
            console.log(`🛡️ GymApprovals: ${mapped.length} Hubs Synchronized`);
        } catch (err: any) {
            console.error("🛡️ GymApprovals: Infrastructure Failure", err);
            setError(err.message || "Failed to establish secure link with venue database.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string | number, action: 'approve' | 'reject') => {
        try {
            const status = action === 'approve' ? 'active' : 'rejected';
            await updateGymStatus(String(id), status);
            setGyms(prev => prev.map(g => g.id === id ? { ...g, status: status } : g));
            setSelectedGym(null);
        } catch (err: any) {
            console.error("🛡️ Action Protocol Failure:", err);
            alert("Action Protocol Failure: " + (err.message || "Unknown error"));
        }
    };

    const pendingGyms = useMemo(() => {
        return gyms.filter(g => g && String(g.status || "").toLowerCase() === 'pending');
    }, [gyms]);

    if (internalError) {
        return (
            <div className="p-20 text-center space-y-6 bg-red-50 min-h-screen">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto" />
                <h2 className="text-3xl font-black text-red-900 uppercase italic">Component Runtime Failure</h2>
                <p className="text-red-600 font-bold uppercase tracking-widest text-xs">{internalError}</p>
                <button onClick={() => window.location.reload()} className="px-10 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest">Reboot Intelligence</button>
            </div>
        );
    }

    try {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20 font-sans">
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
                                <p className="text-xl font-black italic tracking-tighter">{pendingGyms.length}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-50 border-2 border-red-100 p-12 rounded-[48px] text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
                        <h3 className="text-xl font-black text-red-900 uppercase">System Alert</h3>
                        <p className="text-red-600 font-bold uppercase tracking-widest text-xs italic">{error}</p>
                        <button onClick={loadGyms} className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Retry Link</button>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <Loader2 className="w-16 h-16 text-black animate-spin" />
                        <p className="font-black uppercase tracking-[0.4em] text-xs text-gray-400">Synchronizing Vetting Streams...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {pendingGyms.length === 0 && !error && (
                            <div className="py-40 text-center space-y-4 bg-white rounded-[48px] border border-gray-100 border-dashed">
                                <ShieldCheck className="w-12 h-12 text-gray-200 mx-auto" />
                                <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No pending vetting requests in queue.</p>
                            </div>
                        )}
                        {pendingGyms.map((gym) => (
                            <div
                                key={gym.id}
                                onClick={() => setSelectedGym(gym)}
                                className="bg-white border border-gray-100 rounded-[56px] p-10 shadow-sm hover:shadow-2xl transition-all cursor-pointer group flex flex-col md:flex-row gap-10 items-center overflow-hidden relative"
                            >
                                <div className="w-48 h-48 rounded-[40px] overflow-hidden bg-gray-50 flex-shrink-0 relative shadow-inner">
                                    <img
                                        src={String((gym.images ?? [])[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48")}
                                        alt={gym.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"; }}
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">{gym.name}</h3>
                                            <span className="bg-yellow-50 text-yellow-600 text-[8px] font-black px-4 py-1.5 rounded-full border border-yellow-100 uppercase tracking-widest">Vetting In Progress</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{gym.location}</p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        <StatItem label="Principal" value={gym.owner} icon={User} />
                                        <StatItem label="Regulatory ID" value={gym.gstNo} icon={FileText} />
                                        <StatItem label="Footprint" value={gym.areaSize} icon={Building2} />
                                        <StatItem label="Personnel" value={`${gym.staffCount} Count`} icon={Users} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSelectedGym(gym); }}
                                        className="px-10 py-5 bg-black text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:bg-gray-800 shadow-2xl shadow-black/20"
                                    >
                                        <Eye className="w-4 h-4 text-[#A3E635]" /> Full Audit
                                    </button>
                                    <p className="text-center text-[8px] font-black text-gray-300 uppercase tracking-[0.3em]">{gym.joined}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedGym && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl px-4 overflow-y-auto">
                        <div className="bg-white w-full max-w-6xl my-auto rounded-[64px] overflow-hidden flex flex-col lg:flex-row relative shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/20">
                            <button
                                onClick={() => setSelectedGym(null)}
                                className="absolute top-10 right-10 p-5 bg-gray-50 hover:bg-gray-100 rounded-3xl transition-all z-[110] shadow-sm hover:rotate-90 duration-300"
                            >
                                <X className="w-8 h-8 text-black" />
                            </button>

                            <div className="lg:w-[400px] bg-gray-900 p-12 text-white flex flex-col relative overflow-hidden shrink-0">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-[#A3E635]/10 blur-[90px] rounded-full" />
                                <div className="relative z-10 space-y-12">
                                    <div className="aspect-square w-full rounded-[48px] overflow-hidden border-4 border-white/5 shadow-2xl bg-white/5">
                                        <img
                                            src={String((selectedGym.images ?? [])[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48")}
                                            className="w-full h-full object-cover"
                                            alt="Venue"
                                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"; }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-4">{selectedGym.name}</h3>
                                        <p className="text-[10px] font-black text-[#A3E635] uppercase tracking-[0.3em] italic">Institutional Grade Dossier</p>
                                    </div>
                                    <div className="space-y-8">
                                        <InfoLine label="Corporate Entity" value="Partnership FIRM" icon={Building2} />
                                        <InfoLine label="Est. Year" value={selectedGym.establishedYear} icon={Landmark} />
                                        <InfoLine label="Integrity Floor" value="Level 4 Certified" icon={Award} />
                                    </div>
                                </div>
                                <div className="mt-20 pt-12 border-t border-white/10 relative z-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-[#A3E635]"><Mail className="w-5 h-5" /></div>
                                        <p className="font-bold text-xs lowercase group-hover:text-primary transition-colors">{selectedGym.ownerEmail}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-[#A3E635]"><Phone className="w-5 h-5" /></div>
                                        <p className="font-bold text-xs">{selectedGym.ownerPhone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-16 space-y-16 bg-white overflow-y-auto max-h-[92vh]">
                                <section className="space-y-10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4" /> Compliance Portfolio
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <DocItem label="Trading License" id={selectedGym.documentation.tradingLicense} icon={FileText} />
                                        <DocItem label="Fire Compliance" id={selectedGym.documentation.fireSafety} icon={Shield} />
                                        <DocItem label="GST Certification" id={selectedGym.gstNo} icon={Landmark} />
                                        <DocItem label="Liability Insurance" id={selectedGym.documentation.insurancePolicy} icon={ShieldCheck} />
                                    </div>
                                </section>

                                <section className="space-y-10">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3">
                                        <Dumbbell className="w-4 h-4" /> Facility Architecture
                                    </h4>
                                    <p className="text-xl font-medium text-gray-600 leading-relaxed italic border-l-4 border-[#A3E635] pl-8">
                                        "{selectedGym.description}"
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedGym.facilities.map((fac, i) => (
                                            <span key={i} className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-[18px] font-black text-[9px] uppercase tracking-widest text-gray-500 flex items-center gap-3">
                                                <Check className="w-3 h-3 text-emerald-500" /> {fac}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                <section className="bg-red-50 p-12 rounded-[56px] border border-red-100 space-y-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-red-100 rounded-[24px] flex items-center justify-center text-red-600 shadow-sm">
                                            <AlertCircle className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black uppercase italic tracking-tighter text-red-900">Executive Authorization</h4>
                                            <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-1">Final onboarding credentials required.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleAction(selectedGym.id, 'reject')}
                                            className="py-5 bg-white border border-red-200 text-red-600 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-sm hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-3"
                                        >
                                            <Trash2 className="w-5 h-5" /> Deny Access
                                        </button>
                                        <button
                                            onClick={() => handleAction(selectedGym.id, 'approve')}
                                            className="py-5 bg-black text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-black/20 hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Check className="w-5 h-5 text-[#A3E635]" /> Authorize & Launch Hub
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (e: any) {
        console.error("🛡️ GymApprovals: Critical Render Crash Caught", e);
        setInternalError(e.message || "Unknown Runtime Exception");
        return null;
    }
}

function StatItem({ label, value, icon: Icon }: any) {
    return (
        <div className="space-y-1 group/stat">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover/stat:text-black transition-colors">
                <Icon className="w-3 h-3" /> {label}
            </p>
            <p className="font-black italic text-gray-900 uppercase text-[11px] tracking-tight">{value}</p>
        </div>
    )
}

function InfoLine({ label, value, icon: Icon }: any) {
    return (
        <div className="flex items-center gap-5 group">
            <div className="p-4 bg-white/5 rounded-[20px] text-[#A3E635] group-hover:bg-[#A3E635] group-hover:text-black transition-all shadow-sm">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-none mb-1.5">{label}</p>
                <p className="font-bold text-sm text-white">{value}</p>
            </div>
        </div>
    )
}

function DocItem({ label, id, icon: Icon }: any) {
    return (
        <div className="p-8 bg-gray-50 border border-transparent rounded-[32px] hover:bg-white hover:border-gray-100 hover:shadow-xl transition-all group/doc">
            <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 group-hover/doc:text-black transition-colors">
                    <Icon className="w-5 h-5" />
                </div>
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-xl border border-emerald-100">Verified</span>
            </div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
            <p className="font-black italic text-gray-900 text-sm tracking-tighter truncate" title={id}>{id}</p>
        </div>
    )
}
