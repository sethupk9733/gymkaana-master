import { QrCode, Calendar, ArrowRight, ShieldCheck, User } from "lucide-react";
import { motion } from "motion/react";
import { ActivePass } from "../../types";

export function ActivePassCard({ pass, onClick, userPhoto }: { pass: ActivePass; onClick: () => void; userPhoto?: string | null }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="bg-gray-900 text-white rounded-[32px] p-6 shadow-2xl relative overflow-hidden cursor-pointer group"
        >
            {/* Design Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 blur-[60px] rounded-full" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 bg-white rounded-2xl p-2 shadow-lg group-hover:rotate-6 transition-transform relative">
                            <img src={pass.gymLogo} alt={pass.gymName} className="w-full h-full object-contain" />
                            {userPhoto && (
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-gray-900 overflow-hidden shadow-lg">
                                    <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-black text-xl leading-tight italic uppercase tracking-tight">{pass.gymName}</h4>
                            <div className="flex items-center gap-2">
                                <p className="text-primary text-xs font-black uppercase tracking-widest mt-0.5">{pass.planName}</p>
                                {userPhoto && (
                                    <div className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                        <ShieldCheck className="w-2.5 h-2.5" />
                                        <span className="text-[7px] font-black uppercase">Verified</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all">
                        <QrCode className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Valid Until</div>
                        <div className="flex items-center gap-2 font-bold bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-sm">{pass.validUntil}</span>
                        </div>
                    </div>

                    {pass.remainingSessions && (
                        <div className="text-right">
                            <div className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-1">Sessions Left</div>
                            <div className="text-3xl font-black italic tracking-tighter text-accent">{pass.remainingSessions}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between group-hover:text-white transition-colors">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60">Tap to Access Venue</span>
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
            </div>
        </motion.div>
    );
}
