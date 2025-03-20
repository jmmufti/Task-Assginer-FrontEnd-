document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get user input values
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        const apiUrl = "https://task-assginer.onrender.com/api/auth/login"; // API endpoint

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }) // Send credentials
            });

            const data = await response.json();  // Parse the response

            if (!response.ok) {
                throw new Error(data.message || "Invalid credentials. Please try again.");
            }

            console.log("Login successful:", data);  // Log success message

            // Store user data (excluding password)
            localStorage.setItem("user", JSON.stringify({
                _id: data._id,
                username: data.username,
                email: data.email,
                isAdmin: data.isAdmin,
                token: data.token
            }));

            //////////////////////////////////////////////////
            /////////PLACEHOLDER FOR HOME PAGE ///////////////
            /////////////////////////////////////////////////
            window.location.href = "Main.html"; // Redirect after login

        } catch (error) {
            console.error("Error:", error);  // Log the error
            alert(error.message); // Show error to the user
        }
    });
});
