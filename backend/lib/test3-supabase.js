// test the select functionality of Supabase

import 'dotenv/config';
import { supabase } from './supabase.js';

async function testSelect() {
  const { data, error } = await supabase.from('songs').select('*');
  if (error) {
    console.error("❌ Select failed:", error);
  } else {
    console.log("✅ Current table data:", data);
  }
}

async function run() {
  await testSelect();
}

run();