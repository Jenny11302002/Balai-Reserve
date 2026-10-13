/*
    Firebase Auth Controller
    Balai Reserve - Authentication with Firestore
*/

import { User } from "../models/userModelFirebase.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
};

export const dashboardPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dashboard.html"));
};

export const registerPage = (req, res) => res.render("register", { title: "Register" });
export const forgotPasswordPage = (req, res) => res.render("forgotpassword", { title: "Forgot Password" });

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.send("User not found");
    }
    
    // Verify password
    const match = await User.verifyPassword(password, user.password);
    
    if (!match) {
      return res.send("Incorrect password");
    }
    
    // Set session
    req.session.userId = user.id;
    res.redirect("/dashboard");
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send("Login failed");
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.send("Email already registered");
    }
    
    // Create new user
    const user = await User.create({ name, email, password });
    
    // Set session
    req.session.userId = user.id;
    res.redirect("/dashboard");
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send("Registration failed");
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

export const resetPasswordRequest = async (req, res) => {
  try {
    const { email, userType } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.json({ success: false, message: "Email not found" });
    }

    // Store reset session temporarily (in production, use JWT or email)
    req.session.resetEmail = email;
    req.session.resetUserType = userType;
    req.session.resetAttempts = 0;
    
    res.json({ success: true, message: "Email verified. Please answer the security question." });
  } catch (error) {
    console.error('Reset password request error:', error);
    res.status(500).json({ success: false, message: "Error processing request" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, userType } = req.body;
    
    if (!req.session.resetEmail || req.session.resetEmail !== email) {
      return res.json({ success: false, message: "Session expired. Please start over." });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Update password
    await User.update(user.id, { password: newPassword });
    
    // Clear reset session
    req.session.resetEmail = null;
    req.session.resetUserType = null;
    
    res.json({ success: true, message: "Password reset successfully!" });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: "Error resetting password" });
  }
};
