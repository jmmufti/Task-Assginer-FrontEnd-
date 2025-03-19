function validateForm() {
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return false;
    }
    alert("Sign Up Successful!");
    return true;
}
