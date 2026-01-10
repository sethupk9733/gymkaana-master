import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, CalendarCheck, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'gyms', label: 'Gyms', icon: Building2, path: '/gyms' },
        { id: 'bookings', label: 'Bookings', icon: CalendarCheck, path: '/bookings' },
        { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="flex-1 overflow-y-auto pb-20"> {/* pb-20 to ensure content isn't hidden behind nav */}
                <Outlet />
            </div>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-2 flex justify-around items-center z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
                {tabs.map((tab) => {
                    // Simple active check. Enhance if nested routes need it.
                    const isActive = location.pathname === tab.path ||
                        (tab.path !== '/dashboard' && location.pathname.startsWith(tab.path));

                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.path)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full space-y-1 transition-colors duration-200",
                                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <tab.icon className={cn("w-6 h-6", isActive && "fill-current opacity-20")} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
