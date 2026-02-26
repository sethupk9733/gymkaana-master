import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShoppingBag, UserPlus, Star, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const ALL_ACTIVITIES = [
    { id: 1, type: 'join', text: 'New member Rahul Sharma joined Gold Plan', time: '2 mins ago', gym: 'Main Branch' },
    { id: 2, type: 'payment', text: 'Payment received ₹2,500 from Priya Singh', time: '15 mins ago', gym: 'Downtown Gym' },
    { id: 3, type: 'review', text: 'New 5-star review received from Amit Kumar', time: '1 hour ago', gym: 'Main Branch' },
    { id: 4, type: 'alert', text: 'Equipment maintenance due: Treadmills', time: '3 hours ago', gym: 'CrossFit Zone' },
    { id: 5, type: 'join', text: 'New member Sneha Gupta joined Silver Plan', time: '5 hours ago', gym: 'HSR Layout' },
    { id: 6, type: 'payment', text: 'Payment received ₹1,500 from Vikram M', time: 'Yesterday', gym: 'Downtown Gym' },
    { id: 7, type: 'join', text: 'New member Arjun Reddy joined Platinum Plan', time: 'Yesterday', gym: 'Main Branch' },
    { id: 8, type: 'alert', text: 'New gym application "Power House" pending review', time: '2 days ago', gym: 'System' },
];

export default function ActivityHistory() {
    const navigate = useNavigate();

    const getIcon = (type: string) => {
        switch (type) {
            case 'join': return <UserPlus className="w-5 h-5 text-primary" />;
            case 'payment': return <ShoppingBag className="w-5 h-5 text-green-600" />;
            case 'review': return <Star className="w-5 h-5 text-yellow-500 fill-current" />;
            case 'alert': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <Clock className="w-5 h-5 text-gray-600" />;
        }
    };

    const getBg = (type: string) => {
        switch (type) {
            case 'join': return 'bg-primary/10';
            case 'payment': return 'bg-green-50';
            case 'review': return 'bg-yellow-50';
            case 'alert': return 'bg-red-50';
            default: return 'bg-gray-50';
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center mb-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="mr-3 p-1 rounded-full hover:bg-gray-100" aria-label="Go back" title="Go back">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Activity History</h1>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {ALL_ACTIVITIES.map((item) => (
                        <div key={item.id} className="p-4 flex gap-4 hover:bg-gray-50 transition-colors">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", getBg(item.type))}>
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-medium text-gray-900 leading-tight pr-2">
                                        {item.text}
                                    </p>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap uppercase font-bold tracking-wider">
                                        {item.time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-primary font-semibold">{item.gym}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-[10px] text-gray-400 capitalize">{item.type}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
                    Load More History
                </button>
            </div>
        </div>
    );
}
