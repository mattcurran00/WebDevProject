/*// frontend/js/signup.js

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // Display error returned from backend
        alert(`Signup failed: ${data.message || "Unknown error"}`);
        console.error("Backend error:", data);
        return;
      }

      // Success
      alert("Signup successful! Welcome, " + data.user.username);
      console.log("Signup response:", data);

      // Optionally redirect to login page
      // window.location.href = "/html/login.html";

    } catch (err) {
      console.error("Network or parsing error:", err);
      alert("An unexpected error occurred. Check console for details.");
    }
  });
});
*/
// signup.js
const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    console.log("Server response:", data);

    if (data.success) {
      alert("Account created successfully!");
      window.location.href = "/login";
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Network or parsing error:", err);
    alert("Something went wrong. Check console for details.");
  }

    console.log("Signup payload:", { username, password });
    console.log("Password hash:", password_hash);

    const { data, error } = await supabase
        .from("users")
        .insert([{ username, password_hash }])
        .select();

    console.log("Supabase response:", { data, error });

});