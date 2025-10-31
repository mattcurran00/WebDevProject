import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/saved-songs", async (req, res) => {
//check if the user is acc logged in
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" }); 

  const userId = req.session.user.id;
  //send the queries through here
  const result = await pool.query("SELECT * FROM saved_songs WHERE user_id = $1", [userId]);
  res.json(result.rows);
});

export default router;

// "bosh"
