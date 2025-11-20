import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force dotenv to load the .env in backend/
dotenv.config({ path: path.join(__dirname, "../.env") });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is missing. Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
console.log("ENV CHECK:", process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
