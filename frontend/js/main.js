// JS for dynamically rendering the songs after being chosen
//will have to actually implement database communication as im just manually
//entering data for it to show

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

/*  WE WILL USE THIS MAYBE LATER IF THE OTHER ONE CAUSES ISSUES

const songs = [
  { id: 1, title: "Forget Her", artist: "Jeff Buckley" },
  { id: 2, title: "Creep", artist: "Radiohead" },
];


// the rendering of the songs to the actual page (hopefully)
const songList = document.getElementById('song-list');
songs.forEach(song => {
  const div = document.createElement('div');
  div.className = 'song-card';
  div.innerHTML = `<strong>${song.title}</strong><br>${song.artist}`;
  div.addEventListener('click', () => {
    window.location.href = `/song.html?id=${song.id}`;
    //dont think this will work with node
  });
  songList.appendChild(div);
}); 
*/ 

async function loadSongs() {
  const { data: songs, error } = await window.supabase
    .from('songs')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error fetching songs:", error);
    return [];
  }

  return songs;
}

// or: const supabase = require('./lib/supabase');

/*const { data, error } = await supabase
  .from('songs')
  .select('*');

console.log(data);


const songs = [
  { id: 3, title: "Hallelujah", artist: "Leonard Cohen" },
  { id: 4, title: "Under the Bridge", artist: "Red Hot Chili Peppers" },
  { id: 5, title: "Black", artist: "Pearl Jam" },
  { id: 6, title: "Linger", artist: "The Cranberries" },
  { id: 7, title: "Fake Plastic Trees", artist: "Radiohead" },
  { id: 8, title: "The Night We Met", artist: "Lord Huron" },
  { id: 9, title: "Skinny Love", artist: "Bon Iver" },
  { id: 10, title: "Motion Picture Soundtrack", artist: "Radiohead" },
  { id: 11, title: "Lovesong", artist: "The Cure" },
  { id: 12, title: "Fade Into You", artist: "Mazzy Star" },
  { id: 13, title: "Shadow of the Day", artist: "Linkin Park" },
  { id: 14, title: "The Blower’s Daughter", artist: "Damien Rice" },
  { id: 15, title: "Re: Stacks", artist: "Bon Iver" },
  { id: 16, title: "Northern Sky", artist: "Nick Drake" },
  { id: 17, title: "Wonderwall", artist: "Oasis" },
  { id: 18, title: "Everlong (Acoustic)", artist: "Foo Fighters" },
  { id: 19, title: "Slow Dancing in a Burning Room", artist: "John Mayer" },
  { id: 20, title: "Wish You Were Here", artist: "Pink Floyd" },
  { id: 21, title: "Unchained Melody", artist: "The Righteous Brothers" },
  { id: 22, title: "Tears in Heaven", artist: "Eric Clapton" },
  { id: 23, title: "Holocene", artist: "Bon Iver" },
  { id: 24, title: "The Scientist", artist: "Coldplay" },
  { id: 25, title: "Dreams", artist: "Fleetwood Mac" },
  { id: 26, title: "Love Will Tear Us Apart", artist: "Joy Division" },
  { id: 27, title: "Everybody’s Got to Learn Sometime", artist: "The Korgis" },
  { id: 28, title: "Something in the Way", artist: "Nirvana" },
  { id: 29, title: "Blue Monday", artist: "New Order" },
  { id: 30, title: "Karma Police", artist: "Radiohead" }

];*/

async function renderSongs() {
  const songList = document.getElementById('song-list');
  if (!songList) return;

  // Clear existing content
  songList.innerHTML = '';

  const songs = await loadSongs();  // fetch from DB

  if (songs.length === 0) {
    songList.innerHTML = '<li>No songs in the database.</li>';
    return;
  }

  songs.forEach(song => {
    const a = document.createElement('a');
    a.className = 'song-card';
    a.href = `/song.html?id=${encodeURIComponent(song.id)}`;
    a.setAttribute('aria-label', `${song.title} by ${song.artist}`);
    a.innerHTML = `
      <strong>${escapeHtml(song.title)}</strong>
      <span class="artist">${escapeHtml(song.artist)}</span>
    `;
    songList.appendChild(a);
  });
}

// Call the render function once DOM is ready
document.addEventListener('DOMContentLoaded', renderSongs);

// Helper function remains the same
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


// Database test section
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("testBtn");
  const results = document.getElementById("testResults");
  if (!btn || !results) return;  // page doesn't have section

  btn.addEventListener("click", async () => {
    results.innerHTML = "<li>Loading...</li>";

    try {
      const res = await fetch("/api/saved-songs", { credentials: "include" });

      if (!res.ok) {
        results.innerHTML = "<li>Not logged in or DB error.</li>";
        return;
      }

      const songs = await res.json();
      results.innerHTML = "";

      if (songs.length === 0) {
        results.innerHTML = "<li>No songs in database.</li>";
        return;
      }

      songs.forEach(song => {
        const li = document.createElement("li");
        li.textContent = `${song.title} — ${song.artist}`;
        results.appendChild(li);
      });

    } catch (err) {
      console.error(err);
      results.innerHTML = "<li>Database connection failed.</li>";
    }
  });
});


