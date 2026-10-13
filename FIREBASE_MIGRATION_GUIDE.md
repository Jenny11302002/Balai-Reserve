# Firebase Migration Guide - Balai Reserve

## ⚠️ IMPORTANT: This is a MAJOR Rewrite!

Migrating from MySQL to Firebase requires rewriting ALL database code. Estimated time: 6-8 hours.

---

## Step 1: Create Firebase Project

1. Go to: **https://console.firebase.google.com**
2. Click **"Add project"** or **"Create a project"**
3. Project name: `balai-reserve` or `balaireserve`
4. **Enable Google Analytics**: Optional (you can skip)
5. Click **"Create project"**
6. Wait for project creation (30-60 seconds)

---

## Step 2: Setup Firestore Database

1. In your Firebase project, go to **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Choose mode:
   - **Production mode** (recommended for deployment)
   - **Test mode** (for development - anyone can read/write for 30 days)
4. Select location: **asia-southeast1 (Singapore)** or **asia-northeast1 (Tokyo)**
5. Click **"Enable"**

---

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → **"Project settings"**
2. Scroll down to **"Your apps"**
3. Click the **Web icon** (`</>`) to add a web app
4. App nickname: `Balai Reserve Web`
5. Click **"Register app"**
6. Copy the `firebaseConfig` object - you'll need these values:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "balai-reserve.firebaseapp.com",
  projectId: "balai-reserve",
  storageBucket: "balai-reserve.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## Step 4: Update .env File

```env
# Firebase Configuration
FIREBASE_API_KEY=paste_your_api_key_here
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

---

## Step 5: Install Firebase (When Network is Stable)

```bash
npm install firebase firebase-admin --strict-ssl=false
```

Or if that doesn't work:
```bash
npm config set strict-ssl false
npm install firebase firebase-admin
npm config set strict-ssl true
```

---

## Step 6: Database Structure Migration

### MySQL Tables → Firestore Collections

| MySQL Table | Firestore Collection |
|-------------|---------------------|
| `users` | `users` |
| `bookings` | `bookings` |
| `photos` | `photos` |
| `messages` | `messages` |

### Firestore Data Structure

```
users/
  └─ {userId}/
      ├─ email: string
      ├─ firstName: string
      ├─ lastName: string
      ├─ role: string ("user", "admin", "super_admin")
      ├─ phone: string
      ├─ address: string
      ├─ createdAt: timestamp
      └─ updatedAt: timestamp

bookings/
  └─ {bookingId}/
      ├─ userId: string
      ├─ checkIn: timestamp
      ├─ checkOut: timestamp
      ├─ guests: number
      ├─ totalPrice: number
      ├─ status: string ("pending", "confirmed", "cancelled")
      ├─ createdAt: timestamp
      └─ updatedAt: timestamp

photos/
  └─ {photoId}/
      ├─ title: string
      ├─ description: string
      ├─ url: string (Firebase Storage URL)
      ├─ uploadedBy: string (userId)
      ├─ createdAt: timestamp
      └─ category: string
```

---

## Step 7: Rewrite User Model

**NEW FILE: `models/userModelFirebase.js`**

```javascript
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
  where 
} from 'firebase/firestore';
import bcrypt from 'bcrypt';

const usersCollection = collection(db, 'users');

export const User = {
  // Create new user
  async create(userData) {
    const userId = doc(usersCollection).id;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const newUser = {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: hashedPassword,
      role: userData.role || 'user',
      phone: userData.phone || '',
      address: userData.address || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'users', userId), newUser);
    return newUser;
  },

  // Find user by email
  async findByEmail(email) {
    const q = query(usersCollection, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    const userData = snapshot.docs[0].data();
    return { id: snapshot.docs[0].id, ...userData };
  },

  // Find user by ID
  async findById(userId) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) return null;
    
    return { id: userDoc.id, ...userDoc.data() };
  },

  // Get all users
  async findAll() {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Update user
  async update(userId, userData) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
    return await this.findById(userId);
  },

  // Delete user
  async delete(userId) {
    await deleteDoc(doc(db, 'users', userId));
    return true;
  },

  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
};
```

---

## Step 8: Rewrite Auth Controller

**UPDATE: `controllers/authController.js`**

```javascript
import { User } from '../models/userModelFirebase.js';

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      role: 'user'
    });

    // Remove password from response
    delete newUser.password;

    req.session.user = newUser;
    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await User.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Remove password from session
    delete user.password;

    req.session.user = user;
    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};
```

---

## Step 9: Setup Firestore Security Rules

In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user data (for display purposes)
      allow read: if true;
      
      // Only the user themselves can update their data
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Only authenticated users can create (handled by server)
      allow create: if request.auth != null;
      
      // Only admin or the user can delete
      allow delete: if request.auth != null && 
        (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      // Users can read their own bookings, admins can read all
      allow read: if request.auth != null;
      
      // Authenticated users can create bookings
      allow create: if request.auth != null;
      
      // Users can update their own bookings, admins can update all
      allow update: if request.auth != null;
      
      // Only admin can delete
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Photos collection
    match /photos/{photoId} {
      // Everyone can read photos
      allow read: if true;
      
      // Only admin can create/update/delete
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

---

## Step 10: Remove Old MySQL Code

Once Firebase is working:

1. **Remove/backup these files:**
   - `models/db.js` (Sequelize connection)
   - `models/userModel.js` (old MySQL model)
   - `migrate.js` (MySQL migrations)
   - `create.js` (MySQL setup)

2. **Update package.json** - remove:
   ```json
   "mysql2": "^3.x.x",
   "sequelize": "^6.x.x"
   ```

3. **Remove from .env:**
   ```
   DB_NAME=...
   DB_USER=...
   DB_PASSWORD=...
   DB_HOST=...
   DB_PORT=...
   DB_SSL=...
   ```

---

## Step 11: Test Locally

```bash
# Start the app
npm start

# Test registration
# Test login
# Test bookings
# Check Firebase Console for data
```

---

## Step 12: Deploy to Hostinger

1. Upload updated files to Hostinger
2. Upload new `.env` with Firebase credentials
3. Run: `npm install firebase firebase-admin`
4. Restart Node.js app
5. Test all functionality

---

## Comparison: Firebase vs MySQL

| Feature | MySQL (Current) | Firebase (New) |
|---------|-----------------|----------------|
| **Setup Time** | 5 minutes | 6-8 hours coding |
| **Code Changes** | None needed | Rewrite all queries |
| **Cost** | Need paid hosting | Free (generous limits) |
| **Scalability** | Manual | Automatic |
| **Real-time** | Need Socket.IO | Built-in |
| **Backups** | Manual | Automatic |
| **Learning Curve** | Know SQL | Learn NoSQL |

---

## Firebase Free Tier Limits

- **Firestore**: 1 GB storage, 50k reads/day, 20k writes/day
- **Authentication**: Unlimited users
- **Storage**: 5 GB, 1 GB/day downloads
- **Hosting**: 10 GB/month bandwidth

**Perfect for a capstone project!**

---

## Next Steps

1. ✅ Install Firebase packages (when network stable)
2. ✅ Create Firebase project
3. ✅ Setup Firestore database
4. ✅ Get configuration credentials
5. ✅ Update .env file
6. ⏳ Rewrite all controllers (auth, booking, photos)
7. ⏳ Test locally
8. ⏳ Deploy to Hostinger

---

## Need Help?

- Firebase Docs: https://firebase.google.com/docs
- Firestore Guides: https://firebase.google.com/docs/firestore

---

**Ready to proceed? This will take 6-8 hours of work to complete the migration!**
