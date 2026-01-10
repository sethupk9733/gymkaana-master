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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentScreen, setCurrentScreen] = useState("main");
  const [selectedGymId, setSelectedGymId] = useState<number | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

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
