/**
 * @function checkForToken
 * @description to check if the user has a token, if not then the user will be redirected to login.html
 */
function checkForToken() {
  if (localStorage.getItem("token") === null) {
    window.location.href = "../account/login.html";
  }
}
/** call the function for checkForToken */
checkForToken();

import { getAllPosts } from "./api.js";

const searchInput = document.getElementById("searchInput");
const postContainer = document.getElementById("postContainer");

const displayPosts = async (searchQuery = "") => {
  try {
    const posts = await getAllPosts();
    postContainer.innerHTML = "";

    const filteredPosts = posts.filter((post) => {
      const title = post.title ? post.title.toLowerCase() : "";
      const body = post.body ? post.body.toLowerCase() : "";
      const tags = post.tags ? post.tags.map((tag) => tag.toLowerCase()) : [];

      return (
        title.includes(searchQuery.toLowerCase()) ||
        body.includes(searchQuery.toLowerCase()) ||
        tags.some((tag) => tag.includes(searchQuery.toLowerCase()))
      );
    });

    filteredPosts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const titleElement = document.createElement("h2");
      titleElement.textContent = post.title || "No title";
      postElement.appendChild(titleElement);

      const bodyElement = document.createElement("p");
      bodyElement.textContent = post.body || "No content";
      postElement.appendChild(bodyElement);

      const tagsElement = document.createElement("p");
      const strongElement = document.createElement("strong");
      strongElement.textContent = "Tags: ";
      tagsElement.appendChild(strongElement);
      tagsElement.appendChild(
        document.createTextNode(post.tags ? post.tags.join(", ") : "No tags")
      );
      postElement.appendChild(tagsElement);

      if (post.media && post.media.url) {
        const imageElement = document.createElement("img");
        imageElement.src = post.media.url;
        imageElement.alt = post.media.alt || "Image";
        imageElement.classList.add("post-image");
        postElement.appendChild(imageElement);
      }

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
