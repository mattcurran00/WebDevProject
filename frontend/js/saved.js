document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("saved-list");

  try {
    const res = await fetch("/api/saved-songs", {
      credentials: "include",
    });

    if (!res.ok) {
      list.innerHTML = "<li>Could not load saved songs.</li>";
      return;
    }

    const songs = await res.json();

    if (songs.length === 0) {
      list.innerHTML = "<li>No saved songs yet.</li>";
      return;
    }

    list.innerHTML = "";
    songs.forEach((song) => {
      const li = document.createElement("li");
      li.textContent = `${song.title} – ${song.artist}`;
      li.dataset.id = song.id;

      const del = document.createElement("button");
      del.textContent = "Delete";
      del.addEventListener("click", () => deleteSavedSong(song.id, li));

      li.appendChild(del);
      list.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    list.innerHTML = "<li>Error loading songs.</li>";
  }
});

async function deleteSavedSong(id, li) {
  if (!confirm("Delete this song?")) return;

  const res = await fetch(`/api/saved-songs/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.ok) {
    li.remove();
  } else {
    alert("Could not delete song");
  }
}
