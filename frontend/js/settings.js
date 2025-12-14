console.log("SETTINGS JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveChangesBtn");
  const deleteBtn = document.getElementById("deleteAccountBtn");
  const usernameInput = document.getElementById("username");

  if (!saveBtn || !deleteBtn || !usernameInput) {
    console.error("Settings elements missing");
    return;
  }

  // Update username
  saveBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: usernameInput.value })
      });

      if (!res.ok) {
        const err = await res.text();
        alert("Failed to update username");
        console.error(err);
        return;
      }

      alert("Username updated");
    } catch (err) {
      console.error("Request failed:", err);
      alert("Server error");
    }
  });

  // Delete account
  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete account permanently?")) return;

    try {
      const res = await fetch("http://localhost:3000/settings/delete-account", {
        method: "DELETE",
        credentials: "include"
      });

      if (!res.ok) {
        alert("Failed to delete account");
        return;
      }

      window.location.href = "/login";
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Server error");
    }
  });
});
