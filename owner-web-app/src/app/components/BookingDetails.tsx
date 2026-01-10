import { ArrowLeft, User, Calendar, Clock, CreditCard, MapPin, Phone, Mail, CheckCircle, XCircle, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

interface BookingDetailsProps {
  bookingId: number;
  onBack: () => void;
}

export function BookingDetails({ bookingId, onBack }: BookingDetailsProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700">
          <ArrowLeft size={20} />
          <span>Booking Details</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 max-w-3xl mx-auto">
        {/* Status Banner */}
        <div className="bg-white border-2 border-green-200 bg-green-50 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" />
          <div>
            <h3 className="font-bold text-green-900">Booking Confirmed</h3>
            <p className="text-sm text-green-700">This booking is confirmed and paid for.</p>
          </div>
        </div>

        {/* Member Information */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <User size={18} />
            Member Information
          </h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
              <span className="text-xl font-bold text-gray-500">AK</span>
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <h4 className="text-lg font-bold">Amit Kumar</h4>
                <p className="text-sm text-gray-500">Member ID: #M-2024-885</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={14} className="text-gray-400" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail size={14} className="text-gray-400" />
                  <span>amit.kumar@email.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking & Plan Details */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <Calendar size={18} />
            Booking & Plan
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Booking ID</span>
                <p className="font-medium text-gray-900">#BK{bookingId.toString().padStart(4, '0')}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                <p className="font-medium text-green-600">Confirmed</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Plan Name</span>
                <p className="font-medium text-gray-900">Quarterly Gold Plan</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Total Amount</span>
                <p className="font-bold text-gray-900">₹6,500</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">Start Date</span>
                <p className="font-medium text-gray-900">Jan 02, 2026</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">End Date</span>
                <p className="font-medium text-gray-900">Apr 02, 2026</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase">Preferred Session</span>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                7:00 AM - 9:00 AM (Morning Slot)
              </p>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2">
            <CreditCard size={18} />
            Payment Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment ID</span>
              <span className="font-mono">PAY_123456789</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Payment Method</span>
              <span>UPI (Google Pay)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Date & Time</span>
              <span>Jan 01, 2026 at 10:30 PM</span>
            </div>
            <div className="pt-2 border-t border-gray-100 flex justify-between items-center font-bold text-lg">
              <span>Total Paid</span>
              <span>₹6,500</span>
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <h3 className="text-base font-bold mb-3 flex items-center gap-2">
            <MapPin size={18} />
            Location Details
          </h3>
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-blue-50 p-2 rounded-lg">
              <Building2 size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-base font-bold">FitZone Gym - Main Branch</p>
              <p className="text-sm text-gray-600">Sector 18, Noida, Delhi NCR, 201301</p>
              <a href="#" className="text-xs text-blue-600 font-medium hover:underline mt-1 inline-block">View on Maps</a>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full h-12 border-2 border-gray-300 text-gray-700 font-medium">
          Download Invoice
        </Button>
      </div>
    </div>
  );
}
