import { ArrowLeft, Plus, Edit, ToggleLeft, ToggleRight, Trash2, Search, Loader2, Zap, CheckSquare, Square, Percent } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { fetchPlansByGymId, deletePlan, updatePlan } from "../lib/api";

interface MembershipPlansProps {
  gymId: string;
  onBack: () => void;
  onAddPlan: () => void;
  onEditPlan: (id: string) => void;
}

export function MembershipPlans({ gymId, onBack, onAddPlan, onEditPlan }: MembershipPlansProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [bulkDiscountMode, setBulkDiscountMode] = useState(false);
  const [bulkDiscountValue, setBulkDiscountValue] = useState("");

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await fetchPlansByGymId(gymId);
        setPlans(data);
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, [gymId]);

  const toggleSelection = (id: string) => {
    setSelectedPlans(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBulkDiscount = async () => {
    const discount = Number(bulkDiscountValue);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      alert("Please enter a valid discount percentage (0-100)");
      return;
    }

    if (!confirm(`Apply extra ${discount}% discount to ${selectedPlans.length} plans?`)) return;

    setLoading(true);
    try {
      await Promise.all(selectedPlans.map(id => updatePlan(id, { discount })));
      setPlans(plans.map(p => selectedPlans.includes(p._id) ? { ...p, discount } : p));
      setSelectedPlans([]);
      setBulkDiscountMode(false);
      setBulkDiscountValue("");
      alert("Bulk discount applied successfully");
    } catch (err) {
      alert("Failed to apply bulk discount");
    } finally {
      setLoading(false);
    }
  };

  const togglePlan = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await updatePlan(id, { enabled: newStatus });
      setPlans(plans.map(plan =>
        plan._id === id ? { ...plan, enabled: newStatus } : plan
      ));
    } catch (err) {
      console.error("Failed to toggle plan status:", err);
      alert("Failed to update plan status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan(id);
        setPlans(plans.filter(p => p._id !== id));
      } catch (err) {
        alert("Failed to delete plan");
      }
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(plan.price).includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="px-6 py-6 space-y-4 max-w-2xl mx-auto pb-32">
        {selectedPlans.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
            <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-2xl border border-gray-800 flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">{selectedPlans.length} Selected</p>
                {bulkDiscountMode ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="%"
                      className="w-16 h-8 bg-gray-800 border-gray-700 text-white text-xs"
                      value={bulkDiscountValue}
                      onChange={(e) => setBulkDiscountValue(e.target.value)}
                    />
                    <Button size="sm" className="h-8 text-[10px] font-black" onClick={handleBulkDiscount}>APPLY</Button>
                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black hover:bg-white/10" onClick={() => setBulkDiscountMode(false)}>ESC</Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" className="h-8 text-[10px] font-black gap-1" onClick={() => setBulkDiscountMode(true)}>
                      <Percent size={12} /> BULK DISCOUNT
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black opacity-50" onClick={() => setSelectedPlans([])}>CLEAR</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={onAddPlan}
          className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 rounded-xl"
        >
          <Plus size={18} className="mr-2" />
          Add New Plan
        </Button>

        <div className="space-y-3">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
              <p>No plans found matching "{searchQuery}"</p>
            </div>
          ) : (
            filteredPlans.map((plan) => (
              <div
                key={plan._id}
                onClick={() => toggleSelection(plan._id)}
                className={`group relative bg-white border-2 rounded-2xl p-4 transition-all cursor-pointer hover:border-primary/50 ${plan.enabled !== false ? "border-gray-200 shadow-sm" : "border-gray-100 opacity-60 grayscale"
                  } ${selectedPlans.includes(plan._id) ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20" : ""}`}
              >
                <div className="absolute top-4 left-4">
                  {selectedPlans.includes(plan._id) ? (
                    <CheckSquare className="w-5 h-5 text-primary fill-primary/10" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-300 group-hover:text-gray-400" />
                  )}
                </div>

                <div className="pl-8">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-black uppercase italic tracking-tight text-gray-900">{plan.name}</h3>
                        {plan.discount > 0 && (
                          <span className="bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Percent size={8} /> {plan.discount}% EXTRA
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{plan.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-gray-900 italic tracking-tighter">₹{plan.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePlan(plan._id, plan.enabled !== false); }}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${plan.enabled !== false ? "text-green-700 hover:text-green-800" : "text-gray-500 hover:text-gray-600"
                          }`}
                        title={plan.enabled !== false ? "Disable Plan" : "Enable Plan"}
                      >
                        {plan.enabled !== false ? (
                          <ToggleRight size={24} className="text-green-600" />
                        ) : (
                          <ToggleLeft size={24} className="text-gray-400" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest">{plan.enabled !== false ? "Live" : "Disabled"}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                        onClick={(e) => { e.stopPropagation(); onEditPlan(plan._id); }}
                        title="Edit Plan"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); handleDelete(plan._id); }}
                        title="Delete Plan"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
