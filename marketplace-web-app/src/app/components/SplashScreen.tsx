import { Dumbbell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
      className="h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"
      />

      <div className="flex flex-col items-center gap-8 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0, rotate: -10 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
            delay: 0.2
          }}
          className="w-32 h-32 bg-white rounded-[40px] flex items-center justify-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border-8 border-white group"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Dumbbell className="w-16 h-16 text-black" strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-6xl font-black text-white italic tracking-tighter mb-2"
          >
            GYMKAANA
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 1, duration: 1.5 }}
            className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-xs font-black text-white/40 uppercase tracking-[0.4em]"
          >
            Premium Fitness Network
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-16 flex flex-col items-center gap-4"
      >
        <div className="w-1 h-12 bg-white/10 rounded-full relative overflow-hidden">
          <motion.div
            animate={{ y: [0, 48] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 w-full h-1/2 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
