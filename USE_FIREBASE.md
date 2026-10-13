# Quick Switch to Firebase

## Summary of Changes Needed

To activate Firebase in your app, you need to make these changes:

---

## 1. Update `routes/index.js`

Find and replace the controller imports:

### **FIND:**
```javascript
import { 
  loginPage, 
  dashboardPage, 
  loginUser, 
  registerUser, 
  logoutUser,
  registerPage,
  forgotPasswordPage,
  resetPasswordRequest,
  resetPassword
} from "../controllers/authController.js";
```

### **REPLACE WITH:**
```javascript
import { 
  loginPage, 
  dashboardPage, 
  loginUser, 
  registerUser, 
  logoutUser,
  registerPage,
  forgotPasswordPage,
  resetPasswordRequest,
  resetPassword
} from "../controllers/authControllerFirebase.js";
```

### **IF you have booking routes, FIND:**
```javascript
import { 
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateStatus,
  deleteBooking,
  getStatistics
} from '../controllers/bookingController.js';
```

### **REPLACE WITH:**
```javascript
import { 
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateStatus,
  deleteBooking,
  getStatistics
} from '../controllers/bookingControllerFirebase.js';
```

### **IF you have photo routes, FIND:**
```javascript
import {
  uploadPhoto,
  getPhotos,
  deletePhoto,
  getAllPhotos
} from '../controllers/photoController.js';
```

### **REPLACE WITH:**
```javascript
import {
  uploadPhoto,
  getPhotos,
  deletePhoto,
  getAllPhotos
} from '../controllers/photoControllerFirebase.js';
```

---

## 2. Update `index.js`

### **FIND and REMOVE/COMMENT OUT:**
```javascript
import { sequelize } from "./models/userModel.js";

// Later in the file:
try {
  await sequelize.sync();
} catch (err) {
  console.error("⚠️  Database connection failed...", err.message);
}
```

### **REPLACE WITH:**
```javascript
// Firebase is now handling database - no sync needed!
console.log("🔥 Using Firebase as database");
```

---

## 3. Update Package.json Scripts (Optional)

Remove MySQL-related scripts:

### **REMOVE:**
```json
"migrate": "node migrate.js"
```

### **ADD:**
```json
"firebase": "firebase",
"deploy": "firebase deploy"
```

---

## Quick Command Reference

### After completing Firebase setup, install:
```bash
npm install firebase firebase-admin
```

### Start your app:
```bash
npm start
```

### Deploy to Hostinger:
```bash
# Upload files
git add .
git commit -m "Switch to Firebase"
git push

# SSH to Hostinger
ssh your-hostinger-account
cd ~/domains/balai-reserve.online/public_html/app/
npm install firebase firebase-admin
pm2 restart all
```

---

## Files You Created:

✅ Firebase Controllers (new):
- `controllers/authControllerFirebase.js`
- `controllers/bookingControllerFirebase.js`
- `controllers/photoControllerFirebase.js`

✅ Firebase Models (new):
- `models/userModelFirebase.js`
- `models/bookingModelFirebase.js`

✅ Firebase Config (new):
- `config/firebase.js`

✅ Old MySQL Files (keep for backup, don't use):
- `controllers/authController.js` ← OLD
- `controllers/bookingController.js` ← OLD
- `controllers/photoController.js` ← OLD
- `models/userModel.js` ← OLD
- `models/db.js` ← OLD
- `migrate.js` ← OLD

---

## Testing Checklist

After switching to Firebase:

1. ✅ Start app locally: `npm start`
2. ✅ Open http://localhost:3001
3. ✅ Try to register a new user
4. ✅ Check Firebase Console → Firestore → users collection (should see new user)
5. ✅ Try to login
6. ✅ Try to create a booking
7. ✅ Check Firebase Console → Firestore → bookings collection
8. ✅ Try to upload a photo
9. ✅ Check Firebase Console → Storage (should see uploaded file)

---

## Rollback to MySQL (If Needed)

If Firebase doesn't work and you want to go back to MySQL:

1. In `routes/index.js`, change imports back:
   - `authControllerFirebase.js` → `authController.js`
   - `bookingControllerFirebase.js` → `bookingController.js`
   - `photoControllerFirebase.js` → `photoController.js`

2. In `index.js`, uncomment:
   ```javascript
   import { sequelize } from "./models/userModel.js";
   await sequelize.sync();
   ```

3. Update `.env` back to MySQL credentials

4. Restart app

---

**That's it! Follow FIREBASE_SETUP_STEPS.md for detailed setup instructions.**
