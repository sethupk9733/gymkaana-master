import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function HelpSupport() {
    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const FAQS = [
        { id: 1, q: "How do I add a new gym?", a: "Go to the Gyms tab and click on the 'Add Gym' button in the top right corner. Fill in the details and submit." },
        { id: 2, q: "When do I get my payouts?", a: "Payouts are processed weekly every Wednesday for the previous week's earnings." },
        { id: 3, q: "How does the QR check-in work?", a: "Customers will show their QR code. You can scan it using the 'Check-in' feature on your dashboard or manually enter their ID." },
    ];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center mb-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">

                {/* Contact Options */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors group">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                            <Phone className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Call Us</span>
                    </button>
                    <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 transition-colors group">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                            <Mail className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Email Us</span>
                    </button>
                </div>

                {/* FAQs */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
                    <div className="space-y-2">
                        {FAQS.map((faq) => (
                            <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                                    className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                >
                                    {faq.q}
                                    {activeFaq === faq.id ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {activeFaq === faq.id && (
                                    <div className="px-4 pb-4 text-sm text-gray-600 animate-in slide-in-from-top-2">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticket Form */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-gray-500" />
                        Raise a Ticket
                    </h3>
                    <form className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Subject</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="What's the issue?"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows={4}
                                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Describe your problem in detail..."
                            ></textarea>
                        </div>
                        <button className="w-full bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                            Submit Ticket
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
