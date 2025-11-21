/*// backend/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

// -------------------------------------
// POST /signup - Create a new user account
console.log("🚀 Setting up /signup route...");

router.post("/signup", async (req, res) => {
  console.log("🔵 [SIGNUP] Request received");

  // Check raw body
  console.log("🔵 Raw body:", req.body);

  const { username, password } = req.body;

  // Validate fields
  if (!username || !password) {
    console.log("🔴 Missing username or password");
    return res.status(400).json({
      success: false,
      message: "Missing username or password"
    });
  }

  try {
    console.log("🔵 Hashing password...");
    const password_hash = await bcrypt.hash(password, 10);
    console.log("🟢 Password hashed");

    console.log("🔵 Attempting database insert...");
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password_hash }])
      .select();

    // Log Supabase response
    console.log("🔵 Supabase insert returned:");
    console.log("   data  →", data);
    console.log("   error →", error);

    if (error) {
      // Duplicate username
      if (error.code === "23505") {
        console.log("🔴 Username already exists");
        return res.status(409).json({
          success: false,
          message: "Username already exists",
          supabaseError: error
        });
      }

      console.log("🔴 Database error:", error);
      return res.status(500).json({
        success: false,
        message: "Supabase database error",
        supabaseError: error
      });
    }

    console.log("🟢 Account created successfully:", data[0]);

    return res.status(201).json({
      success: true,
      message: "Account successfully created",
      user: data[0]
    });

  } catch (err) {
    console.log("🔴 INTERNAL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message
    });
  }
});

export default router;
*/

import express from "express";
import bcrypt from "bcrypt";
import { supabase } from "../lib/supabase.js";

const router = express.Router();


router.get("/search", async (req, res) => {
    const q = req.query.q;

    if (!q || q.trim() === "") {
        return res.json({ results: [] });
    }

    const { data, error } = await supabase
        .from("songs")
        .select("*")
        .or(`title.ilike.%${q}%,artist.ilike.%${q}%`)
        .limit(10);

    if (error) {
        console.error("Supabase search error:", error);
        return res.status(500).json({ error: "Database search error" });
    }

    res.json({ results: data });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing username or password" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single(); 
    if (error || !data) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    const validPassword = await bcrypt.compare(password, data.password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }
    req.session.user = { id: data.id, username: data.username };
    return res.json({ success: true, message: "Login successful" });
  }
    catch (err) {
    return res.status(500).json({ success: false, message: "Internal error", error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  console.log("🔵 [SIGNUP] Request received");
  console.log("🔵 Raw body:", req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing username or password" });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, password_hash }])
      .select();

    if (error) return res.status(500).json({ success: false, message: "DB error", error });
    //debugging
    console.log("Supabase insert response:", data, error);


    return res.status(201).json({ success: true, user: data[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal error", error: err.message });
  }
});

export default router;
