import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

/**
 * DELETE /settings/delete-account
 * Deletes the logged-in user's account
 */
router.delete("/delete-account", async (req, res) => {

  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const userId = req.session.user.id;

  try {

    await supabase.from("users").delete().eq("id", userId);


    req.session.destroy(() => {});

    res.sendStatus(200);
  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
