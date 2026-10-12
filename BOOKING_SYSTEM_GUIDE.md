# E-Reserve Booking System - Complete Guide

## 📋 System Overview

The E-Reserve booking system allows guests to book rooms/cottages and automatically syncs all bookings to a super admin dashboard with weekly overview and detailed reports.

---

## 🏷️ Key Features Implemented

### 1. **Guest Booking Form** (book.html)
- ✅ Check room/cottage availability by date
- ✅ Select from 7 room types (Standard, Deluxe, Cottage, Premium, Family)
- ✅ Real-time room filtering (prevents double booking)
- ✅ Automatic booking confirmation
- ✅ Booking history/view previous bookings

### 2. **Super Admin Dashboard** (dashboard.html)
- ✅ Booking Management - View, edit, add, delete bookings
- ✅ Room Management - Manage inventory and room types
- ✅ Customer List - Track all customers
- ✅ Promotions - Create and manage promotional offers
- ✅ **Weekly Overview** (NEW) - See bookings and revenue by day
- ✅ **Reports** - Detailed analytics and statistics

---

## 📊 Weekly Overview Page

**Location:** Super Admin Dashboard → Weekly Overview

Shows:
- **Daily Bookings Chart** - Bar chart of daily booking counts
- **Daily Revenue Chart** - Line chart of daily revenue trends
- **Weekly Summary Statistics:**
  - Total bookings for the week
  - Confirmed vs pending bookings
  - Total weekly revenue
  - Total guests

**Weekly Details Table:**
| Day | Date | Bookings | Confirmed | Pending | Guests | Revenue | Action |
|-----|------|----------|-----------|---------|--------|---------|--------|
| Shows each day with detailed booking information, click "View" to see individual bookings for that day |

---

## 📈 Reports Page

**Location:** Super Admin Dashboard → Reports

Shows:
- **Bookings Over Time Chart** - Line chart showing booking trends
- **Revenue Over Time Chart** - Bar chart showing revenue trends
- **Summary Statistics:**
  - Total bookings
  - Total revenue
  - Average per booking

**Customizable Date Range:**
- Last 7 days (default)
- Last 30 days
- Last 365 days (yearly)

---

## 🔄 Data Sync Flow

### Booking Creation Flow:
```
1. Guest books on book.html
   ↓
2. Booking is created with:
   - Booking ID (BK10001, BK10002, etc.)
   - Guest details (name, email, phone)
   - Room selected
   - Check-in/Check-out dates
   - Number of guests
   - Special requests
   ↓
3. Booking is synced to Super Admin Dashboard
   ↓
4. Super Admin sees booking in:
   - Booking Management page
   - Dashboard recent bookings
   - Weekly Overview (on check-in date)
   - Reports (based on date range)
```

### Storage Locations:
- **Guest Bookings:** `sessionStorage` + `localStorage` (book.html)
- **Super Admin Data:** `localStorage` with key `'ereserve_data_v1'` (dashboard.html)
- **Bookings Sync:** Automatic via `syncBookingToAdmin()` function

---

## 🛏️ Available Rooms

The system comes with 7 pre-configured room types:

| Room Type | Capacity | Price/Night | Amenities |
|-----------|----------|-------------|-----------|
| Standard Room 1 | 2 guests | ₱5,500 | WiFi, AC, Breakfast |
| Standard Room 2 | 2 guests | ₱5,500 | WiFi, AC, Breakfast |
| Deluxe Room | 3 guests | ₱8,000 | WiFi, AC, Breakfast, Mini Bar |
| Riverside Cottage | 4 guests | ₱9,000 | WiFi, AC, River View, Kitchen |
| Garden Cottage | 4 guests | ₱8,500 | WiFi, AC, Garden View, Kitchen |
| Premium Suite | 4 guests | ₱12,000 | WiFi, AC, Spa Bath, Balcony |
| Family Cottage | 6 guests | ₱15,000 | Full Kitchen, 2 Bedrooms, Living Area |

