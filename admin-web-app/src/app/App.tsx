import { useState, useEffect } from 'react';
import { Home, Building2, Users, DollarSign, LogOut, Settings as SettingsIcon, Megaphone, Loader2 } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { PartnerApprovals } from './components/PartnerApprovals';
import { UserManagement } from './components/UserManagement';
import { RefundManagement } from './components/RefundManagement';
import { Promotions } from './components/Promotions';
import { Settings } from './components/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AdminLogin } from './components/AdminLogin';
import { setToken, checkSession, logout } from './lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentTab, setCurrentTab] = useState('dashboard');

  // On mount: restore session from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = localStorage.getItem('gymkaana_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          // Restore any existing token from the last login
          if (parsed.accessToken) {
            setToken(parsed.accessToken);
          }
          // Try to silently refresh the session
          const refreshed = await checkSession();
          if (refreshed && refreshed.accessToken) {
            setToken(refreshed.accessToken);
            localStorage.setItem('gymkaana_user', JSON.stringify(refreshed));
            setIsAuthenticated(true);
          } else if (parsed.accessToken) {
            // Use the existing token as fallback
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('gymkaana_user');
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (e) {
        console.error('Session restore failed:', e);
        localStorage.removeItem('gymkaana_user');
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    initAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setToken(null);
    localStorage.removeItem('gymkaana_user');
    setIsAuthenticated(false);
  };

  // While checking session show a loading state
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 bg-black rounded-[28px] flex items-center justify-center shadow-2xl">
          <span className="text-[#A3E635] font-black italic text-2xl">G</span>
        </div>
        <Loader2 className="w-8 h-8 text-black animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Authorizing Session...</p>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'partners': return <PartnerApprovals />;
      case 'users': return <UserManagement />;
      case 'refunds': return <RefundManagement />;
      case 'promotions': return <Promotions />;
      case 'settings': return <Settings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-black text-white flex flex-col shrink-0 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Gymkaana <span className="block text-[10px] not-italic font-black tracking-[0.3em] text-[#A3E635] mt-2 uppercase">Command Center</span>
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <NavItem icon={Home} label="Dashboard" active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} />
            <NavItem icon={Building2} label="Gym Approvals" active={currentTab === 'partners'} onClick={() => setCurrentTab('partners')} />
            <NavItem icon={Users} label="User Management" active={currentTab === 'users'} onClick={() => setCurrentTab('users')} />
            <NavItem icon={DollarSign} label="Refunds & Finance" active={currentTab === 'refunds'} onClick={() => setCurrentTab('refunds')} />
            <NavItem icon={Megaphone} label="Promotions" active={currentTab === 'promotions'} onClick={() => setCurrentTab('promotions')} />
            <NavItem icon={SettingsIcon} label="Settings" active={currentTab === 'settings'} onClick={() => setCurrentTab('settings')} />
          </nav>

          <div className="p-4 border-t border-gray-800 space-y-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-3 rounded-xl font-bold text-sm hover:bg-white/5"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative bg-gray-100">
           <ErrorBoundary key={currentTab}>
             {renderContent()}
           </ErrorBoundary>
        </main>
      </div>
    </ErrorBoundary>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${active
        ? 'bg-[#A3E635] text-black shadow-2xl shadow-[#A3E635]/20 scale-[1.02]'
        : 'text-white/40 hover:bg-white/10 hover:text-white'
        }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-[#A3E635]/60'}`} />
      {label}
    </button>
  )
}
