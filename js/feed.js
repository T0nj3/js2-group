function checkForToken(){
    if (localStorage.getItem('token') === null) {
        window.location.href = 'login.html';
    }
    else {
        console.log('User is logged in');
    }
}
checkForToken();

import { getAllPosts } from "./api.js";

const searchInput = document.getElementById("searchInput");
const postContainer = document.getElementById("postContainer");

const displayPosts = async (searchQuery = "") => {
    try {
        const posts = await getAllPosts();
        postContainer.innerHTML = "";

        const filteredPosts = posts.filter(post => {
            const title = post.title ? post.title.toLowerCase() : "";
            const body = post.body ? post.body.toLowerCase() : "";
            const tags = post.tags ? post.tags.map(tag => tag.toLowerCase()) : [];

            return title.includes(searchQuery.toLowerCase()) ||
                   body.includes(searchQuery.toLowerCase()) ||
                   tags.some(tag => tag.includes(searchQuery.toLowerCase()));
        });

        filteredPosts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <h2>${post.title || "No title"}</h2>
                <p>${post.body || "No content"}</p>
                <p><strong>Tags:</strong> ${post.tags ? post.tags.join(", ") : "No tags"}</p>
                ${post.media && post.media.url 
                    ? `<img src="${post.media.url}" alt="${post.media.alt || "Image"}" class="post-image">`
                    : ""
                }
            `;
            postElement.addEventListener("click", () => {
                window.location.href = `../post/individualpost.html?id=${post.id}`;
            });

            postContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching posts:", error.message);
    }
};

searchInput.addEventListener("input", () => {
    displayPosts(searchInput.value);
});

displayPosts();