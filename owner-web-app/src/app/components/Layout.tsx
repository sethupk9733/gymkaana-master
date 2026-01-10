import { ReactNode } from 'react';
import { Building2, User, Menu } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    setCurrentScreen: (screen: string) => void;
}

export function Layout({ children, activeTab, setActiveTab, setCurrentScreen }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-black selection:text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Building2 className="text-primary w-6 h-6" />
                        <h1 className="text-xl font-black italic uppercase tracking-tighter">Gymkaana Owner</h1>
                    </div>
                    {/* Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => { setActiveTab('dashboard'); setCurrentScreen('main'); }}
                            className={`text-sm font-medium uppercase tracking-widest transition-colors ${activeTab === 'dashboard' ? 'text-primary' : 'text-gray-500 hover:text-gray-800'}`}
                            title="Dashboard"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => { setActiveTab('gyms'); setCurrentScreen('main'); }}
                            className={`text-sm font-medium uppercase tracking-widest transition-colors ${activeTab === 'gyms' ? 'text-primary' : 'text-gray-500 hover:text-gray-800'}`}
                            title="Gyms"
                        >
                            Gyms
                        </button>
                        <button
                            onClick={() => { setActiveTab('bookings'); setCurrentScreen('main'); }}
                            className={`text-sm font-medium uppercase tracking-widest transition-colors ${activeTab === 'bookings' ? 'text-primary' : 'text-gray-500 hover:text-gray-800'}`}
                            title="Bookings"
                        >
                            Bookings
                        </button>
                        <button
                            onClick={() => { setActiveTab('profile'); setCurrentScreen('main'); }}
                            className={`text-sm font-medium uppercase tracking-widest transition-colors ${activeTab === 'profile' ? 'text-primary' : 'text-gray-500 hover:text-gray-800'}`}
                            title="Profile"
                        >
                            Profile
                        </button>
                    </nav>
                    {/* Mobile menu toggle (optional) */}
                    <button className="md:hidden p-2" title="Open menu">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            {/* Main content area */}
            <main className="pt-20 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
