import { ArrowLeft, ShieldCheck, FileText, CheckCircle2, Gavel, Scale, IndianRupee, ShieldAlert } from "lucide-react";
import { Button } from "./ui/button";

interface PartnerTermsProps {
    onBack: () => void;
    onAccept: () => void;
}

export function PartnerTerms({ onBack, onAccept }: PartnerTermsProps) {
    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center px-6 lg:px-12">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-black transition-all group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-xs">Back to Onboarding</span>
                </button>
            </header>

            <main className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
                <div className="space-y-16">
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-[24px] bg-black flex items-center justify-center text-white shadow-2xl shadow-black/20">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter -skew-x-12">Partner Agreement</h1>
                                <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mt-1">Platform Protocol v1.2</p>
                            </div>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed text-lg italic">
                            "Transparency is the foundation of every championship partnership."
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 text-black">
                                <IndianRupee className="w-5 h-5 text-emerald-500" />
                                <h2 className="text-sm font-black uppercase tracking-widest">Financial Framework</h2>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed italic">
                                            Gymkaana operates on a commission-based model for marketplace users. We only win when you win.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed italic">
                                            Introductory Rate: 5% service fee for the first 180 days post-onboarding.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-700 leading-relaxed italic">
                                            Post-Introductory Phase: Future rates are subject to mutual discussion based on venue performance and user volume.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 text-black">
                                <Scale className="w-5 h-5 text-blue-500" />
                                <h2 className="text-sm font-black uppercase tracking-widest">Legal Guardrails</h2>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs font-medium text-gray-500 leading-relaxed">
                                    Partners agree to indemnify Gymkaana against any liabilities arising from facility use. You must maintain valid fire safety and structural fitness certifications.
                                </p>
                                <p className="text-xs font-medium text-gray-500 leading-relaxed">
                                    Platform access can be revoked in case of consistent booking refusal or false facility reporting.
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-3 text-black">
                                <FileText className="w-5 h-5 text-purple-500" />
                                <h2 className="text-sm font-black uppercase tracking-widest">How Gymkaana Works</h2>
                            </div>
                            <div className="space-y-4 text-sm text-gray-600 font-medium leading-relaxed">
                                <p>Gymkaana is an intelligent fitness marketplace that connects elite venues with a global network of fitness enthusiasts. Our platform provides you with a digital storefront, an automated booking engine, and real-time economics tracking.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2" />
                                        <span><span className="font-black text-black uppercase text-[10px]">Exposure:</span> Your venue appears in search results for thousands of nearby users based on distance, discipline, and facilities.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2" />
                                        <span><span className="font-black text-black uppercase text-[10px]">Booking:</span> Users purchase Day Passes or Memberships directly through the Gymkaana app. All payments are collected securely by our platform at the time of booking.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-black shrink-0 mt-2" />
                                        <span><span className="font-black text-black uppercase text-[10px]">Settlement:</span> Once a user check-in is verified, the funds (minus commission) are added to your partner wallet for our weekly settlement cycle.</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-3 text-black">
                                <ShieldCheck className="w-5 h-5 text-amber-500" />
                                <h2 className="text-sm font-black uppercase tracking-widest">Client Verification Protocol (QR)</h2>
                            </div>
                            <div className="bg-black text-white p-6 rounded-3xl space-y-6 shadow-xl">
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Step-by-Step Verification</p>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black italic shrink-0">1</span>
                                        <div>
                                            <p className="font-black uppercase text-xs tracking-tight">User Arrives</p>
                                            <p className="text-[11px] text-gray-400 font-medium mt-1">The user opens their Gymkaana App and navigates to the "Active Pass" section to display their unique QR code.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black italic shrink-0">2</span>
                                        <div>
                                            <p className="font-black uppercase text-xs tracking-tight">Open Owner App</p>
                                            <p className="text-[11px] text-gray-400 font-medium mt-1">You or your front-desk staff must open the "Gymkaana Owner App" on your mobile device and tap the QR Scanner icon in the navigation bar.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black italic shrink-0">3</span>
                                        <div>
                                            <p className="font-black uppercase text-xs tracking-tight">Scan & Verify</p>
                                            <p className="text-[11px] text-gray-400 font-medium mt-1">Point your camera at the user's phone. Our system instantly verifies the pass validity, user identity, and session balance.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black italic shrink-0">4</span>
                                        <div>
                                            <p className="font-black uppercase text-xs tracking-tight">Grant Access</p>
                                            <p className="text-[11px] text-gray-400 font-medium mt-1">Once you see the "Check-in Successful" confirmation on your screen, you may allow the user to proceed with their session. This scan is the ONLY proof of service needed for payout.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section className="space-y-4 border-l-4 border-black pl-8">
                            <h2 className="text-xl font-black uppercase italic tracking-tight">01. Service Fulfillment Protocol</h2>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                Partners must honor every verified Gymkaana booking during listed operational hours. The check-in must be validated through the Gymkaana Owner App using the QR technology detailed above. Manual entries or outside proofs are not accepted for financial settlement. Failure to perform a successful scan results in an unverified session and non-payment.
                            </p>
                        </section>

                        <section className="space-y-4 border-l-4 border-black pl-8">
                            <h2 className="text-xl font-black uppercase italic tracking-tight">02. Data Integrity & Pricing</h2>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                Venue pricing on Gymkaana must be "Market Fair." Artificial inflation of base prices for the purpose of manipulating platform discounts is grounds for immediate de-listing. Partners must update the platform within 12 hours of any changes to facility availability or operating hours.
                            </p>
                        </section>

                        <section className="space-y-4 border-l-4 border-black pl-8">
                            <h2 className="text-xl font-black uppercase italic tracking-tight">03. Financial Settlement & Taxation</h2>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                All payments collected via Gymkaana are held in a secure escrow before settlement. Payouts are triggered on a weekly cycle for all verified check-ins. GST and other applicable taxes are the responsibility of the venue partner, unless otherwise specified in local laws for digital platforms.
                            </p>
                        </section>

                        <section className="space-y-4 border-l-4 border-black pl-8">
                            <h2 className="text-xl font-black uppercase italic tracking-tight">04. Dispute Resolution</h2>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                Any disputes regarding check-in validity or payment amounts must be raised with Partner Support within 14 business days of the transaction date. Our team will review system logs and provides a final, binding decision.
                            </p>
                        </section>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center gap-6 p-8 bg-gray-50 rounded-[32px] border border-gray-100 border-dashed">
                    <div className="flex items-center gap-3 text-amber-600">
                        <ShieldAlert className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authoritative Acceptance Required</span>
                    </div>
                    <Button
                        onClick={onAccept}
                        className="w-full h-16 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Accept Terms & Proceed
                    </Button>
                    <p className="text-[10px] text-gray-400 font-medium max-w-xs text-center">
                        By clicking "Accept", you electronically sign this agreement and confirm your venue protocol alignment.
                    </p>
                </div>
            </main>
        </div>
    );
}

