// test the insert and select functionality of Supabase

import 'dotenv/config';
import { supabase } from './supabase.js';

async function testInsert() {
  const { data, error } = await supabase
    .from('songs')
    .insert([
      { id: 29, title: "Forget Her", artist: "Jeff Buckley" },
      { id: 30, title: "Creep", artist: "Radiohead" }
    ]);

  if (error) {
    console.error("❌ Insert failed:", error);
  } else {
    console.log("✅ Insert succeeded:", data);
  }
}

async function testSelect() {
  const { data, error } = await supabase.from('songs').select('*');
  if (error) {
    console.error("❌ Select failed:", error);
  } else {
    console.log("✅ Current table data:", data);
  }
}

async function run() {
  await testInsert();
  await testSelect();
}

run();