import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ActivityHistory from './pages/ActivityHistory';
import Gyms from './pages/Gyms';
import AddGym from './pages/AddGym';
import EditGym from './pages/EditGym';
import GymDetails from './pages/GymDetails';
import SelectGymForPlan from './pages/SelectGymForPlan';
import AddPlan from './pages/AddPlan';
import EditPlan from './pages/EditPlan';
import MembershipPlans from './pages/MembershipPlans';
import Earnings from './pages/Earnings';
import Bookings from './pages/Bookings';
import CheckIn from './pages/CheckIn';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import BankDetails from './pages/BankDetails';
import EditProfile from './pages/EditProfile';
import HelpSupport from './pages/HelpSupport';
import Contact from './pages/Contact';
import Chat from './pages/Chat';
import Loading from './pages/Loading';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Welcome from './pages/Welcome';
import { Accounting } from './pages/Accounting';
import Reviews from './pages/Reviews';
import { useEffect, useState } from 'react';
import { checkSession } from './lib/api';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkSession();
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-sm text-gray-400 mt-4">Loading...</p>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Authenticated Routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Gym Routes */}
          <Route path="gyms" element={<Gyms />} />
          <Route path="gyms/add" element={<AddGym />} />
          <Route path="gyms/:id" element={<GymDetails />} />
          <Route path="gyms/:id/edit" element={<EditGym />} />
          <Route path="gyms/:id/plans" element={<MembershipPlans />} />

          {/* Plan Routes */}
          <Route path="plans/add" element={<SelectGymForPlan />} />
          <Route path="plans/create" element={<AddPlan />} />
          <Route path="plans/:id/edit" element={<EditPlan />} />

          {/* Other Routes */}
          <Route path="earnings" element={<Earnings />} />
          <Route path="accounting" element={<Accounting onBack={() => window.history.back()} />} />
          <Route path="history" element={<ActivityHistory />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="check-in" element={<CheckIn />} />
          <Route path="profile" element={<Profile />} />
          <Route path="reviews" element={<Reviews onBack={() => window.history.back()} />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="help-support" element={<HelpSupport />} />
          <Route path="help" element={<HelpSupport />} />
          <Route path="contact" element={<Contact />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="bank-details" element={<BankDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
