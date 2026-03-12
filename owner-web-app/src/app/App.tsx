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
import { checkSession } from "./lib/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentScreen, setCurrentScreen] = useState("main");
  const [selectedGymId, setSelectedGymId] = useState<number | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setIsLoggedIn(true);
        } else {
          // Fallback check to localStorage if cookie-based refresh fails
          const savedUser = localStorage.getItem('gymkaana_owner_user');
          if (savedUser) setIsLoggedIn(true);
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest italic">Authenticating...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <OwnerLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleGymSelect = (gymId: number) => {
    setSelectedGymId(gymId);
    setCurrentScreen("gymDetails");
  };

  const handleBookingSelect = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setCurrentScreen("bookingDetails");
  };

  const renderScreen = () => {
    if (currentScreen === "gymDetails" && selectedGymId !== null) {
      return (
        <GymDetails
          gymId={selectedGymId}
          onBack={() => setCurrentScreen("main")}
          onEdit={() => setCurrentScreen("editGym")}
          onManagePlans={() => setCurrentScreen("membershipPlans")}
        />
      );
    }

    if (currentScreen === "editGym") {
      return <EditGym onBack={() => setCurrentScreen("gymDetails")} />;
    }

    if (currentScreen === "addGym") {
      return <AddGym onBack={() => setCurrentScreen("main")} />;
    }

    if (currentScreen === "membershipPlans") {
      return (
        <MembershipPlans
          onBack={() => setCurrentScreen("gymDetails")}
          onAddPlan={() => setCurrentScreen("addPlan")}
          onEditPlan={() => setCurrentScreen("editPlan")}
        />
      );
    }

    if (currentScreen === "editPlan") {
      return <EditPlan onBack={() => setCurrentScreen("membershipPlans")} />;
    }

    if (currentScreen === "addPlan") {
      return <AddPlan onBack={() => setCurrentScreen("main")} />;
    }

    if (currentScreen === "bookingDetails" && selectedBookingId !== null) {
      return (
        <BookingDetails
          bookingId={selectedBookingId}
          onBack={() => setCurrentScreen("main")} />
      );
    }

    if (currentScreen === "qrCheckIn") {
      return <QRCheckIn onBack={() => setCurrentScreen("main")} />;
    }

    if (currentScreen === "payouts") {
      return <PayoutsEarnings onBack={() => setCurrentScreen("main")} />;
    }

    if (currentScreen === "notifications") {
      return <Notifications onBack={() => setCurrentScreen("main")} />;
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            onNavigateToNotifications={() => setCurrentScreen("notifications")}
            onNavigateToPayouts={() => setCurrentScreen("payouts")}
            onNavigateToQR={() => setCurrentScreen("qrCheckIn")}
            onAddGym={() => setCurrentScreen("addGym")}
            onAddPlan={() => setCurrentScreen("addPlan")}
          />
        );
      case "gyms":
        return <GymsList onGymSelect={handleGymSelect} onAddGym={() => setCurrentScreen("addGym")} />;
      case "bookings":
        return <BookingsList onBookingSelect={handleBookingSelect} />;
      case "profile":
        return <Profile onLogout={() => setIsLoggedIn(false)} />;
      default:
        return (
          <Dashboard
            onNavigateToNotifications={() => setCurrentScreen("notifications")}
            onNavigateToPayouts={() => setCurrentScreen("payouts")}
            onNavigateToQR={() => setCurrentScreen("qrCheckIn")}
            onAddGym={() => setCurrentScreen("addGym")}
            onAddPlan={() => setCurrentScreen("addPlan")}
          />
        );
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      setCurrentScreen={setCurrentScreen}>
      {renderScreen()}
    </Layout>
  );
}
