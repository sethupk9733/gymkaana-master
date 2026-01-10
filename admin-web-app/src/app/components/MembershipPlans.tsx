import { ArrowLeft, Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface MembershipPlansProps {
  onBack: () => void;
}

export function MembershipPlans({ onBack }: MembershipPlansProps) {
  const [plans, setPlans] = useState([
    { id: 1, name: "Daily Pass", price: "₹150", duration: "1 Day", enabled: true },
    { id: 2, name: "Weekly Pass", price: "₹800", duration: "7 Days", enabled: true },
    { id: 3, name: "Monthly", price: "₹2,500", duration: "30 Days", enabled: true },
    { id: 4, name: "Quarterly", price: "₹6,500", duration: "90 Days", enabled: true },
    { id: 5, name: "Half Yearly", price: "₹11,000", duration: "180 Days", enabled: false },
    { id: 6, name: "Yearly", price: "₹20,000", duration: "365 Days", enabled: true },
  ]);

  const togglePlan = (id: number) => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, enabled: !plan.enabled } : plan
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 mb-4">
          <ArrowLeft size={20} />
          <span>Membership Plans</span>
        </button>
        <p className="text-sm text-gray-500">Manage pricing and availability</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4">
        {/* Add Plan Button */}
        <Button className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800">
          <Plus size={18} className="mr-2" />
          Add New Plan
        </Button>

        {/* Plans List */}
        <div className="space-y-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border-2 rounded-lg p-4 ${
                plan.enabled ? "border-gray-300" : "border-gray-200 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-500">{plan.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl">{plan.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePlan(plan.id)}
                    className={`flex items-center gap-2 text-sm ${
                      plan.enabled ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {plan.enabled ? (
                      <ToggleRight size={24} className="text-gray-900" />
                    ) : (
                      <ToggleLeft size={24} className="text-gray-400" />
                    )}
                    <span>{plan.enabled ? "Enabled" : "Disabled"}</span>
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-2 border-gray-300"
                >
                  <Edit size={14} className="mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
