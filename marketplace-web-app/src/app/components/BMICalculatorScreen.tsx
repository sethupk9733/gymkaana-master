import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Calculator, Info, Activity, ArrowRight, ShieldCheck, 
    ChevronDown, Scale, Ruler, History, RefreshCw, Users 
} from 'lucide-react';
import { SEO } from './SEO';

export function BMICalculatorScreen({ 
    onGoHome, 
    onReadGuide 
}: { 
    onGoHome: () => void;
    onReadGuide: () => void;
}) {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [result, setResult] = useState<{ bmi: number, category: string, color: string } | null>(null);
    const [history, setHistory] = useState<{ date: string, bmi: number, age: string, gender: string }[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('gymkaana_bmi_history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const calculateBMI = () => {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100;
        if (w > 0 && h > 0) {
            const bmi = parseFloat((w / (h * h)).toFixed(1));
            let category = '';
            let color = '';

            if (bmi < 18.5) {
                category = 'Underweight';
                color = 'text-blue-400';
            } else if (bmi < 25) {
                category = 'Normal';
                color = 'text-primary'; // Electric Lime
            } else if (bmi < 30) {
                category = 'Overweight';
                color = 'text-yellow-500';
            } else {
                category = 'Obese';
                color = 'text-red-500';
            }

            const newResult = { bmi, category, color };
            setResult(newResult);

            // Update History
            const newHistory = [{ 
                date: new Date().toLocaleDateString(), 
                bmi,
                age,
                gender
            }, ...history].slice(0, 5);
            setHistory(newHistory);
            localStorage.setItem('gymkaana_bmi_history', JSON.stringify(newHistory));
        }
    };

    const getIdealWeightRange = () => {
        const h = parseFloat(height) / 100;
        if (!h) return null;
        const low = (18.5 * h * h).toFixed(1);
        const high = (24.9 * h * h).toFixed(1);
        return `${low}kg - ${high}kg`;
    };

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Gymkaana BMI Calculator",
        "description": "Calculate your Body Mass Index (BMI) instantly with Gymkaana's free fitness tool.",
        "applicationCategory": "HealthApplication",
        "about": {
            "@type": "Thing",
            "name": "Body Mass Index"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is a healthy BMI?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A healthy BMI for adults is generally considered to be between 18.5 and 24.9."
                }
            },
            {
                "@type": "Question",
                "name": "How is BMI calculated?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "BMI is calculated by dividing your weight in kilograms by your height in meters squared (kg/m²)."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title="Free BMI Calculator | Check Your Body Mass Index | Gymkaana"
                description="Use Gymkaana's free BMI calculator to check your body mass index instantly. Find out if you are underweight, normal, overweight or obese."
            />
            
            {/* Inject Schemas */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(faqSchema)}
            </script>

            {/* Header */}
            <div className="bg-slate-900 py-12 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                        <Activity className="w-3 h-3" />
                        Fitness Intelligence
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase text-white tracking-tighter mb-4">
                        BMI Calculator
                    </h1>
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest leading-relaxed max-w-2xl mx-auto">
                        Track your body mass index and understand your fitness profile in seconds.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-10 mb-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calculator Form */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-white border border-slate-100 rounded-[40px] shadow-2xl p-8 md:p-12"
                >
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Scale className="w-4 h-4 text-primary" />
                                Weight (kg)
                            </label>
                            <input 
                                type="number" 
                                placeholder="e.g. 70"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl p-6 text-2xl font-black italic focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-primary" />
                                Height (cm)
                            </label>
                            <input 
                                type="number" 
                                placeholder="e.g. 175"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl p-6 text-2xl font-black italic focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary" />
                                Age (years)
                            </label>
                            <input 
                                type="number" 
                                placeholder="e.g. 25"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xl font-black italic focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                Gender
                            </label>
                            <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl">
                                {(['male', 'female'] as const).map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setGender(g)}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${gender === g ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={calculateBMI}
                        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                        Calculate BMI
                        <ArrowRight className="w-5 h-5 text-primary" />
                    </button>

                    {result && (
                        <AnimatePresence mode="wait">
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-12 p-8 bg-slate-50 rounded-[32px] border border-slate-100"
                            >
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="text-center md:text-left">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your Personal BMI</div>
                                        <div className={`text-7xl font-black italic tracking-tighter ${result.color}`}>
                                            {result.bmi}
                                        </div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Classification</div>
                                        <div className={`text-3xl font-black uppercase italic tracking-tight ${result.color}`}>
                                            {result.category}
                                        </div>
                                        {height && (
                                            <div className="mt-4 inline-block px-4 py-2 bg-white rounded-xl border border-slate-100">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ideal Weight: </span>
                                                <span className="text-[11px] font-bold text-slate-900">{getIdealWeightRange()}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* SEO CONTENT SECTION */}
                    <article className="mt-16 prose prose-slate max-w-none">
                        <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-900 mb-6">What is BMI?</h2>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            Body Mass Index (BMI) is a simple numerical value of your weight in relation to your height. 
                            It is used as a screening tool to identify whether an adult is at a healthy weight for their height. 
                            Our <strong>Gymkaana BMI Calculator</strong> provides instant results to help you kickstart your fitness journey.
                        </p>

                        <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-900 mb-6">BMI Categories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">&lt; 18.5</div>
                                <div className="text-[11px] font-black uppercase tracking-tight text-blue-900">Underweight</div>
                            </div>
                            <div className="p-4 bg-[#A3E635]/10 rounded-2xl border border-[#A3E635]/20">
                                <div className="text-[10px] font-black text-[#A3E635] uppercase tracking-widest text-green-600">18.5 - 24.9</div>
                                <div className="text-[11px] font-black uppercase tracking-tight text-slate-900">Normal</div>
                            </div>
                            <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                                <div className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">25 - 29.9</div>
                                <div className="text-[11px] font-black uppercase tracking-tight text-yellow-900">Overweight</div>
                            </div>
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest">30+</div>
                                <div className="text-[11px] font-black uppercase tracking-tight text-red-900">Obese</div>
                            </div>
                        </div>

                        <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-900 mb-6">Why BMI Matters for Fitness</h2>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            Understanding your BMI is the first step in setting realistic fitness goals. 
                            Whether you're aiming to build muscle, lose body fat, or maintain overall wellness, 
                            tracking your Body Mass Index provides a baseline. 
                            Combining your BMI results with a consistent workout routine at professional gyms 
                            can dramatically improve your long-term health outcomes.
                        </p>

                        <div className="p-8 bg-slate-900 rounded-[32px] text-center">
                            <h3 className="text-white text-2xl font-black italic uppercase mb-4 tracking-tight">Find Gyms Near You</h3>
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-8">
                                Transform your results at professional fitness centers.
                            </p>
                            <button 
                                onClick={onGoHome}
                                className="px-8 py-4 bg-primary text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg"
                            >
                                Explore Gymkaana Partners
                            </button>
                        </div>
                    </article>
                </motion.div>

                {/* Sidebar / History */}
                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-xl"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <History className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Previous Results</h3>
                        </div>
                        
                        {history.length > 0 ? (
                            <div className="space-y-4">
                                {history.map((item, i) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase">{item.date}</span>
                                            <span className="font-black italic text-slate-900">{item.bmi} BMI</span>
                                        </div>
                                        <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                                            {item.age}Y • {item.gender}
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => {
                                        setHistory([]);
                                        localStorage.removeItem('gymkaana_bmi_history');
                                    }}
                                    className="w-full text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-red-400 transition-colors mt-4"
                                >
                                    Clear History
                                </button>
                            </div>
                        ) : (
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider text-center py-8">
                                No history found.
                            </p>
                        )}
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-primary rounded-[32px] p-8 shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <h3 className="text-slate-900 text-xl font-black italic uppercase leading-tight mb-4">
                            The Science of Tracking
                        </h3>
                        <p className="text-slate-900/60 font-bold uppercase text-[9px] tracking-widest leading-relaxed mb-6">
                            BMI is a standard international measure, though not a measure of body fat percentage. Always consult a professional for a complete health profile.
                        </p>
                        <button 
                            onClick={onReadGuide}
                            className="flex items-center gap-2 text-slate-900 font-black uppercase text-[10px] tracking-widest group"
                        >
                            Read Weight Guide
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
