// backend/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

console.log("auth.js LOADED");
console.log(">>> USING AUTH FILE:", import.meta.url);


// SIGNUP
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password_hash }])
      .select();

    if (error) return res.status(500).json({ success: false, message: "DB error" });

    return res.status(201).json({ success: true, user: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error || !data)
    return res.status(401).json({ success: false, message: "Invalid login" });

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid)
    return res.status(401).json({ success: false, message: "Invalid login" });

  req.session.user = { id: data.id, username: data.username };
  res.json({ success: true });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Could not log out" });

    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

console.log("AUTH ROUTER ROUTES:");
router.stack.forEach(layer => {
  if (layer.route) {
    console.log("   ", layer.route.path, layer.route.methods);
  }
});


export default router;
