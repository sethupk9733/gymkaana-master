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
import Earnings from './pages/Earnings';
import Bookings from './pages/Bookings';
import CheckIn from './pages/CheckIn';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import BankDetails from './pages/BankDetails';
import EditProfile from './pages/EditProfile';
import HelpSupport from './pages/HelpSupport';
import Loading from './pages/Loading';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Welcome from './pages/Welcome';

export default function App() {
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

          {/* Plan Routes */}
          <Route path="plans/add" element={<SelectGymForPlan />} />
          <Route path="plans/create" element={<AddPlan />} />
          <Route path="plans/:id/edit" element={<EditPlan />} />

          {/* Other Routes */}
          <Route path="earnings" element={<Earnings />} />
          <Route path="history" element={<ActivityHistory />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="check-in" element={<CheckIn />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="help-support" element={<HelpSupport />} />
          <Route path="settings" element={<Settings />} />
          <Route path="bank-details" element={<BankDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
