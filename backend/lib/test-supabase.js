import 'dotenv/config';

console.log("URL:", process.env.SUPABASE_URL);
console.log("KEY:", process.env.SUPABASE_ANON_KEY ? "Loaded" : "Missing");

import { supabase } from './supabase.js';

async function test() {
  const { data, error } = await supabase.from('songs').select('*').limit(1);

  if (error) {
    console.error("❌ Connection failed:", error);
  } else {
    console.log("✅ Supabase connection working!");
    console.log("Sample data:", data);
  }
}

test();