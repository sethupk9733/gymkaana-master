import { motion } from "motion/react";

export function LoadingSpinner() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
            <div className="relative">
                <motion.div
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <div className="w-2 h-2 bg-black rounded-full" />
                </motion.div>
            </div>
            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400"
            >
                Loading Gymkaana
            </motion.p>
        </div>
    );
}
