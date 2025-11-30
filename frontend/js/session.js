document.addEventListener("DOMContentLoaded", async () => {
  const usernameSpan = document.getElementById("sidebar-username");
  if (!usernameSpan) return;

  try {
    const res = await fetch("/api/auth/session", {
      credentials: "include"
    });

    const data = await res.json();

    if (data.loggedIn && data.user) {
      usernameSpan.textContent = data.user.username;
    } else {
      usernameSpan.textContent = "Account";
    }
  } catch (err) {
    console.error("Session check failed:", err);
  }
});
