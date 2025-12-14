import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

router.delete("/delete-account", async (req, res) => {
  const { userId } = req.body;

  try {
    await supabaseAdmin.from("profiles").delete().eq("id", userId);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
