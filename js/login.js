async function handelLogin(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            alert("Innlogging feilet. Sjekk om e-post og passord er riktig.");
            throw new Error("Innlogging feilet");
        }

        const data = await response.json();
        const token = data.accessToken; 
        const userEmail = data.email;
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", userEmail);
        
        window.location.href = "register.html";
        console.log(response);
    } catch (error) {
        console.error("Feil e-post eller passord", error);
    }
}
function isLoggedIn() {
    const token = localStorage.getItem("token");
    return token !== null; 
}

document.addEventListener("DOMContentLoaded", () => {
    if (isLoggedIn()) {
        const email = localStorage.getItem("brukerEmail");
        console.log(`Logget inn som: ${email}`);
    } else {
        console.log("Brukeren er ikke logget inn");
    }
});