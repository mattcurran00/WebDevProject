/*

// backend/routes/songs.js
import { supabase } from '../lib/supabase.js'; 

// or: const supabase = require('./lib/supabase');

const { data, error } = await supabase
  .from('songs')
  .select('*');

if (data != null) console.log('Songs Loaded'); else console.log('Error loading songs:', error);

import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// READ all saved songs for the logged-in user
router.get("/saved-songs", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const userId = req.session.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM saved_songs WHERE user_id = $1 ORDER BY id",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error loading saved songs:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// CREATE a saved song
router.post("/saved-songs", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const userId = req.session.user.id;
  const { song_id, title, artist } = req.body; 

  try {
    const result = await pool.query(
      `INSERT INTO saved_songs (user_id, song_id, title, artist)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, song_id, title, artist]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error saving song:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// UPDATE a saved song (e.g. notes / rating)
router.put("/saved-songs/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const userId = req.session.user.id;
  const { id } = req.params;
  const { title, artist } = req.body; 

  try {
    const result = await pool.query(
      `UPDATE saved_songs
       SET title = $1, artist = $2
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, artist, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating song:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE a saved song
router.delete("/saved-songs/:id", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const userId = req.session.user.id;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM saved_songs WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json({ message: "Deleted", song: result.rows[0] });
  } catch (err) {
    console.error("Error deleting song:", err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;

*/

// backend/routes/songs.js
import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

// -------------------------------------
// SEARCH songs by title or artist
// -------------------------------------

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

// -------------------------------------
// GET saved songs for logged-in user
// -------------------------------------
router.get("/saved-songs", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;

  const { data, error } = await supabase
    .from("saved_songs")
    .select("*")
    .eq("user_id", userId)
    .order("id");

  if (error) {
    console.error("Supabase select error:", error);
    return res.status(500).json({ error: "Database error" });
  }

  res.json(data);
});


// -------------------------------------
// CREATE a saved song
// -------------------------------------
router.post("/saved-songs", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;
  const { song_id, title, artist } = req.body;

  const { data, error } = await supabase
    .from("saved_songs")
    .insert([
      {
        user_id: userId,
        song_id,
        title,
        artist,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Database error" });
  }

  res.status(201).json(data);
});


// -------------------------------------
// UPDATE a saved song
// -------------------------------------
router.put("/saved-songs/:id", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;
  const { id } = req.params;
  const { title, artist } = req.body;

  const { data, error } = await supabase
    .from("saved_songs")
    .update({ title, artist })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    return res.status(500).json({ error: "Database error" });
  }

  if (!data)
    return res.status(404).json({ error: "Not found" });

  res.json(data);
});


// -------------------------------------
// DELETE a saved song
// -------------------------------------
router.delete("/saved-songs/:id", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;
  const { id } = req.params;

  const { data, error } = await supabase
    .from("saved_songs")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Supabase delete error:", error);
    return res.status(500).json({ error: "Database error" });
  }

  if (!data)
    return res.status(404).json({ error: "Not found" });

  res.json({ message: "Deleted", song: data });
});

export default router;
