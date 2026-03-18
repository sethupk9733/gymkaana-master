import { useState, useRef, useEffect } from "react";
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
  FileText,
  MessageSquare,
  AlertCircle,
  Building,
  Camera,
  ShieldCheck as ShieldVerified,
  Edit2,
  Save,
  Loader2,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActivePassCard } from "./ui/ActivePassCard";
import { QRModal } from "./ui/QRModal";
import { SupportChat } from "./SupportChat";
import { fetchMyBookings, fetchProfile, updateProfile as updateProfileApi } from "../lib/api";


export function ProfileScreen({
  onBack,
  onLogout,
  onViewBookings,
  userPhoto,
  onPhotoCapture
}: {
  onBack: () => void;
  onLogout: () => void;
  onViewBookings: () => void;
  userPhoto: string | null;
  onPhotoCapture: (photo: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showQR, setShowQR] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'payments' | 'privacy' | 'notifications' | 'help' | 'settings' | 'membership' | 'edit'>('main');
  const [bookings, setBookings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    age: '',
    gender: '',
    address: '',
    occupation: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prof, bookingsData] = await Promise.all([
          fetchProfile(),
          fetchMyBookings()
        ]);
        setProfile(prof);
        setEditData({
          name: prof.name || '',
          email: prof.email || '',
          phoneNumber: prof.phoneNumber || '',
          age: prof.age ? String(prof.age) : '',
          gender: prof.gender || '',
          address: prof.address || '',
          occupation: prof.occupation || ''
        });
        setBookings(bookingsData);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateProfileApi(editData);
      setProfile(updated);
      setCurrentView('main');
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Sort bookings by createdAt DESC to get latest active booking
  const activeBooking = bookings
    .sort((a, b) => new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime())
    .find(b => ['active', 'Active', 'upcoming', 'Upcoming'].includes(b.status));

  const mappedActivePass = activeBooking ? {
    id: activeBooking._id,
    gymName: activeBooking.gymId?.name || "Gym",
    gymLogo: activeBooking.gymId?.images?.[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000",
    planName: activeBooking.planId?.name || "Membership",
    validFrom: new Date(activeBooking.startDate).toLocaleDateString(),
    validUntil: new Date(activeBooking.endDate).toLocaleDateString(),
    daysLeft: Math.ceil((new Date(activeBooking.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    location: activeBooking.gymId?.location || activeBooking.gymId?.address || "Location",
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`GYMKAANA-${activeBooking._id}`)}&t=${Date.now()}`,
    houseRules: activeBooking.gymId?.houseRules,
    facilities: activeBooking.gymId?.facilities
  } : null;


  const menuItems = [
    { icon: History, label: "My Bookings", onClick: onViewBookings },
    { icon: CreditCard, label: "Payments", onClick: () => setCurrentView('payments') },
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
            <div className="w-10 h-6 bg-primary rounded flex items-center justify-center text-[8px] text-white font-bold tracking-widest">VISA</div>
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
      {[
        { label: "Booking Reminders", desc: "Get notified 1 hour before workout" },
        { label: "Promotional Offers", desc: "Deals and discounts from gyms" },
        { label: "App Updates", desc: "New features and improvements" },
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
    <div className="h-[calc(100vh-180px)]">
      <SupportChat />
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div>
          <p className="font-bold text-sm text-gray-900">Dark Mode</p>
        </div>
        <div className="w-10 h-6 bg-gray-200 rounded-full p-1">
          <div className="w-4 h-4 bg-white rounded-full" />
        </div>
      </div>
      <button className="w-full p-4 text-left text-red-500 font-bold text-sm flex items-center gap-2 hover:bg-red-50 rounded-2xl transition-colors">
        <AlertCircle className="w-4 h-4" /> Delete Account
      </button>
    </div>
  );

  const renderMembership = () => (
    <div className="space-y-6 p-6">
      {mappedActivePass ? (
        <>
          <div className="bg-gray-900 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[40px] rounded-full" />
            <div className="relative z-10">
              <h4 className="text-xl font-black italic uppercase tracking-tighter mb-1">{mappedActivePass.gymName}</h4>
              <p className="text-xs font-bold text-white/50 mb-6">{mappedActivePass.planName} Access</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Status</p>
                  <p className="text-sm font-bold text-emerald-400">Active</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Till</p>
                  <p className="text-sm font-bold">{mappedActivePass.validUntil}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No active membership found</p>
        </div>
      )}
    </div>
  );

  const renderEditProfile = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Full Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold uppercase text-sm tracking-tight outline-none focus:ring-2 focus:ring-black/5"
            placeholder="Enter full name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-black/5"
            placeholder="Enter email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Phone Number</label>
          <input
            type="tel"
            value={editData.phoneNumber}
            onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm tracking-tight outline-none focus:ring-2 focus:ring-black/5"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Age</label>
            <input
              type="number"
              value={editData.age}
              onChange={(e) => setEditData({ ...editData, age: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-black/5"
              placeholder="Ex: 25"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Gender</label>
            <select
              value={editData.gender}
              onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-black/5 appearance-none"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Occupation</label>
          <input
            type="text"
            value={editData.occupation}
            onChange={(e) => setEditData({ ...editData, occupation: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-black/5"
            placeholder="Ex: Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Address</label>
          <textarea
            value={editData.address}
            onChange={(e) => setEditData({ ...editData, address: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-black/5 min-h-[100px]"
            placeholder="Enter your residence details"
          />
        </div>
      </div>
      <div className="pt-6">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full py-5 bg-black text-white rounded-[24px] font-black uppercase tracking-[0.3em] italic text-xs shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-400"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Profile
        </button>
        <button
          onClick={() => setCurrentView('main')}
          className="w-full mt-4 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          Cancel
        </button>
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
      case 'edit': return 'Edit Profile';
      default: return 'Profile';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

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
                  <div className="relative group/photo">
                    <div className="w-24 h-24 bg-gray-100 rounded-[32px] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden">
                      {profile?.profileImage || userPhoto ? (
                        <img src={profile?.profileImage || userPhoto!} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border-4 border-white"
                      title="Take Security Photo"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      title="Capture Security Photo"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const base64 = reader.result as string;
                            onPhotoCapture(base64);
                            try {
                              await updateProfileApi({ profileImage: base64 });
                              setProfile((prev: any) => ({ ...prev, profileImage: base64 }));
                            } catch (err) {
                              console.error(err);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">{profile?.name || 'User'}</h3>
                      <button
                        onClick={() => setCurrentView('edit')}
                        title="Edit Profile"
                        className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-black transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {profile?.profileImage || userPhoto ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider">
                          <ShieldVerified className="w-3 h-3" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3" />
                          Photo Missing
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Active Pass Section */}
                {mappedActivePass && (
                  <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Active Pass</h3>
                    <ActivePassCard pass={mappedActivePass} onClick={() => setShowQR(true)} userPhoto={profile?.profileImage || userPhoto} />
                  </div>
                )}

              </div>

              {/* Account Menu */}
              <div className="p-6 pt-0">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Account</h3>
                <div className="bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      title={item.label}
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
                      <div className="text-sm font-bold">{profile?.email || 'N/A'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Phone</div>
                      <div className="text-sm font-bold">{profile?.phoneNumber || 'Not set'}</div>
                    </div>
                  </div>
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
              {currentView === 'edit' && renderEditProfile()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showQR && mappedActivePass && <QRModal pass={mappedActivePass} onClose={() => setShowQR(false)} userPhoto={profile?.profileImage || userPhoto} />}
    </motion.div>

  );
}
