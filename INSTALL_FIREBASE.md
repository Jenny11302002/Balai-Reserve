# Firebase Installation - Ready to Install!

## ✅ Code Changes Complete!

I've already updated your code to use Firebase:

### **Files Updated:**
1. ✅ `routes/index.js` - Now uses Firebase controllers
2. ✅ `index.js` - Removed MySQL/Sequelize
3. ✅ `package.json` - Added Firebase & multer packages
4. ✅ `config/multer.js` - Created (for photo uploads)

### **Files Created:**
1. ✅ `config/firebase.js` - Firebase initialization
2. ✅ `models/userModelFirebase.js` - User model
3. ✅ `models/bookingModelFirebase.js` - Booking model
4. ✅ `controllers/authControllerFirebase.js` - Auth controller
5. ✅ `controllers/bookingControllerFirebase.js` - Booking controller
6. ✅ `controllers/photoControllerFirebase.js` - Photo controller

---

## 📋 What YOU Need To Do Now:

### **STEP 1: Install Packages** (When Internet Works)

Run this command in your terminal:

```bash
npm install
```

This will install:
- `firebase` (Firebase SDK)
- `firebase-admin` (Firebase Admin SDK)
- `multer` (File upload handler)

**If you get SSL errors:**
```bash
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

---

### **STEP 2: Create Firebase Project** (15 minutes)

#### A. Go to Firebase Console
- Open: https://console.firebase.google.com
- Sign in with Google account

#### B. Create Project
1. Click **"Add project"** or **"Create a project"**
2. Project name: `balai-reserve` (or any name you want)
3. Click **"Continue"**
4. **Disable Google Analytics** (optional - you can skip it)
5. Click **"Create project"**
6. Wait 30-60 seconds for project creation
7. Click **"Continue"** when ready

#### C. Enable Firestore Database
1. In left sidebar, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll relax rules for development)
4. Choose location: **asia-southeast1 (Singapore)** or **asia-northeast1 (Tokyo)**
5. Click **"Enable"**
6. Wait for database creation (30 seconds)

#### D. Update Firestore Rules (For Development)
1. Click **"Rules"** tab
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publish"**

**⚠️ Warning:** This allows anyone to read/write. For production, add proper authentication!

#### E. Enable Firebase Storage
1. In left sidebar, click **"Build"** → **"Storage"**
2. Click **"Get started"**
3. Click **"Next"** (keep default rules)
4. Choose location: **asia-southeast1 (Singapore)**
5. Click **"Done"**

#### F. Update Storage Rules (For Development)
1. Click **"Rules"** tab in Storage
2. Replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publish"**

---

### **STEP 3: Get Firebase Configuration** (5 minutes)

1. In Firebase Console, click **gear icon ⚙️** (Project Settings)
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. App nickname: `Balai Reserve Web`
5. **DO NOT** check "Also set up Firebase Hosting"
6. Click **"Register app"**

7. **COPY the configuration:**

You'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "balai-reserve.firebaseapp.com",
  projectId: "balai-reserve",
  storageBucket: "balai-reserve.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

8. Click **"Continue to console"**

---

### **STEP 4: Update .env File** (2 minutes)

Open `.env` file in your project and update with YOUR Firebase values:

```env
# Firebase Configuration - PASTE YOUR REAL VALUES HERE
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=balai-reserve.firebaseapp.com
FIREBASE_PROJECT_ID=balai-reserve
FIREBASE_STORAGE_BUCKET=balai-reserve.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Server Configuration
PORT=3001
NODE_ENV=development

# Session Secret
SESSION_SECRET=B4l41R3s3rv3_2025_Fireb4se_S3cr3t
```

**⚠️ IMPORTANT:** Replace ALL values with your actual Firebase config!

---

### **STEP 5: Test Locally** (Optional but Recommended)

```bash
npm start
```

Then open: http://localhost:3001

Try:
1. Register a new user
2. Login
3. Create a booking (if you have booking page)
4. Upload a photo

**Check Firebase Console:**
- Go to Firestore Database → Data tab
- You should see `users` collection with your new user!
- Go to Storage → Files tab
- You should see uploaded photos!

---

### **STEP 6: Deploy to Hostinger**

#### A. Upload Files

**Option 1: Via Git (Recommended)**
```bash
git add .
git commit -m "Migrated to Firebase"
git push origin main
```

**Option 2: Via File Manager**
- Login to Hostinger hPanel
- Go to File Manager
- Upload all files to your app directory

#### B. SSH to Hostinger

```bash
ssh your-username@your-server
cd ~/domains/balai-reserve.online/public_html/app/
```

#### C. Install Packages

```bash
npm install
```

This will install firebase, firebase-admin, and multer.

#### D. Update .env on Hostinger

Make sure `.env` on the server has your Firebase credentials!

#### E. Restart Application

```bash
pm2 restart all
```

Or via Hostinger Node.js Manager:
- Go to Node.js app settings
- Click "Restart"

---

### **STEP 7: Test Your Website**

1. Visit: https://balai-reserve.online
2. Try registering a new user
3. Try logging in
4. Create a booking
5. Upload a photo

**Check Firebase Console to see the data!**

---

## ✅ Success Checklist

- [ ] Ran `npm install` locally
- [ ] Created Firebase project
- [ ] Enabled Firestore Database
- [ ] Enabled Firebase Storage
- [ ] Updated Firestore rules (permissive for dev)
- [ ] Updated Storage rules (permissive for dev)
- [ ] Got Firebase configuration
- [ ] Updated `.env` with Firebase credentials
- [ ] Tested locally (optional)
- [ ] Uploaded files to Hostinger
- [ ] Ran `npm install` on Hostinger
- [ ] Updated `.env` on Hostinger
- [ ] Restarted app
- [ ] Website works!

---

## 🆘 Troubleshooting

### "Cannot find module 'firebase'"
```bash
npm install
```

### "Firebase app not initialized"
- Check `.env` has all Firebase credentials
- Check `config/firebase.js` exists

### "Permission denied" in Firestore
- Check Firestore rules allow read/write
- Use permissive rules for development first

### "Module not found" errors
- Make sure you ran `npm install`
- Check all new Firebase files are uploaded

### App crashes on start
- Check `.env` is valid
- Check Firebase credentials are correct
- Run `npm install` again

---

## 📊 Firebase Console Quick Links

After setup, bookmark these:

- **Firestore Data**: https://console.firebase.google.com/project/YOUR_PROJECT/firestore/data
- **Storage Files**: https://console.firebase.google.com/project/YOUR_PROJECT/storage
- **Usage & Billing**: https://console.firebase.google.com/project/YOUR_PROJECT/usage

---

## 💰 Firebase Free Tier Limits

You're on the FREE Spark Plan:

- **Firestore**: 1 GB storage, 50k reads/day, 20k writes/day
- **Storage**: 5 GB, 1 GB/day downloads
- **Authentication**: Unlimited users

**More than enough for your capstone project!**

---

## 🎉 You're Done!

Your app now uses Firebase instead of MySQL!

Benefits:
- ✅ No need for MySQL hosting
- ✅ Automatic backups
- ✅ Automatic scaling
- ✅ Real-time capabilities built-in
- ✅ Free forever (within limits)

**Enjoy your Firebase-powered app! 🔥**
