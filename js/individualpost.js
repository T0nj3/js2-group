import { fetchPostById, sendComment, sendReactToPost } from './api.js';

async function seeOnePost() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const postId = urlParams.get("id");

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
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");

            const commentText = document.createElement("p");
            commentText.textContent = comment.body;

            const replyButton = document.createElement("button");
            replyButton.textContent = "Svar";
            replyButton.addEventListener("click", () => showReplyInput(comment.id, postId, commentElement));

            const replyContainer = document.createElement("div");
            replyContainer.classList.add("replies");

            if (comment.replies && comment.replies.length > 0) {
                comment.replies.forEach(reply => {
                    const replyElement = document.createElement("p");
                    replyElement.textContent = `↪ ${reply.body}`;
                    replyContainer.appendChild(replyElement);
                });
            }

            commentElement.appendChild(commentText);
            commentElement.appendChild(replyButton);
            commentElement.appendChild(replyContainer);

            commentContainer.appendChild(commentElement);
        });

    } catch (error) {
        console.error("Feil ved henting av kommentarer:", error);
    }
}

function showReplyInput(commentId, postId, commentElement) {
    const existingInput = commentElement.querySelector(".reply-input-container");
    if (existingInput) {
        existingInput.remove();
    }

    const replyContainer = document.createElement("div");
    replyContainer.classList.add("reply-input-container");

    const replyInput = document.createElement("input");
    replyInput.type = "text";
    replyInput.placeholder = "Skriv et svar...";
    replyInput.classList.add("reply-input");

    const sendReplyButton = document.createElement("button");
    sendReplyButton.textContent = "Post svar";
    sendReplyButton.addEventListener("click", () => sendReply(commentId, postId, replyInput.value, commentElement));

    replyContainer.appendChild(replyInput);
    replyContainer.appendChild(sendReplyButton);

    commentElement.appendChild(replyContainer);
}

async function sendReply(commentId, postId, replyText, commentElement) {
    if (!replyText.trim()) {
        console.error("Svaret er tomt.");
        return;
    }

    const accessToken = localStorage.getItem("token");

    if (!accessToken) {
        console.error("Ingen tilgangstoken funnet.");
        return;
    }

    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/comment`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "X-Noroff-API-Key": "580b33a9-04f3-4da3-bb38-de9adcf9d9f8",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                body: replyText
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Kunne ikke sende svaret.");
        }

        const replyElement = document.createElement("p");
        replyElement.textContent = `↪ ${replyText}`;
        commentElement.querySelector(".replies").appendChild(replyElement);

        commentElement.querySelector(".reply-input-container").remove();

        console.log("Svar sendt!");

    } catch (error) {
        console.error("Feil ved innsending av svar:", error);
    }
}

// Like-funksjon
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postId = urlParams.get("id");
const accessToken = localStorage.getItem('token');
const symbol = "👍";
const likeBtn = document.getElementById("likeBtn");

const likeButton = localStorage.getItem(`likeButton_${postId}`);

if (likeButton === "true") {
    likeBtn.textContent = "Likt";
} else {
    likeBtn.textContent = "Like";
}

likeBtn.addEventListener("click", async () => {
    try {
        const response = await sendReactToPost(postId, symbol, accessToken);

        console.log("API Response:", response);

        localStorage.setItem(`likeButton_${postId}`, "true");
        likeBtn.textContent = "Likt";

        alert("Du har likt innlegget!");
    } catch (error) {
        console.error("Feil ved innsending av like:", error);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const commentInput = document.getElementById("commentInput");

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

seeOnePost();