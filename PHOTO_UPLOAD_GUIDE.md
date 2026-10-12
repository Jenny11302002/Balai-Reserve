# Photo Upload Feature - Installation & Setup Guide

## 🎯 What Has Been Implemented

Your booking system now has a complete photo upload feature where:

1. **Clients can upload photos** from their dashboard
2. **Photos are auto-sent to super admin/admin** 
3. **Clients can view their uploaded photos** in their account
4. **Super Admin can view all user uploads** (for future management)

---

## 📋 Files Created/Modified

### New Files Created:
1. **`controllers/photoController.js`** - Handles photo uploads, retrieval, and deletion
2. **`views/customer/dashbord.html`** - Client dashboard with photo upload UI

### Modified Files:
1. **`routes/index.js`** - Added photo upload routes
2. **`index.js`** - Added multer middleware for file uploads
3. **`package.json`** - Added multer dependency

---

## 🚀 Installation Steps

### Step 1: Install Dependencies
Run this command in your terminal:
```bash
npm install multer
```

### Step 2: Create Uploads Directory
The system will auto-create the uploads directory, but make sure `public/uploads/photos/` directory exists.

### Step 3: Start Your Server
```bash
npm run xian
```

---

## 📸 How to Use

### For Clients:

1. **Login** to your account at `/views/customer/dashbord.html`
2. **Upload Photos**:
   - Click "Select Photos" button
   - Or drag & drop a photo
   - Supported: JPG, PNG, GIF (Max 5MB each)
3. **View Your Photos** - All uploaded photos appear in your gallery
4. **Delete Photos** - Hover over a photo and click "✕" to delete

### For Super Admin/Admin:

To view all user uploads:
- Visit: `http://localhost:3001/api/all-photos` (API endpoint)
- All photos with user email are returned

---

## 🔗 API Endpoints

### 1. Upload Photo
**POST** `/api/upload-photo`
```
Body: FormData
- photo: File (image)
- userEmail: string

Response: { success: true, photo: {...} }
```

### 2. Get User Photos
**GET** `/api/photos?userEmail=user@email.com`
```
Response: { success: true, photos: [...], count: number }
```

### 3. Delete Photo
**DELETE** `/api/delete-photo/{photoId}`
```
Response: { success: true, message: '...' }
```

### 4. Get All Photos (Super Admin)
**GET** `/api/all-photos`
```
Response: { success: true, photos: [...], count: number }
```

---

## 📁 Folder Structure

```
project/
├── controllers/
│   ├── photoController.js ✅ NEW
│   └── ...
├── public/
│   └── uploads/
│       └── photos/ ✅ AUTO-CREATED
├── views/
│   ├── customer/
│   │   └── dashbord.html ✅ UPDATED
│   └── ...
├── routes/
│   └── index.js ✅ UPDATED
├── index.js ✅ UPDATED
└── package.json ✅ UPDATED
```

---

## 🔐 Features

✅ **Secure uploads** - Only image files allowed
✅ **File size limit** - Max 5MB per image
✅ **User association** - Each photo linked to user email
✅ **Real-time gallery** - Auto-refreshes every 5 seconds
✅ **Drag & drop** - Easy file upload interface
✅ **Photo management** - View, delete, download features
✅ **Error handling** - User-friendly error messages
✅ **Persistent storage** - Photos saved to disk

---

## 💾 Data Storage

### Photo Information Stored:
- Photo ID
- User Email
- File name (unique timestamp + random ID)
- File URL
- Upload date & time
- File size
- Original filename

### File Location:
- `/public/uploads/photos/` - Stores actual image files

### Metadata Location:
- `/data/photos.json` - Stores photo metadata (auto-created)

---

## 🎨 Client Dashboard Features

### Photo Upload Section:
- Drag & drop zone
- Click to upload button
- File type validation
- File size checking
- Progress indication

### Profile Section:
- Show user name
- Show user email
- Show total photos count
- Show join date

### Photo Gallery:
- Grid layout (responsive)
- Photo thumbnails with dates
- Delete button on hover
- Real-time updates
- Empty state message

---

## 🔧 Customization

### Change Photo Size Limit:
In `index.js`, modify:
```javascript
limits: { fileSize: 5 * 1024 * 1024 } // Current: 5MB
// Change to: 10 * 1024 * 1024 } // For 10MB
```

### Change Auto-Refresh Rate:
In `dashbord.html`, modify:
```javascript
setInterval(loadPhotos, 5000); // Current: 5 seconds
// Change to: setInterval(loadPhotos, 10000); // For 10 seconds
```

### Allowed Image Types:
In `index.js`, modify:
```javascript
const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
// Add or remove formats as needed
```

---

## 📊 Super Admin Photo Dashboard (Future Enhancement)

To create a dedicated super admin page to view all user photos:

1. Create `/views/admin-photos.html`
2. Use the `/api/all-photos` endpoint
3. Display photos with user info
4. Add filtering by user email

Example snippet for super admin dashboard:
```javascript
async function loadAllPhotos() {
    const response = await fetch('/api/all-photos');
    const data = await response.json();
    // Display data.photos with user association
}
```

---

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] Can access client dashboard
- [ ] Can upload a photo successfully
- [ ] Photo appears in gallery
- [ ] Can delete a photo
- [ ] Refreshing page still shows photos
- [ ] File type validation works
- [ ] File size validation works
- [ ] Super Admin can view all photos via API

---

## 🐛 Troubleshooting

### "Cannot find module 'multer'"
Solution: Run `npm install multer`

### "Photo upload fails"
Check:
- File size is under 5MB
- File is a real image (JPG, PNG, GIF)
- `public/uploads/photos/` directory exists

### "Photos don't persist after refresh"
Check:
- `data/photos.json` file exists
- Write permissions in the data directory

### "Can't see photos in super admin API"
Solution: Ensure `/api/all-photos` endpoint is accessible

---

## 📱 Mobile Responsive

The dashboard is fully responsive with:
- Mobile-friendly upload interface
- Touch-friendly buttons
- Responsive photo grid
- Optimized for all screen sizes

---

## 🔒 Security Considerations

Current implementation:
✅ File type validation
✅ File size limits
✅ Unique filename generation
✅ User email association

Future improvements:
- Add user authentication middleware
- Add CSRF protection
- Add rate limiting
- Scan for malicious files
- Add photo watermarking

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API endpoints
3. Check browser console for errors
4. Check server logs for backend errors

---

Generated: 2026-03-16
Version: 1.0.0
Status: Ready for Testing
