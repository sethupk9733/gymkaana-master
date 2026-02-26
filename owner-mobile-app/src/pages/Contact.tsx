import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center mb-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">
                {/* Email Support */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-gray-900">Email Support</h3>
                    </div>
                    <a
                        href="mailto:support@gymkaana.com"
                        className="text-primary hover:underline font-medium text-sm block"
                    >
                        support@gymkaana.com
                    </a>
                    <p className="text-xs text-gray-500">We typically respond within 24 hours</p>
                </div>

                {/* Phone Support */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-bold text-gray-900">Phone Support</h3>
                    </div>
                    <a
                        href="tel:+918000900900"
                        className="text-green-600 hover:underline font-medium text-sm block"
                    >
                        +91 8000 900 900
                    </a>
                    <p className="text-xs text-gray-500">Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                </div>

                {/* Office Address */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="font-bold text-gray-900">Office Address</h3>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium">Gymkaana Support Center</p>
                        <p className="text-gray-600">Mumbai, India</p>
                    </div>
                </div>

                {/* Hours */}
                <div className="bg-primary/10 border border-blue-200 rounded-xl p-4 text-sm text-center text-gray-700">
                    <p className="font-medium mb-2">Support Hours</p>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                    <p className="text-gray-600 mt-2">Email support available 24/7</p>
                </div>
            </div>
        </div>
    );
}
