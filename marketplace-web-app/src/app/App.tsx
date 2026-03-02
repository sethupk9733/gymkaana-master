import { useState, useEffect, lazy, Suspense } from "react";
import { LoadingSpinner } from "./components/ui/LoadingSpinner";
import { AnimatePresence } from "motion/react";
import { User as UserIcon } from "lucide-react";
import { fetchProfile, checkSession } from "./lib/api";

// Lazy loaded components
const SplashScreen = lazy(() => import("./components/SplashScreen").then(m => ({ default: m.SplashScreen })));
const LoginSignupScreen = lazy(() => import("./components/LoginSignupScreen").then(m => ({ default: m.LoginSignupScreen })));
const HomeScreen = lazy(() => import("./components/HomeScreen").then(m => ({ default: m.HomeScreen })));
const GymDetailsScreen = lazy(() => import("./components/GymDetailsScreen").then(m => ({ default: m.GymDetailsScreen })));
const MembershipPlansScreen = lazy(() => import("./components/MembershipPlansScreen").then(m => ({ default: m.MembershipPlansScreen })));
const CheckoutScreen = lazy(() => import("./components/CheckoutScreen").then(m => ({ default: m.CheckoutScreen })));
const PaymentScreen = lazy(() => import("./components/PaymentScreen").then(m => ({ default: m.PaymentScreen })));
const SuccessScreen = lazy(() => import("./components/SuccessScreen").then(m => ({ default: m.SuccessScreen })));
const ProfileScreen = lazy(() => import("./components/ProfileScreen").then(m => ({ default: m.ProfileScreen })));
const BookingHistoryScreen = lazy(() => import("./components/BookingHistoryScreen").then(m => ({ default: m.BookingHistoryScreen })));
const Footer = lazy(() => import("./components/Footer").then(m => ({ default: m.Footer })));
const AboutUsScreen = lazy(() => import("./components/AboutUsScreen").then(m => ({ default: m.AboutUsScreen })));
const PrivacyScreen = lazy(() => import("./components/PrivacyScreen").then(m => ({ default: m.PrivacyScreen })));
const FAQScreen = lazy(() => import("./components/FAQScreen").then(m => ({ default: m.FAQScreen })));
const ContactUsScreen = lazy(() => import("./components/ContactUsScreen").then(m => ({ default: m.ContactUsScreen })));
const CareersScreen = lazy(() => import("./components/CareersScreen").then(m => ({ default: m.CareersScreen })));
const TermsScreen = lazy(() => import("./components/TermsScreen").then(m => ({ default: m.TermsScreen })));
const PartnerScreen = lazy(() => import("./components/PartnerScreen").then(m => ({ default: m.PartnerScreen })));

