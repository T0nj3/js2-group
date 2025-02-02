import { fetchPostById } from './api.js';

async function seeOnePost() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const postId = urlParams.get("id");

    console.log("Post ID from URL:", postId);

    if (!postId) {
        console.error("Did not find Post ID.");
        return;
    }

    const accessToken = localStorage.getItem('token');
    console.log("Access token from localStorage:", accessToken);

    if (!accessToken) {
        throw new Error('No access token found');
    }

    try {
        const post = await fetchPostById(postId, accessToken);
        console.log("Post data:", post);

        const postContainer = document.getElementById("OnePost");

        if (!postContainer) {
            console.error("Element with id 'OnePost' not found in the DOM");
            return;
        }

        const titleElement = document.createElement("h2");
        titleElement.textContent = post.data.title;  
        postContainer.appendChild(titleElement);

        const bodyElement = document.createElement("p");
        bodyElement.textContent = post.data.body;  
        postContainer.appendChild(bodyElement);

        const imgElement = document.createElement("img");
        if (post.data.media && post.data.media.url) {
            imgElement.src = post.data.media.url;
            imgElement.alt = "Post image";
            postContainer.appendChild(imgElement);
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

seeOnePost();

import { sendComment } from './api.js'; 

document.getElementById("commentBtn").addEventListener("click", async () => {
    const commentInput = document.getElementById("commentInput");
    const commentText = commentInput.value.trim(); 
    if (commentText === "") {
        console.log("Kommentar kan ikke være tom!");
        return; 
    }

   
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const postId = urlParams.get("id");

    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
        console.error("Ingen tilgangstoken funnet!");
        return;
    }

    
    try {
        const response = await sendComment(postId, commentText, accessToken);
        console.log("Kommentar sendt:", response);

        
        const commentContainer = document.getElementById("commentContainer");
        const newComment = document.createElement("p");
        newComment.textContent = commentText;
        commentContainer.appendChild(newComment);

        
        commentInput.value = "";
    } catch (error) {
        console.error("Feil ved innsending av kommentar:", error);
    }
});