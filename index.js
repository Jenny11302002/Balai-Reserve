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
    
import express from "express";
import path from "path";
import session from "express-session";
import flash from "connect-flash";
import router from "./routes/index.js";
import fs from 'fs';
import hbs from "hbs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import { Server } from "socket.io";

// ===== FIREBASE ENABLED - NO MYSQL/SEQUELIZE NEEDED =====
console.log("🔥 Using Firebase as database - MySQL/Sequelize disabled");
// Note: Firebase initialization happens in config/firebase.js
// No database sync needed - Firebase handles everything automatically!

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));



app.use(session({
  secret: "xianfire-secret-key",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

app.engine("xian", async (filePath, options, callback) => {
  try {
     const originalPartialsDir = hbs.partialsDir;
    hbs.partialsDir = path.join(__dirname, 'views');

    const result = await new Promise((resolve, reject) => {
      hbs.__express(filePath, options, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    hbs.partialsDir = originalPartialsDir;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
});
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "xian");
const partialsDir = path.join(__dirname, "views/partials");
fs.readdir(partialsDir, (err, files) => {
  if (err) {
    console.error("❌ Could not read partials directory:", err);
    return;
  }

   files
    .filter(file => file.endsWith('.xian'))
    .forEach(file => {
      const partialName = file.replace('.xian', ''); 
      const fullPath = path.join(partialsDir, file);

      fs.readFile(fullPath, 'utf8', (err, content) => {
        if (err) {
          console.error(`❌ Failed to read partial: ${file}`, err);
          return;
        }
        hbs.registerPartial(partialName, content);
        
      });
    });
});

app.use("/", router);

// ===== REAL-TIME CHAT SYSTEM =====
let messages = {
  super_admin: [],           // SuperAdmin-to-super_admin chat
  admin: [],           // Admin-to-admin chat
  client_super_admin: [],    // Client-to-super_admin chat
  client_admin: []     // Client-to-admin chat
};

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins a chat room
  socket.on('join_room', (data) => {
    const { room, userType, userName } = data;
    socket.join(room);
    console.log(`👤 ${userName} (${userType}) joined ${room} chat`);

    // Notify others in the room
    socket.broadcast.to(room).emit('user_joined', {
      message: `${userName} joined the chat`,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  // Handle new messages
  socket.on('send_message', (data) => {
    const { room, message, userName, userType, userEmail } = data;
    
    const messageObj = {
      id: Date.now(),
      sender: userName,
      email: userEmail,
      userType: userType,
      message: message,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };

    // Store message
    if (messages[room]) {
      messages[room].push(messageObj);
    }

    // Broadcast to all in room
    io.to(room).emit('receive_message', messageObj);

    // Also store to file for persistence
    saveMessagesToFile();
  });

  // Get chat history
  socket.on('get_history', (room) => {
    if (messages[room]) {
      socket.emit('chat_history', messages[room]);
    } else {
      socket.emit('chat_history', []);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.to(data.room).emit('user_typing', {
      userName: data.userName,
      isTyping: true
    });
  });

  socket.on('stop_typing', (data) => {
    socket.broadcast.to(data.room).emit('user_typing', {
      userName: data.userName,
      isTyping: false
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Load messages from file on startup
function loadMessagesFromFile() {
  const filePath = path.join(__dirname, 'data', 'messages.json');
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      messages = JSON.parse(data);
      console.log('✅ Chat messages loaded from file');
    }
  } catch (err) {
    console.error('Error loading messages:', err);
  }
}

// Save messages to file
function saveMessagesToFile() {
  const dataDir = path.join(__dirname, 'data');
  const filePath = path.join(dataDir, 'messages.json');
  
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error('Error saving messages:', err);
  }
}

// Load messages on startup
loadMessagesFromFile();

export default app;
export { io };

if (!process.env.ELECTRON) {
  const server = httpServer.listen(PORT, () => console.log(`🔥 XianFire running at http://localhost:${PORT}`));
  
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
      const server2 = httpServer.listen(PORT + 1, () => console.log(`🔥 XianFire running at http://localhost:${PORT + 1}`));
    } else {
      throw err;
    }
  });
}
