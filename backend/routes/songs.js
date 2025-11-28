// backend/routes/songs.js
import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

// PUBLIC search
router.get("/search", async (req, res) => {
  const q = req.query.q?.trim() || "";
  if (!q) return res.json({ results: [] });

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .or(`title.ilike.%${q}%,artist.ilike.%${q}%`)
    .limit(10);

  if (error) return res.status(500).json({ error: "Search failed" });

  res.json({ results: data });
});

// PRIVATE - save song
router.post("/saved-songs", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ error: "Not logged in" });

  const userId = req.session.user.id;
  const { song_id, title, artist } = req.body;

  const { data, error } = await supabase
    .from("saved_songs")
    .insert([{ user_id: userId, song_id, title, artist }])
    .select();

  if (error) return res.status(500).json({ error: "Insert failed" });

  res.json({ success: true, data });
});

export default router;
