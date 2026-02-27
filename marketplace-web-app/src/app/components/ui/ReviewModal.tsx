import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Send, Loader2 } from 'lucide-react';
import { createReview } from '../../lib/api';

interface ReviewModalProps {
    booking: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function ReviewModal({ booking, isOpen, onClose, onSuccess }: ReviewModalProps) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await createReview({
                gymId: booking.gymId,
                bookingId: booking.id,
                rating,
                comment
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        <div className="bg-black p-8 text-white relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white"
                                title="Close"
                            >
                                <X size={18} />
                            </button>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Rate Your Hub</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                {booking.gym} • {booking.plan}
                            </p>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Intensity Level</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            onClick={() => setRating(star)}
                                            className="p-1 transition-all hover:scale-110 active:scale-90"
                                            title={`Rate ${star} Stars`}
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-all ${(hover || rating) >= star
                                                    ? "fill-primary text-black"
                                                    : "text-gray-200"
                                                    }`}
                                                strokeWidth={1.5}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Member Feedback</label>
                                <textarea
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-black transition-all min-h-[120px]"
                                    placeholder="How was the equipment, vibe, and staff?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full h-16 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 text-primary" />
                                        Submit Institutional Report
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
