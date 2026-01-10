import { useState } from 'react';
import { ArrowLeft, IndianRupee, Clock, FileText } from 'lucide-react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface AddPlanProps {
    onBack: () => void;
}

export function AddPlan({ onBack }: AddPlanProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            setLoading(false);
            onBack();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-3xl mx-auto flex items-center">
                    <button onClick={onBack} className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors" title="Go back">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Create Plan</h1>
                        <p className="text-sm text-gray-500">Add a new membership plan</p>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    {/* Gym Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Gym</label>
                        <select
                            className="w-full h-11 px-3 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                            aria-label="Select Gym"
                        >
                            <option value="">Select a gym...</option>
                            <option value="1">FitZone Gym - New York</option>
                            <option value="2">Muscle Beach - Los Angeles</option>
                            <option value="3">Iron Paradise - Miami</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Name</label>
                        <Input
                            type="text"
                            required
                            className="h-11 border-gray-300"
                            placeholder="e.g. Gold Membership"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="number"
                                    required
                                    className="pl-9 h-11 border-gray-300"
                                    placeholder="2500"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1.5">Duration</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select id="duration" className="w-full pl-9 pr-4 h-11 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm">
                                    <option>Daily</option>
                                    <option>Weekly (5 days)</option>
                                    <option>Weekend (Sat-Sun)</option>
                                    <option>1 Month</option>
                                    <option>3 Months</option>
                                    <option>6 Months</option>
                                    <option>1 Year</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Textarea
                                rows={4}
                                className="pl-9 border-gray-300 min-h-[100px]"
                                placeholder="Includes access to all equipment..."
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all"
                            disabled={loading}
                        >
                            {loading ? 'Creating Plan...' : 'Create Plan'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}
