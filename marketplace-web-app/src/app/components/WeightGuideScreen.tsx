import { motion } from 'motion/react';
import { 
    ChevronLeft, Heart, Salad, Dumbbell, 
    Zzz, Brain, Flag, Sparkles, TrendingUp 
} from 'lucide-react';
import { SEO } from './SEO';

export function WeightGuideScreen({ onBack }: { onBack: () => void }) {
    const sections = [
        {
            title: "Nutrition Protocol",
            icon: <Salad className="w-5 h-5" />,
            content: "Focus on whole foods. Prioritize fiber-rich vegetables, lean proteins, and complex carbohydrates. Aim for a caloric balance that matches your fitness goals.",
            color: "bg-green-50 text-green-600"
        },
        {
            title: "Training Discipline",
            icon: <Dumbbell className="w-5 h-5" />,
            content: "Combine strength training with progressive cardiovascular sessions. Muscle tissue burns more calories at rest, boosting your metabolic rate.",
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Recovery & Sleep",
            icon: <Heart className="w-5 h-5" />,
            content: "Aim for 7-9 hours of quality sleep. Recovery is when your body repairs and builds tissue. Without it, progress stalls.",
            color: "bg-red-50 text-red-600"
        },
        {
            title: "Mental Fortitude",
            icon: <Brain className="w-5 h-5" />,
            content: "Fitness is a marathon, not a sprint. Maintain consistency over intensity. Celebrate small victories to build long-term habits.",
            color: "bg-purple-50 text-purple-600"
        }
    ];

    return (
        <div className="min-h-screen bg-white pb-20">
            <SEO 
                title="Ultimate Weight Management Guide | Gymkaana"
                description="Expert advice on nutrition, training, and recovery. Learn how to manage your weight effectively with Gymkaana's comprehensive fitness guide."
            />

            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-900" />
                    </button>
                    <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
                        Health Protocol Alpha
                    </h1>
                    <div className="w-10 h-10 invisible" />
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                        <Sparkles className="w-3 h-3" />
                        Expert Guide
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase text-slate-900 tracking-tighter mb-8 max-w-2xl leading-none">
                        Mastering Your <br />
                        <span className="text-primary italic underline decoration-slate-900/10 underline-offset-8">Physical Identity</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                    {sections.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 border border-slate-100 rounded-[32px] hover:shadow-2xl transition-all group"
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${section.color}`}>
                                {section.icon}
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 mb-4">
                                {section.title}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900 rounded-[48px] p-12 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full" />
                    <TrendingUp className="w-12 h-12 text-primary mx-auto mb-8" />
                    <h3 className="text-white text-3xl font-black italic uppercase mb-6 tracking-tight">
                        Progress is Linear <br />
                        <span className="text-primary">If You Start Today</span>
                    </h3>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-10 max-w-md mx-auto">
                        Don't overthink the data. Use the BMI calculator as a compass, not a verdict. Ready to take action?
                    </p>
                    <button 
                        onClick={onBack}
                        className="px-10 py-5 bg-primary text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                    >
                        Return to Calculator
                    </button>
                </motion.section>
            </main>
        </div>
    );
}
