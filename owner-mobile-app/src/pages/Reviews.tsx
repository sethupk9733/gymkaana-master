import { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, ArrowLeft } from 'lucide-react';
import { fetchOwnerReviews, replyToReview } from '../lib/api';
import { motion } from 'motion/react';

export default function Reviews({ onBack }: { onBack: () => void }) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const handleReplySubmit = async (reviewId: string) => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        try {
            await replyToReview(reviewId, replyText);
            setReviews(reviews.map(r =>
                r._id === reviewId
                    ? { ...r, reply: replyText, repliedAt: new Date().toISOString() }
                    : r
            ));
            setReplyingTo(null);
            setReplyText('');
        } catch (err) {
            console.error('Failed to submit reply:', err);
            alert('Failed to send reply. Please try again.');
        } finally {
            setSubmittingReply(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const data = await fetchOwnerReviews();
            setReviews(data);
        } catch (err) {
            console.error('Failed to load reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white z-10">
                <button onClick={onBack} title="Go Back" className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Field Reports</h2>
            </div>

            <div className="p-6 space-y-6">
                {reviews.length === 0 ? (
                    <div className="py-20 text-center">
                        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">No member intelligence available.</p>
                    </div>
                ) : (
                    reviews.map((review, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={review._id}
                            className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black text-primary rounded-xl flex items-center justify-center font-black text-sm italic uppercase tracking-tighter">
                                        {review.userId?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase italic tracking-tighter leading-tight">{review.userId?.name}</h4>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className={`${i < review.rating ? 'fill-black text-black' : 'text-gray-100'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[9px] font-black text-primary uppercase tracking-widest">{review.gymId?.name}</p>
                                <p className="text-sm font-bold text-gray-600 leading-relaxed italic border-l-4 border-gray-50 pl-4 py-1">
                                    "{review.comment}"
                                </p>

                                {review.reply ? (
                                    <div className="mt-4 pt-4 border-t border-gray-50 pl-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Owner Response</span>
                                            <span className="text-[9px] font-bold text-gray-300 uppercase">{new Date(review.repliedAt || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-800 italic">"{review.reply}"</p>
                                    </div>
                                ) : (
                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        {replyingTo === review._id ? (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Write your response..."
                                                    className="w-full text-xs font-bold p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 resize-none h-24"
                                                    disabled={submittingReply}
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setReplyingTo(null);
                                                            setReplyText('');
                                                        }}
                                                        className="px-4 py-2 text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 border border-gray-200 rounded-xl"
                                                        disabled={submittingReply}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleReplySubmit(review._id)}
                                                        className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                                                        disabled={submittingReply}
                                                    >
                                                        {submittingReply && <Loader2 size={10} className="animate-spin" />}
                                                        Send Reply
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingTo(review._id)}
                                                className="w-full py-3 border border-gray-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-gray-50 flex items-center justify-center gap-2 group/reply transition-all"
                                            >
                                                <MessageSquare size={12} className="group-hover/reply:scale-110 transition-transform" /> Reply to member
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
