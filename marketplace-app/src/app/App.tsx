import { useState, useEffect, lazy, Suspense } from "react";
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
const TermsScreen = lazy(() => import("./components/TermsScreen").then(m => ({ default: m.TermsScreen })));

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
  | "bookings"
  | "terms";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [latestBooking, setLatestBooking] = useState<any>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingScreen, setPendingScreen] = useState<Screen | null>(null);

  const loadProfile = async () => {
    try {
      const { fetchProfile, checkSession } = await import("./lib/api");
      const user = await checkSession();
      if (user) {
        const profile = await fetchProfile();
        setUserProfile(profile);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) return <LoadingSpinner />;

  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    await loadProfile();

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
        // Go straight to login screen instead of home
        return <SplashScreen onComplete={() => setCurrentScreen("login")} />;

      case "login":
        return (
          <LoginSignupScreen
            onLogin={handleLoginSuccess}
            onBack={() => setCurrentScreen(pendingScreen && pendingScreen !== 'login' ? "home" : "home")}
            onTerms={() => setCurrentScreen("terms")}
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
            onExplore={() => setCurrentScreen("listing")}
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
            onProceedToPayment={(date) => {
              setSelectedStartDate(date);
              setCurrentScreen("payment");
            }}
            selectedPlan={selectedPlan}
          />
        );

      case "payment":
        return (
          <PaymentScreen
            gymId={selectedGymId}
            plan={selectedPlan}
            startDate={selectedStartDate}
            onBack={() => setCurrentScreen("checkout")}
            onPaymentSuccess={(booking) => {
              setLatestBooking(booking);
              setCurrentScreen("success");
            }}
          />
        );

      case "success":
        return (
          <SuccessScreen
            onGoHome={() => setCurrentScreen("home")}
            onViewDashboard={() => handleProtectedAction("dashboard")}
            userPhoto={userProfile?.profileImage}
            booking={latestBooking}
          />
        );

      case "dashboard":
        return (
          <DashboardScreen
            onBack={() => setCurrentScreen("home")}
            onHome={() => setCurrentScreen("home")}
            profile={userProfile}
          />
        );

      case "profile":
        return (
          <ProfileScreen
            onBack={() => setCurrentScreen("home")}
            onLogout={() => {
              setIsAuthenticated(false);
              setUserProfile(null);
              localStorage.removeItem('gymkaana_token');
              localStorage.removeItem('gymkaana_user');
              setCurrentScreen("login");
            }}
            onViewBookings={() => setCurrentScreen("bookings")}
            userPhoto={userProfile?.profileImage}
            onPhotoCapture={loadProfile}
            onTerms={() => setCurrentScreen("terms")}
          />
        );

      case "bookings":
        return (
          <BookingHistoryScreen
            onBack={() => setCurrentScreen("profile")}
          />
        );

      case "terms":
        return (
          <TermsScreen
            onBack={() => setCurrentScreen("home")}
          />
        );

      default:
        // Default to login if splash
        return <SplashScreen onComplete={() => setCurrentScreen("login")} />;
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
