/*
    Firebase Booking Controller
    Balai Reserve - Booking Management with Firestore
*/

import { Booking } from '../models/bookingModelFirebase.js';

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
  }
};

// Get single booking
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const {
      guestName,
      contact,
      email,
      roomType,
      packageType,
      checkIn,
      checkOut,
      guests,
      checkInTime,
      requests,
      pricePerPerson,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!guestName || !contact || !email || !checkIn || !guests) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Generate booking ID
    const lastBooking = await Booking.findOne();
    let newBookingNumber = 10001;
    
    if (lastBooking && lastBooking.bookingId) {
      const lastNumber = parseInt(lastBooking.bookingId.replace('BK', ''));
      if (!isNaN(lastNumber)) {
        newBookingNumber = lastNumber + 1;
      }
    }
    
    const bookingId = 'BK' + newBookingNumber;

    // Create booking
    const booking = await Booking.create({
      bookingId,
      guestName,
      contact,
      email,
      roomType: roomType || packageType,
      packageType,
      checkIn,
      checkOut: checkOut || checkIn,
      guests,
      checkInTime: checkInTime || '14:00',
      requests: requests || '',
      pricePerPerson: pricePerPerson || 0,
      totalAmount: totalAmount || 0,
      status: 'Pending'
    });

    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully',
      booking,
      bookingId 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error creating booking', 
      error: error.message 
    });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ 
      success: true, 
      message: 'Booking updated successfully',
      booking 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating booking', 
      error: error.message 
    });
  }
};

// Update booking status
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ 
      success: true, 
      message: `Status updated to ${status}`,
      booking 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error updating status', 
      error: error.message 
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ 
      success: true, 
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting booking', 
      error: error.message 
    });
  }
};

// Get dashboard statistics
export const getStatistics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'Confirmed' });
    const pending = await Booking.countDocuments({ status: 'Pending' });
    const cancelled = await Booking.countDocuments({ status: 'Cancelled' });
    
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    // Get bookings by date for chart
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentBookings = await Booking.find({
      checkIn: { $gte: thirtyDaysAgo }
    });

    // Sort by checkIn date
    recentBookings.sort((a, b) => {
      const dateA = new Date(a.checkIn);
      const dateB = new Date(b.checkIn);
      return dateA - dateB;
    });

    res.json({
      success: true,
      statistics: {
        totalBookings,
        confirmed,
        pending,
        cancelled,
        totalRevenue,
        recentBookings
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching statistics', 
      error: error.message 
    });
  }
};
