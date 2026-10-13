/*
    Firebase Photo Controller
    Handles photo uploads with Firebase Storage and Firestore
*/

import { db, storage } from '../config/firebase.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

const photosCollection = collection(db, 'photos');

export const uploadPhoto = async (req, res) => {
    try {
        if (!req.file || !req.body.userEmail) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing file or user email' 
            });
        }

        const userEmail = req.body.userEmail;
        const fileName = `${Date.now()}-${req.file.originalname}`;
        
        // Upload to Firebase Storage
        const storageRef = ref(storage, `photos/${fileName}`);
        const metadata = {
            contentType: req.file.mimetype,
        };
        
        await uploadBytes(storageRef, req.file.buffer, metadata);
        
        // Get download URL
        const fileUrl = await getDownloadURL(storageRef);

        // Create photo document in Firestore
        const photoRef = doc(photosCollection);
        const photoId = photoRef.id;
        
        const photo = {
            id: photoId,
            userEmail: userEmail,
            fileName: fileName,
            url: fileUrl,
            uploadDate: serverTimestamp(),
            size: req.file.size,
            originalName: req.file.originalname
        };

        await setDoc(photoRef, photo);

        res.json({ 
            success: true, 
            message: 'Photo uploaded successfully',
            photo: { ...photo, uploadDate: new Date().toISOString() }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error uploading photo: ' + error.message 
        });
    }
};

export const getPhotos = async (req, res) => {
    try {
        const userEmail = req.query.userEmail;

        if (!userEmail) {
            return res.status(400).json({ 
                success: false, 
                message: 'User email is required' 
            });
        }

        // Query photos for this user
        const q = query(
            photosCollection, 
            where('userEmail', '==', userEmail),
            orderBy('uploadDate', 'desc')
        );
        
        const snapshot = await getDocs(q);
        const userPhotos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({ 
            success: true, 
            photos: userPhotos,
            count: userPhotos.length
        });
    } catch (error) {
        console.error('Get photos error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching photos' 
        });
    }
};

export const deletePhoto = async (req, res) => {
    try {
        const photoId = req.params.id;

        // Get photo document
        const photoDoc = await getDoc(doc(db, 'photos', photoId));
        
        if (!photoDoc.exists()) {
            return res.status(404).json({ 
                success: false, 
                message: 'Photo not found' 
            });
        }

        const photo = photoDoc.data();

        // Delete from Firebase Storage
        try {
            const storageRef = ref(storage, `photos/${photo.fileName}`);
            await deleteObject(storageRef);
        } catch (storageError) {
            console.error('Storage delete error:', storageError);
            // Continue even if storage delete fails
        }

        // Delete from Firestore
        await deleteDoc(doc(db, 'photos', photoId));

        res.json({ 
            success: true, 
            message: 'Photo deleted successfully' 
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting photo: ' + error.message 
        });
    }
};

export const getAllPhotos = async (req, res) => {
    try {
        // Get all photos (for admin dashboard)
        const q = query(photosCollection, orderBy('uploadDate', 'desc'));
        const snapshot = await getDocs(q);
        
        const allPhotos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json({ 
            success: true, 
            photos: allPhotos,
            count: allPhotos.length
        });
    } catch (error) {
        console.error('Get all photos error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching photos' 
        });
    }
};
