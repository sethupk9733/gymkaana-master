import { useState, ReactNode } from 'react';
import { Building2, User, Menu, X } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setCurrentScreen: (screen: string) => void;
}

export function Layout({ children, activeTab, setActiveTab, setCurrentScreen }: LayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'gyms', label: 'Gyms' },
        { id: 'bookings', label: 'Bookings' },
        { id: 'reviews', label: 'Reviews' },
        { id: 'profile', label: 'Profile' }
    ];

    const handleNav = (id: string) => {
        setActiveTab(id);
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-black selection:text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('dashboard')}>
                        <h1 className="text-2xl md:text-3xl font-[1000] tracking-[-0.08em] uppercase flex items-center -skew-x-12">
                            <span className="text-slate-900">GYM</span>
                            <span className="italic ml-0.5" style={{ color: '#A3E635' }}>KAA</span>
                            <span className="text-slate-900">NA</span>
                        </h1>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-1">Owner</span>
                    </div>
                    {/* Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                className={`text-sm font-medium uppercase tracking-widest transition-colors ${activeTab === item.id ? 'text-primary' : 'text-gray-500 hover:text-gray-800'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                    {/* Mobile menu toggle */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-black transition-colors" title="Toggle menu">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                    <nav className="fixed top-16 left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                className={`text-lg font-black italic uppercase tracking-tighter text-left ${activeTab === item.id ? 'text-primary' : 'text-gray-500'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            )}

            {/* Main content area */}
            <main className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
