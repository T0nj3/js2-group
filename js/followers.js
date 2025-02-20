import { fetchProfiles, toggleFollow } from "./api.js";

const token = localStorage.getItem("token");
const username = localStorage.getItem("name");

if (!token || !username) {
  console.error("No token or username found.");
} else {
  await fetchProfilesData();
  setupSearch();
}

async function fetchProfilesData() {
  try {
    const data = await fetchProfiles();
    displayProfiles(data.data);
  } catch (error) {
    console.error("Error fetching profiles:", error.message);
  }
}

function displayProfiles(profiles) {
  const container = document.getElementById("profilesContainer");
  container.innerHTML = ""; // Clear container before adding new profiles

  profiles.forEach((profile) => {
    const profileCard = document.createElement("div");
    profileCard.className = "profile-card";

    const profileImage = document.createElement("img");
    profileImage.src = profile.avatar?.url || "https://via.placeholder.com/150";
    profileImage.alt = profile.name;

    const profileName = document.createElement("h4");
    profileName.textContent = profile.name;

    const viewProfileLink = document.createElement("a");
    viewProfileLink.href = `../post/profileview.html?profile=${encodeURIComponent(
      profile.name
    )}`;
    viewProfileLink.classList.add("view-profile-btn");
    viewProfileLink.textContent = "View Profile";

    const followButton = document.createElement("button");
    followButton.className = "follow-btn";
    followButton.dataset.username = profile.name;

    const followingList =
      JSON.parse(localStorage.getItem("followingList")) || [];
    const isFollowing = followingList.includes(profile.name);
    followButton.textContent = isFollowing ? "Followed" : "Follow";

    followButton.addEventListener("click", async () => {
      await handleFollowToggle(profile.name, followButton);
    });

    // Append profile data to the profileCard div
    profileCard.appendChild(profileImage);
    profileCard.appendChild(profileName);
    profileCard.appendChild(viewProfileLink);
    profileCard.appendChild(followButton);

    // Append profileCard to the container
    container.appendChild(profileCard);
  });
}

async function handleFollowToggle(profileName, button) {
  try {
    const { isFollowing } = await toggleFollow(profileName);

    const followingList =
      JSON.parse(localStorage.getItem("followingList")) || [];

    if (isFollowing) {
      const newFollowingList = followingList.filter(
        (name) => name !== profileName
      );
      localStorage.setItem("followingList", JSON.stringify(newFollowingList));
      button.textContent = "Follow";
    } else {
      followingList.push(profileName);
      localStorage.setItem("followingList", JSON.stringify(followingList));
      button.textContent = "Followed";
    }
  } catch (error) {
    console.error("Error toggling follow status:", error.message);
  }
}

function setupSearch() {
  document
    .getElementById("searchProfiles")
    .addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const profileCards = document.querySelectorAll(".profile-card");

      profileCards.forEach((card) => {
        const name = card.querySelector("h4").innerText.toLowerCase();
        card.style.display = name.includes(query) ? "block" : "none";
      });
    });
}
