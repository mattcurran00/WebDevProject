// server.js
import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

import authRoutes from "./routes/auth.js";
import songRoutes from "./routes/songs.js";

const app = express();
const __dirname = path.resolve();

console.log("RUNNING SERVER.JS FROM:", __dirname);

// --- Middleware ---
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

//debufg
console.log("Checking if server crashes...");

// --- HTML routes ---
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/login.html"));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/index.html"));
});

app.get("/saved", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/saved.html"));
});

app.get("/settings", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/settings.html"));
});

// --- STATIC FILES (LAST!!!) ---
app.use(express.static(path.join(__dirname, "../frontend")));


// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
