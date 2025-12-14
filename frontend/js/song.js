// func for SAVED.html to save a song
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("saveSongBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const song_id = btn.dataset.songId;
    const title = btn.dataset.title;
    const artist = btn.dataset.artist;
    const user_id = btn.dataset.userId;

    try {
      const res = await fetch("/api/songs/saved-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ song_id, title, artist, user_id }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not save song");
        return;
      }

      alert("Song saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving song");
    }
  });
});

// function used to render chords in SONG.html
function renderChords(rawText) {
  // allows for newline
  rawText = rawText.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");

  const container = document.getElementById("chord-container");
  container.innerHTML = "";

  const lines = rawText.split("\n");
  let currentSection = null;

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;

    // Key line
    if (line.startsWith("Key:")) {
      const key = document.createElement("div");
      key.className = "chord-key";
      key.textContent = line;
      container.appendChild(key);
      return;
    }

    // Section header
    if (line.startsWith("[") && line.endsWith("]")) {
      currentSection = document.createElement("div");
      currentSection.className = "chord-section";

      const title = document.createElement("h3");
      title.textContent = line.replace(/\[|\]/g, "");
      currentSection.appendChild(title);

      container.appendChild(currentSection);
      return;
    }

    // Chord line
    const chordLine = document.createElement("div");
    chordLine.className = "chord-line";

    line.split(/\s+/).forEach(chord => {
      const span = document.createElement("span");
      span.className = "chord";
      span.textContent = chord;
      chordLine.appendChild(span);
    });

    currentSection?.appendChild(chordLine);
  });
}

// On DOM load, fetch chords and render them 
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const songId = params.get("id");

  if (!songId) {
    console.error("No song ID in URL");
    return;
  }

  try {
    const res = await fetch(`/api/songs/${songId}/chords`);
    if (!res.ok) throw new Error("Failed to load chords");

    const chordsText = await res.text();
    renderChords(chordsText);
  } catch (err) {
    console.error(err);
    document.getElementById("chord-container").textContent =
      "Unable to load chords.";
  }
});
