import { Shield, Bell, Lock, Globe, Database, Mail, Save, User as UserIcon, Building, CreditCard, Sliders, Smartphone, Code, Server, Zap, Search, ExternalLink, RefreshCcw, HardDrive, Key } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Settings() {
    const [activeSection, setActiveSection] = useState('general');

    const sections = [
        { id: 'general', label: 'Ecosystem', icon: Globe, sub: 'Core platform identity' },
        { id: 'finance', label: 'Treasury', icon: CreditCard, sub: 'Fees & Payout logic' },
        { id: 'security', label: 'Vault', icon: Shield, sub: 'Access & Auth protocols' },
        { id: 'infrastructure', label: 'Network', icon: Server, sub: 'API Sync & CDNs' },
        { id: 'notifications', label: 'Comms', icon: Bell, sub: 'Global alert routing' },
        { id: 'system', label: 'Telemetry', icon: Database, sub: 'System logs & health' },
    ];

    return (
        <div className="p-10 max-w-[1600px] mx-auto space-y-12 pb-32 font-sans">
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-black rounded-2xl shadow-xl shadow-black/10">
                            <Sliders className="w-6 h-6 text-primary" />
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Platform Command</h2>
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Centralized configuration for marketplace infrastructure</p>
                </div>

                <div className="flex gap-4">
                    <button className="px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all border border-gray-100 flex items-center gap-2">
                        <RefreshCcw className="w-4 h-4" /> Reset Defaults
                    </button>
                    <button className="px-10 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 flex items-center gap-3 active:scale-95">
                        <Save className="w-5 h-5 text-primary" /> Synchronize State
                    </button>
                </div>
            </header>

            <div className="flex flex-col xl:flex-row gap-16">
                {/* ADVANCED SIDEBAR NAVIGATION */}
                <div className="w-full xl:w-96 space-y-4 shrink-0">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            title={`Navigate to ${section.label}`}
                            className={`w-full flex items-center gap-5 px-8 py-6 rounded-[32px] transition-all text-left group relative ${activeSection === section.id
                                ? 'bg-black text-white shadow-2xl shadow-black/20 translate-x-2'
                                : 'bg-white border border-gray-50 text-gray-400 hover:border-gray-200 hover:text-gray-600'
                                }`}
                        >
                            <div className={`p-3 rounded-2xl transition-all ${activeSection === section.id ? 'bg-primary/20 text-primary' : 'bg-gray-50 text-gray-400 group-hover:text-black'}`}>
                                <section.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-xs uppercase tracking-[0.15em] mb-0.5">{section.label}</p>
                                <p className={`text-[9px] font-bold uppercase tracking-widest ${activeSection === section.id ? 'text-white/40' : 'text-gray-300'}`}>{section.sub}</p>
                            </div>
                            {activeSection === section.id && (
                                <ChevronRight className="w-5 h-5 text-primary" />
                            )}
                        </button>
                    ))}
                </div>

                {/* DETAILED CONTENT AREA */}
                <div className="flex-1 bg-white border border-gray-100 rounded-[64px] p-16 shadow-sm relative overflow-hidden min-h-[800px]">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64" />

                    <AnimatePresence mode="wait">
                        {activeSection === 'general' && (
                            <motion.div key="gen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <SectionHeader title="Ecosystem Configuration" sub="Manage the core identity & public-facing data of Gymkaana" icon={Globe} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <SettingField label="Platform Name" value="Gymkaana Enterprise" />
                                    <SettingField label="Primary Domain" value="https://gymkaana.com" />
                                    <SettingField label="Support Gateway" value="admin-ops@gymkaana.com" />
                                    <SettingField label="Transactional SMS ID" value="GYMKNA" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4">
                                    <SettingSelect label="Default Language" options={['English (US)', 'English (UK)', 'Hindi (IN)']} />
                                    <SettingSelect label="System Currency" options={['INR (₹)', 'USD ($)', 'AED (د.إ)']} />
                                    <SettingSelect label="Deployment State" options={['Production (Stable)', 'Maintenance Mode', 'Developer Beta']} />
                                </div>

                                <div className="space-y-4 pt-8">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-4">Institutional Presence</label>
                                    <textarea
                                        className="w-full p-10 bg-gray-50 border border-gray-100 rounded-[40px] text-sm font-bold text-gray-600 outline-none focus:ring-8 focus:ring-primary/5 min-h-[160px] leading-relaxed"
                                        title="Official Company Data"
                                        placeholder="Company registration data..."
                                        defaultValue="Gymkaana Networks Pvt Ltd. Level 4, Tech Pillar, Outer Ring Road, Bangalore, India - 560048. CIN: U72900KA2023PTC170012"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'finance' && (
                            <motion.div key="fin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <SectionHeader title="Treasury & Settlement Logic" sub="Define the economic parameters of the marketplace" icon={CreditCard} />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <YieldStat label="Base Commission" value="15%" sub="Per Transaction" />
                                    <YieldStat label="GST Protocol" value="18%" sub="Statutory Tax" />
                                    <YieldStat label="Payout Window" value="7 Days" sub="Settlement Cycle" />
                                    <YieldStat label="Platform Floor" value="₹5,000" sub="Min. Payout" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <SettingField label="Refund Window (Hours)" value="24" />
                                    <SettingField label="Partner Convenience Fee" value="₹20" />
                                    <SettingField label="Transactional GSTIN" value="29AAAAA0000A1Z5" />
                                    <SettingSelect label="Calculation Model" options={['Post-Tax Deduction', 'Pre-Tax Margin', 'Flat Rate']} />
                                </div>

                                <div className="p-12 bg-gray-900 rounded-[48px] text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all" />
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-black italic uppercase tracking-tighter mb-4 flex items-center gap-3">
                                            <ShieldAlert className="w-6 h-6 text-primary" /> Automated Clearing House (ACH)
                                        </h4>
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest leading-relaxed max-w-2xl">
                                            Partner settlements are triggered automatically by the Treasury Daemon every Monday at 00:00 UTC.
                                            Manual overrides require Level-3 Admin authorization.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'security' && (
                            <motion.div key="sec" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <SectionHeader title="Security & Auth Protocols" sub="System-wide access controls & encryption settings" icon={Shield} />

                                <div className="space-y-6">
                                    <VaultToggle label="Enterprise MFA (2FA)" desc="Force mobile authenticator requirement for all administrative accounts." active={true} />
                                    <VaultToggle label="IP Access Filtering" desc="Restrict platform backend access to corporate VPN ranges only." active={false} />
                                    <VaultToggle label="Session Persistence" desc="Automatically terminate idle admin sessions after 30 minutes of inactivity." active={true} />
                                    <VaultToggle label="Audit Logging" desc="Capture every interaction and database query performed by admin users." active={true} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8">
                                    <SettingField label="Password Expiry (Days)" value="90" />
                                    <SettingField label="Max Login Attempts" value="5" />
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'infrastructure' && (
                            <motion.div key="infra" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <SectionHeader title="Infrastructure & Cloud Sync" sub="Low-level API keys & development environment hooks" icon={Server} />

                                <div className="grid grid-cols-1 gap-8">
                                    <APIKeyCard label="Razorpay Gateway (Live)" keyID="rzp_live_2190sh8127391" lastSync="2 mins ago" />
                                    <APIKeyCard label="Mapbox SDK" keyID="pk.gh.ai.12981029831.Xz" lastSync="5 hours ago" />
                                    <APIKeyCard label="AWS S3 Bucket" keyID="gymkaana-prod-assets-01" lastSync="Active" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                                    <SettingSelect label="CDN Cache Policy" options={['Normal (4h)', 'Aggressive (24h)', 'Bypass (Dev)']} />
                                    <SettingField label="Webhook Endpoint" value="https://api.gymkaana.com/hooks/v1" />
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'notifications' && (
                            <motion.div key="notif" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <SectionHeader title="Global Communications" sub="Alert routing logic for admins and partners" icon={Bell} />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <NotificationCard label="Partner Onboarding" desc="Notify executive team when a new gym hub applies for verification." channels={['Email', 'Slack']} />
                                    <NotificationCard label="Revenue Spikes" desc="Trigger alert when daily GMV crosses ₹5,00,000 threshold." channels={['Push', 'SMS']} />
                                    <NotificationCard label="Critical Errors" desc="High-priority alerts for system failures or database connection drops." channels={['All Channels']} />
                                    <NotificationCard label="Payout Batch" desc="Confirmation once a payout batch has been successfully cleared." channels={['Email']} />
                                </div>
                            </motion.div>
                        )}

                        {activeSection === 'system' && (
                            <motion.div key="sys" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                                <div className="flex justify-between items-center bg-emerald-50 p-10 rounded-[48px] border border-emerald-100 mb-12">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-emerald-500 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-emerald-200">
                                            <Zap className="w-8 h-8 animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-emerald-900">System Functional</h3>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Telemetry Sync: 100% Core systems responsive</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">UPTIME (30D)</p>
                                        <p className="text-3xl font-black italic text-emerald-900">99.98%</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Low-Level System Event Logs</h4>
                                        <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-2">
                                            <HardDrive className="w-3 h-3" /> Clear Audit Logs
                                        </button>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-100 rounded-[40px] p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                                        <LogItem time="15:20:01" source="AUTH" msg="Admin #102 successfully accessed Vault Settings" type="info" />
                                        <LogItem time="14:45:10" source="DB" msg="Automated backup routine: Database state snapshot captured" type="success" />
                                        <LogItem time="12:10:33" source="API" msg="Rate limit warning: Surge in gym biometric sync requests from Hub #44" type="warning" />
                                        <LogItem time="09:00:00" source="TREASURY" msg="Payout batch #ACH-99 completed (₹14.28L distributed)" type="success" />
                                        <LogItem time="04:30:12" source="INFRA" msg="Cloudflare CDN cache invalidation triggered for /assets" type="info" />
                                        <LogItem time="01:15:00" source="AUTH" msg="Failed login attempt detected from unauthorized IP range" type="error" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, sub, icon: Icon }: any) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">{title}</h3>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">{sub}</p>
        </div>
    );
}

function SettingField({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">{label}</label>
            <input
                type="text"
                title={label}
                defaultValue={value}
                className="w-full p-6 bg-gray-50 border border-transparent rounded-[32px] text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-gray-100 focus:ring-8 focus:ring-black/5 transition-all shadow-sm"
            />
        </div>
    );
}

function SettingSelect({ label, options }: { label: string, options: string[] }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4">{label}</label>
            <div className="relative group">
                <select
                    title={label}
                    className="w-full p-6 bg-gray-50 border border-transparent rounded-[32px] text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-gray-100 transition-all appearance-none cursor-pointer shadow-sm"
                >
                    {options.map(opt => <option key={opt}>{opt}</option>)}
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none group-hover:text-black transition-colors rotate-90" />
            </div>
        </div>
    );
}

function VaultToggle({ label, desc, active }: any) {
    return (
        <div className="p-8 bg-gray-50 border border-transparent rounded-[40px] flex items-center justify-between hover:bg-white hover:border-gray-100 hover:shadow-xl transition-all group">
            <div className="space-y-1">
                <p className="font-black text-gray-900 uppercase italic tracking-tighter text-lg">{label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-sm leading-relaxed">{desc}</p>
            </div>
            <div className={`w-16 h-10 rounded-full p-1.5 transition-all cursor-pointer shadow-inner ${active ? 'bg-black' : 'bg-gray-200'}`}>
                <motion.div
                    animate={{ x: active ? 22 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-7 h-7 bg-white rounded-full shadow-lg"
                />
            </div>
        </div>
    );
}

function YieldStat({ label, value, sub }: any) {
    return (
        <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-xl transition-all">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black italic tracking-tighter text-gray-900 uppercase leading-none">{value}</p>
            <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-3 underline decoration-primary/30 underline-offset-4">{sub}</p>
        </div>
    );
}

function APIKeyCard({ label, keyID, lastSync }: any) {
    return (
        <div className="p-8 flex items-center justify-between bg-gray-50 border border-gray-100 rounded-[40px] group hover:bg-white hover:shadow-2xl transition-all">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white text-gray-400 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-black transition-all">
                    <Key className="w-6 h-6" />
                </div>
                <div>
                    <h5 className="font-black italic uppercase tracking-tighter text-gray-900 text-lg">{label}</h5>
                    <p className="text-[10px] font-mono text-gray-400 tracking-wider mt-1">{keyID.substring(0, 15)}••••••••••</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">State: {lastSync}</p>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:underline">
                    Edit Token <ExternalLink className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}

function NotificationCard({ label, desc, channels }: any) {
    return (
        <div className="p-10 bg-gray-50 border border-transparent rounded-[48px] hover:bg-white hover:border-gray-100 hover:shadow-2xl transition-all group">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                    <Bell className="w-5 h-5" />
                </div>
                <h5 className="font-black italic uppercase tracking-tighter text-gray-900 text-xl">{label}</h5>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase leading-relaxed mb-8">{desc}</p>
            <div className="flex gap-2">
                {channels.map((chan: string) => (
                    <span key={chan} className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-gray-100 group-hover:bg-black group-hover:text-white transition-all">
                        {chan}
                    </span>
                ))}
            </div>
        </div>
    );
}

function LogItem({ time, source, msg, type }: any) {
    const color = type === 'success' ? 'text-emerald-500' : type === 'warning' ? 'text-orange-500' : type === 'error' ? 'text-red-500' : 'text-blue-500';
    return (
        <div className="flex items-center gap-6 p-6 border-b border-gray-100 font-mono text-xs hover:bg-white transition-colors">
            <span className="text-gray-400 tracking-tighter">{time}</span>
            <span className={`${color} font-black w-24 shrink-0`}>[{source}]</span>
            <span className="text-gray-700 font-bold flex-1">{msg}</span>
        </div>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
    )
}

function ShieldAlert({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    )
}
