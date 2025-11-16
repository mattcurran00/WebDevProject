// import express from "express";
// import { pool } from "../db.js";

// const router = express.Router();

// router.get("/saved-songs", async (req, res) => {
// //check if the user is acc logged in
//   if (!req.session.user) return res.status(401).json({ error: "Not logged in" }); 

//   const userId = req.session.user.id;
//   //send the queries through here
//   const result = await pool.query("SELECT * FROM saved_songs WHERE user_id = $1", [userId]);
//   res.json(result.rows);
// });

// export default router;

// "bosh"

// backend/routes/songs.js
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