---

## 🚀 How to Use

### For Guests:

1. **Go to book.html** (landing/booking page)
2. **Select Check-in and Check-out dates**
3. **Click "Check Available Rooms & Cottages"**
4. **View available rooms** (shows only rooms not already booked)
5. **Select a room** 
6. **Fill in personal details** (name, email, phone)
7. **Add special requests** (optional)
8. **Confirm booking** → Booking ID is generated automatically
9. **View booking** in "My Bookings" section

### For Super Admin:

1. **Go to dashboard.html** (super admin portal)
2. **Select menu option:**
   - **Booking Management** → View/Edit/Add bookings
   - **Weekly Overview** → See week's bookings & revenue
   - **Reports** → View detailed analytics
   - **Room Management** → Manage inventory
   - **Customer List** → Track customers

---

## 📅 Weekly Overview Details

### What happens when you confirm a booking?

1. Booking is created with a unique ID (BK + sequential number)
2. Booking is automatically added to super admin's booking list
3. On the **check-in date**, it appears in the **Weekly Overview**
4. Revenue is calculated based on:
   - (Check-out Date - Check-in Date) = Number of nights
   - Number of nights × Room price per night = Total amount

### Example:
- Guest books Deluxe Room (₱8,000/night)
- Check-in: 2025-12-15
- Check-out: 2025-12-18
- Number of nights: 3 nights
- **Total: ₱24,000**

This booking appears in Weekly Overview on the 2025-12-15 entry with:
- +1 booking
- +₱24,000 revenue
- +3 guests

---

## 💾 Data Persistence

- **Local Storage:** All super admin data saved to browser's localStorage
- **Session Storage:** Guest bookings saved during session
- **Auto-Sync:** When guest books, data automatically syncs to super admin system
- **Backup:** Both systems keep independent backup

### To Clear All Data:
```javascript
// In browser console:
localStorage.removeItem('ereserve_data_v1');  // Clears super admin data
sessionStorage.removeItem('resortBookings');   // Clears guest session
location.reload();
```

---

## 🎯 Key Functions

### Guest Booking Page (book.html):
- `checkRoomAvailability()` - Check available rooms for dates
- `selectRoom(room)` - Select room from available options
- `submitBooking()` - Submit booking confirmation
- `syncBookingToAdmin(booking)` - Sync to admin dashboard
- `generateBookingId()` - Generate unique booking ID

### Super Admin Dashboard (dashboard.html):
- `renderWeeklyOverview()` - Show weekly overview page
- `renderWeeklyCharts()` - Render weekly charts
- `renderReportsPage()` - Show reports page
- `renderReports()` - Generate report data

---

## 📌 Important Notes

1. **Booking Confirmation:** When a booking is confirmed, it's automatically saved and synced to the admin dashboard within seconds
2. **Real-time Availability:** Room availability is calculated in real-time based on existing bookings
3. **Double-booking Prevention:** The system prevents booking the same room for overlapping dates
4. **Unique Booking IDs:** Each booking gets a unique sequential ID (BK10001, BK10002, etc.)
5. **Super Admin Access:** Only super admin can view dashboard at `/dashboard`
6. **Guest Access:** Guests can book at `/book.html` after logging in

---

## 🔐 Security Features

- ✅ Login required to access booking page
- ✅ Double booking prevention with date validation
- ✅ Guest capacity validation (room capacity check)
- ✅ Data persistence with localStorage
- ✅ Super Admin dashboard protected by session

---

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ✅ Responsive design

---

## Support & Contact

For issues or questions:
- 📧 Email: almanzajanwin@gmail.com
- 📱 Phone: 09279517955
- 🕐 Hours: Monday - Sunday, 8:00 AM - 10:00 PM

---

**Last Updated:** March 15, 2026  
**Version:** 1.0.0
