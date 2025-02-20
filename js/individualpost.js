import {
  fetchPostById,
  sendComment,
  sendReactToPost,
  fetchComments,
} from "./api.js";

await seeOnePost();
setupLikeButton();
setupCommentButton();

async function seeOnePost() {
  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) return console.error("Did not find Post ID.");

  const accessToken = localStorage.getItem("token");
  if (!accessToken) throw new Error("No access token found");

  try {
    const post = await fetchPostById(postId, accessToken);
    const postContainer = document.getElementById("OnePost");
    if (!postContainer)
      return console.error("Element with id 'OnePost' not found");

    const titleElement = document.createElement("h2");
    titleElement.textContent = post.data.title;
    postContainer.appendChild(titleElement);

    const bodyElement = document.createElement("p");
    bodyElement.textContent = post.data.body;
    postContainer.appendChild(bodyElement);

    if (post.data.media?.url) {
      const imgElement = document.createElement("img");
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
  const accessToken = localStorage.getItem("token");
  if (!accessToken) return console.error("No access token found.");

  try {
    const data = await fetchComments(postId, accessToken);

    const commentContainer = document.getElementById("commentContainer");
    commentContainer.innerHTML = "";

    if (!data.comments?.length) {
      const noComments = document.createElement("p");
      noComments.textContent = "No comments yet. Be the first to comment!";
      noComments.classList.add("no-comments");
      commentContainer.appendChild(noComments);
      return;
    }

    data.comments.forEach((comment) => {
      const commentElement = document.createElement("div");
      commentElement.classList.add("comment");

      const commentText = document.createElement("p");
      commentText.textContent = comment.body;

      const replyButton = document.createElement("button");
      replyButton.textContent = "Reply";
      replyButton.classList.add("reply-btn");
      replyButton.addEventListener("click", () =>
        showReplyInput(comment.id, postId, commentElement)
      );

      const replyContainer = document.createElement("div");
      replyContainer.classList.add("replies");

      comment.replies?.forEach((reply) => {
        const replyElement = document.createElement("p");
        replyElement.textContent = `↪ ${reply.body}`;
        replyContainer.appendChild(replyElement);
      });

      commentElement.append(commentText, replyButton, replyContainer);
      commentContainer.appendChild(commentElement);
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
}

function showReplyInput(commentId, postId, commentElement) {
  const existingInput = commentElement.querySelector(".reply-input-container");
  if (existingInput) existingInput.remove();

  const replyContainer = document.createElement("div");
  replyContainer.classList.add("reply-input-container");

  const replyInput = document.createElement("input");
  replyInput.type = "text";
  replyInput.placeholder = "Write a reply...";
  replyInput.classList.add("reply-input");

  const sendReplyButton = document.createElement("button");
  sendReplyButton.textContent = "Post reply";
  sendReplyButton.addEventListener("click", () =>
    sendReply(commentId, postId, replyInput.value, commentElement)
  );

  replyContainer.append(replyInput, sendReplyButton);
  commentElement.appendChild(replyContainer);
}

async function sendReply(commentId, postId, replyText, commentElement) {
  if (!replyText.trim()) return console.error("Reply is empty.");

  const accessToken = localStorage.getItem("token");
  if (!accessToken) return console.error("No access token found.");

  try {
    await sendComment(postId, replyText, accessToken);
    await loadComments(postId);
  } catch (error) {
    console.error("Error sending reply:", error);
  }
}

function setupCommentButton() {
  const commentBtn = document.getElementById("commentBtn");
  const commentInput = document.getElementById("commentInput");
  if (!commentBtn || !commentInput) return;

  commentBtn.addEventListener("click", async () => {
    const postId = new URLSearchParams(window.location.search).get("id");
    const commentText = commentInput.value.trim();
    if (!commentText) return console.error("Comment is empty");

    try {
      await sendComment(postId, commentText, localStorage.getItem("token"));
      commentInput.value = "";
      await loadComments(postId);
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  });
}

function setupLikeButton() {
  const postId = new URLSearchParams(window.location.search).get("id");
  const likeBtn = document.getElementById("likeBtn");
  if (!likeBtn) return;

  const likeStatus = localStorage.getItem(`likeButton_${postId}`);
  likeBtn.textContent = likeStatus === "true" ? "Liked!" : "Like";

  likeBtn.addEventListener("click", async () => {
    try {
      await sendReactToPost(postId, "👍", localStorage.getItem("token"));
      localStorage.setItem(`likeButton_${postId}`, "true");
      likeBtn.textContent = "Liked";
    } catch (error) {
      console.error("Error sending like:", error);
    }
  });
}
