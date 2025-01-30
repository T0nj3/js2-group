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

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
            `;
            postContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error.message);
    }
};
displayPosts();