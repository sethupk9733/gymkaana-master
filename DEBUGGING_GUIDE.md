# Debugging Guide - Payment & Booking Issues

## Changes Made

### 1. Backend - Booking Model
**File**: `backend-api/models/Booking.js`
- Added `{ timestamps: true }` to enable automatic `createdAt` and `updatedAt` fields
- This fixes the sorting issue in the Dashboard

### 2. Web App - Dashboard
**File**: `marketplace-web-app/src/app/components/DashboardScreen.tsx`
- Added comprehensive console logging to track:
  - Booking fetch process
  - Number of bookings received
  - Active booking selection
  - Active pass creation
- Logs will show in browser console

### 3. Mobile App - Dashboard
**File**: `marketplace-app/src/app/components/DashboardScreen.tsx`
- Added same comprehensive logging as web
- Logs will show in browser console (when running in browser)

### 4. Web Payment Screen
**File**: `marketplace-web-app/src/app/components/PaymentScreen.tsx`
- Added detailed logging before booking creation
- Added success logging after booking creation
- Added detailed error logging with stack traces
- Reduced animation delays (800ms + 1200ms = 2 seconds total)

### 5. Mobile Payment Screen
**File**: `marketplace-app/src/app/components/PaymentScreen.tsx`
- Added same comprehensive logging as web
- Reduced animation delays to match web

## How to Debug

### Step 1: Check Browser Console
Open the browser console (F12) and look for these logs:

**When viewing Dashboard:**
```
Dashboard: Fetching bookings...
Dashboard: Received bookings: [array of bookings]
Dashboard: Number of bookings: X
Dashboard: Active booking: {booking object}
Dashboard: Active Pass: {pass object}
```

**When making a payment:**
```
Web Payment: Creating booking with data: {booking data}
Web Payment: Booking created successfully: {response}
Payment Successful, navigating to Success screen
```

### Step 2: Check for Errors
If you see errors, they will show:
- The error message
- The stack trace
- The full error object

### Step 3: Common Issues

#### Issue: "No Active Membership" showing on Dashboard
**Possible causes:**
1. No bookings exist for the user
2. All bookings have status 'completed' or 'cancelled'
3. Booking fetch failed (check console for error)

**Solution:**
- Check console logs to see what bookings were received
- Verify booking status is 'upcoming' or 'active'
- Check if user is logged in (check localStorage for 'gymkaana_token')

#### Issue: "Payment failed" on mobile
**Possible causes:**
1. Invalid gymId or planId
2. Missing authentication token
3. Backend API not responding
4. Network error

**Solution:**
- Check console logs for detailed error message
- Verify the booking data being sent (logged before API call)
- Check if backend is running on http://localhost:5000
- Verify user is logged in

#### Issue: Payment completes but doesn't show in Dashboard
**Possible causes:**
1. Booking created with wrong status
2. Booking not populated with gym/plan data
3. Dashboard not refreshing

**Solution:**
- Check console to see if booking was created successfully
- Verify booking status is 'upcoming' or 'active'
- Try refreshing the Dashboard page
- Check backend database to see if booking exists

### Step 4: Test Flow
1. **Login** - Check console for user data
2. **Select Gym** - Note the gymId
3. **Select Plan** - Note the planId
4. **Checkout** - Verify date selection
5. **Payment** - Watch console for booking creation logs
6. **Success** - Verify booking data is shown
7. **Dashboard** - Check if active pass appears

## Backend Restart Required
After the Booking model change, you MUST restart the backend server:
```bash
# Stop the current backend (Ctrl+C)
# Then restart:
cd "c:\Users\sethu\OneDrive\Desktop\gymkaana owner\backend-api"
npm run dev
```

## Testing Checklist
- [ ] Backend restarted after model change
- [ ] User can login successfully
- [ ] User can select a gym and plan
- [ ] Payment screen shows correct price
- [ ] Payment completes without errors
- [ ] Success screen shows booking details
- [ ] Dashboard shows active pass
- [ ] Active pass shows correct gym name, plan, dates
- [ ] QR code is generated
- [ ] Venue guide shows house rules and facilities

## Console Log Examples

### Successful Payment Flow:
```
Web Payment: Creating booking with data: {...}
Starting authenticating step...
Starting bank processing step...
Web Payment: Booking created successfully: {...}
Payment Successful, navigating to Success screen {...}
```

### Failed Payment Flow:
```
Web Payment: Creating booking with data: {...}
Starting authenticating step...
Starting bank processing step...
Payment failed during booking creation: Error: Failed to create booking
Web Payment error details: {
  message: "Failed to create booking",
  stack: "...",
  error: {...}
}
```

### Dashboard Loading:
```
Dashboard: Fetching bookings...
Dashboard: Received bookings: [{...}, {...}]
Dashboard: Number of bookings: 2
Dashboard: Active booking: {...}
Dashboard: Active Pass: {...}
```
