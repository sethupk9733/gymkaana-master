import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe,
  Lock,
} from "lucide-react";

type OwnerLandingProps = {
  onNavigateToLogin: (mode: "login" | "signup") => void;
};

export function OwnerLanding({ onNavigateToLogin }: OwnerLandingProps) {
  const [liveStats, setLiveStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://api.gymkaana.com/api";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const res = await fetch(`${API_URL}/dashboard/public-stats`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          setLiveStats({ ...data, isConnected: true });
        }
      } catch (err) {
        console.error("Failed to fetch owner stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: Users,
      title: "Attract More Members",
      description:
        "Get discovered by thousands of fitness enthusiasts actively searching for your services on Gymkaana.",
    },
    {
      icon: BarChart3,
      title: "Smart Pricing Control",
      description:
        "Create custom plans, hourly passes, and seasonal offers. Full control over your pricing strategy.",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Bookings",
      description:
        "Instant booking notifications, live occupancy tracking, and member management in one dashboard.",
    },
    {
      icon: Lock,
      title: "Secure & Reliable",
      description:
        "Bank-grade security, automated payouts, and transparent reporting for your business growth.",
    },
  ];

  const statsCards = [
    {
      label: "Gym Partners",
      value: liveStats?.totalGyms || "500+",
      icon: Globe,
    },
    {
      label: "Active Bookings",
      value: liveStats?.activeBookings || "12.4K+",
      icon: CheckCircle2,
    },
    {
      label: "Platform Rating",
      value: liveStats?.platformRating || "4.9",
      suffix: "/5",
      icon: Star,
    },
    {
      label: "Monthly Growth",
      value: liveStats?.monthlyGrowth || "+42%",
      icon: TrendingUp,
    },
  ];

  const steps = [
    {
      num: 1,
      title: "Register Your Gym",
      description:
        "Complete your profile with gym details, photos, and location information.",
    },
    {
      num: 2,
      title: "Set Your Plans",
      description:
        "Create membership packages, hourly rates, class passes, and seasonal offers.",
    },
    {
      num: 3,
      title: "Start Growing",
      description:
        "Go live on Gymkaana and start receiving bookings from your local fitness community.",
    },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-[#2EDD3B] selection:text-black overflow-x-hidden">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-[100] backdrop-blur-xl bg-white/80 border-b border-slate-200/40"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl md:text-3xl font-[1000] tracking-[-0.08em] uppercase flex items-center -skew-x-12">
            <span className="text-slate-900">GYM</span>
            <span className="italic ml-0.5" style={{ color: "#2EDD3B" }}>
              KAA
            </span>
            <span className="text-slate-900">NA</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-[10px] font-black text-slate-600 hover:text-[#2EDD3B] transition-colors uppercase tracking-widest"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-[10px] font-black text-slate-600 hover:text-[#2EDD3B] transition-colors uppercase tracking-widest"
            >
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigateToLogin("login")}
              className="text-[10px] font-black text-slate-600 hover:text-[#2EDD3B] transition-colors uppercase tracking-widest hidden sm:block"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigateToLogin("signup")}
              className="px-6 py-3 rounded-full bg-[#2EDD3B] text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#2EDD3B]/20 hover:opacity-90 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </motion.header>

      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2EDD3B]/5 rounded-full blur-[200px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/2 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2EDD3B]/10 text-[#2EDD3B] text-[10px] font-black mb-6 animate-pulse uppercase tracking-widest">
                <Zap size={14} /> For Gym Owners
              </div>
              <h1 className="text-5xl lg:text-7xl font-[1000] tracking-tighter text-slate-900 leading-[1] mb-6">
                Fill Your Gym.{" "}
                <span className="text-[#2EDD3B] italic">Maximize Revenue.</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Connect with thousands of fitness enthusiasts. Manage bookings in real-time, list your gym for free, and grow your business with a transparent 5% commission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigateToLogin("signup")}
                  className="h-16 px-10 rounded-2xl text-lg font-black bg-[#2EDD3B] hover:bg-[#2EDD3B]/90 shadow-xl shadow-[#2EDD3B]/25 transition-all uppercase tracking-wider text-black flex items-center justify-center gap-2"
                >
                  Get Started <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigateToLogin("login")}
                  className="h-16 px-10 rounded-2xl text-lg font-black border-2 border-slate-300 hover:bg-slate-50 transition-all uppercase tracking-wider text-slate-900"
                >
                  Sign In
                </motion.button>
              </div>
              <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-[#2EDD3B]" size={20} />
                  <span className="font-bold text-sm">Free listing on Gymkaana</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-[#2EDD3B]" size={20} />
                  <span className="font-bold text-sm">5% fixed commission, no hidden charges</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <div className="relative">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1200"
                    alt="Gym Owner Dashboard"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 z-20 max-w-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#2EDD3B] flex items-center justify-center">
                      <TrendingUp className="text-black" size={24} />
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        Avg Revenue Increase
                      </p>
                      <p className="text-2xl font-[1000] text-slate-900">
                        {loading ? "Loading..." : `${liveStats?.avgRevenueIncrease || "32"}%`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 border-y border-slate-200/40">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-3xl bg-white p-6 border border-slate-200/40 shadow-sm hover:-translate-y-1 transition-transform"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#2EDD3B]/10 flex items-center justify-center mb-4">
                    <Icon className="text-[#2EDD3B]" size={24} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-[1000] text-slate-900">
                    {stat.value}
                    {stat.suffix && <span className="text-xl">{stat.suffix}</span>}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-[#2EDD3B]/10 text-[#2EDD3B] text-[10px] font-black uppercase tracking-widest mb-6">
            Why Choose Gymkaana
          </span>
          <h2 className="text-4xl lg:text-5xl font-[1000] text-slate-900 mb-4">
            Everything you need to grow your gym
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            From member acquisition to revenue management, Gymkaana handles the operations while you focus on fitness.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-3xl bg-white p-8 border border-slate-200/40 shadow-sm hover:-translate-y-2 transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#2EDD3B]/10 flex items-center justify-center mb-6">
                  <Icon className="text-[#2EDD3B]" size={28} />
                </div>
                <h3 className="text-xl font-[1000] text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-7">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-[#2EDD3B]/10 text-[#2EDD3B] text-[10px] font-black uppercase tracking-widest mb-6">
              Simple & Fast
            </span>
            <h2 className="text-4xl lg:text-5xl font-[1000] text-slate-900 mb-4">
              Launch in 3 simple steps
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From signup to first booking in under an hour.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-[calc(100%+1rem)] w-[calc((100%-3rem)/3-1rem)] h-1 bg-gradient-to-r from-[#2EDD3B] to-[#2EDD3B]/30"></div>
                )}
                <div className="rounded-3xl bg-white p-8 border border-slate-200/40 shadow-sm h-full relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#2EDD3B] text-white flex items-center justify-center font-[1000] text-2xl mb-6">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-[1000] text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-sm leading-7">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-slate-200/40">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start">
            <div className="space-y-6">
              <span className="inline-flex rounded-full bg-[#2EDD3B]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#2EDD3B]">
                What you need to join
              </span>
              <h2 className="text-4xl font-[1000] text-slate-900">
                Ready to onboard? Here’s what you need.
              </h2>
              <p className="text-lg text-slate-600 max-w-xl leading-8">
                Gymkaana makes it easy for gym owners to list and manage their facility. Provide the essentials below and start receiving bookings fast.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200/50 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-[#2EDD3B] font-black mb-3">Requirement</p>
                <p className="text-slate-700 font-semibold">Bank account in owner or business name</p>
              </div>
              <div className="rounded-3xl border border-slate-200/50 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-[#2EDD3B] font-black mb-3">Requirement</p>
                <p className="text-slate-700 font-semibold">PAN card or GST registration</p>
              </div>
              <div className="rounded-3xl border border-slate-200/50 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-[#2EDD3B] font-black mb-3">Requirement</p>
                <p className="text-slate-700 font-semibold">Gym address, plan details, and pricing</p>
              </div>
              <div className="rounded-3xl border border-slate-200/50 bg-slate-50 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.35em] text-[#2EDD3B] font-black mb-3">Requirement</p>
                <p className="text-slate-700 font-semibold">Contact details for business and customer support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-16 text-center"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2EDD3B]/10 rounded-full blur-[200px]" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-[1000] text-white mb-6">
              Stop losing revenue to slow bookings
            </h2>
            <p className="text-xl text-slate-200 mb-10">
              Join 500+ gym owners growing their business with Gymkaana. Get instant bookings, real-time management, transparent payouts, and a fixed 5% commission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigateToLogin("signup")}
                className="px-10 py-4 rounded-2xl bg-[#2EDD3B] text-black font-black uppercase tracking-widest text-sm shadow-xl shadow-[#2EDD3B]/30 hover:opacity-90 transition-all"
              >
                Join for free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigateToLogin("login")}
                className="px-10 py-4 rounded-2xl border-2 border-white text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
              >
                Sign In
              </motion.button>
            </div>
            <p className="text-slate-300 text-sm mt-8">
              ✓ Free listing • ✓ 5% fixed commission • ✓ No hidden charges
            </p>
          </div>
        </motion.div>
      </section>

      <footer className="bg-black text-white pt-20 pb-10 px-6 lg:px-12 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Brand & Mission */}
            <div className="space-y-6">
              <h2 className="text-3xl font-[1000] tracking-[-0.08em] uppercase flex items-center -skew-x-12">
                <span className="text-white">GYM</span>
                <span className="text-[#2EDD3B] italic mx-0.5">KAA</span>
                <span className="text-white">NA</span>
              </h2>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs">
                ELEVATING THE FITNESS ECOSYSTEM. UNIVERSAL ACCESS TO THE FINEST VENUES, POWERED BY INTELLIGENT TECHNOLOGY.
              </p>
            </div>

            {/* Backlinks */}
            <div className="lg:self-start lg:text-left">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2EDD3B] mb-6">
                Quick Links
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=contact"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    Privacy & Security
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=help"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    Help & Support
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=faq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=refund"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=partner"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    Partner with Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://app.gymkaana.com/?screen=careers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors block py-1"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-gray-400 text-xs">
            <p>© {new Date().getFullYear()} Gymkaana. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
