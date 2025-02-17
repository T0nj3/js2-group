import { fetchProfile, fetchUserPosts } from './api.js';

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

    await fetchProfileData(profileUsername);
    await fetchUserPostsData(profileUsername);  
});

async function fetchProfileData(username) {
    try {
        const data = await fetchProfile(username);
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

async function fetchUserPostsData(username) {
    try {
        const data = await fetchUserPosts(username);
        console.log("User posts fetched:", data);
        displayUserPosts(data);
    } catch (error) {
        console.error("Error fetching user posts:", error.message);
    }
}

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
