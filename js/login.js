export const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";

document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = { email, password };

    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-Noroff-API-Key": X_NOROFF_API_KEY
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        console.log("Full API Response:", result); 

        if (response.ok) {
            if (!result.data) {
                throw new Error("Data is undefined!");
            }

            const token = result.data.accessToken;
            const userEmail = result.data.email;
            const userName = result.data.name;

            console.log("Token:", token);
            console.log("Email:", userEmail);
            console.log("Name:", userName);

            if (!token || !userEmail || !userName) {
                throw new Error("Token, email or navn is undefined!");
            }

            localStorage.setItem("token", token);
            localStorage.setItem("email", userEmail);
            localStorage.setItem("name", userName);

            document.getElementById("message").textContent = "Login successful! Redirecting to feed page...";

            setTimeout(() => {
                window.location.href = "../post/feedpage.html"; 
            }, 2000);
        } else {
            console.error("Feilrespons fra API:", result);
            document.getElementById("message").textContent = "Error: " + (result.errors ? result.errors[0].message : "Unknown error");
        }
    } catch (error) {
        console.error("Innloggingsfeil:", error);
        document.getElementById("message").textContent = "something went wrong. Please try again.";
    }
});


