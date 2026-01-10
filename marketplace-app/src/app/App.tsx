import { useState, lazy, Suspense } from "react";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { AnimatePresence } from "motion/react";

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
            onBookNow={() => handleProtectedAction("membership_plans")} // Auth required here
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
              setCurrentScreen("login");
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
        // Default to home if splash
        return <SplashScreen onComplete={() => setCurrentScreen("home")} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full sm:max-w-md h-screen sm:h-[850px] bg-white sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] sm:rounded-[48px] overflow-hidden relative">
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
}
