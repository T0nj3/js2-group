import {
  updateUserProfile,
  getUserProfile,
  getUserPosts,
  createPost,
  deleteUserPost,
  saveEditedPost,
} from "./api.js";

async function init() {
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

  document
    .getElementById("createPostBtn")
    .addEventListener("click", async function () {
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
}
init();

async function displayUserProfile(username) {
  const profile = await getUserProfile(username);
  const profileContainer = document.getElementById("profileContainer");

  if (!profile) {
    console.error("Profile not found.");
    return;
  }

  profileContainer.innerHTML = "";

  const profileDetails = document.createElement("div");
  profileDetails.className = "profile-details";

  const banner = document.createElement("img");
  banner.src = profile.banner?.url || "https://via.placeholder.com/600x200";
  banner.className = "profile-banner";

  const profileHeader = document.createElement("div");
  profileHeader.className = "profile-header";

  const avatar = document.createElement("img");
  avatar.src = profile.avatar?.url || "https://via.placeholder.com/150";
  avatar.className = "profile-avatar";

  const profileInfo = document.createElement("div");
  profileInfo.className = "profile-info";

  const nameElement = document.createElement("h2");
  nameElement.textContent = profile.name;

  const editButton = document.createElement("button");
  editButton.id = "editProfileBtn";
  editButton.className = "edit-profile-btn";

  const editIcon = document.createElement("i");
  editIcon.className = "fas fa-edit";

  editButton.appendChild(editIcon);
  nameElement.appendChild(editButton);

  const bioElement = document.createElement("p");
  bioElement.textContent = profile.bio || "No bio available";

  profileInfo.appendChild(nameElement);
  profileInfo.appendChild(bioElement);
  profileHeader.appendChild(avatar);
  profileHeader.appendChild(profileInfo);
  profileDetails.appendChild(banner);
  profileDetails.appendChild(profileHeader);
  profileContainer.appendChild(profileDetails);

  const updateProfileSection = document.createElement("div");
  updateProfileSection.id = "updateProfileSection";
  updateProfileSection.className = "update-profile";
  updateProfileSection.style.display = "none";

  const updateTitle = document.createElement("h3");
  updateTitle.textContent = "Update profile";

  const avatarInput = document.createElement("input");
  avatarInput.type = "text";
  avatarInput.id = "newAvatar";
  avatarInput.placeholder = "New Avatar URL";

  const bannerInput = document.createElement("input");
  bannerInput.type = "text";
  bannerInput.id = "newBanner";
  bannerInput.placeholder = "New Banner URL";

  const bioTextarea = document.createElement("textarea");
  bioTextarea.id = "newBio";
  bioTextarea.placeholder = "Update bio";

  const updateButton = document.createElement("button");
  updateButton.id = "updateProfileBtn";
  updateButton.textContent = "Update";

  updateProfileSection.appendChild(updateTitle);
  updateProfileSection.appendChild(avatarInput);
  updateProfileSection.appendChild(bannerInput);
  updateProfileSection.appendChild(bioTextarea);
  updateProfileSection.appendChild(updateButton);

  profileContainer.appendChild(updateProfileSection);

  editButton.addEventListener("click", function () {
    updateProfileSection.style.display =
      updateProfileSection.style.display === "none" ? "block" : "none";
  });
}

async function displayUserPosts(username) {
  const posts = await getUserPosts(username);
  const postsContainer = document.getElementById("postsContainer");

  postsContainer.innerHTML = "";

  if (!posts || posts.length === 0) {
    const noPostsMessage = document.createElement("p");
    noPostsMessage.textContent = "No posts yet.";
    postsContainer.appendChild(noPostsMessage);
    return;
  }

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.id = `post-${post.id}`;

    const postActions = document.createElement("div");
    postActions.className = "post-actions";

    const editButton = document.createElement("button");
    const editIcon = document.createElement("i");
    editIcon.className = "fas fa-edit";
    editButton.appendChild(editIcon);

    editButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openEditModal(post.id);
    });

    const deleteButton = document.createElement("button");
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash";
    deleteButton.appendChild(deleteIcon);

    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteUserPost(post.id);
    });

    postActions.appendChild(editButton);
    postActions.appendChild(deleteButton);

    const titleElement = document.createElement("h3");
    titleElement.className = "post-title";
    titleElement.textContent = post.title;

    const bodyElement = document.createElement("p");
    bodyElement.className = "post-body";
    bodyElement.textContent = post.body;

    if (post.media?.url) {
      const imageElement = document.createElement("img");
      imageElement.className = "post-image";
      imageElement.src = post.media.url;
      imageElement.alt = "Post image";
      postElement.appendChild(imageElement);
    }

    const authorElement = document.createElement("p");
    authorElement.className = "post-author";
    authorElement.textContent = `Posted by: ${post.author?.name || "unknown"}`;

    postElement.appendChild(titleElement);
    postElement.appendChild(postActions);
    postElement.appendChild(authorElement);
    postElement.appendChild(bodyElement);

    postElement.addEventListener("click", () => {
      window.location.href = `../post/individualpost.html?id=${post.id}`;
    });

    postsContainer.appendChild(postElement);
  });
}

function openEditModal(postId) {
  const postElement = document.getElementById(`post-${postId}`);
  if (!postElement) {
    return;
  }

  document.getElementById("editPostTitle").value =
    postElement.querySelector(".post-title")?.innerText || "";
  document.getElementById("editPostBody").value =
    postElement.querySelector(".post-body")?.innerText || "";
  document.getElementById("editPostImage").value =
    postElement.querySelector(".post-image")?.src || "";

  const modal = document.getElementById("editPostModal");
  modal.dataset.postId = postId;
  modal.classList.add("active");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

function setupModal() {
  const openPostFormBtn = document.getElementById("openPostForm");
  const newPostModal = document.getElementById("newPostModal");
  const closeNewPostModalBtn = newPostModal?.querySelector(".close");

  if (openPostFormBtn && newPostModal && closeNewPostModalBtn) {
    openPostFormBtn.addEventListener("click", () => {
      newPostModal.classList.add("active");
    });

    closeNewPostModalBtn.addEventListener("click", () => {
      newPostModal.classList.remove("active");
    });
  }
}

document
  .getElementById("saveEditPostBtn")
  .addEventListener("click", function () {
    const postId = document.getElementById("editPostModal").dataset.postId;
    const newTitle = document.getElementById("editPostTitle").value.trim();
    const newBody = document.getElementById("editPostBody").value.trim();
    const newImageUrl = document.getElementById("editPostImage").value.trim();

    if (postId && newTitle && newBody) {
      saveEditedPost(postId, newTitle, newBody, newImageUrl).then(
        (response) => {
          closeModal("editPostModal");
          displayUserPosts(localStorage.getItem("name"));
        }
      );
    } else {
      console.error("Post ID, title, or body is missing.");
    }
  });

window.openEditModal = openEditModal;
window.deleteUserPost = deleteUserPost;
window.closeModal = closeModal;

function test() {
  const toggleButtons = document.querySelectorAll(".toggle-button");
  const sections = document.querySelectorAll(".content-section");

  if (toggleButtons.length > 0 && sections.length > 0) {
    toggleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        toggleButtons.forEach((btn) => btn.classList.remove("active"));
        sections.forEach((section) => section.classList.remove("active"));

        this.classList.add("active");
        document.getElementById(this.dataset.target).classList.add("active");
      });
    });
  } else {
    console.warn("Toggle buttons or sections not found.");
  }
}
test();
