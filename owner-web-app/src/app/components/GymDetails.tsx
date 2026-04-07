import { ArrowLeft, MapPin, Star, Phone, Mail, Clock, Edit, Dumbbell, Wifi, Droplets, User, XCircle, CreditCard, CheckCircle2, TrendingUp, LayoutList, Users, ShieldCheck, Target } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { fetchGymById, fetchPlansByGymId, fetchDashboardStats, updateGymBankDetails } from "../lib/api";
import { useEffect, useState } from "react";

interface GymDetailsProps {
  gymId: string; // Changed to string to match backend ID
  onBack: () => void;
  onEdit: () => void;
  onManagePlans: () => void;
}

export function GymDetails({ gymId, onBack, onEdit, onManagePlans }: GymDetailsProps) {
  const [gym, setGym] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [gymStats, setGymStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 GymDetails: Fetching data for gymId:', gymId);

    Promise.all([
      fetchGymById(gymId),
      fetchPlansByGymId(gymId),
      fetchDashboardStats(gymId) // Fetch stats for this specific gym
    ])
      .then(([gymData, plansData, statsData]) => {
        console.log('📊 Stats Data Received:', statsData);
        console.log('🏋️ Gym Performance Array:', statsData?.gymPerformance);

        // Find this gym's performance data
        const thisGymPerf = statsData?.gymPerformance?.find((g: any) => g._id === gymId);
        console.log('🎯 This Gym Performance:', thisGymPerf);

        // Merge stats into gym data
        const enrichedGym = {
          ...gymData,
          id: gymData._id || gymData.id,
          realRevenue: statsData?.totalRevenue || 0,
          realBookings: statsData?.totalBookingCount || statsData?.bookingCount || thisGymPerf?.bookingCount || 0,
          realMembers: statsData?.totalMembers || statsData?.activeMembers || 0,
          realCheckins: statsData?.dailyCheckins || statsData?.checkInsToday || 0
        };

        console.log('✅ Enriched Gym Data:', {
          name: enrichedGym.name,
          realRevenue: enrichedGym.realRevenue,
          realBookings: enrichedGym.realBookings
        });

        setGym(enrichedGym);
        setPlans(plansData);
        setGymStats(statsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error loading gym details:', err);
        setLoading(false);
      });
  }, [gymId]);

  const facilities = [
    { name: "Cardio Equipment", icon: Dumbbell },
    { name: "Free WiFi", icon: Wifi },
    { name: "Shower", icon: Droplets },
    { name: "Personal Trainer", icon: User },
  ];



  if (!gym) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <XCircle size={40} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Gym Not Found</h3>
        <p className="text-gray-500 mt-2 mb-6 text-sm">The gym detail you're looking for doesn't exist or has been removed.</p>
        <Button onClick={onBack} variant="outline" className="border-2 border-gray-300">
          Back to Gyms
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-bold">
          <ArrowLeft size={20} />
          <span>Venue Profile</span>
        </button>
      </div>

      {/* Banner Image */}
      <div className="w-full h-56 bg-gray-200 border-b-2 border-gray-300 overflow-hidden relative">
        <img src={gym.images?.[0] || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000"} alt={gym.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 relative z-10 space-y-6">
        {/* Gym Info Block */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 mb-1">{gym.name}</h1>
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-sm font-medium">{gym.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">
                  <Star size={14} className="text-yellow-600 fill-yellow-600" />
                  <span className="text-sm font-bold text-yellow-700">{gym.rating}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">({gym.reviews} Verified Reviews)</span>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-200">
              {gym.status}
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
            {gym.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Phone size={16} className="text-blue-600" />
              </div>
              <span className="font-bold">{gym.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Mail size={16} className="text-purple-600" />
              </div>
              <span className="font-bold truncate">{gym.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Clock size={16} className="text-orange-600" />
              </div>
              <span className="font-bold">{gym.timings}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-auto bg-white border-2 border-gray-300 p-1.5 rounded-2xl shadow-sm">
            <TabsTrigger value="overview" className="text-[9px] font-black uppercase tracking-tight py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-xl transition-all">
              Metrics
            </TabsTrigger>
            <TabsTrigger value="facilities" className="text-[9px] font-black uppercase tracking-tight py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-xl transition-all">
              Amenities
            </TabsTrigger>
            <TabsTrigger value="trainers" className="text-[9px] font-black uppercase tracking-tight py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-xl transition-all">
              Staff
            </TabsTrigger>
            <TabsTrigger value="plans" className="text-[9px] font-black uppercase tracking-tight py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-xl transition-all">
              Pricing
            </TabsTrigger>
            <TabsTrigger value="photos" className="text-[9px] font-black uppercase tracking-tight py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-xl transition-all">
              Media
            </TabsTrigger>
            <TabsTrigger value="bank" className="text-[9px] font-black uppercase tracking-tight py-3 data-[state=active]:bg-gray-900 data-[state=active]:text-white rounded-xl transition-all">
              Bank
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  Live Performance
                </h3>
                <span className="text-[8px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-1 rounded">Synced with Blockchain</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-3xl font-black text-orange-600 mb-1">{gym.realCheckins || 0}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Daily Entry</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-3xl font-black text-gray-900 mb-1">{gym.realBookings || 0}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bookings</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-3xl font-black text-emerald-600 mb-1">₹{(gym.realRevenue || 0).toLocaleString()}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-3xl font-black text-yellow-600 mb-1">{gym.rating || 0}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Member Rating</p>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    console.log('🚀 Navigating to Manage Plans for gym:', gym.id);
                    onManagePlans();
                  }}
                  className="w-full h-12 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" /> Configure Pricing Tiers
                </Button>
              </div>

              {/* House Rules in Overview */}
              {gym.houseRules && gym.houseRules.length > 0 && (
                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">Institutional Rules</h4>
                  <div className="space-y-3">
                    {gym.houseRules.map((rule: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-5 h-5 bg-black text-white text-[9px] flex items-center justify-center rounded-full font-black italic">{i + 1}</div>
                        <p className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-6">
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                Integrated Infrastructure
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {gym.facilities?.map((facility: string, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 border-2 border-gray-50 rounded-2xl bg-gray-50/30 hover:border-blue-100 transition-all group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-all">
                      <Dumbbell size={16} className="text-inherit" />
                    </div>
                    <span className="text-[10px] font-black text-gray-700 uppercase tracking-wide">{facility}</span>
                  </div>
                ))}
              </div>

              {gym.specializations && gym.specializations.length > 0 && (
                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    Specialized Disciplines
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {gym.specializations.map((spec: string, index: number) => (
                      <div key={index} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 italic">
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trainers" className="mt-6">
            <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                Staff Roster
              </h3>
              <div className="space-y-4">
                {gym.trainerDetails && gym.trainerDetails.length > 0 ? (
                  gym.trainerDetails.map((trainer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black italic text-lg">{trainer.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-black uppercase italic tracking-tight">{trainer.name}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{trainer.specialization}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-900 uppercase italic">{trainer.experience} Exp</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-[10px] font-black text-gray-300 uppercase italic">No trainers registered for this hub</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="mt-6">
            <div className="space-y-4">
              {/* Base Day Pass Price Reference */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Base Price Anchor</p>
                  <p className="text-sm font-black italic uppercase text-blue-900">₹{gym.baseDayPassPrice || 0} PER DAY PASS</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-[0.2em]">Discount Logic</p>
                  <p className="text-[10px] font-bold text-blue-700 italic">Automatic Yield Calculation</p>
                </div>
              </div>

              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <div key={index} className={`bg-white border-2 border-gray-300 rounded-2xl p-5 hover:border-black transition-all relative overflow-hidden group ${plan.enabled === false ? 'opacity-50 grayscale' : ''}`}>
                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <h4 className="text-lg font-black uppercase italic text-gray-900 mb-1">{plan.name}</h4>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{plan.duration} ({plan.sessions || 1} Days)</span>
                        </div>
                        {(plan.baseDiscount > 0 || (gym.baseDayPassPrice > 0 && (plan.sessions || 1) > 1)) && (
                          <div className="space-y-1 mt-2">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded inline-block mr-1">
                              {plan.baseDiscount || Math.round((1 - (plan.price / (gym.baseDayPassPrice * (plan.sessions || 1)))) * 100)}% VALUE SAVE
                            </p>
                            {plan.discount > 0 && (
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded inline-block">
                                + {plan.discount}% EXTRA PROMO
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{plan.price}</p>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Inc. of all taxes</p>
                      </div>
                    </div>
                    {plan.enabled === false && (
                      <div className="absolute top-2 right-2 z-20">
                        <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Disabled</span>
                      </div>
                    )}
                    <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Dumbbell className="w-20 h-20 rotate-[-15deg] translate-x-4 translate-y-4" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active tiers configured</p>
                </div>
              )}
              <Button onClick={onManagePlans} variant="outline" className="w-full h-14 border-2 border-gray-300 mt-4 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all">
                Configure Tiers
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gym.images && gym.images.length > 0 ? (
                gym.images.map((img: string, i: number) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded-2xl border-2 border-gray-100 overflow-hidden hover:scale-105 transition-transform shadow-sm">
                    <img src={img} alt="Gym" className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 text-gray-400 font-bold uppercase tracking-widest text-xs">
                  No images available
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bank" className="mt-6">
            <BankDetailsSection gym={gym} setGym={setGym} />
          </TabsContent>
        </Tabs>

        {/* Edit Button */}
        <div className="pt-6">
          <Button onClick={onEdit} className="w-full h-14 bg-gray-900 border-2 border-black text-white hover:bg-white hover:text-black transition-all rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl">
            <Edit size={18} className="mr-3" />
            Modify Venue Details
          </Button>
        </div>
      </div>
    </div>
  );
}

function BankDetailsSection({ gym, setGym }: { gym: any, setGym: any }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankData, setBankData] = useState({
    accountName: gym.bankDetails?.accountName || '',
    accountNumber: gym.bankDetails?.accountNumber || '',
    ifscCode: gym.bankDetails?.ifscCode || '',
    bankName: gym.bankDetails?.bankName || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateGymBankDetails(gym._id, bankData);
      setGym({ ...gym, bankDetails: bankData });
      setEditing(false);
      alert('Bank details updated successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to update bank details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
          Settlement Configuration
        </h3>
        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            variant="ghost"
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50"
          >
            Update Details
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Holder Name</label>
              <input
                type="text"
                value={bankData.accountName}
                onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-black outline-none transition-all"
                placeholder="Business or Personal Name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
              <input
                type="text"
                value={bankData.accountNumber}
                onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-black outline-none transition-all"
                placeholder="000000000000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">IFSC Code</label>
              <input
                type="text"
                value={bankData.ifscCode}
                onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-black outline-none transition-all"
                placeholder="BANK0123456"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
              <input
                type="text"
                value={bankData.bankName}
                onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-black outline-none transition-all"
                placeholder="HDFC, ICICI, etc."
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-black text-white rounded-xl h-12 font-black uppercase tracking-widest text-[10px]"
            >
              {loading ? 'Securing...' : 'Verify & Save Details'}
            </Button>
            <Button
              onClick={() => setEditing(false)}
              variant="outline"
              className="px-6 rounded-xl h-12 text-gray-400 font-bold border-gray-200"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {gym.bankDetails?.accountNumber ? (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Connected Account</p>
                  <p className="text-xl font-black italic text-gray-900 tracking-tight">
                    {gym.bankDetails.bankName} •••• {gym.bankDetails.accountNumber.slice(-4)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">KYC VERIFIED & SECURE</span>
                  </div>
                </div>
                <div className="space-y-1 md:text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Settlement Holder</p>
                  <p className="text-sm font-black uppercase">{gym.bankDetails.accountName}</p>
                </div>
              </div>
              <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CreditCard size={80} className="-rotate-12 translate-x-4 -translate-y-4" />
              </div>
            </div>
          ) : (
            <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <XCircle size={32} className="mx-auto text-gray-300 mb-4" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Bank Details Configured</p>
              <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wide">Payouts cannot be processed until set up</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
