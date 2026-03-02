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
import { OWNER_URL } from "../config/api";

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
    { icon: History, label: "My Bookings", sub: "View active & past passes", onClick: onViewBookings },
    { icon: CreditCard, label: "Payment Methods", sub: "Manage your saved cards", onClick: () => setCurrentView('payments') },
    { icon: Bell, label: "Notifications", sub: "Control your alerts", onClick: () => setCurrentView('settings') },
    { icon: LogOut, label: "Sign Out", sub: "See you later!", onClick: onLogout },
  ];

  /* Sub-view Components */
  const renderPayments = () => (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Active Accounts</h3>
        <div className="p-6 bg-white border border-border/60 rounded-[32px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-slate-900 rounded-md flex items-center justify-center text-[10px] text-white font-black tracking-widest italic">VISA</div>
            <div>
              <p className="font-extrabold text-secondary tracking-tight">•••• 4242</p>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Exp 12/28</p>
            </div>
          </div>
          <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full uppercase tracking-widest">DEFAULT</span>
        </div>
        <button className="w-full py-5 border-2 border-dashed border-border/80 rounded-[32px] text-muted-foreground text-[11px] font-black uppercase tracking-[0.2em] hover:border-primary hover:text-primary transition-all">
          + ADD NEW METHOD
        </button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Alert Settings</h3>
        <div className="bg-white rounded-[32px] p-8 border border-border/60 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold text-secondary tracking-tight">Push Notifications</p>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mt-1">Booking & Security Alerts</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-extrabold text-secondary tracking-tight">Email Marketing</p>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mt-1">New gym launches & offers</p>
            </div>
            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
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
    <div className="p-8 space-y-8">
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Full Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full p-5 bg-white border border-border/60 rounded-[24px] font-extrabold text-secondary outline-none focus:border-primary transition-all shadow-sm"
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Email Address</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            className="w-full p-5 bg-white border border-border/60 rounded-[24px] font-extrabold text-secondary outline-none focus:border-primary transition-all shadow-sm"
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Phone Number</label>
          <input
            type="tel"
            value={editData.phoneNumber}
            onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
            className="w-full p-5 bg-white border border-border/60 rounded-[24px] font-extrabold text-secondary outline-none focus:border-primary transition-all shadow-sm"
            placeholder="+91 00000 00000"
          />
        </div>
      </div>
      <div className="pt-4">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full py-5 bg-secondary text-white rounded-[24px] font-black uppercase tracking-[0.3em] italic text-xs shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          SAVE PROFILE
        </button>
        <button
          onClick={() => setCurrentView('main')}
          className="w-full mt-4 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-secondary transition-colors"
        >
          Go Back
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
      <div className="h-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full bg-background flex flex-col"
    >
      <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
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

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'main' ? (
            <motion.div
              key="main"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="pb-24"
            >
              <div className="p-8">
                {/* Clean Profile Header */}
                <div className="flex flex-col items-center text-center mb-12">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shadow-2xl relative overflow-hidden">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white">
                        {localProfile?.profileImage ? (
                          <img src={localProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-14 h-14 text-slate-200" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform border-4 border-white"
                      title="Update Profile Picture"
                      aria-label="Update Profile Picture"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      title="Profile picture upload"
                      aria-label="Profile picture upload"
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

                  <h3 className="text-4xl font-black italic uppercase tracking-tighter text-secondary mb-1">{localProfile?.name || 'User'}</h3>
                  <p className="text-[12px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] opacity-60 mb-6">{localProfile?.email || 'Fitness Junkie'}</p>

                  <button
                    onClick={() => setCurrentView('edit')}
                    className="px-8 py-3 bg-white border border-border/60 rounded-full font-black text-[11px] uppercase tracking-[0.2em] text-secondary hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                </div>

                {/* Membership Pass Section */}
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-5 px-1">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Current Access</h3>
                  </div>
                  {renderActivePass() || (
                    <div className="bg-white border border-border/60 rounded-[40px] p-12 text-center shadow-sm">
                      <p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-6">No Active Passes Found</p>
                      <button
                        onClick={() => onBack()}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 italic"
                      >
                        Find a Venue
                      </button>
                    </div>
                  )}
                </div>

                {/* Refined Menu - List Style */}
                <div className="space-y-4 mb-12">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground px-1 italic">Account Options</h3>
                  <div className="bg-white rounded-[40px] border border-border/60 shadow-sm overflow-hidden">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={item.onClick}
                        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all border-b border-border/40 last:border-0 group"
                      >
                        <div className="flex items-center gap-5">
                          <div className={`p-3 rounded-2xl ${item.label === 'Sign Out' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-secondary'} group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-6 h-6" />
                          </div>
                          <div className="text-left">
                            <span className="block font-extrabold text-secondary text-[15px] tracking-tight uppercase italic">{item.label}</span>
                            <span className="block text-[11px] font-bold text-muted-foreground uppercase opacity-60 tracking-wide">{item.sub}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center p-8">
                  <button
                    onClick={() => window.open(OWNER_URL, '_blank')}
                    className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] hover:text-primary transition-all underline underline-offset-8"
                  >
                    Open Partner Portal
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="subview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pb-24"
            >
              {currentView === 'payments' && renderPayments()}
              {currentView === 'edit' && renderEditProfile()}
              {currentView === 'help' && (
                <div className="h-[calc(100vh-180px)]">
                  <SupportChat />
                </div>
              )}
              {currentView === 'settings' && renderSettings()}
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
