// frontend/js/login.js
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    //console.error("Server response:", data);
    if (data.success) {
    //alert("Login successful!");
    // redirect user
    window.location.href = "/";

    } else {
    //alert("Login failed: " + data.message);
}

    //debugging
    //alert("Server error: " + JSON.stringify(data));

  } catch (err) {
    console.error("Network or parsing error:", err);
    alert("Something went wrong. Check console for details.");
  }
});

