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

const displayPosts = async () => {
    try {
        const posts = await getAllPosts();
        const postContainer = document.getElementById("postContainer");

        postContainer.innerHTML = ""; 

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
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
        console.error("Feil ved henting av innlegg:", error.message);
    }
};

displayPosts();