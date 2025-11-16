console.log("=== AUTH ROUTER LOADED ===", import.meta.url);

import express from "express";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/gen", async (req, res) => {
  const hash = await bcrypt.hash("test123", 10);
  console.log("NEW HASH:", hash);
  res.send(hash);
}); //fucking bcrypt will be the death of me


router.post("/login", async (req, res) => {

  console.log("LOGIN ROUTE HIT");                
  console.log("REQ BODY:", req.body);

  const { username, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

  if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);

  console.log("HASH FROM DB:", user.password_hash);
console.log("HASH LENGTH:", user.password_hash.length);
console.log("COMPARE RESULT:", await bcrypt.compare("test123", user.password_hash));


  if (!match) return res.status(401).json({ error: "Incorrect password" });

  req.session.user = { id: user.id, username: user.username };
  res.json({ message: "Logged in", user: req.session.user });
});


router.get("/check-login", (req, res) => {
  if (req.session.user) res.json({ loggedIn: true, user: req.session.user });
  else res.json({ loggedIn: false });
});

export default router;