import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, CalendarCheck, User } from 'lucide-react';
import { cn } from '../lib/utils';
import FloatingChat from './FloatingChat';

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
        <div className="flex flex-col h-[100dvh] bg-gray-50 overflow-hidden">
            <div className="flex-1 overflow-y-auto pb-6">
                <Outlet />
                <div className="px-6 py-10 text-center opacity-30 mt-10">
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} VUEGAM SOLUTIONS. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </div>

            <nav className="bg-white border-t border-gray-200 py-3 px-2 flex justify-around items-center shrink-0 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path ||
                        (tab.path !== '/dashboard' && location.pathname.startsWith(tab.path));

                    return (
                        <button
                            key={tab.id}
                            onClick={() => navigate(tab.path)}
                            className={cn(
                                "flex flex-col items-center justify-center w-full space-y-1 transition-all duration-200 active:scale-90 relative",
                                isActive ? "text-primary" : "text-gray-400"
                            )}
                        >
                            <div className="relative">
                                <tab.icon className={cn("w-6 h-6", isActive && "fill-current opacity-20")} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Floating Chat Component */}
            <FloatingChat />
        </div>
    );
}
