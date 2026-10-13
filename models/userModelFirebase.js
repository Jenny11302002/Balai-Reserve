/*
    Firebase User Model
    Balai Reserve - User Management with Firestore
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
  serverTimestamp
} from 'firebase/firestore';
import bcrypt from 'bcryptjs';

const usersCollection = collection(db, 'users');

export const User = {
  // Create new user
  async create(userData) {
    try {
      // Generate unique ID
      const userRef = doc(usersCollection);
      const userId = userRef.id;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const newUser = {
        id: userId,
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role || 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, newUser);
      return { ...newUser, createdAt: new Date(), updatedAt: new Date() };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Find user by email
  async findOne(options) {
    try {
      if (options.where && options.where.email) {
        const email = options.where.email.toLowerCase();
        const q = query(usersCollection, where('email', '==', email));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) return null;
        
        const userData = snapshot.docs[0].data();
        return { id: snapshot.docs[0].id, ...userData };
      }
      return null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  },

  // Find user by ID
  async findById(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) return null;
      
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  // Get all users
  async findAll() {
    try {
      const snapshot = await getDocs(usersCollection);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },

  // Update user
  async update(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      const updateData = {
        ...userData,
        updatedAt: serverTimestamp()
      };
      
      // Don't update password directly, use separate method
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      
      await updateDoc(userRef, updateData);
      return await this.findById(userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  async delete(userId) {
    try {
      await deleteDoc(doc(db, 'users', userId));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};

// Export for compatibility
export { db as sequelize };
