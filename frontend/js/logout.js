document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });

      if (!res.ok) {
        alert("Logout failed");
        return;
      }

      // Redirect to index page after logout
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  });
});
