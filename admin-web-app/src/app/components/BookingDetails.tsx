import { ArrowLeft, User, Calendar, Clock, CreditCard, MapPin, Phone, Mail, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

interface BookingDetailsProps {
  bookingId: number;
  onBack: () => void;
}

export function BookingDetails({ bookingId, onBack }: BookingDetailsProps) {
  const [status, setStatus] = useState("confirmed");

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
      <div className="px-6 py-6 space-y-6">
        {/* User Info */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <h3 className="text-base mb-4">Member Information</h3>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-base mb-1">Amit Kumar</h4>
              <p className="text-sm text-gray-600 mb-2">Member since Jan 2024</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={14} />
                  <span>amit.kumar@email.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Info */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <h3 className="text-base mb-4">Booking Information</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Booking ID</span>
              <span className="text-sm">#BK{bookingId.toString().padStart(4, '0')}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Membership Type</span>
              <span className="text-sm">Quarterly Plan</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Start Date</span>
              <span className="text-sm">Jan 2, 2026</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">End Date</span>
              <span className="text-sm">Apr 2, 2026</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Session Time</span>
              <span className="text-sm">7:00 AM - 9:00 AM</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">Amount Paid</span>
              <span className="text-base">₹6,500</span>
            </div>
          </div>
        </div>

        {/* Gym Location */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <h3 className="text-base mb-3">Gym Location</h3>
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm">FitZone Gym</p>
              <p className="text-sm text-gray-600">Sector 18, Noida, Delhi NCR</p>
            </div>
          </div>
        </div>

        {/* Status Selector */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
          <h3 className="text-base mb-3">Status</h3>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-11 border-2 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        {status === "pending" && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 border-2 border-gray-300"
            >
              <XCircle size={18} className="mr-2" />
              Reject
            </Button>
            <Button className="h-12 bg-gray-900 text-white hover:bg-gray-800">
              <CheckCircle size={18} className="mr-2" />
              Confirm
            </Button>
          </div>
        )}

        {status !== "pending" && (
          <Button variant="outline" className="w-full h-12 border-2 border-gray-300">
            Contact Member
          </Button>
        )}
      </div>
    </div>
  );
}
