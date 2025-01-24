async function handelLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            alert("Innlogging feilet. Sjekk om e-post og passord er riktig.");
            throw new Error("Innlogging feilet");
        }

        const data = await response.json();
        console.log("API response data:", data); 
        const token = data.data.accessToken;
        const userEmail = data.data.email;

        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", userEmail);
        console.log("Token and email saved in localStorage.");
        window.location.href = "../feedpage.html";
    } catch (error) {
        console.error("Innlogging feilet:", error);
    }
}

function checkIfLoggedIn() {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    if (token && userEmail) {
        console.log("User is logged in");
        return true;
    } else {
        console.log("User is not logged in");
        return false;
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    console.log("User logged out.");
    updateUI();
}

checkIfLoggedIn();
