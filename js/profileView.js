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
        console.error("No 'profile' parameter found in URL.");
        return;
    }

    await fetchProfile(profileUsername);
    await fetchUserPosts(profileUsername);  
});

async function fetchProfile(username) {
    try {
        const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": X_NOROFF_API_KEY,
            },
        });

        if (!response.ok) throw new Error("Could not fetch profile.");

        const data = await response.json();
        console.log("Profile fetched:", data);

        displayProfile(data);  
    } catch (error) {
        console.error("Error fetching profile:", error.message);
    }
}

function displayProfile(data) {
    if (!data || typeof data !== "object") {
        console.error("Invalid profile data received:", data);
        return;
    }

    const profileContainer = document.getElementById("profileContainer");
    if (!profileContainer) {
        console.error("Error: Could not find #profileContainer");
        return;
    }

    profileContainer.innerHTML = "";  

    const nameElement = document.createElement("h2");
    nameElement.textContent = data.data.name;

    const bioElement = document.createElement("p");
    bioElement.textContent = data.data.bio || "No bio available.";

    const avatarElement = document.createElement("img");
    avatarElement.src = data.data.avatar?.url || "default-avatar.png"; 
    avatarElement.alt = "Profile picture";
    avatarElement.width = 150;

    profileContainer.appendChild(nameElement);
    profileContainer.appendChild(bioElement);
    profileContainer.appendChild(avatarElement);
}

/* ✅ Henter alle innleggene til brukeren */
async function fetchUserPosts(username) {
    try {
        const response = await fetch(`${API_BASE_URL}/profiles/${username}/posts`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": X_NOROFF_API_KEY,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error("Could not fetch user posts.");

        const data = await response.json();
        console.log("User posts fetched:", data);

        displayUserPosts(data);
    } catch (error) {
        console.error("Error fetching user posts:", error.message);
    }
}

/* ✅ Viser innleggene på profilsiden */
function displayUserPosts(data) {
    const postsContainer = document.getElementById("postsContainer");
    if (!postsContainer) {
        console.error("Error: Could not find #postsContainer");
        return;
    }

    postsContainer.innerHTML = "";  

    if (!data || !data.data || data.data.length === 0) {
        const noPostsMessage = document.createElement("p");
        noPostsMessage.textContent = "No posts available.";
        noPostsMessage.classList.add("no-posts");
        postsContainer.appendChild(noPostsMessage);
        return;
    }

    data.data.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const titleElement = document.createElement("h3");
        titleElement.textContent = post.title;

        const bodyElement = document.createElement("p");
        bodyElement.textContent = post.body;

        if (post.media && post.media.url) {
            const imgElement = document.createElement("img");
            imgElement.src = post.media.url;
            imgElement.alt = "Post image";
            imgElement.classList.add("post-image");
            postElement.appendChild(imgElement);
        }

        postElement.appendChild(titleElement);
        postElement.appendChild(bodyElement);

        postElement.addEventListener("click", () => {
            window.location.href = `../post/individualpost.html?id=${post.id}`;
        });

        postsContainer.appendChild(postElement);
    });
}