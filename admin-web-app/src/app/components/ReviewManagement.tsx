import { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, Search, Filter } from 'lucide-react';
import { fetchAllReviews } from '../lib/api';

export function ReviewManagement() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'highest' | 'lowest' | 'newest'>('newest');

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const data = await fetchAllReviews();
            setReviews(data);
        } catch (err) {
            console.error('Failed to load reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.gymId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedReviews = [...filteredReviews].sort((a, b) => {
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">Institutional Feedback</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Global monitoring of venue performance</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm gap-1">
                        {[
                            { id: 'newest', label: 'Recent' },
                            { id: 'highest', label: 'Top' },
                            { id: 'lowest', label: 'Critical' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSortBy(opt.id as any)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === opt.id
                                    ? 'bg-black text-[#A3E635] shadow-lg'
                                    : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Filter reports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl w-64 font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
                            title="Filter Reviews"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedReviews.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No matching reports found in database.</p>
                    </div>
                ) : (
                    sortedReviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-black text-[#A3E635] rounded-2xl flex items-center justify-center font-black text-lg italic uppercase tracking-tighter shadow-lg shadow-black/10">
                                        {review.userId?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase italic tracking-tighter leading-tight">{review.userId?.name}</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.userId?.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, idx) => (
                                        <Star
                                            key={idx}
                                            size={12}
                                            className={`${idx < review.rating ? 'fill-black text-black' : 'text-gray-100'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-[#A3E635] uppercase tracking-widest bg-black px-2 py-1 rounded-md">{review.gymId?.name}</span>
                                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm font-bold text-gray-600 leading-relaxed italic border-l-4 border-gray-100 pl-4 py-1">
                                    "{review.comment}"
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">ID: {review._id.slice(-8).toUpperCase()}</span>
                                <button className="text-[8px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Flag Report</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
