import { X, Info, Calendar, ShieldCheck, ArrowLeft, Dumbbell, Users, Bike, Droplets } from "lucide-react";
import { ActivePass } from "../../types";
import { useState } from "react";
import { motion } from "motion/react";

export function QRModal({ pass, onClose }: { pass: ActivePass; onClose: () => void }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = (e: React.MouseEvent) => {
        // Prevent flipping if clicking the close button or inner scrollable content
        if ((e.target as HTMLElement).closest('.stop-propagation')) return;
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm h-[580px] [perspective:1200px] relative">
                <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 25 }}
                    className="w-full h-full relative [transform-style:preserve-3d]"
                >
                    {/* Front Side: QR Code */}
                    <div
                        onClick={handleFlip}
                        className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col cursor-pointer border border-gray-100"
                    >
                        {/* Close Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10 stop-propagation"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className="p-8 pb-4 text-center flex-1 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 mb-4 border border-gray-100 flex items-center justify-center">
                                <img src={pass.gymLogo} alt={pass.gymName} className="w-12 h-12 object-contain" />
                            </div>
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">{pass.gymName}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">{pass.planName} Access</p>

                            <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 mb-8 inline-block shadow-inner">
                                <motion.img
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={pass.qrCode}
                                    alt="QR Code"
                                    className="w-44 h-44 mx-auto"
                                />
                                <p className="mt-4 text-[10px] font-mono text-gray-300 font-bold uppercase tracking-[0.3em]">{pass.id}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-[8px] text-gray-400 uppercase font-black tracking-widest mb-1">
                                        <Calendar className="w-3 h-3" />
                                        Valid Thru
                                    </div>
                                    <div className="text-xs font-black">{pass.validUntil}</div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-2 text-[8px] text-gray-400 uppercase font-black tracking-widest mb-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Status
                                    </div>
                                    <div className="text-xs font-black text-emerald-500">ACTIVE</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-0">
                            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse">
                                <Info className="w-3.5 h-3.5" />
                                Tap anywhere to Flip
                            </div>
                        </div>
                    </div>

                    {/* Back Side: Venue Guide */}
                    <div
                        onClick={handleFlip}
                        className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col cursor-pointer border border-gray-100"
                    >
                        <div className="p-8 flex flex-col h-full uppercase">
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                        <Info className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-black italic tracking-tighter">Venue Guide</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors stop-propagation"
                                    title="Flip back to QR"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide stop-propagation">
                                <section>
                                    <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 mb-4 px-1">House Rules</h4>
                                    <div className="space-y-2">
                                        {[
                                            "Clean shoes required",
                                            "Wipe down equipment",
                                            "No outside training",
                                            "Re-rack weights"
                                        ].map((rule, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                                                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">
                                                    {i + 1}
                                                </div>
                                                <p className="text-[11px] font-black text-gray-600 tracking-tight">{rule}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 mb-4 px-1">Amenities</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Dumbbell, label: "Weights" },
                                            { icon: Users, label: "Coaches" },
                                            { icon: Bike, label: "Cardio" },
                                            { icon: Droplets, label: "Showers" },
                                        ].map((amenity, i) => (
                                            <div key={i} className="flex items-center gap-2.5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                                                <amenity.icon className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-black text-gray-600">{amenity.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-50">
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Tap to flip back
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
