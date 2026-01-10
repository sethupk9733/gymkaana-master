import { useState, lazy, Suspense } from "react";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { AnimatePresence } from "motion/react";
import { User } from "lucide-react";

// Lazy loaded components
const SplashScreen = lazy(() => import("./components/SplashScreen").then(m => ({ default: m.SplashScreen })));
const LoginSignupScreen = lazy(() => import("./components/LoginSignupScreen").then(m => ({ default: m.LoginSignupScreen })));
const HomeScreen = lazy(() => import("./components/HomeScreen").then(m => ({ default: m.HomeScreen })));
const GymListingScreen = lazy(() => import("./components/GymListingScreen").then(m => ({ default: m.GymListingScreen })));
const GymDetailsScreen = lazy(() => import("./components/GymDetailsScreen").then(m => ({ default: m.GymDetailsScreen })));
const MembershipPlansScreen = lazy(() => import("./components/MembershipPlansScreen").then(m => ({ default: m.MembershipPlansScreen })));
const CheckoutScreen = lazy(() => import("./components/CheckoutScreen").then(m => ({ default: m.CheckoutScreen })));
const PaymentScreen = lazy(() => import("./components/PaymentScreen").then(m => ({ default: m.PaymentScreen })));
const SuccessScreen = lazy(() => import("./components/SuccessScreen").then(m => ({ default: m.SuccessScreen })));
const DashboardScreen = lazy(() => import("./components/DashboardScreen").then(m => ({ default: m.DashboardScreen })));
const ProfileScreen = lazy(() => import("./components/ProfileScreen").then(m => ({ default: m.ProfileScreen })));
const BookingHistoryScreen = lazy(() => import("./components/BookingHistoryScreen").then(m => ({ default: m.BookingHistoryScreen })));

type Screen =
  | "splash"
  | "login"
  | "home"
  | "listing"
  | "details"
  | "membership_plans"
  | "checkout"
  | "payment"
  | "success"
  | "dashboard"
  | "profile"
  | "bookings";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [selectedPlan, setSelectedPlan] = useState("Monthly");
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<Screen | null>(null);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    if (pendingScreen) {
      setCurrentScreen(pendingScreen);
      setPendingScreen(null);
    } else {
      setCurrentScreen("home");
    }
  };

  const handleProtectedAction = (targetScreen: Screen) => {
    if (isAuthenticated) {
      setCurrentScreen(targetScreen);
    } else {
      setPendingScreen(targetScreen);
      setCurrentScreen("login");
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "splash":
        // Go straight to home instead of login
        return <SplashScreen onComplete={() => setCurrentScreen("home")} />;

      case "login":
        return (
          <LoginSignupScreen
            onLogin={handleLoginSuccess}
            onBack={() => setCurrentScreen(pendingScreen && pendingScreen !== 'login' ? "home" : "home")}
          />
        );

      case "home":
        return (
          <HomeScreen
            onGymClick={(gymId) => {
              setSelectedGymId(gymId.toString());
              setCurrentScreen("details");
            }}
            onProfile={() => handleProtectedAction("profile")}
          />
        );

      case "listing":
        return (
          <GymListingScreen
            onBack={() => setCurrentScreen("home")}
            onGymClick={(gymId) => {
              setSelectedGymId(gymId.toString());
              setCurrentScreen("details");
            }}
          />
        );

      case "details":
        return (
          <GymDetailsScreen
            gymId={selectedGymId}
            onBack={() => setCurrentScreen("home")}
            onBookNow={() => handleProtectedAction("membership_plans")}
          />
        );

      case "membership_plans":
        return (
          <MembershipPlansScreen
            gymId={selectedGymId}
            onBack={() => setCurrentScreen("details")}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setCurrentScreen("checkout");
            }}
          />
        );

      case "checkout":
        return (
          <CheckoutScreen
            onBack={() => setCurrentScreen("membership_plans")}
            onProceedToPayment={() => setCurrentScreen("payment")}
            selectedPlan={selectedPlan}
          />
        );

      case "payment":
        return (
          <PaymentScreen
            onBack={() => setCurrentScreen("checkout")}
            onPaymentSuccess={() => setCurrentScreen("success")}
          />
        );

      case "success":
        return (
          <SuccessScreen
            onGoHome={() => setCurrentScreen("home")}
            onViewDashboard={() => handleProtectedAction("dashboard")}
          />
        );

      case "dashboard":
        return (
          <DashboardScreen
            onBack={() => setCurrentScreen("home")}
            onHome={() => setCurrentScreen("home")}
          />
        );

      case "profile":
        return (
          <ProfileScreen
            onBack={() => setCurrentScreen("home")}
            onLogout={() => {
              setIsAuthenticated(false);
              setCurrentScreen("login"); // Or home? user usually expects to be kicked out or go to home. Login is safer to re-login.
            }}
            onViewBookings={() => setCurrentScreen("bookings")}
          />
        );

      case "bookings":
        return (
          <BookingHistoryScreen
            onBack={() => setCurrentScreen("profile")}
          />
        );

      default:
        // Default to home if something weird happens, but initial is splash
        return <SplashScreen onComplete={() => setCurrentScreen("home")} />;
    }
  };

  // Main content render without mobile wrapper
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
      {/* Top Navigation Bar */}
      {currentScreen !== 'splash' && currentScreen !== 'login' && (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-[50] flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-12">
            <div
              onClick={() => setCurrentScreen('home')}
              className="cursor-pointer group"
            >
              <h1 className="text-2xl font-black tracking-tighter italic uppercase group-hover:scale-105 transition-transform">Gymkaana</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setCurrentScreen('home')}
                className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${currentScreen === 'home' ? 'text-primary' : 'text-gray-500'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentScreen('listing')}
                className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${currentScreen === 'listing' ? 'text-primary' : 'text-gray-500'}`}
              >
                Explore
              </button>
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className={`text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors ${currentScreen === 'dashboard' ? 'text-primary' : 'text-gray-500'}`}
              >
                Dashboard
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => setCurrentScreen('profile')}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                title="View Profile"
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setPendingScreen('profile');
                  setCurrentScreen('login');
                }}
                className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`${currentScreen !== 'splash' && currentScreen !== 'login' ? 'pt-20' : ''} min-h-screen w-full`}>
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </Suspense>
      </main>
    </div>
  );
}
