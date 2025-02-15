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
            await displayUserProfile(username);
        });
    }

    document.getElementById("createPostBtn").addEventListener("click", async function () {
        const title = document.getElementById("postTitle").value.trim();
        const body = document.getElementById("postBody").value.trim();
        const imageUrl = document.getElementById("postImage").value.trim();

        if (title && body) {
            await createPost(title, body, imageUrl);
            await displayUserPosts(username);
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
                    <h2>${profile.name} 
                        <button id="editProfileBtn" class="edit-profile-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                    </h2>
                    <p>${profile.bio || 'No bio available'}</p>
                </div>
            </div>
        </div>

        <div id="updateProfileSection" class="update-profile" style="display: none;">
            <h3>Update profile</h3>
            <input type="text" id="newAvatar" placeholder="New Avatar URL">
            <input type="text" id="newBanner" placeholder="New Banner URL">
            <textarea id="newBio" placeholder="Update bio"></textarea>
            <button id="updateProfileBtn">Update</button>
        </div>
    `;

    document.getElementById("editProfileBtn").addEventListener("click", function () {
        const updateSection = document.getElementById("updateProfileSection");
        updateSection.style.display = updateSection.style.display === "none" ? "block" : "none";
    });

    document.getElementById("updateProfileBtn").addEventListener("click", async function () {
        const bio = document.getElementById("newBio").value.trim();
        const avatar = document.getElementById("newAvatar").value.trim();
        const banner = document.getElementById("newBanner").value.trim();
        await updateUserProfile(username, bio, avatar, banner);
        await displayUserProfile(username);
    });
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

    if (!response.ok) {
        console.error("Failed to update profile.");
        return null;
    }
    
    return await response.json();
}

async function displayUserPosts(username) {
    const posts = await getUserPosts(username);
    const postsContainer = document.getElementById("postsContainer");

    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = "<p>No posts yet.</p>";
        return;
    }

    postsContainer.innerHTML = posts.map(post => `
        <div class="post" id="post-${post.id}">
            <div class="post-actions">
                <button onclick="openEditModal('${post.id}')"><i class="fas fa-edit"></i></button>
                <button onclick="deleteUserPost('${post.id}')"><i class="fas fa-trash"></i></button>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-body">${post.body}</p>
            ${post.media?.url ? `<img class="post-image" src="${post.media.url}" alt="Post image">` : ""}
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

async function deleteUserPost(postId) {
    const confirmation = confirm("Are you sure you want to delete this post?");
    if (!confirmation) return; 

    const token = localStorage.getItem("token");
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": X_NOROFF_API_KEY
        }
    });

    if (!response.ok) {
        alert("Failed to delete post. Please try again.");
        return null;
    }
 
    window.location.reload(); 
}

async function saveEditedPost() {
   

    const postId = document.getElementById("editPostModal").dataset.postId;
    if (!postId) {
        console.error("Post ID not found!");
        return;
    }

    const newTitle = document.getElementById("editPostTitle").value.trim();
    const newBody = document.getElementById("editPostBody").value.trim();
    const newImageUrl = document.getElementById("editPostImage").value.trim();

    if (!newTitle || !newBody) {
        console.error("Title and body cannot be empty!");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("User not authenticated!");
        return;
    }

   
    const updatedPost = {
        title: newTitle,
        body: newBody,
        media: newImageUrl ? { url: newImageUrl } : null
    };


    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": X_NOROFF_API_KEY
            },
            body: JSON.stringify(updatedPost)
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Failed to update post:", responseData);
            return;
        }

        await displayUserPosts(localStorage.getItem("name"));
        closeModal("editPostModal");

    } catch (error) {
        console.error("Error updating post:", error);
    }
}

function openEditModal(postId) {

    const postElement = document.getElementById(`post-${postId}`);
    if (!postElement) {
        return;
    }

    document.getElementById("editPostTitle").value = postElement.querySelector(".post-title")?.innerText || "";
document.getElementById("editPostBody").value = postElement.querySelector(".post-body")?.innerText || "";
document.getElementById("editPostImage").value = postElement.querySelector(".post-image")?.src || "";

    const modal = document.getElementById("editPostModal");
    modal.dataset.postId = postId;
   
    modal.style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

function setupModal() {
    const openPostFormBtn = document.getElementById("openPostForm");
    const newPostModal = document.getElementById("newPostModal");
    const closeNewPostModalBtn = newPostModal?.querySelector(".close");

    if (openPostFormBtn && newPostModal && closeNewPostModalBtn) {
        openPostFormBtn.addEventListener("click", () => {
            newPostModal.style.display = "flex";
        });

        closeNewPostModalBtn.addEventListener("click", () => {
            newPostModal.style.display = "none";
        });
    }
}

document.getElementById("saveEditPostBtn").addEventListener("click", saveEditedPost);

window.openEditModal = openEditModal;
window.deleteUserPost = deleteUserPost;
window.closeModal = closeModal;
