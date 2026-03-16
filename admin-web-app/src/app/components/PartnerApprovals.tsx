import { useState, useEffect, useMemo } from 'react';
import { 
    Check, X, Building2, FileText, User, Phone, ShieldCheck, 
    Users, Landmark, Award, Shield, Mail, AlertCircle, 
    Loader2, Eye, RefreshCcw, Trash2 
} from "lucide-react";
import { fetchGyms, updateGymStatus } from '../lib/api';

// --- Hardened Types ---
interface PartnerRecord {
    _id: string;
    name: string;
    ownerName: string;
    ownerPhone: string;
    ownerEmail: string;
    address: string;
    status: string;
    gstNo: string;
    panNo: string;
    description: string;
    facilities: string[];
    displayImage: string;
    documentation: {
        trading: string;
        fire: string;
        insurance: string;
    };
    createdAt: string;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000";

export function PartnerApprovals() {
    const [partners, setPartners] = useState<PartnerRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [auditTarget, setAuditTarget] = useState<PartnerRecord | null>(null);

    const synchronize = async () => {
        setLoading(true);
        setError(null);
        try {
            const rawData = await fetchGyms();
            
            let list: any[] = [];
            if (Array.isArray(rawData)) list = rawData;
            else if (rawData?.gyms && Array.isArray(rawData.gyms)) list = rawData.gyms;
            else if (rawData?.data && Array.isArray(rawData.data)) list = rawData.data;

            const sanitized: PartnerRecord[] = list.map((item, idx) => {
                try {
                    if (!item || typeof item !== 'object') return null;

                    // Images check
                    let img = FALLBACK_IMG;
                    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
                        img = String(item.images[0] || FALLBACK_IMG);
                    } else if (item.image) {
                        img = String(item.image);
                    }

                    return {
                        _id: String(item._id || item.id || `p-${idx}`),
                        name: String(item.name || "UNNAMED FACILITY").toUpperCase(),
                        ownerName: String(item.ownerId?.name || "PRIVATE PRINCIPAL"),
                        ownerPhone: String(item.ownerId?.phoneNumber || "NO CONTACT"),
                        ownerEmail: String(item.ownerId?.email || "NO EMAIL"),
                        address: String(item.address || "NO ADDRESS DATA"),
                        status: String(item.status || "pending").toLowerCase(),
                        gstNo: String(item.gstNo || "PENDING"),
                        panNo: String(item.panNo || "PENDING"),
                        description: String(item.description || "No description provided."),
                        facilities: Array.isArray(item.facilities) ? item.facilities.map(String) : [],
                        displayImage: img,
                        documentation: {
                            trading: String(item.documentation?.tradingLicense || "MISSING"),
                            fire: String(item.documentation?.fireSafety || "MISSING"),
                            insurance: String(item.documentation?.insurancePolicy || "MISSING")
                        },
                        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "RECENT"
                    };
                } catch (e) {
                    return null;
                }
            }).filter((p): p is PartnerRecord => p !== null);

            setPartners(sanitized);
        } catch (err: any) {
            setError(err.message || "Protocol Failure: Could not reach vetting server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { synchronize(); }, []);

    const queue = useMemo(() => partners.filter(p => p.status === 'pending'), [partners]);

    const performAction = async (id: string, action: 'authorize' | 'terminate') => {
        try {
            const nextStatus = action === 'authorize' ? 'active' : 'rejected';
            await updateGymStatus(id, nextStatus);
            setPartners(prev => prev.map(p => p._id === id ? { ...p, status: nextStatus } : p));
            setAuditTarget(null);
        } catch (err: any) {
            alert("Action Protocol Error: " + err.message);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-32 gap-6 bg-gray-50/50 rounded-[64px] m-8 border border-gray-100">
            <Loader2 className="w-16 h-16 animate-spin text-black" />
            <p className="font-black uppercase tracking-[0.5em] text-[10px] text-gray-400">Vetting Database Sync...</p>
        </div>
    );

    if (error) return (
        <div className="p-20 flex items-center justify-center h-full">
            <div className="bg-white p-16 rounded-[48px] border-2 border-red-50 text-center max-w-lg shadow-2xl">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-8" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 mb-4">Link Termination</h3>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-loose mb-10">{error}</p>
                <button onClick={synchronize} className="px-12 py-5 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-4 mx-auto hover:bg-red-600 transition-all">
                    <RefreshCcw className="w-4 h-4" /> Re-Establish Connection
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-16 pb-32 font-sans">
            <header className="flex flex-col md:flex-row justify-between items-end gap-10">
                <div>
                    <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">Security Vetting</h2>
                    <div className="flex items-center gap-4 mt-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                             Network Integrity Center
                        </p>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                </div>
                <div className="bg-black px-10 py-6 rounded-[32px] text-white flex items-center gap-6 shadow-2xl">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Awaiting Clearance</p>
                        <p className="text-4xl font-black italic tracking-tighter leading-none">{queue.length}</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <Building2 className="w-8 h-8 text-primary" />
                </div>
            </header>

            {queue.length === 0 ? (
                <div className="bg-white p-32 rounded-[72px] border-2 border-dashed border-gray-100 text-center space-y-8 shadow-sm">
                    <ShieldCheck className="w-24 h-24 text-gray-100 mx-auto" />
                    <div>
                        <h4 className="text-3xl font-black uppercase italic tracking-tighter text-gray-900">Perimeter Secured</h4>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-3">No Hubs currently awaiting authorization protocol.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-10">
                    {queue.map((partner) => (
                        <div 
                            key={partner._id}
                            onClick={() => setAuditTarget(partner)}
                            className="bg-white p-10 rounded-[64px] border border-gray-100 hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all cursor-pointer group flex flex-col lg:flex-row gap-12 items-center relative overflow-hidden"
                        >
                            <div className="w-48 h-48 rounded-[48px] overflow-hidden bg-gray-50 shrink-0 border-4 border-white shadow-xl">
                                <img src={partner.displayImage} alt="Partner" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-6">
                                    <h3 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900">{partner.name}</h3>
                                    <span className="px-5 py-2 bg-amber-50 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">Audit Req.</span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    <InfoBox icon={User} label="Registrant" value={partner.ownerName} />
                                    <InfoBox icon={Landmark} label="Registry" value={partner.gstNo} />
                                    <InfoBox icon={Users} label="Impact" value="Network" />
                                    <InfoBox icon={Award} label="Identity" value="Vetted" />
                                </div>
                            </div>
                            <button className="px-12 py-6 bg-black text-white rounded-[32px] font-black text-xs uppercase tracking-widest flex items-center gap-4 shadow-2xl group-hover:bg-gray-800 transition-all">
                                <Eye className="w-5 h-5 text-primary" /> Inspect Hub
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Audit Interaction Layer --- */}
            {auditTarget && (
                <div className="fixed inset-0 z-[200] bg-black/98 p-6 flex items-center justify-center overflow-y-auto backdrop-blur-3xl">
                    <div className="bg-white w-full max-w-6xl rounded-[80px] overflow-hidden relative shadow-[0_50px_150px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col xl:flex-row max-h-[92vh]">
                        <button 
                            onClick={() => setAuditTarget(null)} 
                            title="Close Audit"
                            className="absolute top-10 right-10 p-6 bg-gray-50 hover:bg-gray-100 rounded-[32px] transition-all z-[210] shadow-sm"
                        >
                            <X className="w-8 h-8 text-black" />
                        </button>

                        <div className="xl:w-[450px] bg-gray-950 p-16 text-white flex flex-col shrink-0">
                            <div className="space-y-12">
                                <div className="aspect-square rounded-[56px] overflow-hidden border-4 border-white/5 shadow-2xl">
                                    <img src={auditTarget.displayImage} className="w-full h-full object-cover" alt="Venue" />
                                </div>
                                <div>
                                    <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-tight mb-8">{auditTarget.name}</h3>
                                    <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-white/5 rounded-full border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Live Audit Active</p>
                                    </div>
                                </div>
                                <div className="space-y-8 pt-8 border-t border-white/10">
                                    <SideStat icon={User} label="Principal" value={auditTarget.ownerName} />
                                    <SideStat icon={Mail} label="Contact" value={auditTarget.ownerEmail} />
                                    <SideStat icon={Phone} label="Line" value={auditTarget.ownerPhone} />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-20 space-y-20 bg-white overflow-y-auto custom-scrollbar">
                            <section className="space-y-12">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-400">Compliance Files</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <FileCard icon={FileText} label="Trading License" id={auditTarget.documentation.trading} />
                                    <FileCard icon={Shield} label="Fire Safety Index" id={auditTarget.documentation.fire} />
                                    <FileCard icon={Landmark} label="Direct Tax (GST)" id={auditTarget.gstNo} />
                                    <FileCard icon={Award} label="Legal Entity (PAN)" id={auditTarget.panNo} />
                                </div>
                            </section>

                            <section className="space-y-12">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-gray-400">Institutional Dossier</h4>
                                <p className="text-3xl font-black italic text-gray-900 leading-tight border-l-[12px] border-primary pl-12 py-4">
                                    "{auditTarget.description}"
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {auditTarget.facilities.map((f, i) => (
                                        <span key={i} className="px-10 py-5 bg-gray-50 border border-gray-100 rounded-[32px] font-black text-[11px] uppercase tracking-widest text-black shadow-sm">
                                            {String(f).toUpperCase()}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            <section className="bg-black p-16 rounded-[72px] text-white space-y-12 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
                                <div className="relative z-10 flex items-center gap-10">
                                    <div className="w-24 h-24 bg-white/10 rounded-[40px] flex items-center justify-center text-primary shadow-2xl">
                                        <ShieldCheck className="w-12 h-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-4xl font-black uppercase italic tracking-tighter">Clearance Status</h4>
                                        <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest mt-3">Final authorization for hub network access.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    <button onClick={() => performAction(auditTarget._id, 'terminate')} className="py-8 bg-white/5 border border-white/10 rounded-[40px] font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all shadow-sm">
                                        Deny Clearance
                                    </button>
                                    <button onClick={() => performAction(auditTarget._id, 'authorize')} className="py-8 bg-primary text-black rounded-[40px] font-black text-xs uppercase tracking-widest shadow-[0_24px_50px_rgba(163,230,53,0.4)] hover:scale-[1.02] transition-all">
                                        Authorize Launch
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Internal Utilities ---
function InfoBox({ icon: Icon, label, value }: any) {
    return (
        <div className="space-y-2">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Icon className="w-4 h-4" /> {label}
            </p>
            <p className="font-black italic text-gray-900 text-[12px] uppercase tracking-tighter truncate">{String(value)}</p>
        </div>
    );
}

function SideStat({ icon: Icon, label, value }: any) {
    return (
        <div className="flex items-center gap-6 group">
            <div className="w-14 h-14 bg-white/5 rounded-[24px] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
                <p className="font-bold text-base text-white truncate max-w-[200px]">{String(value)}</p>
            </div>
        </div>
    );
}

function FileCard({ icon: Icon, label, id }: any) {
    return (
        <div className="p-10 bg-gray-50 border-2 border-transparent rounded-[56px] hover:border-black hover:bg-white transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-gray-300 group-hover:text-black transition-colors shadow-sm">
                    <Icon className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-3 px-5 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Scanned</span>
                </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">{label}</p>
            <p className="font-black italic text-gray-900 text-lg tracking-tighter truncate">{String(id)}</p>
        </div>
    );
}
