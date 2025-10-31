//tryna implement express to set the backend server up, dk how well its gonna go
import express from 'express';
import session from 'express-session';
import cors from 'cors'; //dont ask me what this is, i dont know why it needs to be there but it doesnt work
//without it for some reason
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import songRoutes from './routes/songs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin : true, credentials: true }));

app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api", authRoutes);
app.use("/api", songRoutes);

// Catch-all to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));