import { useState } from "react";
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentScreen, setCurrentScreen] = useState("main");
  const [selectedGymId, setSelectedGymId] = useState<string | number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  // Session restore logic
  useState(() => {
    const token = localStorage.getItem('gymkaana_token');
    const userStr = localStorage.getItem('gymkaana_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // Ensure the user object has a role property and it's either 'owner' or 'admin'
        if (user && (user.role === 'owner' || user.role === 'admin')) {
          setIsLoggedIn(true);
        } else {
          // If user data is invalid or role is not authorized, clear session
          localStorage.removeItem('gymkaana_token');
          localStorage.removeItem('gymkaana_user');
          setIsLoggedIn(false);
        }
      } catch (e) {
        // Handle JSON parsing error
        console.error("Failed to parse user data from localStorage", e);
        localStorage.removeItem('gymkaana_token');
        localStorage.removeItem('gymkaana_user');
        setIsLoggedIn(false);
      }
    }
  });

  if (!isLoggedIn) {
    return <OwnerLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const handleGymSelect = (gymId: string | number) => {
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
          gymId={String(selectedGymId)}
          onBack={() => setCurrentScreen("main")}
          onEdit={() => setCurrentScreen("editGym")}
          onManagePlans={() => setCurrentScreen("membershipPlans")}
        />
      );
    }

    if (currentScreen === "editGym" && selectedGymId !== null) {
      return (
        <EditGym
          gymId={String(selectedGymId)}
          onBack={() => setCurrentScreen("gymDetails")}
        />
      );
    }

    if (currentScreen === "addGym") {
      return <AddGym onBack={() => setCurrentScreen("main")} />;
    }

    if (currentScreen === "membershipPlans" && selectedGymId !== null) {
      return (
        <MembershipPlans
          gymId={String(selectedGymId)}
          onBack={() => setCurrentScreen("gymDetails")}
          onAddPlan={() => setCurrentScreen("addPlan")}
          onEditPlan={(planId: string) => {
            setSelectedPlanId(planId);
            setCurrentScreen("editPlan");
          }}
        />
      );
    }

    if (currentScreen === "editPlan" && selectedPlanId !== null) {
      return <EditPlan planId={selectedPlanId} onBack={() => setCurrentScreen("membershipPlans")} />;
    }

    if (currentScreen === "addPlan") {
      return <AddPlan gymId={selectedGymId ? String(selectedGymId) : undefined} onBack={() => setCurrentScreen("membershipPlans")} />;
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

    if (currentScreen === "accounting") {
      return <Accounting onBack={() => setCurrentScreen("main")} />;
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            onNavigateToNotifications={() => setCurrentScreen("notifications")}
            onNavigateToPayouts={() => setCurrentScreen("payouts")}
            onNavigateToQR={() => setCurrentScreen("qrCheckIn")}
            onNavigateToAccounting={() => setCurrentScreen("accounting")}
            onNavigateToBookings={() => setActiveTab("bookings")}
            onAddGym={() => setCurrentScreen("addGym")}
            onAddPlan={() => setCurrentScreen("addPlan")}
            onManagePlans={(gymId: string) => {
              setSelectedGymId(gymId);
              setCurrentScreen("membershipPlans");
            }}
          />
        );
      case "gyms":
        return <GymsList onGymSelect={handleGymSelect} onAddGym={() => setCurrentScreen("addGym")} />;
      case "bookings":
        return <BookingsList onBookingSelect={handleBookingSelect} />;
      case "reviews":
        return <ReviewsList />;
      case "profile":
        return <Profile onLogout={() => setIsLoggedIn(false)} />;
      default:
        return (
          <Dashboard
            onNavigateToNotifications={() => setCurrentScreen("notifications")}
            onNavigateToPayouts={() => setCurrentScreen("payouts")}
            onNavigateToQR={() => setCurrentScreen("qrCheckIn")}
            onNavigateToAccounting={() => setCurrentScreen("accounting")}
            onNavigateToBookings={() => setActiveTab("bookings")}
            onAddGym={() => setCurrentScreen("addGym")}
            onAddPlan={() => setCurrentScreen("addPlan")}
            onManagePlans={(gymId: string) => {
              setSelectedGymId(gymId);
              setCurrentScreen("membershipPlans");
            }}
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
      <SupportChat minimized={true} />
    </Layout>
  );
}

// FORCE_REDEPLOY_SYNC: 2026-04-07 14:12:34
