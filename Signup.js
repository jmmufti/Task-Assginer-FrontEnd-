document.addEventListener("DOMContentLoaded", function () {
  const signUpForm = document.querySelector("#signUp-form");

  signUpForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent default form submission

      // Get user input values
      const username = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      const confirmPassword = document.querySelector("#confirmPassword").value;

      const apiUrl = "https://task-assginer.onrender.com/api/auth/signup"; // API endpoint

      // Basic validation before sending to the server
      if (password !== confirmPassword) {
          alert("Passwords do not match.");
          return;
      }

      if (password.length < 8) {
          alert("Password must be at least 8 characters.");
          return;
      }

      try {
          const response = await fetch(apiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, email, password }) // Send credentials
          });

          const data = await response.json();  // Parse the response

          if (!response.ok) {
              throw new Error(data.message || "Sign-up failed. Please try again.");
          }

          console.log("Sign-up successful:", data);  // Log success message

          // Store user data (excluding password)
          localStorage.setItem("user", JSON.stringify({
              _id: data._id,
              username: data.username,
              email: data.email,
              isAdmin: data.isAdmin,
              token: data.token
            
          }));

          window.location.href = "Main.html"; // Redirect after sign-up

      } catch (error) {
          console.error("Error:", error);  // Log the error
          alert(error.message); // Show error to the user
      }
  });
});
