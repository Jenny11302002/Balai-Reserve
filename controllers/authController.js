
      /*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import bcrypt from "bcryptjs";
import { User, sequelize } from "../models/userModel.js";

try {
  await sequelize.sync();
} catch (err) {
  console.error("⚠️  Database connection failed. Running in offline mode.", err.message);
}

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
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.send("User not found");
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Incorrect password");
  req.session.userId = user.id;
  res.redirect("/dashboard");
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  req.session.userId = user.id;
  res.redirect("/dashboard");
};

export const logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

export const resetPasswordRequest = async (req, res) => {
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
};

export const resetPassword = async (req, res) => {
  const { email, newPassword, userType } = req.body;
  
  if (!req.session.resetEmail || req.session.resetEmail !== email) {
    return res.json({ success: false, message: "Session expired. Please start over." });
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await user.update({ password: hashed });
  
  // Clear reset session
  req.session.resetEmail = null;
  req.session.resetUserType = null;
  
  res.json({ success: true, message: "Password reset successfully!" });
};
