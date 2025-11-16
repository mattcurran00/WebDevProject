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

const songs = [
  { id: 1, title: "Forget Her", artist: "Jeff Buckley" },
  { id: 2, title: "Creep", artist: "Radiohead" },
];

const songList = document.getElementById('song-list');

// Clear existing content 
songList.innerHTML = '';

songs.forEach(song => {
  // Create an anchor so it's naturally focusable/clickable and copyable
  const a = document.createElement('a');
  a.className = 'song-card';
  a.href = `/song.html?id=${encodeURIComponent(song.id)}`;
  a.setAttribute('aria-label', `${song.title} by ${song.artist}`);

  // content
  a.innerHTML = `
    <strong>${escapeHtml(song.title)}</strong>
    <span class="artist">${escapeHtml(song.artist)}</span>
  `;

  songList.appendChild(a);
});

// Simple helper to avoid accidental HTML injection if titles come from user input
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


