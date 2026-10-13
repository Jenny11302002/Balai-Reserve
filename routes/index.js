import express from "express";
import path from "path";
import { fileURLToPath } from "url";
// ===== FIREBASE CONTROLLERS (Updated to use Firebase) =====
import {
  loginPage,
  registerPage,
  forgotPasswordPage,
  dashboardPage,
  loginUser,
  registerUser,
  logoutUser,
  resetPasswordRequest,
  resetPassword
} from "../controllers/authControllerFirebase.js";
import { homePage } from "../controllers/homeController.js";
import { uploadPhoto, getPhotos, deletePhoto, getAllPhotos } from "../controllers/photoControllerFirebase.js";
import { upload } from "../config/multer.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Root route - serves book.html (landing page)
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/book.html"));
});

// Book page route (alternative access)
router.get("/book", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/book.html"));
});

// Login page route
router.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

// Login routes
router.get("/login", loginPage);
router.post("/login", loginUser);

// Register routes
router.get("/register", registerPage);
router.post("/register", registerUser);

// Forgot password route
router.get("/forgot-password", forgotPasswordPage);
router.post("/reset-password-request", resetPasswordRequest);
router.post("/reset-password", resetPassword);

// Dashboard route (protected - should have auth middleware)
router.get("/dashboard", dashboardPage);

// Logout route
router.get("/logout", logoutUser);

// Legacy index.html redirect to login
router.get("/index.html", (req, res) => {
  res.redirect("/login.html");
});

// Home page route (if needed)
router.get("/home", homePage);

// ===== PHOTO UPLOAD ROUTES =====
// Upload photo endpoint (with multer middleware for Firebase)
router.post("/api/upload-photo", upload.single('photo'), uploadPhoto);

// Get user photos endpoint
router.get("/api/photos", getPhotos);

// Delete photo endpoint
router.delete("/api/delete-photo/:id", deletePhoto);

// Get all photos endpoint (for admin)
router.get("/api/all-photos", getAllPhotos);

// ===== END PHOTO ROUTES =====

// Serve static files from views directory
// This allows direct access to CSS, JS, images in views folder
router.use("/views", express.static(path.join(__dirname, "../views")));


router.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page Not Found</title>
        <style>
            body {
                margin: 0;
                font-family: "Segoe UI", sans-serif;
                background: linear-gradient(135deg, #0b1f4a, #2b8bd6);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                text-align: center;
            }
            .error-container {
                padding: 40px;
            }
            h1 {
                font-size: 80px;
                margin: 0;
            }
            p {
                font-size: 24px;
                margin: 20px 0;
            }
            a {
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                transition: 0.3s;
                display: inline-block;
                margin-top: 20px;
            }
            a:hover {
                background-color: rgba(255, 255, 255, 0.3);
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>404</h1>
            <p>Page Not Found</p>
            <p>The page you're looking for doesn't exist.</p>
            <a href="/">Return to Home</a>
        </div>
    </body>
    </html>
  `);
});

export default router;