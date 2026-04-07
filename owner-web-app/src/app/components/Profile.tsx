import { User, Building2, HelpCircle, Settings, LogOut, ChevronRight, Mail, Phone, MapPin, FileText, Smartphone, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { fetchProfile, updateProfile, fetchDashboardStats, submitTicket } from "../lib/api";

interface ProfileProps {
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const [currentView, setCurrentView] = useState("main");
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const loadData = async () => {
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
          phoneNumber: profileData.phoneNumber || ''
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveProfile = async () => {
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

  const menuSections = [
    {
      title: "Business",
      items: [
        { icon: Building2, label: "Business Profile", view: "business" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", view: "help" },
        { icon: Mail, label: "Contact Us", view: "contact" },
        { icon: Settings, label: "Settings", view: "settings" },
      ],
    },
  ];

  const renderEditProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Full Name</label>
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="h-11"
          />
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Email Address</label>
          <Input
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            className="h-11"
          />
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Phone Number</label>
          <Input
            value={editData.phoneNumber}
            onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
            className="h-11"
          />
        </div>
      </div>
      <Button
        onClick={handleSaveProfile}
        disabled={saving}
        className="w-full h-12 bg-gray-900 text-white"
      >
        {saving ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : 'Save Changes'}
      </Button>
    </div>
  );

  const renderBusiness = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Business Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Business Name</label>
          <Input defaultValue={profile?.name || "Business Name"} className="h-11" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Business Address</label>
          <Textarea defaultValue="Office Address" className="h-24" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Owner PAN</label>
          <Input defaultValue="ABCDE1234F" className="h-11" />
        </div>
      </div>
      <Button onClick={() => setCurrentView("main")} className="w-full h-12 bg-gray-900 text-white">Update Business Profile</Button>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Help Center</h2>
      
      {/* FAQs Section */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
        <div className="space-y-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="font-medium text-gray-900">How do I add a new gym?</p>
            <p className="text-sm text-gray-600">Go to the Gyms tab and click on the 'Add Gym' button. Fill in the details and submit.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="font-medium text-gray-900">When do I get my payouts?</p>
            <p className="text-sm text-gray-600">Payouts are processed weekly every Wednesday for the previous week's earnings.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
            <p className="font-medium text-gray-900">How does the QR check-in work?</p>
            <p className="text-sm text-gray-600">Customers will show their QR code. You can scan it using the 'Check-in' feature on your dashboard or manually enter their ID.</p>
          </div>
        </div>
      </div>

      {/* Raise a Ticket Button */}
      <button 
        onClick={() => setCurrentView("ticket")}
        className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm"
      >
        <span className="font-medium">Raise a Ticket</span>
        <ChevronRight size={18} className="text-gray-400" />
      </button>

      <Button onClick={() => setCurrentView("main")} variant="outline" className="w-full h-12 border-gray-300">Back</Button>
    </div>
  );

  const [ticketData, setTicketData] = useState({
    subject: '',
    description: ''
  });
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const handleSubmitTicket = async () => {
    if (!ticketData.subject.trim() || !ticketData.description.trim()) {
      alert('Please fill in both subject and description');
      return;
    }

    setSubmittingTicket(true);
    try {
      await submitTicket(ticketData);
      alert('Ticket submitted successfully! Our team will review it soon.');
      setTicketData({ subject: '', description: '' });
      setCurrentView("help");
    } catch (err) {
      alert('Failed to submit ticket: ' + (err as Error).message);
    } finally {
      setSubmittingTicket(false);
    }
  };

  const renderTicket = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Raise a Support Ticket</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <Input 
            placeholder="What's the issue?" 
            className="h-11" 
            value={ticketData.subject}
            onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <Textarea 
            placeholder="Describe your problem in detail..." 
            rows={4} 
            className="resize-none"
            value={ticketData.description}
            onChange={(e) => setTicketData({ ...ticketData, description: e.target.value })}
          />
        </div>
        <Button 
          onClick={handleSubmitTicket}
          disabled={submittingTicket}
          className="w-full h-11 bg-black text-white hover:bg-gray-800"
        >
          {submittingTicket ? <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Submitting...
          </> : 'Submit Ticket'}
        </Button>
      </div>
      <Button onClick={() => setCurrentView("help")} variant="outline" className="w-full h-12 border-gray-300">Back to Help</Button>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Contact Us</h2>
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Mail size={20} className="text-blue-600" />
            Email Support
          </h3>
          <a href="mailto:support@gymkaana.com" className="text-blue-600 hover:underline font-medium">
            support@gymkaana.com
          </a>
          <p className="text-sm text-gray-500">We typically respond within 24 hours</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Phone size={20} className="text-green-600" />
            Phone Support
          </h3>
          <a href="tel:+918000900900" className="text-blue-600 hover:underline font-medium text-lg">
            +91 8000 900 900
          </a>
          <p className="text-sm text-gray-500">Monday to Friday, 9 AM - 6 PM IST</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={20} className="text-red-600" />
            Office Address
          </h3>
          <p className="text-gray-700">
            Gymkaana Support Center<br />
            123 Fitness Street<br />
            Mumbai, Maharashtra 400001<br />
            India
          </p>
        </div>
      </div>
      <Button onClick={() => setCurrentView("main")} variant="outline" className="w-full h-12 border-gray-300">Back</Button>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <Smartphone size={20} className="text-gray-600" />
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-xs text-gray-500">Receive alerts on mobile</p>
            </div>
          </div>
          <div className="h-6 w-11 bg-blue-600 rounded-full relative cursor-pointer">
            <div className="h-5 w-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} className="text-gray-600" />
            <div>
              <p className="font-medium">Two-Factor Auth</p>
              <p className="text-xs text-gray-500">Extra security layer</p>
            </div>
          </div>
          <div className="h-6 w-11 bg-gray-200 rounded-full relative cursor-pointer">
            <div className="h-5 w-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Legal Section */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
        <div className="space-y-2">
          <a href="#" className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm text-left">
            <span className="font-medium text-gray-900">Privacy Policy</span>
            <ChevronRight size={18} className="text-gray-400" />
          </a>
          <a href="#" className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm text-left">
            <span className="font-medium text-gray-900">Terms & Conditions</span>
            <ChevronRight size={18} className="text-gray-400" />
          </a>
        </div>
      </div>

      <Button onClick={() => setCurrentView("main")} variant="outline" className="w-full h-12 border-gray-300">Back</Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  /* --- Main View --- */
  if (currentView === "main") {
    const initials = profile?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'OW';

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
          <h1 className="text-xl font-bold">Profile & Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 pb-24">
          {/* Profile Card */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
                {initials}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{profile?.name || 'Owner Name'}</h2>
                <p className="text-sm text-gray-600 mb-3">{profile?.role === 'owner' ? 'Premium Account' : 'Account'}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-2 border-gray-300 font-medium"
                  onClick={() => setCurrentView("edit")}
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} />
                <span>{profile?.email || 'No email'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>{profile?.phoneNumber || 'No phone'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <h3 className="text-base font-bold mb-4">Your Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold mb-1">{stats?.gymPerformance?.length || 0}</p>
                <p className="text-xs text-gray-500">Total Gyms</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold mb-1">{stats?.totalMembers || 0}</p>
                <p className="text-xs text-gray-500">Total Members</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600 mb-1">₹{((stats?.totalRevenue || 0) / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500">Total Revenue</p>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wide">{section.title}</h3>
              <div className="bg-white border-2 border-gray-300 rounded-lg divide-y-2 divide-gray-100 overflow-hidden">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => setCurrentView(item.view)}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                        <item.icon size={20} className="text-gray-700" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-200 mt-4"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>

          {/* App Version */}
          <div className="text-center pt-4 pb-8">
            <p className="text-xs text-gray-400">Gymkaana Owner v1.0.4</p>
          </div>
        </div>
      </div>
    );
  }

  /* --- Render Active Sub-View --- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Common Header for Sub-Views */}
      {(currentView !== "main") && (
        <div className="bg-white border-b-2 border-gray-300 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setCurrentView("main")} className="p-1 hover:bg-gray-100 rounded-full" title="Back to Main Profile">
            <ChevronRight size={24} className="rotate-180 text-gray-700" />
          </button>
          <span className="font-bold text-lg text-gray-900">Back to Profile</span>
        </div>
      )}

      <div className="px-6 py-6 pb-24 max-w-2xl mx-auto">
        {currentView === "edit" && renderEditProfile()}
        {currentView === "business" && renderBusiness()}
        {currentView === "help" && renderHelp()}
        {currentView === "ticket" && renderTicket()}
        {currentView === "contact" && renderContact()}
        {currentView === "settings" && renderSettings()}
      </div>
    </div>
  );
}
