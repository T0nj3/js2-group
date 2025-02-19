
/** Import fetch api from api.js */
import { login } from './api.js';  

/**
 * Handles login form submission.
 * Prevents default form submission, retrieves user input, and calls the login function.
 */
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();
/**  Get email and password from input fields */
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
/** Create object with variabels email and password */
    const userData = { email, password };

    try {
        /*** 
         * call the login function with userData as argument
         * {object} userData - object with email and password
         * @param {string} userData.email - The user's email address.
         * @param {string} userData.password - The user's password.
         * @returns {object} result - object with accessToken, email and name
        */
        const result = await login(userData);

/** if result is true, get token, email and name from result */
        if (result) {
            const token = result.accessToken;
            const userEmail = result.email;
            const userName = result.name;
/** if there is no token, email or name, it thorws an error message (token, email or name is undefined)*/
            if (!token || !userEmail || !userName) {
                throw new Error("Token, email or name is undefined!");
            }
/** save token, email and name in local storage */
            localStorage.setItem("token", token);
            localStorage.setItem("email", userEmail);
            localStorage.setItem("name", userName);

            document.getElementById("message").textContent = "Login successful! Redirecting to feed page...";
/** after 2 seconds, redirect to feedpage */
            setTimeout(() => {
                window.location.href = "../post/feedpage.html"; 
            }, 2000);
        }
/** if result is false, it throws an error message (somthing went wrong. Please try again)*/
    } catch (error) {
        console.error("Login failed:", error);
        document.getElementById("message").textContent = "Something went wrong. Please try again.";
    }
});