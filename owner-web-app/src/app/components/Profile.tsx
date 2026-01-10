import { User, Building2, CreditCard, HelpCircle, Settings, LogOut, ChevronRight, Mail, Phone, MapPin, FileText, Smartphone, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { Textarea } from "./ui/textarea";

interface ProfileProps {
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const [currentView, setCurrentView] = useState("main"); // main, edit, banking, business, help, settings

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

  /* --- Sub-Views Renders --- */

  const renderEditProfile = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Edit Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Full Name</label>
          <Input defaultValue="Rahul Sharma" className="h-11" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Email Address</label>
          <Input defaultValue="owner@gymkaana.com" className="h-11" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Phone Number</label>
          <Input defaultValue="+91 98765 43210" className="h-11" />
        </div>
      </div>
      <Button onClick={() => setCurrentView("main")} className="w-full h-12 bg-gray-900 text-white">Save Changes</Button>
    </div>
  );

  const renderBanking = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Bank & Payout Details</h2>

      {/* Bank Account */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <Building2 size={18} /> Bank Account
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-1 text-gray-500 font-medium uppercase">Account Number</label>
            <Input defaultValue="XXXXXXXXXX1234" className="bg-gray-50 mb-2" />
          </div>
          <div>
            <label className="block text-xs mb-1 text-gray-500 font-medium uppercase">IFSC Code</label>
            <Input defaultValue="HDFC0001234" className="bg-gray-50" />
          </div>
        </div>
      </div>

      {/* GST Info */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <FileText size={18} /> GST Information
        </h3>
        <div>
          <label className="block text-xs mb-1 text-gray-500 font-medium uppercase">GST Number</label>
          <Input defaultValue="29ABCDE1234F1Z5" className="bg-gray-50" />
        </div>
      </div>

      {/* Payout Details */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
        <h3 className="text-base font-bold mb-3 flex items-center gap-2">
          <CreditCard size={18} /> Payout Schedule
        </h3>
        <div className="text-sm text-gray-600">
          <p>Payouts are processed weekly on <span className="font-bold text-gray-900">Mondays</span>.</p>
          <p className="mt-1">Next payout: <span className="font-bold text-green-600">Jan 08, 2026</span></p>
        </div>
      </div>

      <Button onClick={() => setCurrentView("main")} className="w-full h-12 bg-gray-900 text-white">Save Banking Details</Button>
    </div>
  );

  const renderBusiness = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Business Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Business Name</label>
          <Input defaultValue="FitZone Enterprise" className="h-11" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-gray-700 font-medium">Business Address</label>
          <Textarea defaultValue="Office 201, Tech Park, Bangalore" className="h-24" />
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
      <div className="space-y-3">
        <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm">
          <span className="font-medium">Contact Support</span>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm">
          <span className="font-medium">FAQs</span>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm">
          <span className="font-medium">Privacy Policy</span>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
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
      <Button onClick={() => setCurrentView("main")} variant="outline" className="w-full h-12 border-gray-300">Back</Button>
    </div>
  );

  /* --- Main View --- */
  if (currentView === "main") {
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
                RS
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Rahul Sharma</h2>
                <p className="text-sm text-gray-600 mb-3">Premium Account</p>
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
                <span>owner@gymkaana.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} />
                <span>Delhi NCR, India</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
            <h3 className="text-base font-bold mb-4">Your Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold mb-1">3</p>
                <p className="text-xs text-gray-500">Total Gyms</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold mb-1">448</p>
                <p className="text-xs text-gray-500">Total Members</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-600 mb-1">₹1.2L</p>
                <p className="text-xs text-gray-500">This Month</p>
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
            <p className="text-xs text-gray-400">Gymkaana Owner v1.0.0</p>
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
        {currentView === "banking" && renderBanking()}
        {currentView === "business" && renderBusiness()}
        {currentView === "help" && renderHelp()}
        {currentView === "settings" && renderSettings()}
      </div>
    </div>
  );
}
