// backend/server.js
import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import songRoutes from "./routes/songs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (you could remove this if frontend is same origin, but it's fine)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Sessions
app.use(
  session({
    secret: "secret key", // change for real
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

// Static frontend
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api", songRoutes);

// Home route → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "html", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
