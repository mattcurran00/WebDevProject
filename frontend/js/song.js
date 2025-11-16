document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("saveSongBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const song_id = btn.dataset.songId;
    const title = btn.dataset.title;
    const artist = btn.dataset.artist;

    try {
      const res = await fetch("/api/saved-songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ song_id, title, artist }),
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
