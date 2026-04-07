import { useState } from 'react';
import { Sparkles, Calendar, Image as ImageIcon, Plus, Trash2, Megaphone, Tag, ArrowUpRight, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Promotion {
    id: number;
    title: string;
    description: string;
    type: "Flash Sale" | "New Launch" | "Special Discount";
    status: "Active" | "Scheduled" | "Expired";
    startDate: string;
    endDate: string;
    banner: string;
    clickCount: number;
}

export function Promotions() {
    const [promotions, setPromotions] = useState<Promotion[]>([
        {
            id: 1,
            title: "New Year Fit Blast",
            description: "Get up to 40% off on all annual memberships across selected premium gyms.",
            type: "Special Discount",
            status: "Active",
            startDate: "Jan 1, 2026",
            endDate: "Jan 31, 2026",
            banner: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f",
            clickCount: 1240
        },
        {
            id: 2,
            title: "Cult Fitness Launch",
            description: " Cult is now live in Whitefield. First 100 users get a free trial session.",
            type: "New Launch",
            status: "Scheduled",
            startDate: "Jan 15, 2026",
            endDate: "Jan 25, 2026",
            banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
            clickCount: 0
        }
    ]);

    const [showCreator, setShowCreator] = useState(false);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-primary shadow-xl">
                        <Megaphone className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Promotions & Ads</h2>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage global platform banners and flash sales</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowCreator(true)}
                    className="px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5 text-primary" /> Create Promotion
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promotions.map((promo, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
                    >
                        <div className="relative h-56 overflow-hidden">
                            <img src={promo.banner} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={promo.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute top-6 left-6 flex gap-2">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 backdrop-blur-md text-white ${promo.status === 'Active' ? 'bg-emerald-500/50' : promo.status === 'Scheduled' ? 'bg-blue-500/50' : 'bg-gray-500/50'
                                    }`}>
                                    {promo.status}
                                </span>
                                <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-black text-primary border border-primary/20">
                                    {promo.type}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{promo.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed italic">{promo.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400">Duration</p>
                                        <p className="text-xs font-bold text-gray-700">{promo.startDate} - {promo.endDate}</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-gray-400">Total Clicks</p>
                                        <p className="text-xs font-bold text-gray-700">{promo.clickCount.toLocaleString()} Users</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button className="flex-1 py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                                    Edit Details
                                </button>
                                <button
                                    className="p-4 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-xl transition-all"
                                    title="Delete promotion"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Campaign Insight Banner */}
            <div className="bg-black text-white rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary backdrop-blur-md">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">Campaign Effectiveness</h3>
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Average boost of 22% in bookings during active promotions</p>
                    </div>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Conversion Rate</p>
                        <p className="text-3xl font-black italic">14.2%</p>
                    </div>
                </div>
            </div>

            {/* Creator Modal Placeholder */}
            {showCreator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white w-full max-w-xl rounded-[48px] p-12 text-center"
                    >
                        <Megaphone className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Create New Campaign</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-10 leading-relaxed">
                            Upload your banner art and set the target parameters to launch a new marketplace promotion.
                        </p>
                        <div className="grid grid-cols-1 gap-4 mb-10">
                            <div className="h-32 border-2 border-dashed border-gray-100 rounded-3xl flex items-center justify-center text-gray-300 font-black flex-col gap-2">
                                <Plus className="w-6 h-6" />
                                <span>Upload Banner Art (1920x1080)</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setShowCreator(false)} className="flex-1 py-5 bg-gray-50 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest">Cancel</button>
                            <button className="flex-1 py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/20">Launch Campaign</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
