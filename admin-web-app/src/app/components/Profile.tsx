import { User, Building2, CreditCard, HelpCircle, Settings, LogOut, ChevronRight, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface ProfileProps {
  onLogout: () => void;
}

export function Profile({ onLogout }: ProfileProps) {
  const menuSections = [
    {
      title: "Business",
      items: [
        { icon: Building2, label: "Business Profile", badge: null },
        { icon: CreditCard, label: "Bank & Payout Details", badge: null },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", badge: null },
        { icon: Settings, label: "Settings", badge: null },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
        <h1 className="text-xl">Profile & Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-base mb-1">Fitness Owner</h2>
              <p className="text-sm text-gray-600 mb-3">Premium Account</p>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-2 border-gray-300"
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
          <h3 className="text-base mb-4">Your Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl mb-1">3</p>
              <p className="text-xs text-gray-500">Total Gyms</p>
            </div>
            <div className="text-center">
              <p className="text-xl mb-1">448</p>
              <p className="text-xs text-gray-500">Total Members</p>
            </div>
            <div className="text-center">
              <p className="text-xl mb-1">₹1.2L</p>
              <p className="text-xs text-gray-500">This Month</p>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-sm text-gray-600 mb-3 px-2">{section.title}</h3>
            <div className="bg-white border-2 border-gray-300 rounded-lg divide-y-2 divide-gray-300">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <item.icon size={18} className="text-gray-600" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-1 bg-gray-900 text-white rounded text-xs">
                        {item.badge}
                      </span>
                    )}
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
          className="w-full h-12 border-2 border-gray-300 text-gray-700"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>

        {/* App Version */}
        <div className="text-center pt-4">
          <p className="text-xs text-gray-400">Gymkaana Owner v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
