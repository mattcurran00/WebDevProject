// backend/routes/songs.js
// public search + private crud for saved songs

import express from "express";
import { supabase } from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/* -----------------------------------------
   PUBLIC: Search Songs (no login required)
-------------------------------------------- */
router.get("/search", async (req, res) => {
  const q = req.query.q?.trim() || "";
  if (!q) return res.json({ results: [] });

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .or(`title.ilike.%${q}%,artist.ilike.%${q}%`)
    .limit(10);

  if (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Search failed" });
  }

  res.json({ results: data });
});



/* -----------------------------------------
   PRIVATE: Login require for below Get Saved Songs
-------------------------------------------- */

//Get Saved Songs
router.get("/saved-songs", requireAuth, async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;

  const { data, error } = await supabase
    .from("saved_songs")
    .select("*")
    .eq("user_id", userId)
    .order("id");

  if (error) {
    console.error("Load saved songs error:", error);
    return res.status(500).json({ error: "Could not load saved songs" });
  }

  res.json(data);
});


//PRIVATE: Save Songs
router.post("/saved-songs", requireAuth, async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;
  const { song_id, title, artist } = req.body;

  const { data, error } = await supabase
    .from("saved_songs")
    .insert([{ user_id: userId, song_id, title, artist }])
    .select()
    .single();

  if (error) {
    console.error("Insert saved song error:", error);
    return res.status(500).json({ error: "Insert failed" });
  }

  res.json({ success: true, data });
});

/* -----------------------------------------
   PRIVATE: Delete a saved song
-------------------------------------------- */
router.delete("/saved-songs/:id", requireAuth, async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;
  const songId = req.params.id;

  const { data, error } = await supabase
    .from("saved_songs")
    .delete()
    .eq("id", songId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Delete failed" });
  }

  if (!data)
    return res.status(404).json({ error: "Song not found" });

  res.json({ success: true, deleted: data });
});

/* -----------------------------------------
   PRIVATE: Update a saved song (title, artist)
-------------------------------------------- */
router.put("/saved-songs/:id", requireAuth, async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;
  const songId = req.params.id;
  const { title, artist } = req.body;

  const { data, error } = await supabase
    .from("saved_songs")
    .update({ title, artist })
    .eq("id", songId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    return res.status(500).json({ error: "Update failed" });
  }

  if (!data)
    return res.status(404).json({ error: "Not found" });

  res.json({ success: true, updated: data });
});

export default router;