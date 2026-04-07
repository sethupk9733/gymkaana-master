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
  QrCode,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ActivePassCard } from "./ui/ActivePassCard";
import { QRModal } from "./ui/QRModal";
import { SupportChat } from "./SupportChat";
import { fetchProfile, updateProfile as updateProfileApi, fetchMyBookings, updateBookingDate, cancelBooking } from "../lib/api";

export function ProfileScreen({
  onBack,
  onLogout,
  onViewBookings,
  profile: initialProfile,
  onProfileUpdate,
  initialView = 'main'
}: {
  onBack: () => void;
  onLogout: () => void;
  onViewBookings: () => void;
  profile: any;
  onProfileUpdate: () => void;
  initialView?: 'main' | 'payments' | 'help' | 'settings' | 'membership' | 'edit';
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showQR, setShowQR] = useState(false);
  const [currentView, setCurrentView] = useState(initialView);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [localProfile, setLocalProfile] = useState<any>(initialProfile);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [loading, setLoading] = useState(!initialProfile);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editData, setEditData] = useState({
    name: initialProfile?.name || '',
    email: initialProfile?.email || '',
    phoneNumber: initialProfile?.phoneNumber || ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prof, bookings] = await Promise.all([
          !initialProfile ? fetchProfile() : Promise.resolve(initialProfile),
          fetchMyBookings()
        ]);

        if (!initialProfile) {
          setLocalProfile(prof);
          setEditData({
            name: prof.name || '',
            email: prof.email || '',
            phoneNumber: prof.phoneNumber || ''
          });
        }

        // Sort by createdAt DESC and get latest active booking
        const sortedBookings = bookings.sort((a: any, b: any) =>
          new Date(b.createdAt || b.startDate).getTime() - new Date(a.createdAt || a.startDate).getTime()
        );
        const active = sortedBookings.find((b: any) => ['active', 'upcoming'].includes(b.status.toLowerCase()));
        setActiveBooking(active);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [initialProfile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    }, 10);
    return () => clearTimeout(timer);
  }, [currentView]);

  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await updateProfileApi(editData);
      setLocalProfile(updated);
      onProfileUpdate(); // Refresh App.tsx global state
      setCurrentView('main');
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoCapture = async (base64: string) => {
    try {
      await updateProfileApi({ profileImage: base64 });
      onProfileUpdate(); // Sync globally
    } catch (err) {
      console.error("Photo update failed:", err);
    }
  };

  const menuItems = [
    { icon: History, label: "My Bookings", onClick: onViewBookings },
    { icon: CreditCard, label: "Payments", onClick: () => setCurrentView('payments') },
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
    </div>
  );

  const renderMembership = () => (
    <div className="space-y-6 p-6">
      {activeBooking ? (
        <>
          <div className="bg-gray-900 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2">
                  <img src={activeBooking.gymId?.images?.[0] || activeBooking.gymLogo || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000"} alt="Gym" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">Active clearance</span>
                  <span className="text-2xl font-black italic uppercase tracking-tighter">#{activeBooking._id?.slice(-8).toUpperCase() || 'PASS-712'}</span>
                </div>
              </div>
              <div className="mb-10">
                <h4 className="text-xl font-black italic uppercase tracking-tighter mb-1">{activeBooking.gym || activeBooking.gymId?.name || "Premium Gym"}</h4>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{activeBooking.plan || activeBooking.planId?.name || "Elite Membership"}</p>
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">VALID UNTIL</p>
                  <p className="text-sm font-bold uppercase tracking-tight">{new Date(activeBooking.endDate || '2026-02-15').toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setShowQR(true)}
                  title="View QR Pass"
                  className="p-4 bg-primary text-black rounded-2xl hover:scale-110 transition-transform shadow-lg shadow-primary/20"
                >
                  <QrCode className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">Subscription Details</h3>
            <div className="bg-gray-50 rounded-[28px] p-6 border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
                <p className="font-bold text-gray-900">₹{activeBooking.amount || '0'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs font-black text-emerald-600 uppercase italic">Active Protocol</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[40px] p-16 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">No Active Subscriptions</p>
          <button onClick={() => setCurrentView('main')} className="mt-6 px-8 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Browse Plans</button>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-1">System Preferences</h3>
        <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">Email Alerts & Notifications</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Booking & Security Alerts</p>
            </div>
            <div className="w-12 h-6 bg-black rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-primary rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="h-[calc(100vh-180px)]">
      <SupportChat />
    </div>
  );

  const renderActivePass = () => {
    if (!activeBooking) return null;
    const pass = {
      id: activeBooking._id,
      gymName: activeBooking.gym || activeBooking.gymId?.name || "Gym",
      gymLogo: activeBooking.gymId?.images?.[0] || activeBooking.gymLogo || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000",
      planName: activeBooking.plan || activeBooking.planId?.name || "Membership",
      validFrom: new Date(activeBooking.startDate).toLocaleDateString(),
      validUntil: new Date(activeBooking.endDate).toLocaleDateString(),
      daysLeft: activeBooking.endDate ? Math.max(0, Math.ceil((new Date(activeBooking.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 0,
      location: activeBooking.gymId?.location || activeBooking.gymId?.address || "Location",
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`GYMKAANA-${activeBooking._id}`)}&t=${Date.now()}`,
      houseRules: activeBooking.gymId?.houseRules,
      facilities: activeBooking.gymId?.facilities
    };
    return <ActivePassCard pass={pass} onClick={() => setShowQR(true)} userPhoto={localProfile?.profileImage} />;
  };


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
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Email Axis</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-black/5"
            placeholder="Enter email"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Comms Protocol (Phone)</label>
          <input
            type="tel"
            value={editData.phoneNumber}
            onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm tracking-tight outline-none focus:ring-2 focus:ring-black/5"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
      </div>
      <div className="pt-6">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          title="Authorize Override"
          className="w-full py-5 bg-black text-white rounded-[24px] font-black uppercase tracking-[0.3em] italic text-xs shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-400"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Authorize Override
        </button>
        <button
          onClick={() => setCurrentView('main')}
          className="w-full mt-4 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          Cancel Protocol
        </button>
      </div>
    </div>
  );

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'payments': return 'Payments';
      case 'help': return 'Help & Support';
      case 'settings': return 'Settings';
      case 'membership': return 'Manage Membership';
      case 'edit': return 'Secure Override';
      default: return 'Profile Hub';
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
            <h2 className="text-xl font-black italic uppercase tracking-tighter">{getHeaderTitle()}</h2>
          </div>
          {currentView === 'main' && (
            <button
              onClick={onLogout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Logout System"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentView === 'main' ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pb-10"
            >
              <div className="p-6">
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative group/photo">
                    <div className="w-28 h-28 bg-gray-50 rounded-[40px] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                      {localProfile?.profileImage ? (
                        <img src={localProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-gray-200" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-11 h-11 bg-black text-primary rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all border-4 border-white"
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
                            handlePhotoCapture(base64);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">{localProfile?.name || 'User'}</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{localProfile?.email || 'N/A'}</p>
                      </div>
                      <button
                        onClick={() => setCurrentView('edit')}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                        title="Edit Identity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      {localProfile?.profileImage ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                          <ShieldVerified className="w-3.5 h-3.5" />
                          Clearance Granted
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100 animate-pulse">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Security Vulnerable
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-10">
                  <div className="flex justify-between items-center mb-5 px-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Live Sector Access</h3>
                    {activeBooking && <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">#{activeBooking._id.slice(-6).toUpperCase()}</span>}
                  </div>
                  {renderActivePass() || (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-100 rounded-[40px] p-12 text-center">
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">No Active Sector clearance Found</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-5 px-1 italic">Protocol Hub</h3>
                <div className="bg-white rounded-[40px] border-2 border-gray-50 overflow-hidden shadow-sm">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.onClick}
                      title={item.label}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-all border-b-2 border-gray-50 last:border-0 group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white group-hover:scale-110 transition-all">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900 text-sm tracking-tight uppercase italic">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 px-1 italic">Emergency Identification</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-5 p-5 bg-gray-50/50 rounded-[32px] border-2 border-gray-50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Secure Channel</div>
                      <div className="text-sm font-bold text-gray-900">{localProfile?.email || 'OFFLINE'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 p-5 bg-gray-50/50 rounded-[32px] border-2 border-gray-50">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Phone className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Comms Signal</div>
                      <div className="text-sm font-bold text-gray-900">{localProfile?.phoneNumber || 'UNSET'}</div>
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
              {currentView === 'edit' && renderEditProfile()}
              {currentView === 'help' && renderHelp()}
              {currentView === 'settings' && renderSettings()}
              {currentView === 'membership' && (
                <div className="p-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-3xl mx-auto flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gray-200 animate-spin" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Accessing Encrypted Sub-module...</p>
                  <button onClick={() => setCurrentView('main')} className="mt-8 text-[10px] font-black text-primary uppercase border-b border-primary">Return to Hub</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showQR && activeBooking && (
        <QRModal
          pass={{
            id: activeBooking._id,
            gymName: activeBooking.gym || activeBooking.gymId?.name || "Premium Gym",
            gymLogo: activeBooking.gymId?.images?.[0] || activeBooking.gymLogo || "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000",
            planName: activeBooking.plan || activeBooking.planId?.name || "Elite Membership",
            validUntil: activeBooking.endDate || "Feb 1, 2026",
            qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GYMKAANA-${activeBooking._id}`,
            houseRules: activeBooking.gymId?.houseRules,
            facilities: activeBooking.gymId?.facilities
          }}
          onClose={() => setShowQR(false)}
          userPhoto={localProfile?.profileImage}
        />
      )}
    </motion.div>
  );
}
