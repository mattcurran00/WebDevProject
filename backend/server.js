/*// backend/server.js
import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import songRoutes from "./routes/songs.js";
import { supabase } from "./lib/supabase.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== Required for JSON Body Parsing =====
console.log("📦 Loading middleware...");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== CORS =====
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ===== Sessions =====
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// ===== API Routes FIRST (important!) =====
console.log("🚀 Mounting routes...");
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// server.js (after mounting authRoutes)
app.post("/api/auth/signup", (req, res) => {
  console.log("Signup route hit!");
  res.json({ message: "ok" });
});

app.post("/api/test", (req, res) => {
  console.log("Test route hit!", req.body);
  res.json({ ok: true, body: req.body });
});

// ===== Static frontend AFTER API routes =====
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));
  
// ===== Home =====
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "html", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
}); */

/*// server.js
import 'dotenv/config'; // <-- MUST be first
import path from "path";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import songRoutes from "./routes/songs.js"; 

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json()); // VERY IMPORTANT to parse JSON
app.use(express.urlencoded({ extended: true }));

// Body parser
app.use(express.json());

// --- API Routes FIRST ---
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);

// Serve frontend static files
const frontendPath = path.join(process.cwd(), "frontend");
app.use(express.static(frontendPath));

app.listen(PORT, () => {
  console.log(`🟢 Server running on http://localhost:${PORT}`);
});

*/

// server.js
import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";


// Load environment variables from .env first
dotenv.config();

import authRoutes from "./routes/auth.js";

const app = express();
const __dirname = path.resolve();

// --- Middleware ---
// Parse JSON bodies for API requests
app.use(express.json());

// Serve static files from frontend folder (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, "../frontend")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

// --- HTML routes ---
// Clean URLs: /signup, /login, /
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

// --- API routes ---
app.use("/api/auth", authRoutes);
// You can add other API routes like songs later:
// import songRoutes from "./routes/songs.js";
// app.use("/api/songs", songRoutes);

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
