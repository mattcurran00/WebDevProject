import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

router.put("/username", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const { username } = req.body;
  const userId = req.session.user.id;

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", userId);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.sendStatus(200);
});

export default router;
