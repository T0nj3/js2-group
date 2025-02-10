const API_BASE_URL = "https://v2.api.noroff.dev/social";
const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";
const token = localStorage.getItem("token");
const username = localStorage.getItem("name");

document.addEventListener("DOMContentLoaded", async () => {
    if (!token || !username) {
        console.error("No token or username found.");
        return;
    }

    await fetchProfiles();
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

        const followButton = document.createElement("button");
        followButton.className = "follow-btn";
        followButton.dataset.username = profile.name;


        const followingList = JSON.parse(localStorage.getItem("followingList")) || [];
        const isFollowing = followingList.includes(profile.name);
        followButton.textContent = isFollowing ? "Followed" : "Follow";

        followButton.addEventListener("click", async () => {
            await toggleFollow(profile.name, followButton);
        });

        profileCard.innerHTML = `
            <img src="${profile.avatar?.url || 'https://via.placeholder.com/150'}" alt="${profile.name}">
            <h4>${profile.name}</h4>
            <a href="../post/profileview.html?profile=${encodeURIComponent(profile.name)}" class="view-profile-btn">View Profile</a>
        `;

        profileCard.appendChild(followButton);
        container.appendChild(profileCard);
    });
}

async function toggleFollow(profileName, button) {
    const followingList = JSON.parse(localStorage.getItem("followingList")) || [];
    const isFollowing = followingList.includes(profileName);

    try {
        let url;
        if (isFollowing) {

            console.log(`Attempting to unfollow ${profileName}`);
            url = `${API_BASE_URL}/profiles/${profileName}/unfollow`;
        } else {

            console.log(`Attempting to follow ${profileName}`);
            url = `${API_BASE_URL}/profiles/${profileName}/follow`;
        }


        console.log("API Request URL: ", url);
        console.log("Method: PUT");
        console.log("Headers: ", {
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY,
            "Content-Type": "application/json"
        });

        const response = await fetch(url, {
            method: "PUT",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": X_NOROFF_API_KEY,
                "Content-Type": "application/json"
            }
        });

        const responseData = await response.json();
        console.log("Response Status: ", response.status);
        console.log("Response Data: ", responseData);

        if (!response.ok) {
            throw new Error(isFollowing ? "Failed to unfollow user." : "Failed to follow user.");
        }


        if (isFollowing) {
            const newFollowingList = followingList.filter(name => name !== profileName);
            localStorage.setItem("followingList", JSON.stringify(newFollowingList));
            button.textContent = "Follow";
            console.log(`${username} has unfollowed ${profileName}`); 
        } else {
            followingList.push(profileName);
            localStorage.setItem("followingList", JSON.stringify(followingList));
            button.textContent = "Followed";
            console.log(`${username} has followed ${profileName}`);
        }
    } catch (error) {
        console.error("Error: ", error.message);
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