type Screen =
  | "splash"
  | "login"
  | "home"
  | "details"
  | "membership_plans"
  | "checkout"
  | "payment"
  | "success"
  | "profile"
  | "bookings"
  | "about"
  | "privacy"
  | "faq"
  | "contact"
  | "careers"
  | "terms"
  | "partner";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    // Check for deep links immediately during state initialization
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen') as Screen;
    const actionParam = params.get('action');

    if (actionParam === 'login') return 'login';
    if (screenParam && ['home', 'partner', 'about', 'privacy', 'faq', 'contact', 'careers', 'terms'].includes(screenParam)) {
      return screenParam;
    }
    return "splash";
  });
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [recentBooking, setRecentBooking] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingScreen, setPendingScreen] = useState<Screen | null>(null);
  const [initialDiscipline, setInitialDiscipline] = useState<string | null>(null);
  const [profileInitialView, setProfileInitialView] = useState<any>('main');

  const [initialSearch, setInitialSearch] = useState<string | null>(null);

  useEffect(() => {
    // Handle action parameters (like login)
    const params = new URLSearchParams(window.location.search);
    const actionParam = params.get('action');
    if (actionParam === 'login') {
      setCurrentScreen('login');
    }
  }, []);

  const loadProfile = async () => {
    try {
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

  useEffect(() => {
    // Global scroll-to-top reset on screen navigation
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentScreen]);

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
        return <SplashScreen onComplete={() => setCurrentScreen("home")} />;

      case "login":
        return (
          <LoginSignupScreen
            onLogin={handleLoginSuccess}
            onBack={() => setCurrentScreen("home")}
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
            initialDiscipline={initialDiscipline}
            onClearInitialDiscipline={() => setInitialDiscipline(null)}
            initialSearch={initialSearch}
            onClearInitialSearch={() => setInitialSearch(null)}
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
              setRecentBooking(booking);
              setCurrentScreen("success");
            }}
          />
        );

      case "success":
        return (
          <SuccessScreen
            booking={recentBooking}
            onGoHome={() => setCurrentScreen("home")}
          />
        );

      case "profile":
        return (
          <ProfileScreen
            profile={userProfile}
            initialView={profileInitialView}
            onBack={() => {
              setCurrentScreen("home");
              setProfileInitialView('main');
            }}
            onLogout={() => {
              setIsAuthenticated(false);
              setUserProfile(null);
              localStorage.removeItem('gymkaana_token');
              localStorage.removeItem('gymkaana_user');
              setCurrentScreen("login");
              setProfileInitialView('main');
            }}
            onViewBookings={() => setCurrentScreen("bookings")}
            onProfileUpdate={loadProfile}
          />
        );

      case "bookings":
        return (
          <BookingHistoryScreen
            onBack={() => setCurrentScreen("profile")}
          />
        );

      case "about":
        return (
          <AboutUsScreen
            onGoHome={() => setCurrentScreen("home")}
          />
        );

      case "privacy":
        return (
          <PrivacyScreen
            onBack={() => setCurrentScreen("home")}
          />
        );

      case "faq":
        return (
          <FAQScreen
            onBack={() => setCurrentScreen("home")}
            onContactSupport={() => {
              setProfileInitialView('help');
              handleProtectedAction("profile");
            }}
          />
        );

      case "contact":
        return (
          <ContactUsScreen
            onBack={() => setCurrentScreen("home")}
            onLiveChat={() => {
              setProfileInitialView('help');
              handleProtectedAction("profile");
            }}
          />
        );

      case "careers":
        return (
          <CareersScreen
            onBack={() => setCurrentScreen("home")}
          />
        );

      case "terms":
        return (
          <TermsScreen
            onBack={() => setCurrentScreen("home")}
          />
        );

      case "partner":
        return (
          <PartnerScreen
            onBack={() => setCurrentScreen("home")}
          />
        );

      default:
        return <SplashScreen onComplete={() => setCurrentScreen("home")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Top Navigation Bar */}
      {currentScreen !== 'splash' && currentScreen !== 'login' && (
        <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-md border-b border-border z-[50] flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-12">
            <div
              onClick={() => setCurrentScreen('home')}
              className="cursor-pointer group"
            >
              <h1 className="text-3xl font-[1000] tracking-[-0.08em] uppercase flex items-center group-hover:scale-105 transition-all duration-300 -skew-x-12">
                <span className="text-secondary">GYM</span>
                <span className="text-primary italic ml-0.5">KAA</span>
                <span className="text-secondary">NA</span>
              </h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => setCurrentScreen('profile')}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all overflow-hidden"
                title="View Profile"
              >
                {userProfile?.profileImage ? (
                  <img src={userProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  setPendingScreen('profile');
                  setCurrentScreen('login');
                }}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-primary/20"
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
          {currentScreen !== 'splash' && currentScreen !== 'login' && (
            <Footer
              onDisciplineClick={(value) => {
                const cities = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];
                if (cities.includes(value)) {
                  setInitialSearch(value);
                  setInitialDiscipline(null);
                } else {
                  setInitialDiscipline(value);
                  setInitialSearch(null);
                }
                setCurrentScreen("home");
              }}
              onAboutClick={() => {
                setCurrentScreen("about");
              }}
              onPrivacyClick={() => {
                setCurrentScreen("privacy");
              }}
              onHelpClick={() => {
                setProfileInitialView('help');
                handleProtectedAction("profile");
              }}
              onFAQClick={() => {
                setCurrentScreen("faq");
              }}
              onContactClick={() => {
                setCurrentScreen("contact");
              }}
              onCareersClick={() => {
                setCurrentScreen("careers");
              }}
              onTermsClick={() => {
                setCurrentScreen("terms");
              }}
              onPartnerClick={() => {
                setCurrentScreen("partner");
              }}
            />
          )}
        </Suspense>
      </main>
    </div>
  );
}
