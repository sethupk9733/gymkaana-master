import { useState, useEffect } from 'react';
import { Home, Building2, Users, DollarSign, LogOut, Settings as SettingsIcon, Megaphone, Calendar, MessageCircle, Star } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { PartnerManagement } from './components/PartnerManagement';
import { UserManagement } from './components/UserManagement';
import { RefundManagement } from './components/RefundManagement';
import { Promotions } from './components/Promotions';
import { Settings } from './components/Settings';
import { BookingManagement } from './components/BookingManagement';
import { SupportTickets } from './components/SupportTickets';
import { AdminLogin } from './components/AdminLogin';
import { ReviewManagement } from './components/ReviewManagement';
import { logout, getUnreadTicketCount } from './lib/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('gymkaana_token');
    const userStr = localStorage.getItem('gymkaana_user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      const isAdmin = user.roles?.includes('admin') || user.role === 'admin';
      if (isAdmin) {
        setIsAuthenticated(true);
        fetchUnreadCount();
      }
    }
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await getUnreadTicketCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'partners': return <PartnerManagement />;
      case 'users': return <UserManagement />;
      case 'bookings': return <BookingManagement />;
      case 'refunds': return <RefundManagement />;
      case 'promotions': return <Promotions />;
      case 'support': return <SupportTickets />;
      case 'reviews': return <ReviewManagement />;
      case 'settings': return <Settings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col shrink-0">
        <div className="p-8">
          <h1 className="text-2xl font-[1000] tracking-[-0.08em] uppercase flex items-center -skew-x-12">
            <span className="text-white">GYM</span>
            <span className="text-[#A3E635] italic ml-0.5">KAA</span>
            <span className="text-white">NA</span>
          </h1>
          <span className="block text-[10px] not-italic font-black tracking-[0.3em] text-[#A3E635] uppercase mt-2">Command Center</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={Home} label="Dashboard" active={currentTab === 'dashboard'} onClick={() => setCurrentTab('dashboard')} />
          <NavItem icon={Building2} label="Gym Approvals" active={currentTab === 'partners'} onClick={() => setCurrentTab('partners')} />
          <NavItem icon={Users} label="User Management" active={currentTab === 'users'} onClick={() => setCurrentTab('users')} />
          <NavItem icon={Calendar} label="Bookings Matrix" active={currentTab === 'bookings'} onClick={() => setCurrentTab('bookings')} />
          <NavItem icon={DollarSign} label="Refunds & Finance" active={currentTab === 'refunds'} onClick={() => setCurrentTab('refunds')} />
          <NavItem icon={Megaphone} label="Promotions" active={currentTab === 'promotions'} onClick={() => setCurrentTab('promotions')} />
          <NavItem
            icon={MessageCircle}
            label="Support Tickets"
            active={currentTab === 'support'}
            onClick={() => setCurrentTab('support')}
            badge={unreadCount > 0 ? unreadCount : undefined}
          />
          <NavItem
            icon={Star}
            label="User Reviews"
            active={currentTab === 'reviews'}
            onClick={() => setCurrentTab('reviews')}
          />
          <NavItem icon={SettingsIcon} label="Settings" active={currentTab === 'settings'} onClick={() => setCurrentTab('settings')} />
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button onClick={handleLogout} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-3 rounded-xl font-bold text-sm">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${active
        ? 'bg-[#A3E635] text-black shadow-2xl shadow-[#A3E635]/20 scale-[1.02]'
        : 'text-white/40 hover:bg-white/10 hover:text-white'
        }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-black' : 'text-[#A3E635]/60'}`} />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
}
