import { User, Building2, CreditCard, HelpCircle, Settings, LogOut, ChevronRight, Mail, Phone, MapPin, FileText, Smartphone, ShieldCheck, Camera, Loader2, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { Textarea } from "./ui/textarea";
import { fetchProfile, updateProfile, logout, fetchDashboardStats } from "../lib/api";

interface ProfileProps {
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const [currentView, setCurrentView] = useState("main"); // main, edit, banking, business, help, settings
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '', phoneNumber: '', profileImage: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [profileData, statsData] = await Promise.all([
        fetchProfile(),
        fetchDashboardStats()
      ]);
      setProfile(profileData);
      setStats(statsData);
      setEditData({
        name: profileData.name || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        profileImage: profileData.profileImage || ''
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const menuSections = [
    {
      title: "Business",
      items: [
        { icon: Building2, label: "Business Profile", view: "business" },
        { icon: CreditCard, label: "Bank & Payout Details", view: "banking" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", view: "help" },
        { icon: Settings, label: "Settings", view: "settings" },
      ],
    },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Max 2MB allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setEditData(prev => ({ ...prev, profileImage: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(editData);
      setProfile(updated);
      setCurrentView("main");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAction = async () => {
    await logout();
    localStorage.removeItem('gymkaana_owner_user');
    onLogout();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  /* --- Sub-Views Renders --- */

  const renderEditProfile = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-black uppercase tracking-tighter">Edit Profile</h2>

      {/* Photo Upload Area */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
            {editData.profileImage ? (
              <img src={editData.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 font-bold text-2xl uppercase">
                {String(profile?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white w-6 h-6" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to update snapshot</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Full Identity</label>
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="h-11 font-bold text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Digital Coordinates</label>
          <Input
            value={editData.email}
            readOnly
            className="h-11 font-bold text-sm bg-gray-50 text-gray-400"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Contact Protocol</label>
          <Input
            value={editData.phoneNumber}
            onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
            className="h-11 font-bold text-sm"
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => setCurrentView("main")} className="flex-1 font-black uppercase text-xs tracking-widest h-12">Cancel</Button>
        <Button onClick={handleSave} disabled={saving} className="flex-1 bg-black text-white font-black uppercase text-xs tracking-widest h-12">
          {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Finalize Changes
        </Button>
      </div>
    </div>
  );

  const renderBanking = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase tracking-tighter">Bank & Payout Details</h2>

      {/* Bank Account */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-black mb-3 flex items-center gap-2 uppercase tracking-widest">
          <Building2 size={16} /> Settlement Account
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] mb-1 text-gray-500 font-black uppercase">Account Number</label>
            <Input defaultValue="XXXXXXXXXX1234" className="bg-gray-50 mb-2 font-bold" />
          </div>
          <div>
            <label className="block text-[10px] mb-1 text-gray-500 font-black uppercase">IFSC Code</label>
            <Input defaultValue="HDFC0001234" className="bg-gray-50 font-bold" />
          </div>
        </div>
      </div>

      {/* GST Info */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-black mb-3 flex items-center gap-2 uppercase tracking-widest">
          <FileText size={16} /> Tax Information
        </h3>
        <div>
          <label className="block text-[10px] mb-1 text-gray-500 font-black uppercase">GST Number</label>
          <Input defaultValue="29ABCDE1234F1Z5" className="bg-gray-50 font-bold" />
        </div>
      </div>

      <Button onClick={() => setCurrentView("main")} className="w-full h-12 bg-black font-black uppercase text-xs tracking-widest text-white">Save Banking Vault</Button>
    </div>
  );

  const renderBusiness = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase tracking-tighter">Business Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Trade Name</label>
          <Input defaultValue="FitZone Enterprise" className="h-11 font-bold" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Operational Base</label>
          <Textarea defaultValue="Office 201, Tech Park, Bangalore" className="h-24 font-bold" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Corporate Registration (PAN)</label>
          <Input defaultValue="ABCDE1234F" className="h-11 font-bold" />
        </div>
      </div>
      <Button onClick={() => setCurrentView("main")} className="w-full h-12 bg-black font-black uppercase text-xs tracking-widest text-white">Update Portfolio</Button>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase tracking-tighter">Help Center</h2>
      <div className="space-y-3">
        <button className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-lg hover:border-black transition-all group">
          <span className="font-bold text-sm uppercase tracking-widest">Contact Command Hub</span>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-black transition-colors" />
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-lg hover:border-black transition-all group">
          <span className="font-bold text-sm uppercase tracking-widest">Intelligence Database (FAQs)</span>
          <ChevronRight size={18} className="text-gray-400 group-hover:text-black transition-colors" />
        </button>
      </div>
      <Button onClick={() => setCurrentView("main")} variant="outline" className="w-full h-12 border-2 border-gray-200 font-bold uppercase text-xs tracking-widest">Return</Button>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-black uppercase tracking-tighter">System Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <Smartphone size={20} className="text-gray-600" />
            <div>
              <p className="font-black text-xs uppercase tracking-widest">Real-time Signals</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Mobile alerts active</p>
            </div>
          </div>
          <div className="h-6 w-11 bg-black rounded-full relative cursor-pointer">
            <div className="h-4 w-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border-2 border-gray-100 rounded-lg">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-gray-600" />
            <div>
              <p className="font-black text-xs uppercase tracking-widest">Encryption Level</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Multi-factor ready</p>
            </div>
          </div>
          <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer">
            <div className="h-4 w-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
          </div>
        </div>
      </div>
      <Button onClick={() => setCurrentView("main")} variant="outline" className="w-full h-12 border-2 border-gray-200 font-bold uppercase text-xs tracking-widest">Return</Button>
    </div>
  );

  /* --- Main View --- */
  if (currentView === "main") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-200 px-6 py-6">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Identity & Configuration</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Authorized entity parameters</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 pb-24">
          {/* Profile Card */}
          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 z-0"></div>

            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-3xl border-4 border-white shadow-xl overflow-hidden">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    String(profile?.name || 'P').charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">{profile?.name || 'Authorized User'}</h2>
                  <p className="text-[10px] font-black bg-black text-white px-2 py-0.5 inline-block uppercase tracking-widest mt-1">
                    {profile?.roles?.join(' / ') || 'PARTNER'}
                  </p>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 border-2 border-black font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all"
                      onClick={() => setCurrentView("edit")}
                    >
                      Modify Profile
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-gray-100 flex flex-wrap gap-x-8 gap-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                  <Mail size={14} className="text-black" />
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                  <Phone size={14} className="text-black" />
                  <span>{profile?.phoneNumber || '+91 REQUESTED'}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
                  <MapPin size={14} className="text-black" />
                  <span>India Sector</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Units Managed', val: stats?.gymPerformance?.length || 0 },
              { label: 'Active Personnel', val: stats?.totalMembers || 0 },
              { label: 'Yield (INR)', val: `₹${((stats?.totalRevenue || 0) / 1000).toFixed(1)}K` }
            ].map((s, i) => (
              <div key={i} className="bg-white border-2 border-gray-200 rounded-lg p-3 text-center">
                <p className="text-xl font-black">{s.val}</p>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-[10px] font-black text-gray-400 mb-3 px-2 uppercase tracking-[0.3em]">{section.title}</h3>
              <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden divide-y-2 divide-gray-50">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => setCurrentView(item.view)}
                    className="w-full px-5 py-5 flex items-center justify-between hover:bg-gray-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-white border-2 border-transparent group-hover:border-black transition-all">
                        <item.icon size={20} className="text-gray-900" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <Button
            onClick={handleLogoutAction}
            variant="outline"
            className="w-full h-14 border-2 border-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 mt-6 font-black uppercase tracking-[0.4em] transition-all text-xs"
          >
            <LogOut size={18} className="mr-3" />
            Terminate Session
          </Button>

          {/* Infrastructure ID */}
          <div className="text-center pt-8 pb-12">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">GYMKAANA CORE INFRASTRUCTURE v1.0.8</p>
          </div>
        </div>
      </div>
    );
  }

  /* --- Render Active Sub-View --- */
  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
      {/* Common Header for Sub-Views */}
      {(currentView !== "main") && (
        <div className="bg-white border-b-2 border-gray-200 px-6 py-6 flex items-center gap-4 sticky top-0 z-50">
          <button onClick={() => setCurrentView("main")} className="p-2 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all shadow-sm">
            <ChevronRight size={20} className="rotate-180 text-black" />
          </button>
          <div>
            <span className="font-black text-lg uppercase tracking-widest text-black">Control Panel</span>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Back to primary identity</p>
          </div>
        </div>
      )}

      <div className="px-6 py-10 pb-24 max-w-2xl mx-auto">
        {currentView === "edit" ? renderEditProfile() :
          currentView === "banking" ? renderBanking() :
            currentView === "business" ? renderBusiness() :
              currentView === "help" ? renderHelp() :
                currentView === "settings" ? renderSettings() : null}
      </div>
    </div>
  );
}
