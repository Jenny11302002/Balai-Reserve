/*
    Photo Controller
    Handles photo uploads and retrieval for clients
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../public/uploads/photos');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Store photos in memory (for demo purposes)
// In production, use a database
let photos = [];
let photoIdCounter = 1;

export const uploadPhoto = (req, res) => {
    try {
        if (!req.file || !req.body.userEmail) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing file or user email' 
            });
        }

        const userEmail = req.body.userEmail;
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const fileUrl = `/uploads/photos/${fileName}`;

        // Create photo record
        const photo = {
            id: photoIdCounter++,
            userEmail: userEmail,
            fileName: fileName,
            url: fileUrl,
            uploadDate: new Date().toISOString(),
            size: req.file.size,
            originalName: req.file.originalname
        };

        photos.push(photo);

        // Save to in-memory database simulation
        savePhotosToFile();

        res.json({ 
            success: true, 
            message: 'Photo uploaded successfully',
            photo: photo
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error uploading photo: ' + error.message 
        });
    }
};

export const getPhotos = (req, res) => {
    try {
        const userEmail = req.query.userEmail;

        if (!userEmail) {
            return res.status(400).json({ 
                success: false, 
                message: 'User email is required' 
            });
        }

        // Load photos from file
        loadPhotosFromFile();

        // Filter photos for this user
        const userPhotos = photos.filter(p => p.userEmail === userEmail)
            .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

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

export const deletePhoto = (req, res) => {
    try {
        const photoId = parseInt(req.params.id);

        // Load photos from file
        loadPhotosFromFile();

        // Find photo
        const photoIndex = photos.findIndex(p => p.id === photoId);
        if (photoIndex === -1) {
            return res.status(404).json({ 
                success: false, 
                message: 'Photo not found' 
            });
        }

        const photo = photos[photoIndex];

        // Delete file from disk
        const filePath = path.join(__dirname, '../public', photo.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove from array
        photos.splice(photoIndex, 1);
        savePhotosToFile();

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

export const getAllPhotos = (req, res) => {
    try {
        // Load photos from file
        loadPhotosFromFile();

        // Return all photos (for admin dashboard)
        const allPhotos = photos.sort((a, b) => 
            new Date(b.uploadDate) - new Date(a.uploadDate)
        );

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

// Helper functions to persist photos
function savePhotosToFile() {
    try {
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const filePath = path.join(dataDir, 'photos.json');
        fs.writeFileSync(filePath, JSON.stringify(photos, null, 2));
    } catch (error) {
        console.error('Error saving photos to file:', error);
    }
}

function loadPhotosFromFile() {
    try {
        const filePath = path.join(__dirname, '../data/photos.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            photos = JSON.parse(data);
            
            // Update counter
            if (photos.length > 0) {
                photoIdCounter = Math.max(...photos.map(p => p.id)) + 1;
            }
        }
    } catch (error) {
        console.error('Error loading photos from file:', error);
    }
}

// Load photos on startup
loadPhotosFromFile();
