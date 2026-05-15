import { useState, useEffect } from 'react';
import { 
    MessageSquare, Search, Trash2, Calendar, Phone, MapPin, 
    User, Activity, RefreshCw, AlertCircle, CheckCircle, ExternalLink 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchInquiries, deleteInquiry, updateInquiryStatus } from '../lib/api';

interface Inquiry {
    _id: string;
    gymName: string;
    contact: string;
    location: string;
    status: 'new' | 'on progress' | 'conversion on process' | 'success' | 'contacted' | 'onboarded' | 'ignored';
    createdAt: string;
}

const STAGES = [
    { value: 'new', label: 'New Lead', color: 'bg-blue-100 text-blue-600' },
    { value: 'on progress', label: 'On Progress', color: 'bg-orange-100 text-orange-600' },
    { value: 'conversion on process', label: 'Conversion Process', color: 'bg-purple-100 text-purple-600' },
    { value: 'success', label: 'Success', color: 'bg-[#A3E635]/20 text-black' },
    { value: 'ignored', label: 'Ignored', color: 'bg-gray-100 text-gray-500' }
];

export function EnquiryManagement() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

    const loadInquiries = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Fetching inquiries from API...');
            const data = await fetchInquiries();
            console.log('Inquiries received:', data);
            
            if (data && typeof data === 'object' && !Array.isArray(data) && data.inquiries) {
                setInquiries(data.inquiries);
            } else if (Array.isArray(data)) {
                setInquiries(data);
            } else {
                console.warn('Unexpected data format for inquiries:', data);
                setInquiries([]);
            }
        } catch (err: any) {
            console.error('Fetch Error:', err);
            setError(err.message || 'Failed to fetch enquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInquiries();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
        setDeletingId(id);
        try {
            await deleteInquiry(id);
            setInquiries(prev => prev.filter(item => item._id !== id));
        } catch (err: any) {
            alert(err.message || 'Failed to delete enquiry');
        } finally {
            setDeletingId(null);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        setUpdatingStatusId(id);
        try {
            await updateInquiryStatus(id, status);
            setInquiries(prev => prev.map(item => item._id === id ? { ...item, status: status as any } : item));
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const filteredInquiries = inquiries.filter(item => 
        (item.gymName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.contact || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-10 max-w-[1600px] mx-auto space-y-12 pb-32 font-sans">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-black rounded-2xl shadow-xl shadow-black/10">
                            <MessageSquare className="w-6 h-6 text-[#A3E635]" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Gym Enquiries</h2>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Leads generated from the owner landing page</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={loadInquiries}
                        disabled={loading}
                        className="px-6 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#A3E635]' : ''}`} /> Refresh
                    </button>
                </div>
            </header>

            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl w-full md:w-96 border border-gray-100">
                <Search className="w-5 h-5 text-gray-400 ml-4" />
                <input
                    type="text"
                    placeholder="Search Gym, Contact or Location..."
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold uppercase tracking-wider w-full placeholder:text-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredInquiries.map((inquiry) => (
                        <motion.div
                            key={inquiry._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            className="bg-white border border-gray-200 rounded-[32px] p-8 hover:shadow-2xl transition-all group flex flex-col gap-6 shadow-sm relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#A3E635]/5 rounded-bl-[40px] -mr-4 -mt-4 group-hover:bg-[#A3E635]/10 transition-colors" />
                            
                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Gym Name</p>
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 leading-tight group-hover:text-black">{inquiry.gymName}</h3>
                                    </div>
                                    <select 
                                        value={inquiry.status}
                                        onChange={(e) => handleStatusUpdate(inquiry._id, e.target.value)}
                                        disabled={updatingStatusId === inquiry._id}
                                        className={`text-[9px] font-black uppercase tracking-widest border-none rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-black/5 transition-all ${
                                            STAGES.find(s => s.value === inquiry.status)?.color || 'bg-gray-100 text-gray-900'
                                        }`}
                                    >
                                        {STAGES.map(stage => (
                                            <option key={stage.value} value={stage.value}>{stage.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#A3E635] transition-colors">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact Information</p>
                                            <p className="text-sm font-bold text-gray-700">{inquiry.contact}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#A3E635] transition-colors">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                                            <p className="text-sm font-bold text-gray-700">{inquiry.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#A3E635] transition-colors">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Received On</p>
                                            <p className="text-sm font-bold text-gray-700">{new Date(inquiry.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                <a 
                                    href={`tel:${inquiry.contact}`}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#A3E635] hover:text-black transition-colors"
                                >
                                    <ExternalLink className="w-3 h-3" /> Call Now
                                </a>
                                <button 
                                    onClick={() => handleDelete(inquiry._id)}
                                    disabled={deletingId === inquiry._id}
                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                >
                                    {deletingId === inquiry._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {error && !loading && (
                    <div className="col-span-full py-20 text-center bg-red-50 rounded-[40px] border-2 border-dashed border-red-100">
                        <AlertCircle className="w-16 h-16 text-red-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-red-400">Sync Interrupted</h3>
                        <p className="text-xs font-bold text-red-300 uppercase tracking-widest mt-1 mb-6">{error}</p>
                        <button onClick={loadInquiries} className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all">Retry Sync</button>
                    </div>
                )}

                {filteredInquiries.length === 0 && !loading && !error && (
                    <div className="col-span-full py-32 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100">
                        <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-400">No Enquiries Found</h3>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-2">Check back later for new leads from the landing page</p>
                    </div>
                )}

                {loading && (
                    <div className="col-span-full py-32 text-center">
                        <div className="w-12 h-12 border-4 border-black border-t-[#A3E635] rounded-full animate-spin mx-auto mb-6" />
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">Syncing Leads</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-2">Connecting to the enquiry database...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
