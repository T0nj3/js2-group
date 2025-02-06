import { fetchPostById, sendComment, sendReactToPost } from './api.js';

async function seeOnePost() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const postId = urlParams.get("id");;


    if (!postId) {
        console.error("Did not find Post ID.");
        return;
    }

    const accessToken = localStorage.getItem('token');

    if (!accessToken) {
        throw new Error('No access token found');
    }

    try {
        const post = await fetchPostById(postId, accessToken);

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

        await loadComments(postId);

    } catch (error) {
        console.error("Error:", error.message);
    }
}


async function loadComments(postId) {
    const accessToken = localStorage.getItem('token');

    if (!accessToken) {
        console.error("Ingen tilgangstoken funnet.");
        return;
    }

    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}?_comments=true`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "X-Noroff-API-Key": "580b33a9-04f3-4da3-bb38-de9adcf9d9f8",
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Kunne ikke hente kommentarer");
        }

        const commentContainer = document.getElementById("commentContainer");
        commentContainer.innerHTML = ""; 

        data.data.comments.forEach(comment => {
            const commentElement = document.createElement("p");
            commentElement.textContent = comment.body;
            commentContainer.appendChild(commentElement);
        });

    } catch (error) {
        console.error("Feil ved henting av kommentarer:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const commentInput = document.getElementById("commentInput");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const postId = urlParams.get("id");

    document.getElementById("commentBtn").addEventListener("click", async () => {
        const commentText = commentInput.value.trim(); 
        if (commentText === "") {
            console.error("Kommentaren er tom.");  
            return; 
        }

        try {
            await sendComment(postId, commentText, localStorage.getItem("token"));
            alert("Kommentar sendt!");

            commentInput.value = "";
            await loadComments(postId); 

        } catch (error) {
            console.error("Feil ved innsending av kommentar:", error);
        }
    });
});
const accessToken = localStorage.getItem('token');
const postId = 7259;  
const symbol = "👍";    

sendReactToPost(postId, symbol, accessToken)
    .then(response => {
        console.log("Reaction sent successfully:", response);
    })
    .catch(error => {
        console.error("Error sending reaction:", error);
    });


seeOnePost();