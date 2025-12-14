console.log("SETTINGS JS LOADED");

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("saveChangesBtn");
  const deleteBtn = document.getElementById("deleteAccountBtn");
  const usernameInput = document.getElementById("username");

  saveBtn.addEventListener("click", async () => {
    const res = await fetch("/api/user/username", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: usernameInput.value })
    });

    if (!res.ok) alert("Failed to update username");
    else alert("Username updated");
  });

  deleteBtn.addEventListener("click", async () => {
    if (!confirm("Delete account permanently?")) return;

    await fetch("/settings/delete-account", {
      method: "DELETE",
      credentials: "include"
    });

    window.location.href = "/login";
  });
});
