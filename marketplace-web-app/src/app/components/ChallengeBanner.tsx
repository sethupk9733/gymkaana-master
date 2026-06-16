import { motion } from "motion/react";
import { Trophy, ArrowRight, Target, Flame } from "lucide-react";

export function ChallengeBanner({
    onDashboardClick,
    onLeaderboardClick
}: {
    onDashboardClick: () => void;
    onLeaderboardClick: () => void;
}) {
    return (
        <div className="bg-gradient-to-r from-orange-500 to-rose-600 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl mt-12 mb-12 border border-orange-400">
            {/* Background elements */}
            <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute left-0 bottom-0 w-32 h-32 bg-yellow-400 opacity-20 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-yellow-300" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-100">Gamification Engine</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white mb-2">
                    Accept the Challenge. <br/>Earn the Rewards.
                </h3>
                <p className="text-sm font-medium text-rose-100 max-w-md">
                    Join gym challenges, climb the leaderboard, and unlock exclusive rewards. The more you sweat, the more you get!
                </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onDashboardClick}
                    className="px-6 py-3 bg-white text-rose-600 rounded-full font-black uppercase tracking-widest text-[11px] shadow-lg flex items-center justify-center gap-2"
                >
                    <Target className="w-4 h-4" />
                    My Dashboard
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onLeaderboardClick}
                    className="px-6 py-3 bg-rose-700/50 hover:bg-rose-700 text-white border border-rose-400/50 rounded-full font-black uppercase tracking-widest text-[11px] backdrop-blur-sm transition-colors flex items-center justify-center gap-2"
                >
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                </motion.button>
            </div>
        </div>
    );
}
