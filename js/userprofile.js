const X_NOROFF_API_KEY = '580b33a9-04f3-4da3-bb38-de9adcf9d9f8';
const API_BASE_URL = "https://v2.api.noroff.dev/social";

document.addEventListener("DOMContentLoaded", async function () {
    const username = localStorage.getItem("name");

    if (!username) {
        console.error("No user found in localStorage.");
        return;
    }

    await displayUserProfile(username);
    await displayUserPosts(username);

    const updateProfileBtn = document.getElementById("updateProfileBtn");
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener("click", async function () {
            const bio = document.getElementById("newBio").value.trim();
            const avatar = document.getElementById("newAvatar").value.trim();
            const banner = document.getElementById("newBanner").value.trim();
            await updateUserProfile(username, bio, avatar, banner);
            displayUserProfile(username);
        });
    }

    document.getElementById("createPostBtn").addEventListener("click", async function () {
        const title = document.getElementById("postTitle").value.trim();
        const body = document.getElementById("postBody").value.trim();
        const imageUrl = document.getElementById("postImage").value.trim();

        if (title && body) {
            await createPost(title, body, imageUrl);
            displayUserPosts(username);
            closeModal();
        }
    });

    setupModal();
});

async function displayUserProfile(username) {
    const profile = await getUserProfile(username);
    const profileContainer = document.getElementById("profileContainer");

    if (!profile) {
        console.error("Profile not found.");
        return;
    }

    profileContainer.innerHTML = `
        <div class="profile-details">
            <img src="${profile.banner?.url || 'https://via.placeholder.com/600x200'}" class="profile-banner">
            <div class="profile-header">
                <img src="${profile.avatar?.url || 'https://via.placeholder.com/150'}" class="profile-avatar">
                <div class="profile-info">
                    <h2>${profile.name}</h2>
                    <p>${profile.bio || 'No bio available'}</p>
                </div>
            </div>
        </div>
    `;
}

async function displayUserPosts(username) {
    const posts = await getUserPosts(username);
    const postsContainer = document.getElementById("postsContainer");

    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    postsContainer.innerHTML = posts.map(post => `
        <div class="post">
            <div class="post-actions">
                <button onclick="editPost('${post.id}')"><i class="fas fa-edit"></i></button>
                <button onclick="deleteUserPost('${post.id}')"><i class="fas fa-trash"></i></button>
            </div>
            <h3>${post.title}</h3>
            ${post.media?.url ? `<img src="${post.media.url}" alt="Post image">` : ""}
            <p class="post-author">By: ${post.author?.name || "Unknown"}</p>
        </div>
    `).join('');
}

async function getUserProfile(username) {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY
        }
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
}

async function updateUserProfile(username, bio, avatar, banner) {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY
        },
        body: JSON.stringify({ bio, avatar: { url: avatar }, banner: { url: banner } })
    });

    if (!response.ok) return null;
    return await response.json();
}

async function createPost(title, body, imageUrl) {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const postData = {
        title,
        body,
        media: imageUrl ? { url: imageUrl, alt: "Post image" } : null
    };

    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) return null;
    return await response.json();
}

async function getUserPosts(username) {
    const token = localStorage.getItem("token");
    if (!token) return [];

    const response = await fetch(`${API_BASE_URL}/profiles/${username}/posts`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY
        }
    });

    if (!response.ok) return [];
    const data = await response.json();
    return data.data || [];
}

async function deleteUserPost(postId) {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY
        }
    });

    if (!response.ok) return null;
    return await response.json();
}

async function editPost(postId) {
    const newTitle = prompt("Enter new title:");
    const newBody = prompt("Enter new content:");
    if (!newTitle || !newBody) return;

    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY
        },
        body: JSON.stringify({ title: newTitle, body: newBody })
    });

    if (!response.ok) return null;
    return await response.json();
}

function openPost(postId) {
    window.location.href = `/post/individualpost.html?id=${postId}`;
}

function setupModal() {
    const openPostFormBtn = document.getElementById("openPostForm");
    const newPostModal = document.getElementById("newPostModal");
    const closeModalBtn = document.querySelector("#newPostModal .close"); 

    openPostFormBtn.addEventListener("click", () => {
        newPostModal.style.display = "flex";
    });

    closeModalBtn.addEventListener("click", () => {
        newPostModal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === newPostModal) {
            newPostModal.style.display = "none";
        }
    });
}

window.editPost = editPost;
window.deleteUserPost = deleteUserPost;
window.openPost = openPost;