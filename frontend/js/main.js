// JS for dynamically rendering the songs after being chosen
//will have to actually implement database communication as im just manually
//entering data for it to show

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleBtn');

let page = 0;          // Which "chunk" are we on? (0 = first 25)
const limit = 25;      // How many to fetch each time?
let loading = false;   // Prevent double-clicking

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

async function loadSongs(pageNumber = 0) {
  const start = pageNumber * limit;
  const end = start + limit - 1;

  console.log(`Fetching songs ${start} to ${end}`);

  const { data: songs, error } = await window.supabase
    .from("songs")
    .select("*")
    .order("id", { ascending: true })
    .range(start, end);

  if (error) {
    console.error("Error fetching songs:", error);
    return [];
  }

  return songs;
}

async function renderSongs(append = false) {
  const songList = document.getElementById("song-list");
  if (!songList) return;

  if (!append) {
    songList.innerHTML = ""; // First load = clear list
  }

  // Prevent spam-clicking
  if (loading) return;
  loading = true;

  // Load songs for current page
  const songs = await loadSongs(page);

  // If no songs returned, hide Load More button
  if (songs.length === 0) {
    document.getElementById("loadMoreBtn").style.display = "none";
    loading = false;
    return;
  }

  // Render list
  songs.forEach((song) => {
    const a = document.createElement("a");
    a.className = "song-card";
    a.href = `/song.html?id=${encodeURIComponent(song.id)}`;
    a.setAttribute("aria-label", `${song.title} by ${song.artist}`);
    a.innerHTML = `
        <strong>${escapeHtml(song.title)}</strong>
        <span class="artist">${escapeHtml(song.artist)}</span>
      `;
    songList.appendChild(a);
  });

  loading = false;
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

document.addEventListener("DOMContentLoaded", () => {
  // Load first 25 songs
  renderSongs(false);

  // Setup Load More
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      page++;                // increase page number
      renderSongs(true);     // append songs
    });
  }
});


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


