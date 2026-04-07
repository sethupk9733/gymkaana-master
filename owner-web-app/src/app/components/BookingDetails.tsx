import { ArrowLeft, User, Calendar, Clock, CreditCard, MapPin, Phone, Mail, CheckCircle, XCircle, Building2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { fetchBookingById } from "../lib/api";

interface BookingDetailsProps {
  bookingId: string | number;
  onBack: () => void;
}

export function BookingDetails({ bookingId, onBack }: BookingDetailsProps) {
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      try {
        const data = await fetchBookingById(bookingId);
        setBooking(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Fetching secure booking data...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <XCircle size={40} className="text-red-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Booking Sync Error</h3>
        <p className="text-gray-500 mt-2 mb-6 text-sm">{error || "The booking detail could not be retrieved from the directory."}</p>
        <Button onClick={onBack} variant="outline" className="border-2 border-gray-300">
          Back to Bookings
        </Button>
      </div>
    );
  }

  const isConfirmed = booking.status?.toLowerCase() !== "cancelled";
  const memberName = booking.memberName || booking.userId?.name || "Unknown Member";
  const memberEmail = booking.memberEmail || booking.userId?.email || "N/A";
  const memberPhone = booking.memberPhone || booking.userId?.phoneNumber || "N/A";

  const maskEmail = (email: string) => {
    if (!email || email === "N/A") return "N/A";
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    return `${local.substring(0, 2)}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone === "N/A") return "N/A";
    return `******${phone.slice(-4)}`;
  };

  const maskedEmail = maskEmail(memberEmail);
  const maskedPhone = maskPhone(memberPhone);

  const gymName = booking.gymId?.name || booking.gym || "Gymkaana Partner";
  const gymLocation = booking.gymId?.location || booking.location || "Location not specified";
  const planName = booking.planId?.name || booking.plan || "Membership Plan";

  const generateInvoice = () => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) {
      alert('Please allow popups to generate the invoice.');
      return;
    }

    const totalAmount = Number(booking.amount) || 0;
    const gstRate = 0.18;
    const itemsPrice = totalAmount / (1 + gstRate);
    const taxPrice = totalAmount - itemsPrice;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${booking._id?.slice(-8).toUpperCase()}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: 900; font-style: italic; text-transform: uppercase; }
          .invoice-title { font-size: 32px; font-weight: bold; color: #000; text-transform: uppercase; letter-spacing: 2px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
          .label { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
          .value { font-size: 14px; font-weight: 600; color: #000; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
          .table th { text-align: left; border-bottom: 2px solid #000; padding: 12px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
          .table td { padding: 16px 0; border-bottom: 1px solid #eee; }
          .summary { display: flex; flex-direction: column; align-items: flex-end; }
          .summary-row { display: flex; justify-content: flex-end; font-size: 14px; padding: 5px 0; width: 300px; }
          .summary-label { margin-right: 20px; text-align: right; color: #666; flex: 1; }
          .summary-value { text-align: right; font-weight: 600; width: 100px; }
          .total { display: flex; justify-content: flex-end; font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 20px; margin-top: 10px; width: 300px; }
          .footer { margin-top: 60px; font-size: 10px; text-align: center; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Gymkaana Partner</div>
          <div class="invoice-title">Proforma Invoice</div>
        </div>

        <div class="grid">
          <div>
            <div class="label">Billed To</div>
            <div class="value">${memberName}</div>
            <div class="value">${maskedEmail}</div>
            <div class="value">${maskedPhone}</div>
          </div>
          <div style="text-align: right;">
            <div class="label">Invoice Details</div>
            <div class="value">Invoice #: ${booking._id?.slice(-8).toUpperCase()}</div>
            <div class="value">Date: ${new Date().toLocaleDateString()}</div>
            <div class="value">Tx ID: ${booking.transactionId || 'N/A'}</div>
            <div class="value" style="margin-top: 8px;">Payment Mode: ${booking.paymentMethod || 'Online'}</div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Period</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="font-weight: bold;">${planName}</div>
                <div style="font-size: 12px; color: #666;">${gymName}</div>
              </td>
              <td>${booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'} - ${booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}</td>
              <td style="text-align: right;">₹${itemsPrice.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-value">₹${itemsPrice.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">GST (18%)</span>
            <span class="summary-value">₹${taxPrice.toFixed(2)}</span>
          </div>
          <div class="total">
            <span style="margin-right: 20px;">Total</span>
            <span>₹${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>Gymkaana Partner Portal • Authorized Distribution</p>
          <p>Tax Details: GST Included @ 18%</p>
        </div>

        <script>
          window.print();
        </script>
      </body>
      </html>
    `;

    invoiceWindow.document.write(htmlContent);
    invoiceWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-300 px-6 py-4 sticky top-0 z-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-bold">Booking Details</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 max-w-3xl mx-auto">
        {/* Status Banner */}
        <div className={`rounded-2xl p-4 flex items-center gap-4 border-2 ${isConfirmed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          {isConfirmed ? (
            <CheckCircle className="text-green-600 w-8 h-8" />
          ) : (
            <XCircle className="text-red-600 w-8 h-8" />
          )}
          <div>
            <h3 className={`font-black uppercase tracking-widest text-[10px] ${isConfirmed ? 'text-green-900' : 'text-red-900'}`}>
              Booking {booking.status}
            </h3>
            <p className={`text-sm font-bold ${isConfirmed ? 'text-green-700' : 'text-red-700'}`}>
              {isConfirmed ? 'Subscription is verified and active.' : 'This booking has been revoked or cancelled.'}
            </p>
          </div>
        </div>

        {/* Member Information */}
        <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
            <User size={14} /> Member Profile
          </h3>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-black text-white rounded-[32px] flex items-center justify-center font-black text-3xl shadow-xl italic">
              {memberName.charAt(0)}
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none mb-1">{memberName}</h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partner ID: #{booking._id?.slice(-8).toUpperCase()}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <div className="p-1.5 bg-gray-50 rounded-lg"><Phone size={12} className="text-gray-400" /></div>
                  <span>{maskedPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                  <div className="p-1.5 bg-gray-50 rounded-lg"><Mail size={12} className="text-gray-400" /></div>
                  <span className="truncate">{maskedEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking & Plan Details */}
        <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
            <Calendar size={14} /> Subscription Terms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <DetailBox label="Membership Plan" value={planName} />
              <DetailBox label="Booking Status" value={booking.status} valueClassName={isConfirmed ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div className="space-y-4">
              <DetailBox label="Active From" value={booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'} />
              <DetailBox label="Expiry Date" value={booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'} />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <DetailBox label="Preferred Check-in Slot" value={booking.sessionTime || "Flexible Access"} icon={Clock} />
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
            <CreditCard size={14} /> Financial Audit
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transactional ID</span>
              <span className="font-mono text-xs font-bold text-gray-900 break-all ml-4">#TX-{booking.transactionId || booking._id?.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailBox label="Total Paid" value={`₹${booking.amount}`} valueClassName="text-green-600" />
              <DetailBox label="Payment Method" value={booking.paymentMethod || "Digital Transfer"} />
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-white border-2 border-gray-300 rounded-3xl p-6 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
            <MapPin size={14} /> Hub Logistics
          </h3>
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-2xl flex-shrink-0">
              <Building2 size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-black italic uppercase tracking-tighter text-gray-900">{gymName}</p>
              <p className="text-sm font-bold text-gray-500 leading-tight">{gymLocation}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={generateInvoice}
          variant="outline"
          className="w-full h-14 border-2 border-gray-300 text-gray-900 font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all rounded-2xl"
        >
          Generate Proforma Invoice
        </Button>
      </div>
    </div>
  );
}

function DetailBox({ label, value, valueClassName = "", icon: Icon }: any) {
  return (
    <div className="space-y-1">
      <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">{label}</span>
      <p className={`font-black text-gray-900 uppercase italic flex items-center gap-2 ${valueClassName}`}>
        {Icon && <Icon size={12} className="text-gray-400" />}
        {value}
      </p>
    </div>
  );
}
