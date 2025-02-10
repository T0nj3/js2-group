const X_NOROFF_API_KEY = '580b33a9-04f3-4da3-bb38-de9adcf9d9f8';
const API_BASE_URL = "https://v2.api.noroff.dev/social";

const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async function () {
    if (!token) {
        console.error("No token found.");
        return;
    }


    const urlParams = new URLSearchParams(window.location.search);
    const profileUsername = urlParams.get('profile');  

    if (!profileUsername) {
        console.error("Ingen 'profile' parameter funnet i URL.");
        return;
    }

    await fetchProfile(profileUsername);  
});

async function fetchProfile(username) {
    try {
        const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": X_NOROFF_API_KEY,
            },
        });

        if (!response.ok) throw new Error("Kunne ikke hente profilen.");

        const data = await response.json();
        console.log("Profil hentet:", data);

        displayProfile(data);  
    } catch (error) {
        console.error("Feil ved henting av profilen:", error.message);
    }
}

function displayProfile(data) {
    if (!data || typeof data !== "object") {
        console.error("Ugyldig profildata mottatt:", data);
        return;
    }

    const profileContainer = document.getElementById("profileContainer");


    const nameElement = document.createElement("h2");
    nameElement.textContent = data.name;

    const bioElement = document.createElement("p");
    bioElement.textContent = data.bio || "Ingen bio tilgjengelig.";


    const avatarElement = document.createElement("img");
    avatarElement.src = data.avatar || "default-avatar.png";
    avatarElement.alt = "Profilbilde";
    avatarElement.width = 150;


    profileContainer.appendChild(nameElement);
    profileContainer.appendChild(bioElement);
    profileContainer.appendChild(avatarElement);
}
