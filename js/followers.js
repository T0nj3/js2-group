const API_BASE_URL = "https://v2.api.noroff.dev/social";
const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";
const token = localStorage.getItem("token");
const username = localStorage.getItem("name");

document.addEventListener("DOMContentLoaded", () => {
    if (!token || !username) {
        console.error("No token or username found.");
        return;
    }

    fetchProfiles();
    setupSearch();
});

async function fetchProfiles() {
    try {
        const response = await fetch(`${API_BASE_URL}/profiles?sort=updated&sortOrder=desc&limit=100`, {
            headers: { 
                "Authorization": `Bearer ${token}`, 
                "X-Noroff-API-Key": X_NOROFF_API_KEY 
            }
        });

        if (!response.ok) throw new Error("Failed to fetch profiles.");

        const data = await response.json();
        

       
        displayProfiles(data.data);

    } catch (error) {
        console.error(error.message);
    }
}

function displayProfiles(profiles) {
    const container = document.getElementById("profilesContainer");
    container.innerHTML = ""; 

    profiles.forEach(profile => {
        const profileCard = document.createElement("div");
        profileCard.className = "profile-card";

        const isFollowing = profile.followers?.some(f => f.name === localStorage.getItem("name"));

        profileCard.innerHTML = `
            <img src="${profile.avatar?.url || 'https://via.placeholder.com/150'}" alt="${profile.name}">
            <h4>${profile.name}</h4>
            <button class="follow-btn" data-username="${profile.name}">
                ${isFollowing ? "Unfollow" : "Follow"}
            </button>
            <a href="../post/profileview.html?profile=${encodeURIComponent(profile.name)}" class="view-profile-btn">View Profile</a>
        `;

        container.appendChild(profileCard);
    });

    

   
    document.querySelectorAll(".follow-btn").forEach(button => {
        button.addEventListener("click", () => {
            toggleFollow(button.dataset.username, button);
        });
    });
}

async function fetchUserProfile(username) {
    try {
        const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
            headers: { "Authorization": `Bearer ${token}`, "X-Noroff-API-Key": X_NOROFF_API_KEY }
        });

        if (!response.ok) throw new Error("Failed to fetch user profile.");

        return (await response.json()).data;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

function setupSearch() {
    document.getElementById("searchProfiles").addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const profileCards = document.querySelectorAll(".profile-card");

        profileCards.forEach(card => {
            const name = card.querySelector("h4").innerText.toLowerCase();
            card.style.display = name.includes(query) ? "block" : "none";
        });
    });
}