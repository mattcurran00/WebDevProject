import express from "express";
import { pool } from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

  if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) return res.status(401).json({ error: "Incorrect password" });

  req.session.user = { id: user.id, username: user.username };
  res.json({ message: "Logged in", user: req.session.user });
});


router.get("/check-login", (req, res) => {
  if (req.session.user) res.json({ loggedIn: true, user: req.session.user });
  else res.json({ loggedIn: false });
});

export default router;