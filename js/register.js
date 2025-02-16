import { registerUser } from "./api.js";

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    const userData = { name, email, password };

    try {
        const result = await registerUser(userData);

        if (result.errors) {
            messageElement.textContent = "Error: " + result.errors[0].message;
        } else {
            messageElement.textContent = "Registration successful! Redirecting to login...";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    } catch (error) {
        messageElement.textContent = "Something went wrong. Please try again.";
    }
});

