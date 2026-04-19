import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { OwnerLogin } from "./components/OwnerLogin";
import { Dashboard } from "./components/Dashboard";
import { GymsList } from "./components/GymsList";
import { GymDetails } from "./components/GymDetails";
import { EditGym } from "./components/EditGym";
import { AddGym } from "./components/AddGym";
import { AddPlan } from "./components/AddPlan";
import { EditPlan } from "./components/EditPlan";
import { MembershipPlans } from "./components/MembershipPlans";
import { BookingsList } from "./components/BookingsList";
import { BookingDetails } from "./components/BookingDetails";
import { QRCheckIn } from "./components/QRCheckIn";
import { PayoutsEarnings } from "./components/PayoutsEarnings";
import { Notifications } from "./components/Notifications";
import { Profile } from "./components/Profile";
import { Accounting } from "./components/Accounting";
import { SupportChat } from "./components/SupportChat";
import { ReviewsList } from "./components/ReviewsList";

type ActiveTab = "dashboard" | "gyms" | "bookings" | "reviews" | "profile";
type Screen = "main" | "gymDetails" | "editGym" | "addGym" | "membershipPlans" | "addPlan" | "editPlan" | "bookingDetails" | "qrCheckIn" | "payouts" | "notifications" | "accounting";

// Map URL hash → state
const getStateFromHash = (): { tab: ActiveTab; screen: Screen; gymId: string | null; planId: string | null; bookingId: number | null } => {
  const hash = window.location.hash.replace('#', '') || '';
  const [path, ...parts] = hash.split('/');
  const gymId = parts[0] || null;
  const planId = parts[1] || null;

  const tabMap: Record<string, ActiveTab> = { 'dashboard': 'dashboard', 'gyms': 'gyms', 'bookings': 'bookings', 'reviews': 'reviews', 'profile': 'profile' };
  const screenMap: Record<string, Screen> = {
    'gym-details': 'gymDetails', 'edit-gym': 'editGym', 'add-gym': 'addGym',
    'plans': 'membershipPlans', 'add-plan': 'addPlan', 'edit-plan': 'editPlan',
    'qr-checkin': 'qrCheckIn', 'payouts': 'payouts', 'notifications': 'notifications', 'accounting': 'accounting'
  };

  return {
    tab: tabMap[path] || 'dashboard',
    screen: screenMap[path] || 'main',
    gymId,
    planId,
    bookingId: null
  };
};

