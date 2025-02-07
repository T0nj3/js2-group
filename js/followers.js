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
    fetchUserFollowStats();

    document.getElementById("showFollowersBtn").addEventListener("click", fetchFollowers);
    document.getElementById("showFollowingBtn").addEventListener("click", fetchFollowing);
});


async function fetchProfiles() {
    try {
        const response = await fetch(`${API_BASE_URL}/profiles?sort=updated&sortOrder=desc&limit=100`, {
            headers: { 
                "Authorization": `Bearer ${token}`, 
                "X-Noroff-API-Key": X_NOROFF_API_KEY 
            }
        });

        if (!response.ok) throw new Error("Kunne ikke hente profiler.");

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
        `;

        container.appendChild(profileCard);
    });

   
    document.querySelectorAll(".follow-btn").forEach(button => {
        button.addEventListener("click", () => {
            toggleFollow(button.dataset.username, button);
        });
    });
}

async function toggleFollow(username, button) {
    

    if (!username || username.trim() === "") {
        console.error("Invalid username");
        return;
    }

    const isFollowing = button.innerText === "Unfollow";
    const endpoint = isFollowing ? "unfollow" : "follow";

    try {
        const response = await fetch(`${API_BASE_URL}/profiles/${username}/${endpoint}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": X_NOROFF_API_KEY
            }
        });

        if (!response.ok) {
            let errorMessage = `Failed to ${endpoint} user: ${username}`;
            try {
                const errorData = await response.json();
                if (errorData.errors) {
                    errorMessage += ` - ${errorData.errors[0].message}`;
                }
            } catch (jsonError) {
                console.error("Could not parse error response");
            }

            console.error(errorMessage);
            alert(errorMessage);
            return;
        }

       
        
        
        button.innerText = isFollowing ? "Follow" : "Unfollow";
    } catch (error) {
        console.error("Network error or API is down:", error);
        alert("Network error, please try again later.");
    }
}

fetchProfiles();

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


async function fetchUserFollowStats() {
    try {
        const profile = await fetchUserProfile(username);
        if (!profile) return;

        document.getElementById("followersCount").textContent = profile.followers?.length || 0;
        document.getElementById("followingCount").textContent = profile.following?.length || 0;
    } catch (error) {
        console.error("Failed to fetch follow stats:", error);
    }
}


async function fetchFollowers() {
    try {
        const profile = await fetchUserProfile(username);
        if (!profile) return;

        displayFollowers(profile.followers);
    } catch (error) {
        console.error("Failed to fetch followers:", error);
    }
}


function displayFollowers(followers) {
    const list = document.getElementById("followersList");
    list.innerHTML = followers.map(f => `<li>${f.name}</li>`).join('');
    document.getElementById("followersModal").style.display = "flex";
}


async function fetchFollowing() {
    try {
        const profile = await fetchUserProfile(username);
        if (!profile) return;

        displayFollowing(profile.following);
    } catch (error) {
        console.error("Failed to fetch following:", error);
    }
}


function displayFollowing(following) {
    const list = document.getElementById("followingList");
    list.innerHTML = following.map(f => `<li>${f.name}</li>`).join('');
    document.getElementById("followingModal").style.display = "flex";
}


function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
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

window.toggleFollow = toggleFollow;
window.closeModal = closeModal;