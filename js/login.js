

import { login } from './api.js';  

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = { email, password };

    try {

        const result = await login(userData);

        console.log("Full API Response:", result); 

        if (result) {
            const token = result.accessToken;
            const userEmail = result.email;
            const userName = result.name;

            console.log("Token:", token);
            console.log("Email:", userEmail);
            console.log("Name:", userName);

            if (!token || !userEmail || !userName) {
                throw new Error("Token, email or name is undefined!");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("email", userEmail);
            localStorage.setItem("name", userName);

            document.getElementById("message").textContent = "Login successful! Redirecting to feed page...";

            setTimeout(() => {
                window.location.href = "../post/feedpage.html"; 
            }, 2000);
        }
    } catch (error) {
        console.error("Login failed:", error);
        document.getElementById("message").textContent = "Something went wrong. Please try again.";
    }
});



