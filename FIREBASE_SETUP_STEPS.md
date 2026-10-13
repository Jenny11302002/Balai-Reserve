# Firebase Setup - Step by Step

## ✅ Files Created:

1. ✅ `config/firebase.js` - Firebase initialization
2. ✅ `models/userModelFirebase.js` - User model
3. ✅ `models/bookingModelFirebase.js` - Booking model
4. ✅ `controllers/authControllerFirebase.js` - Auth controller
5. ✅ `controllers/bookingControllerFirebase.js` - Booking controller
6. ✅ `controllers/photoControllerFirebase.js` - Photo controller
7. ✅ `.env` - Updated with Firebase config template

---

## 📋 What YOU Need to Do Now:

### **STEP 1: Create Firebase Project** (5 minutes)

1. Go to: https://console.firebase.google.com
2. Click **"Add project"**
3. Project name: `balai-reserve`
4. **Disable** Google Analytics (optional - you can skip it)
5. Click **"Create project"**
6. Wait 30-60 seconds

---

### **STEP 2: Enable Firestore Database** (2 minutes)

1. In Firebase Console, click **"Build"** in left menu
2. Click **"Firestore Database"**
3. Click **"Create database"**
4. Select **"Start in production mode"** (safer)
5. Choose location: **asia-southeast1 (Singapore)** or **asia-northeast1 (Tokyo)**
6. Click **"Enable"**
7. Wait for database creation

---

### **STEP 3: Setup Firestore Security Rules** (2 minutes)

1. In Firestore Database, click **"Rules"** tab
2. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to all for development
    // TODO: Tighten security for production
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

**Note:** This is permissive for development. For production, you should add proper authentication checks.

---

### **STEP 4: Enable Firebase Storage** (2 minutes)

1. In Firebase Console, click **"Build"** → **"Storage"**
2. Click **"Get started"**
3. Click **"Next"** (keep default rules for now)
4. Choose location: **asia-southeast1 (Singapore)**
5. Click **"Done"**

---

### **STEP 5: Get Firebase Configuration** (3 minutes)

1. In Firebase Console, click gear icon ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to register a web app
4. App nickname: `Balai Reserve Web`
5. **DO NOT** check "Firebase Hosting" (we're using Hostinger)
6. Click **"Register app"**
7. You'll see firebaseConfig - **COPY ALL VALUES**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",                          // ← COPY THIS
  authDomain: "balai-reserve.firebaseapp.com",  // ← COPY THIS
  projectId: "balai-reserve",                   // ← COPY THIS
  storageBucket: "balai-reserve.appspot.com",   // ← COPY THIS
  messagingSenderId: "123456789",              // ← COPY THIS
  appId: "1:123456789:web:abc123"              // ← COPY THIS
};
```

8. Click **"Continue to console"**

---

### **STEP 6: Update .env File** (2 minutes)

Open your `.env` file and paste your Firebase credentials:

```env
# Firebase Configuration
FIREBASE_API_KEY=AIzaSy...your_actual_key_here
FIREBASE_AUTH_DOMAIN=balai-reserve.firebaseapp.com
FIREBASE_PROJECT_ID=balai-reserve
FIREBASE_STORAGE_BUCKET=balai-reserve.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123

# Server Configuration
PORT=3001
NODE_ENV=production
SESSION_SECRET=B4l41R3s3rv3_2025_Fireb4se_S3cr3t
```

**IMPORTANT:** Replace ALL the values with your actual Firebase config!

---

### **STEP 7: Install Firebase Packages** (5 minutes)

When your internet is stable, run:

```bash
npm install firebase firebase-admin
```

If you get SSL errors:

```bash
npm config set strict-ssl false
npm install firebase firebase-admin
npm config set strict-ssl true
```

Or try using your mobile hotspot if WiFi has issues.

---

### **STEP 8: Update Import Statements** (Manual)

You need to update your files to use the Firebase versions:

#### **Update `routes/index.js` or wherever you import controllers:**

**BEFORE:**
```javascript
import { loginUser, registerUser } from '../controllers/authController.js';
```

**AFTER:**
```javascript
import { loginUser, registerUser } from '../controllers/authControllerFirebase.js';
```

#### **Do the same for:**
- Booking controller imports
- Photo controller imports
- User model imports

---

### **STEP 9: Update index.js** (Remove Sequelize)

Open `index.js` and remove/comment out:

```javascript
// REMOVE OR COMMENT OUT:
// import { sequelize } from "./models/userModel.js";
// await sequelize.sync();
```

---

### **STEP 10: Test Locally** (Optional)

If you want to test before deploying:

```bash
npm start
```

Then try:
- Register a new user
- Login
- Create a booking
- Upload a photo

Check Firebase Console to see if data appears in Firestore!

---

### **STEP 11: Deploy to Hostinger**

1. **Upload files via File Manager or Git:**
   - Upload all new Firebase files
   - Upload updated `.env` with Firebase credentials

2. **SSH into Hostinger:**
   ```bash
   cd ~/domains/balai-reserve.online/public_html/app/
   npm install firebase firebase-admin
   ```

3. **Restart app:**
   ```bash
   pm2 restart all
   ```

4. **Test your website:**
   - Visit: https://balai-reserve.online
   - Try registering/logging in
   - Check Firebase Console for data

---

## 🔒 Firebase Storage Rules

After testing, update Storage rules for security:

1. Go to **Storage** → **Rules**
2. Update to:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{fileName} {
      // Allow anyone to read photos
      allow read: if true;
      
      // Only authenticated users can upload
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📊 Check Your Firebase Usage

Firebase Free Plan Limits:
- **Firestore**: 1 GB storage, 50k reads/day, 20k writes/day, 20k deletes/day
- **Storage**: 5 GB, 1 GB/day downloads, 50k/day uploads
- **Authentication**: Unlimited

Monitor usage in: Firebase Console → Usage tab

---

## ✅ Success Checklist

- [ ] Firebase project created
- [ ] Firestore database enabled
- [ ] Firebase Storage enabled
- [ ] Security rules set (permissive for dev)
- [ ] Firebase config copied to `.env`
- [ ] Firebase packages installed (`npm install`)
- [ ] Routes updated to use Firebase controllers
- [ ] Old Sequelize/MySQL code removed
- [ ] Tested locally (optional)
- [ ] Deployed to Hostinger
- [ ] Website working with Firebase!

---

## 🆘 Troubleshooting

### "Firebase not installed"
```bash
npm install firebase firebase-admin
```

### "Permission denied" in Firestore
- Check Firestore Security Rules
- Make sure rules allow read/write for testing

### Photos not uploading
- Check Storage is enabled
- Check Storage rules allow write

### App crashes on start
- Check `.env` has correct Firebase credentials
- Check all Firebase controllers are imported correctly
- Check `config/firebase.js` is being imported

---

## 🎯 Next Steps After It Works

1. **Tighten security rules** (add authentication checks)
2. **Add data validation** in Firestore rules
3. **Set up Firebase Authentication** (optional - for built-in auth)
4. **Enable Firebase Analytics** (optional)
5. **Set up monitoring** and alerts

---

**Your app is now using Firebase! No more MySQL needed! 🎉**