const updateUrl = (screen: Screen, tab: ActiveTab, gymId?: string | null, planId?: string | null) => {
  const screenToHash: Record<Screen, string> = {
    main: '',
    gymDetails: `gym-details/${gymId || ''}`,
    editGym: `edit-gym/${gymId || ''}`,
    addGym: 'add-gym',
    membershipPlans: `plans/${gymId || ''}`,
    addPlan: `add-plan/${gymId || ''}`,
    editPlan: `edit-plan/${gymId || ''}/${planId || ''}`,
    bookingDetails: 'bookings',
    qrCheckIn: 'qr-checkin',
    payouts: 'payouts',
    notifications: 'notifications',
    accounting: 'accounting'
  };
  const tabToHash: Record<ActiveTab, string> = {
    dashboard: 'dashboard', gyms: 'gyms', bookings: 'bookings', reviews: 'reviews', profile: 'profile'
  };

  const hash = screen !== 'main' ? screenToHash[screen] : tabToHash[tab];
  window.history.pushState(null, '', `#${hash}`);
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [currentScreen, setCurrentScreen] = useState<Screen>("main");
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  // Session restore
  useEffect(() => {
    const token = localStorage.getItem('gymkaana_token');
    const userStr = localStorage.getItem('gymkaana_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        const roles = user.roles || (user.role ? [user.role] : []);
        if (roles.includes('owner') || roles.includes('admin')) {
          setIsLoggedIn(true);
          // Restore state from URL hash
          const state = getStateFromHash();
          setActiveTab(state.tab);
          setCurrentScreen(state.screen);
          if (state.gymId) setSelectedGymId(state.gymId);
          if (state.planId) setSelectedPlanId(state.planId);
        } else {
          localStorage.removeItem('gymkaana_token');
          localStorage.removeItem('gymkaana_user');
        }
      } catch {
        localStorage.removeItem('gymkaana_token');
        localStorage.removeItem('gymkaana_user');
      }
    }
    setLoading(false);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePop = () => {
      const state = getStateFromHash();
      setActiveTab(state.tab);
      setCurrentScreen(state.screen);
      if (state.gymId) setSelectedGymId(state.gymId);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = (screen: Screen, tab: ActiveTab = activeTab, gymId?: string | null, planId?: string | null) => {
    setCurrentScreen(screen);
    if (screen === 'main') setActiveTab(tab);
    if (gymId !== undefined) setSelectedGymId(gymId);
    if (planId !== undefined) setSelectedPlanId(planId);
    updateUrl(screen, tab, gymId ?? selectedGymId, planId ?? selectedPlanId);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase text-[#A3E635] tracking-[0.3em]">Restoring Session...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <OwnerLogin onLogin={() => { setIsLoggedIn(true); navigate('main', 'dashboard'); }} />;
  }

  const renderScreen = () => {
    if (currentScreen === "gymDetails" && selectedGymId) {
      return (
        <GymDetails
          gymId={selectedGymId}
          onBack={() => navigate('main', 'gyms')}
          onEdit={() => navigate('editGym', activeTab, selectedGymId)}
          onManagePlans={() => navigate('membershipPlans', activeTab, selectedGymId)}
        />
      );
    }
    if (currentScreen === "editGym" && selectedGymId) {
      return <EditGym gymId={selectedGymId} onBack={() => navigate('gymDetails', activeTab, selectedGymId)} />;
    }
    if (currentScreen === "addGym") {
      return <AddGym onBack={() => navigate('main', 'gyms')} />;
    }
    if (currentScreen === "membershipPlans" && selectedGymId) {
      return (
        <MembershipPlans
          gymId={selectedGymId}
          onBack={() => navigate('gymDetails', activeTab, selectedGymId)}
          onAddPlan={() => navigate('addPlan', activeTab, selectedGymId)}
          onEditPlan={(planId: string) => navigate('editPlan', activeTab, selectedGymId, planId)}
        />
      );
    }
    if (currentScreen === "editPlan" && selectedPlanId) {
      return <EditPlan planId={selectedPlanId} onBack={() => navigate('membershipPlans', activeTab, selectedGymId)} />;
    }
    if (currentScreen === "addPlan") {
      return <AddPlan gymId={selectedGymId || undefined} onBack={() => navigate('membershipPlans', activeTab, selectedGymId)} />;
    }
    if (currentScreen === "bookingDetails" && selectedBookingId) {
      return <BookingDetails bookingId={selectedBookingId} onBack={() => navigate('main', 'bookings')} />;
    }
    if (currentScreen === "qrCheckIn") {
      return <QRCheckIn onBack={() => navigate('main', 'dashboard')} />;
    }
    if (currentScreen === "payouts") {
      return <PayoutsEarnings onBack={() => navigate('main', 'dashboard')} />;
    }
    if (currentScreen === "notifications") {
      return <Notifications onBack={() => navigate('main', 'dashboard')} />;
    }
    if (currentScreen === "accounting") {
      return <Accounting onBack={() => navigate('main', 'dashboard')} />;
    }

    const handleTabChange = (tab: string) => {
      setActiveTab(tab as ActiveTab);
      setCurrentScreen('main');
      updateUrl('main', tab as ActiveTab, null, null);
    };

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            onNavigateToNotifications={() => navigate('notifications')}
            onNavigateToPayouts={() => navigate('payouts')}
            onNavigateToQR={() => navigate('qrCheckIn')}
            onNavigateToAccounting={() => navigate('accounting')}
            onNavigateToBookings={() => navigate('main', 'bookings')}
            onAddGym={() => navigate('addGym')}
            onAddPlan={() => navigate('addPlan')}
            onManagePlans={(gymId: string) => { setSelectedGymId(gymId); navigate('membershipPlans', activeTab, gymId); }}
          />
        );
      case "gyms":
        return <GymsList onGymSelect={(gymId) => navigate('gymDetails', 'gyms', String(gymId))} onAddGym={() => navigate('addGym')} />;
      case "bookings":
        return <BookingsList onBookingSelect={(id) => { setSelectedBookingId(id); navigate('bookingDetails'); }} />;
      case "reviews":
        return <ReviewsList />;
      case "profile":
        return <Profile onLogout={() => {
          setIsLoggedIn(false);
          localStorage.removeItem('gymkaana_token');
          localStorage.removeItem('gymkaana_user');
          window.location.hash = '';
        }} />;
      default:
        return null;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={(tab) => navigate('main', tab as ActiveTab, null, null)}
      setCurrentScreen={(s) => navigate(s as Screen)}
    >
      {renderScreen()}
      <SupportChat minimized={true} />
    </Layout>
  );
}
