import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Moon, Shield, FileText } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function Settings() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center mb-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Settings</h1>
            </div>

            <div className="p-4 space-y-4 max-w-md mx-auto">
                {/* Preferences */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-100">Preferences</h3>
                    <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-900">Notifications</span>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={cn(
                                    "w-11 h-6 rounded-full transition-colors relative",
                                    notifications ? "bg-primary" : "bg-gray-300"
                                )}
                                title={notifications ? "Disable Notifications" : "Enable Notifications"}
                            >
                                <div className={cn(
                                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                                    notifications ? "left-5.5" : "left-0.5"
                                )}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Moon className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-900">Dark Mode</span>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={cn(
                                    "w-11 h-6 rounded-full transition-colors relative",
                                    darkMode ? "bg-primary" : "bg-gray-300"
                                )}
                                title={darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
                            >
                                <div className={cn(
                                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                                    darkMode ? "left-5.5" : "left-0.5"
                                )}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legal */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <h3 className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-700 border-b border-gray-100">Legal</h3>
                    <div>
                        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left">
                            <Shield className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Privacy Policy</span>
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900">Terms of Service</span>
                        </button>
                    </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-8">App Version 1.0.2</p>
            </div>
        </div>
    );
}
