import { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, User, ArrowRight } from 'lucide-react';
import { fetchOwnerReviews, replyToReview } from '../lib/api';

export function ReviewsList() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [submittingReply, setSubmittingReply] = useState(false);

    const handleReplySubmit = async (reviewId: string) => {
        if (!replyText.trim()) return;
        setSubmittingReply(true);
        try {
            await replyToReview(reviewId, replyText);
            // Optimistically update the UI
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">Member Reviews</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Direct feedback from your hubs</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Intelligence</span>
                    <span className="text-xl font-black italic text-gray-900">{reviews.length}</span>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-100 rounded-[32px] p-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-black italic uppercase tracking-tighter text-gray-900 mb-2">No Reports Filed</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Feedback will appear here once members review their visits.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div
                                    className="flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity"
                                    onClick={() => setSelectedUser(review.userId)}
                                    title="View Member Profile"
                                >
                                    <div className="w-12 h-12 bg-black text-primary rounded-2xl flex items-center justify-center font-black text-lg italic uppercase tracking-tighter">
                                        {(review.userId?.name || 'U').charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase italic tracking-tighter leading-tight">{review.userId?.name || 'Unknown'}</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
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

                            <div className="mb-6">
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">{review.gymId?.name}</p>
                                <p className="text-sm font-bold text-gray-600 leading-relaxed italic border-l-4 border-gray-50 pl-4 py-1">
                                    "{review.comment}"
                                </p>

                                {/* Reply Section */}
                                {review.reply ? (
                                    <div className="mt-4 pl-4 border-l-4 border-black/10 py-1">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Owner Response</p>
                                        <p className="text-sm font-bold text-gray-800 italic">"{review.reply}"</p>
                                    </div>
                                ) : (
                                    <div className="mt-4">
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
                                                        className="px-3 py-1.5 text-[9px] font-black uppercase text-gray-400 hover:text-gray-600"
                                                        disabled={submittingReply}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleReplySubmit(review._id)}
                                                        className="px-4 py-1.5 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
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
                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 flex items-center gap-1 group/reply"
                                            >
                                                <MessageSquare size={12} className="group-hover/reply:scale-110 transition-transform" /> Reply to member
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-gray-50">
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Protocol Verified Detail</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Member Profile Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedUser(null)}>
                    <div className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-black text-white rounded-[32px] flex items-center justify-center font-black text-4xl shadow-xl italic mx-auto mb-6 transform -rotate-3">
                                {selectedUser.name?.charAt(0)}
                            </div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">{selectedUser.name}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Valued Member</p>
                        </div>

                        <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <User size={18} className="text-black" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Full Name</p>
                                    <p className="font-bold text-gray-900">{selectedUser.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm">
                                    <MessageSquare size={18} className="text-black" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="font-bold text-gray-900">
                                        {selectedUser.email ? `${selectedUser.email.split('@')[0].substring(0, 2)}***@${selectedUser.email.split('@')[1]}` : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {selectedUser.phoneNumber && (
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm">
                                        <MessageSquare size={18} className="text-black" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                                        <p className="font-bold text-gray-900">******{selectedUser.phoneNumber.slice(-4)}</p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-200">
                                <a
                                    href={`mailto:support@gymkaana.com?subject=Inquiry about Member ${selectedUser.name}&body=I would like to discuss a review from member ${selectedUser.name} (ID: ${selectedUser._id}).`}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-black transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-black text-white rounded-lg">
                                            <MessageSquare size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Contact Support</p>
                                            <p className="text-[9px] font-bold text-gray-400">Resolve with Gymkaana Team</p>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                        <ArrowRight size={12} />
                                    </div>
                                </a>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 transition-all"
                            >
                                Close Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
