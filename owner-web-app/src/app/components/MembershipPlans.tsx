import { ArrowLeft, Plus, Edit, ToggleLeft, ToggleRight, Trash2, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface MembershipPlansProps {
  onBack: () => void;
  onAddPlan: () => void;
  onEditPlan: () => void;
}

export function MembershipPlans({ onBack, onAddPlan, onEditPlan }: MembershipPlansProps) {
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.price.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 mb-4">
          <ArrowLeft size={20} />
          <span>Membership Plans</span>
        </button>
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Membership Plans</h1>
            <p className="text-sm text-gray-500">Manage pricing and availability</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search plans by name or price..."
              className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4 max-w-2xl mx-auto">
        {/* Add Plan Button */}
        <Button
          onClick={onAddPlan}
          className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus size={18} className="mr-2" />
          Add New Plan
        </Button>

        {/* Plans List */}
        <div className="space-y-3">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
              <p>No plans found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white border-2 rounded-lg p-4 transition-all ${plan.enabled ? "border-gray-300 shadow-sm" : "border-gray-200 opacity-75 grayscale"
                  }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-xs text-gray-500 font-medium bg-gray-100 w-fit px-2 py-0.5 rounded-full">{plan.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{plan.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100 mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlan(plan.id)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${plan.enabled ? "text-green-700 hover:text-green-800" : "text-gray-500 hover:text-gray-600"
                        }`}
                      title={plan.enabled ? "Disable Plan" : "Enable Plan"}
                    >
                      {plan.enabled ? (
                        <ToggleRight size={28} className="text-green-600" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400" />
                      )}
                      <span>{plan.enabled ? "Active" : "Inactive"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-gray-200 hover:bg-gray-50 text-gray-700"
                      onClick={onEditPlan}
                    >
                      <Edit size={14} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this plan?')) {
                          setPlans(plans.filter(p => p.id !== plan.id));
                        }
                      }}
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
