/*
    Firebase Booking Model
    Balai Reserve - Booking Management with Firestore
*/

import { db } from '../config/firebase.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

const bookingsCollection = collection(db, 'bookings');

export const Booking = {
  // Find all bookings
  async find(filter = {}) {
    try {
      let q = query(bookingsCollection);
      
      // Apply filters
      if (filter.status) {
        q = query(bookingsCollection, where('status', '==', filter.status));
      }
      
      if (filter.checkIn && filter.checkIn.$gte) {
        q = query(bookingsCollection, where('checkIn', '>=', filter.checkIn.$gte));
      }
      
      // Sort by createdAt descending
      q = query(q, orderBy('createdAt', 'desc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        _id: doc.id, 
        id: doc.id, 
        ...doc.data() 
      }));
    } catch (error) {
      console.error('Error finding bookings:', error);
      throw error;
    }
  },

  // Find booking by ID
  async findById(bookingId) {
    try {
      const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
      
      if (!bookingDoc.exists()) return null;
      
      return { 
        _id: bookingDoc.id, 
        id: bookingDoc.id, 
        ...bookingDoc.data() 
      };
    } catch (error) {
      console.error('Error finding booking by ID:', error);
      throw error;
    }
  },

  // Find one booking with query
  async findOne(filter = {}) {
    try {
      let q = bookingsCollection;
      
      if (filter.bookingId) {
        q = query(bookingsCollection, where('bookingId', '==', filter.bookingId));
      }
      
      // Add order by descending
      q = query(q, orderBy('bookingId', 'desc'), limit(1));
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      return { 
        _id: snapshot.docs[0].id, 
        id: snapshot.docs[0].id, 
        ...snapshot.docs[0].data() 
      };
    } catch (error) {
      console.error('Error finding one booking:', error);
      return null;
    }
  },

  // Create new booking
  async create(bookingData) {
    try {
      const bookingRef = doc(bookingsCollection);
      const bookingId = bookingRef.id;
      
      const newBooking = {
        bookingId: bookingData.bookingId,
        guestName: bookingData.guestName,
        contact: bookingData.contact,
        email: bookingData.email,
        roomType: bookingData.roomType || bookingData.packageType,
        packageType: bookingData.packageType || '',
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut || bookingData.checkIn,
        guests: bookingData.guests,
        checkInTime: bookingData.checkInTime || '14:00',
        requests: bookingData.requests || '',
        pricePerPerson: bookingData.pricePerPerson || 0,
        totalAmount: bookingData.totalAmount || 0,
        status: bookingData.status || 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(bookingRef, newBooking);
      
      return { 
        _id: bookingId, 
        id: bookingId, 
        ...newBooking,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Find by ID and update
  async findByIdAndUpdate(bookingId, updateData, options = {}) {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      
      const dataToUpdate = {
        ...updateData.$set || updateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(bookingRef, dataToUpdate);
      
      if (options.new) {
        return await this.findById(bookingId);
      }
      
      return { _id: bookingId, id: bookingId, ...dataToUpdate };
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Find by ID and delete
  async findByIdAndDelete(bookingId) {
    try {
      const booking = await this.findById(bookingId);
      if (!booking) return null;
      
      await deleteDoc(doc(db, 'bookings', bookingId));
      return booking;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // Count documents
  async countDocuments(filter = {}) {
    try {
      let q = bookingsCollection;
      
      if (filter.status) {
        q = query(bookingsCollection, where('status', '==', filter.status));
      }
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error counting bookings:', error);
      throw error;
    }
  },

  // Save method (for new bookings)
  save: async function() {
    // This is called on booking instances
    // We'll handle this in the create method instead
    throw new Error('Use Booking.create() instead of save()');
  }
};

export default Booking;
