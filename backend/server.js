// backend/server.js
import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import songRoutes from "./routes/songs.js";
import { supabase } from "./lib/supabase.js"; // <-- make sure this file exists in backend/lib

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ===== Middleware =====

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS — adjust origin if your frontend is served elsewhere
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Sessions
app.use(
  session({
    secret: "secret key", // replace with a secure key in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ===== Static frontend =====
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// ===== API Routes =====
app.use("/api/auth", authRoutes);
app.use("/api", songRoutes);

// ===== Home route =====
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "html", "index.html"));
});

// ===== Optional test route to fetch songs directly from Supabase =====
app.get("/api/songs", async (req, res) => {
  try {
    const { data, error } = await supabase.from("songs").select("*").order("id");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Error fetching songs:", err);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
});

// ===== Start server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
