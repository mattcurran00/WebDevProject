// frontend/js/saved.js

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("saved-list");
  const addForm = document.getElementById("add-song-form");
  const titleInput = document.getElementById("new-title");
  const artistInput = document.getElementById("new-artist");
  const songIdInput = document.getElementById("new-song-id");

  const editModal = document.getElementById("editModal");
  const editTitleInput = document.getElementById("edit-title");
  const editArtistInput = document.getElementById("edit-artist");
  const saveEditBtn = document.getElementById("saveEdit");
  const cancelEditBtn = document.getElementById("cancelEdit");

  let currentEditId = null;


  if (!list) return;

  // --- LOAD SONGS (READ) ---
  async function loadSongs() {
    list.innerHTML = "Loading your saved songs...";

    try {
      const res = await fetch("/api/songs/saved-songs", {
        credentials: "include",
      });

      if (res.status === 401) {
        list.innerHTML = "You must be logged in to see saved songs.";
        return;
      }

      if (!res.ok) {
        list.innerHTML = "Error loading songs.";
        return;
      }

      const songs = await res.json();

      if (songs.length === 0) {
        list.innerHTML = "You have no saved songs yet.";
        return;
      }
    
    list.innerHTML = "Songs Loaded:";

  songs.forEach((song) => {
    const item = document.createElement("div");
    item.className = "saved-song";

    item.innerHTML = `
      <h3>${song.title}</h3>
      <p>${song.artist}</p>
      <small>DB id: ${song.id}</small>
      <div class="actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // EDIT → open modal
    item.querySelector(".edit-btn").addEventListener("click", () => {
      currentEditId = song.id;
      editTitleInput.value = song.title;
      editArtistInput.value = song.artist;
      editModal.classList.add("show");
    });

    // DELETE
    item.querySelector(".delete-btn").addEventListener("click", () => {
      deleteSong(song.id);  
    });

    list.appendChild(item);
  });


    } catch (err) {
      console.error("Error fetching saved songs:", err);
      list.innerHTML = "Error talking to the server.";
    }
  }

  // --- CREATE (ADD) ---
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const artist = artistInput.value.trim();
      const song_id = songIdInput.value.trim() || null;

      if (!title || !artist) return;

      try {
        const res = await fetch("/api/songs/saved-songs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ title, artist, song_id }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(data.error || "Could not save song.");
          return;
        }

        // Clear form & reload list
        addForm.reset();
        loadSongs();
      } catch (err) {
        console.error("Error saving song:", err);
        alert("Error talking to the server.");
      }
    });
  }

  // --- DELETE ---
  async function deleteSong(id) {
    try {
      const res = await fetch(`/api/songs/saved-songs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not delete song.");
        return;
      }

      loadSongs();
    } catch (err) {
      console.error("Error deleting song:", err);
      alert("Error talking to the server.");
    }
  }

  // --- UPDATE ---
  async function updateSong(id, title, artist) {
    try {
      const res = await fetch(`/api/songs/saved-songs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title, artist }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Could not update song.");
        return;
      }

      loadSongs();
    } catch (err) {
      console.error("Error updating song:", err);
      alert("Error talking to the server.");
    }
  }

  cancelEditBtn.addEventListener("click", () => {
    editModal.classList.remove("show");
  });

  saveEditBtn.addEventListener("click", async () => {
    const title = editTitleInput.value.trim();
    const artist = editArtistInput.value.trim();

    if (!title || !artist) {
      alert("Both fields are required");
      return;
    }

    const res = await fetch(`/api/songs/saved-songs/${currentEditId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, artist })
    });

    if (!res.ok) {
      alert("Update failed");
      return;
    }

    editModal.classList.remove("show");
    loadSongs(); // refresh
  });


  // Initial load
  loadSongs();
});
