document.getElementById("signUpForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const errorMessage = document.getElementById("error-message");

  // Clear previous error messages
  errorMessage.textContent = "";

  // ✅ Check if all fields are filled
  if (!email || !password || !confirmPassword) {
      errorMessage.textContent = "Please fill in all fields.";
      return;
  }

  // ✅ Password length check
  if (password.length < 8) {
      errorMessage.textContent = "Password must be at least 8 characters long.";
      return;
  }

  // ✅ Password match check
  if (password !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match.";
      return;
  }

  const requestBody = { email, password };

  try {
      console.log("Sending request:", requestBody); // ✅ Debugging Log

      const response = await fetch("https://task-assginer.onrender.com/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Response:", data); // ✅ Debugging Log

      if (response.ok) {
          localStorage.setItem("token", data.token); // Store token securely
          window.location.href = "dashboard.html"; // Redirect to dashboard
      } else {
          errorMessage.textContent = data.message || "Signup failed.";
      }
  } catch (error) {
      console.error("Fetch error:", error); // ✅ Debugging Log
      errorMessage.textContent = "Network error. Please try again.";
  }
});
