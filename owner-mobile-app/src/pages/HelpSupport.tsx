import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { submitTicket } from '../lib/api';

export default function HelpSupport() {
    const navigate = useNavigate();
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [ticketData, setTicketData] = useState({ subject: '', description: '' });
    const [submittingTicket, setSubmittingTicket] = useState(false);

    const FAQS = [
        { id: 1, q: "How do I add a new gym?", a: "Go to the Gyms tab and click on the 'Add Gym' button in the top right corner. Fill in the details and submit." },
        { id: 2, q: "When do I get my payouts?", a: "Payouts are processed weekly every Wednesday for the previous week's earnings." },
        { id: 3, q: "How does the QR check-in work?", a: "Customers will show their QR code. You can scan it using the 'Check-in' feature on your dashboard or manually enter their ID." },
    ];

    const handleSubmitTicket = async () => {
        if (!ticketData.subject.trim() || !ticketData.description.trim()) {
            alert('Please fill in both subject and description');
            return;
        }

        setSubmittingTicket(true);
        try {
            await submitTicket(ticketData);
            alert('Ticket submitted successfully! Our team will review it soon.');
            setTicketData({ subject: '', description: '' });
            setShowTicketForm(false);
        } catch (err) {
            alert('Failed to submit ticket: ' + (err as Error).message);
        } finally {
            setSubmittingTicket(false);
        }
    };

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

                {!showTicketForm ? (
                    <>
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

                        {/* Raise a Ticket Button */}
                        <button
                            onClick={() => setShowTicketForm(true)}
                            className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Raise a Ticket
                        </button>
                    </>
                ) : (
                    <>
                        {/* Ticket Form */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <button 
                                    onClick={() => setShowTicketForm(false)}
                                    className="p-1 rounded-full hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                                </button>
                                <h3 className="text-xl font-bold text-gray-900">Raise a Ticket</h3>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="What's the issue?"
                                        value={ticketData.subject}
                                        onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe your problem in detail..."
                                        value={ticketData.description}
                                        onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/100 resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleSubmitTicket}
                                    disabled={submittingTicket}
                                    className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                                >
                                    {submittingTicket ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : 'Submit Ticket'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
