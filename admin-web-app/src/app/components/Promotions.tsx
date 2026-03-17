import { useState, useEffect } from 'react';
import { Sparkles, Calendar, Image as ImageIcon, Plus, Trash2, Megaphone, Tag, ArrowUpRight, CheckCircle, Clock, Loader2 } from "lucide-react";
import { fetchGyms } from '../lib/api';

interface Promotion {
    id: string | number;
    title: string;
    description: string;
    type: "Flash Sale" | "New Launch" | "Special Discount";
    status: "Active" | "Scheduled" | "Expired";
    impact: string;
    expiry: string;
}

export function Promotions() {
    const [activeType, setActiveType] = useState('All');
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const gyms = await fetchGyms();
            const latestGyms = (Array.isArray(gyms) ? gyms : []).slice(-3).reverse();
            
            const dynamicPromos: Promotion[] = latestGyms.map((gym: any) => ({
                id: gym._id,
                title: `${gym.name} Launch`,
                description: `Special inaugural pricing for the newly onboarded ${gym.city || 'local'} hub.`,
                type: "New Launch",
                status: "Active",
                impact: "Growth Vector",
                expiry: "Direct Access"
            }));

            const staticPromos: Promotion[] = [
                {
                    id: "p1",
                    title: "Summer Shred 2026",
                    description: "25% Off on all annual memberships across Bangalore hubs.",
                    type: "Flash Sale",
                    status: "Active",
                    impact: "+420 New Users",
                    expiry: "12 Days Left"
                },
                {
                    id: "p2",
                    title: "Early Bird Pilates",
                    description: "Limited time 10% discount for morning slot bookings.",
                    type: "Special Discount",
                    status: "Active",
                    impact: "+150 Bookings",
                    expiry: "5 Days Left"
                }
            ];

            setPromotions([...dynamicPromos, ...staticPromos]);
        } catch (err) {
            console.error('Failed to load promotions:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPromotions = promotions.filter(p => activeType === 'All' || p.type === activeType);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
            <Loader2 className="w-16 h-16 animate-spin text-black" />
            <p className="font-black uppercase tracking-[0.4em] text-xs text-gray-400">Loading Campaign Intelligence...</p>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20 font-sans">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic text-shadow">Campaign Engine</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Global marketing & promotion distribution center</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-black/10">
                    <Plus className="w-5 h-5 text-primary" /> Create New Campaign
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-shadow">
                <PromoStat label="Active Reach" value="24.8K" sub="Unique Impressions" icon={Megaphone} />
                <PromoStat label="Conversion Rate" value="3.4%" sub="Campaign Velocity" icon={ArrowUpRight} />
                <PromoStat label="Total Redemptions" value="1,240" sub="Coupon Usage" icon={Tag} />
            </div>

            <div className="bg-white border border-gray-100 rounded-[48px] p-10 shadow-sm space-y-8">
                <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {['All', 'Flash Sale', 'New Launch', 'Special Discount'].map(type => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={`px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeType === type ? 'bg-black text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredPromotions.map((promo) => (
                        <div key={promo.id} className="p-8 bg-gray-50 rounded-[40px] border border-transparent hover:border-black/5 hover:bg-white hover:shadow-2xl transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${promo.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                    }`}>
                                    {promo.status}
                                </span>
                                <div className="flex gap-2">
                                    <button 
                                        title="Delete Campaign"
                                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <h4 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 group-hover:text-primary transition-colors underline decoration-primary/20">{promo.title}</h4>
                                </div>
                                <p className="text-gray-500 font-bold text-xs leading-relaxed max-w-md uppercase">{promo.description}</p>
                            </div>

                            <div className="mt-8 flex items-center justify-between pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Campaign Gain</p>
                                        <p className="font-black text-xs text-emerald-500">{promo.impact}</p>
                                    </div>
                                    <div className="w-px h-6 bg-gray-100" />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="font-black text-xs text-gray-900">{promo.expiry}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PromoStat({ label, value, sub, icon: Icon }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-2xl transition-all">
            <div className="w-16 h-16 bg-gray-50 rounded-[28px] flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                <Icon className="w-8 h-8" />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase">{value}</h3>
                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {sub}
                </p>
            </div>
        </div>
    );
}
