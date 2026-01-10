import { useState } from 'react';
import { Home, Building2, Users, DollarSign, LogOut, Settings as SettingsIcon, Megaphone } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { PartnerManagement } from './components/PartnerManagement';
import { UserManagement } from './components/UserManagement';
import { RefundManagement } from './components/RefundManagement';
import { Promotions } from './components/Promotions';
import { Settings } from './components/Settings';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard': return <AdminDashboard />;
      case 'partners': return <PartnerManagement />;
      case 'users': return <UserManagement />;
      case 'refunds': return <RefundManagement />;
      case 'promotions': return <Promotions />;
      case 'settings': return <Settings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex flex-col shrink-0">
        <div className="p-8">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Gymkaana <span className="block text-[10px] not-italic font-black tracking-[0.3em] text-[#A3E635] mt-2 uppercase">Command Center</span></h1>
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
          <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-3 rounded-xl font-bold text-sm">
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
