export const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const profiles = await fetchAllProfiles();
        displayAllProfiles(profiles);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        document.getElementById("profileContainer").innerHTML = "<p>Could not retrieve profiles.</p>";
    }
});


async function fetchAllProfiles() {
    const API_BASE_URL = "https://v2.api.noroff.dev/social/profiles?limit=100"; 
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No access token found. User is not logged in.");
    }

    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY
    };

    console.log("Fetching all profiles from API:", API_BASE_URL);

    const response = await fetch(API_BASE_URL, { headers });

    if (!response.ok) {
        console.error("Failed API request:", response.status);
        return [];
    }

    const data = await response.json();
    return data.data || [];
}


function displayAllProfiles(profiles) {
    const profileContainer = document.getElementById("profileContainer");

    if (profiles.length === 0) {
        profileContainer.innerHTML = "<p>No profiles found.</p>";
        return;
    }

    profileContainer.innerHTML = profiles.map(profile => `
        <div class="profile-card">
            <img src="${profile.avatar?.url || 'https://via.placeholder.com/150'}" 
                 alt="${profile.avatar?.alt || 'Profile picture'}" 
                 class="profile-avatar">
            <h3>${profile.name || 'Unknown User'}</h3>
            <p>${profile.bio || 'No bio available.'}</p>
            <a href="../post/profileview.html?profile=${encodeURIComponent(profile.name)}" class="view-profile-btn">View Profile</a>
        </div>
    `).join('');
}