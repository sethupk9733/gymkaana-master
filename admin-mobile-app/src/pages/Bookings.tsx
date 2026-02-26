import { Calendar, MapPin, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

import { MOCK_GYMS } from '../lib/api';

const MOCK_BOOKINGS = [
    { id: 1, user: 'Rahul Sharma', gym: 'Main Branch', location: 'Koramangala', date: 'Dec 05, 2023', time: '07:00 AM', status: 'Upcoming', plan: 'Gold Membership' },
    { id: 2, user: 'Priya Singh', gym: 'Downtown Gym', location: 'Indiranagar', date: 'Oct 23, 2023', time: '06:30 PM', status: 'Completed', plan: 'Silver Membership' },
    { id: 3, user: 'Amit Kumar', gym: 'Main Branch', location: 'Koramangala', date: 'Dec 06, 2023', time: '08:00 AM', status: 'Upcoming', plan: 'Gold Membership' },
    { id: 4, user: 'Sneha Gupta', gym: 'CrossFit Zone', location: 'HSR Layout', date: 'Oct 20, 2023', time: '05:00 PM', status: 'Completed', plan: 'Platinum Membership' },
    { id: 5, user: 'Vikram Malhotra', gym: 'Downtown Gym', location: 'Indiranagar', date: 'Oct 19, 2023', time: '07:00 AM', status: 'Completed', plan: 'Silver Membership' },
    { id: 6, user: 'Arjun Reddy', gym: 'Main Branch', location: 'Koramangala', date: 'Oct 25, 2023', time: '09:00 AM', status: 'Active', plan: 'Gold Membership' },
    { id: 7, user: 'Kavya Madhavan', gym: 'Downtown Gym', location: 'Indiranagar', date: 'Oct 24, 2023', time: '05:30 PM', status: 'Active', plan: 'Silver Membership' },
    { id: 8, user: 'Siddharth J', gym: 'CrossFit Zone', location: 'HSR Layout', date: 'Oct 22, 2023', time: '06:00 AM', status: 'Cancelled', plan: 'Trial Session' },
];

export default function Bookings() {
    const [filter, setFilter] = useState('All');
    const [selectedGym, setSelectedGym] = useState('All Gyms');

    const filteredBookings = MOCK_BOOKINGS.filter(b => {
        const matchesStatus = filter === 'All' || b.status === filter;
        const matchesGym = selectedGym === 'All Gyms' || b.gym === selectedGym;
        return matchesStatus && matchesGym;
    });

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-gray-900">Bookings</h1>
                    <select
                        value={selectedGym}
                        onChange={(e) => setSelectedGym(e.target.value)}
                        className="text-sm font-medium text-primary bg-primary/10 border-none rounded-lg px-2 py-1 outline-none"
                        title="Select Gym"
                    >
                        <option value="All Gyms">All Gyms</option>
                        {MOCK_GYMS.map(gym => (
                            <option key={gym.id} value={gym.name}>{gym.name}</option>
                        ))}
                    </select>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search member..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/100 outline-none"
                        />
                    </div>
                    <button className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200" title="Filter bookings">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                    {['All', 'Upcoming', 'Active', 'Completed', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                                filter === status
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings List */}
            <div className="p-4 space-y-3">
                {filteredBookings.map((booking) => (
                    <div key={booking.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                                    {booking.user.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{booking.user}</h3>
                                    <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">{booking.plan}</span>
                                </div>
                            </div>
                            <span className={cn(
                                "text-xs font-semibold px-2 py-1 rounded-full",
                                booking.status === 'Active' && "bg-green-100 text-green-700",
                                booking.status === 'Completed' && "bg-gray-100 text-gray-700",
                                booking.status === 'Cancelled' && "bg-red-100 text-red-700",
                                booking.status === 'Upcoming' && "bg-primary/20 text-secondary"
                            )}>
                                {booking.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="truncate">{booking.gym}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{booking.date}</span>
                            </div>
                            {/* Additional details could go here */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
