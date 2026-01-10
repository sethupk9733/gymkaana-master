import { useState } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  History,
  CreditCard,
  Shield,
  Lock,
  Eye,
  FileText,
  MessageSquare,
  AlertCircle,
  Building
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActivePassCard } from "./ui/ActivePassCard";
import { QRModal } from "./ui/QRModal";
import { activePass } from "../data/mockData";
import { Switch } from "./ui/switch"; // Assuming we have a switch component or will replace with simple toggle

export function ProfileScreen({
  onBack,
  onLogout,
  onViewBookings
}: {
  onBack: () => void;
  onLogout: () => void;
  onViewBookings: () => void;
}) {
  const [showQR, setShowQR] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'payments' | 'privacy' | 'notifications' | 'help' | 'settings' | 'membership'>('main');

  const menuItems = [
    { icon: History, label: "My Bookings", onClick: onViewBookings },
    { icon: CreditCard, label: "Payments", onClick: () => setCurrentView('payments') },
    { icon: User, label: "Manage Membership", onClick: () => setCurrentView('membership') },
    { icon: Shield, label: "Privacy & Security", onClick: () => setCurrentView('privacy') },
    { icon: Bell, label: "Notifications", onClick: () => setCurrentView('notifications') },
    { icon: HelpCircle, label: "Help & Support", onClick: () => setCurrentView('help') },
    { icon: Settings, label: "Settings", onClick: () => setCurrentView('settings') },
    { icon: Building, label: "Gym Owner Portal", onClick: () => window.open('https://gymkaana-owner.vercel.app', '_blank') },
  ];

  /* Sub-view Components */
  const renderPayments = () => (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Saved Methods</h3>
        <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold tracking-widest">VISA</div>
            <div>
              <p className="font-bold text-sm text-gray-900">•••• 4242</p>
              <p className="text-xs text-gray-400">Expires 12/28</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded">DEFAULT</span>
        </div>
        <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-bold uppercase tracking-widest hover:border-black hover:text-black transition-all">
          + Add New Card
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Transaction History</h3>
        {[1, 2].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
            <div>
              <p className="text-sm font-bold text-gray-900">Monthly Plan - PowerHouse</p>
              <p className="text-xs text-gray-400">Dec {5 - i}, 2025</p>
            </div>
            <p className="text-sm font-bold text-gray-900">-₹2,500</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        {[
          { label: "Two-Factor Authentication", desc: "Secure your account with 2FA", active: true },
          { label: "Face ID Login", desc: "Use Face ID to sign in securely", active: false },
          { label: "Profile Visibility", desc: "Manage who can see your profile", active: true },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <p className="font-bold text-sm text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${item.active ? 'bg-black' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.active ? 'translate-x-4' : ''}`} />
            </div>
          </div>
        ))}
      </div>
      <button className="w-full p-4 text-left flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-black transition-colors">
        <Lock className="w-4 h-4" /> Change Password
      </button>
      <button className="w-full p-4 text-left flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-black transition-colors">
        <FileText className="w-4 h-4" /> Privacy Policy
      </button>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6 p-6">
      <div className="p-4 bg-blue-50 text-blue-800 text-xs font-medium rounded-xl mb-4">
        Manage how you receive updates and alerts.
      </div>
      {[
        { label: "Booking Reminders", desc: "Get notified 1 hour before workout" },
        { label: "Promotional Offers", desc: "Deals and discounts from gyms" },
        { label: "App Updates", desc: "New features and improvements" },
        { label: "Community", desc: "Friend requests and interactions" },
      ].map((item, i) => (
        <div key={i} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
          <div>
            <p className="font-bold text-sm text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 bg-black`}>
            <div className={`w-4 h-4 bg-white rounded-full translate-x-4`} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-4 p-6">
      <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-gray-100 transition-colors text-left">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <MessageSquare className="w-5 h-5 text-gray-900" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900">Chat with Support</p>
          <p className="text-xs text-gray-400">Typical reply time: 2 mins</p>
        </div>
        <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
      </button>

      <button className="w-full p-4 bg-gray-50 rounded-2xl flex items-center gap-4 hover:bg-gray-100 transition-colors text-left">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <Mail className="w-5 h-5 text-gray-900" />
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900">Email Us</p>
          <p className="text-xs text-gray-400">support@gymkaana.com</p>
        </div>
        <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
      </button>

      <div className="mt-8">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">FAQ</h3>
        {[
          "How do I cancel a booking?",
          "Refund policy",
          "How to upgrade membership?"
        ].map((q, i) => (
          <button key={i} className="w-full py-3 flex justify-between items-center text-sm font-medium text-gray-600 border-b border-gray-100 text-left">
            {q} <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div>
          <p className="font-bold text-sm text-gray-900">Dark Mode</p>
          <p className="text-xs text-gray-400">Switch app appearance</p>
        </div>
        <div className="w-10 h-6 bg-gray-200 rounded-full p-1">
          <div className="w-4 h-4 bg-white rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div>
          <p className="font-bold text-sm text-gray-900">Language</p>
          <p className="text-xs text-gray-400">English (US)</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>

      <button className="w-full p-4 text-left text-red-500 font-bold text-sm flex items-center gap-2 hover:bg-red-50 rounded-2xl transition-colors">
        <AlertCircle className="w-4 h-4" /> Delete Account
      </button>
    </div>
  );

  const renderMembership = () => (
    <div className="space-y-6 p-6">
      <div className="bg-gray-900 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[40px] rounded-full" />
        <div className="relative z-10">
          <h4 className="text-xl font-black italic uppercase tracking-tighter mb-1">{activePass.gymName}</h4>
          <p className="text-xs font-bold text-white/50 mb-6">{activePass.planName} Access</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Status</p>
              <p className="text-sm font-bold text-emerald-400">Active</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Till</p>
              <p className="text-sm font-bold">{activePass.validUntil}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Plan Details</h3>
        <div className="space-y-3">
          {[
            { label: "Price", value: "₹2,500 / month" },
            { label: "Next Billing", value: activePass.validUntil },
            { label: "Payment Method", value: "VISA •••• 4242" },
          ].map((detail, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-sm font-medium text-gray-500">{detail.label}</span>
              <span className="text-sm font-bold text-gray-900">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 space-y-3">
        <button className="w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-gray-800 transition-all">
          Change Plan
        </button>
        <button className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-100 transition-all">
          Cancel Membership
        </button>
        <p className="text-[10px] text-center text-gray-400 font-medium px-4 leading-relaxed">
          Note: Cancellation will be effective at the end of your current billing cycle on {activePass.validUntil}.
        </p>
      </div>
    </div>
  );

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'payments': return 'Payments';
      case 'privacy': return 'Privacy & Security';
      case 'notifications': return 'Notifications';
      case 'help': return 'Help & Support';
      case 'settings': return 'Settings';
      case 'membership': return 'Manage Membership';
      default: return 'Profile';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => currentView === 'main' ? onBack() : setCurrentView('main')}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">{getHeaderTitle()}</h2>
          </div>
          {currentView === 'main' && (
            <button
              onClick={onLogout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentView === 'main' ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Profile Header */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center border-4 border-white shadow-xl">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">John Doe</h3>
                    <p className="text-sm text-gray-400 font-medium">Member since Jan 2025</p>
                  </div>
                </div>

                {/* Active Pass Section */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Active Pass</h3>
                  <ActivePassCard pass={activePass} onClick={() => setShowQR(true)} />
                </div>
              </div>

              {/* Account Menu */}
              <div className="p-6 pt-0">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Account</h3>
                <div className="bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-4 hover:bg-white transition-all border-b border-gray-100 last:border-0 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                          <item.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="font-bold text-gray-900">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div className="p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email</div>
                      <div className="text-sm font-bold">john.doe@email.com</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone</div>
                      <div className="text-sm font-bold">+91 98765 43210</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* App Version */}
              <div className="p-10 text-center">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                  Gymkaana v1.0.0
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="subview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {currentView === 'payments' && renderPayments()}
              {currentView === 'privacy' && renderPrivacy()}
              {currentView === 'notifications' && renderNotifications()}
              {currentView === 'help' && renderHelp()}
              {currentView === 'settings' && renderSettings()}
              {currentView === 'membership' && renderMembership()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showQR && <QRModal pass={activePass} onClose={() => setShowQR(false)} />}
    </motion.div>
  );
}
