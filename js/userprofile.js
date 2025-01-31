import { getUserProfile } from "./api.js";

export async function displayUserProfile() {
    const username = localStorage.getItem("name"); 

    if (!username) {
        console.error("Ingen bruker funnet i localStorage.");
        return;
    }

    const profile = await getUserProfile(username);
    const profileContainer = document.getElementById("profileContainer");

    if (profile && profileContainer) {
        profileContainer.innerHTML = ""; 

        const profileDiv = document.createElement("div");
        profileDiv.classList.add("profile-details");

        const profileHeader = document.createElement("div");
        profileHeader.classList.add("profile-header");

        const avatarImg = document.createElement("img");
        avatarImg.src = profile.avatar?.url || "https://via.placeholder.com/150"; 
        avatarImg.alt = profile.avatar?.alt || "Profilbilde";
        avatarImg.classList.add("profile-avatar");

        const profileInfo = document.createElement("div");
        profileInfo.classList.add("profile-info");

        const nameElement = document.createElement("h2");
        nameElement.textContent = profile.name || "Ukjent bruker";
        profileInfo.appendChild(nameElement);

        const bioElement = document.createElement("p");
        bioElement.textContent = profile.bio || "Ingen bio lagt til enda.";
        profileInfo.appendChild(bioElement);

        profileHeader.appendChild(avatarImg);
        profileHeader.appendChild(profileInfo);

        const statsContainer = document.createElement("div");
        statsContainer.classList.add("profile-stats");

        const postsInfo = document.createElement("div");
        postsInfo.classList.add("info-item");
        postsInfo.innerHTML = `<span>${profile.posts?.length || 0}</span> Posts`; 
        statsContainer.appendChild(postsInfo);

        profileDiv.appendChild(profileHeader);
        profileDiv.appendChild(statsContainer);

        const bannerImg = document.createElement("img");
        bannerImg.src = profile.banner?.url || "https://via.placeholder.com/600x200";
        bannerImg.alt = profile.banner?.alt || "Bannerbilde";
        bannerImg.classList.add("profile-banner");

        profileContainer.appendChild(bannerImg);
        profileContainer.appendChild(profileDiv);
    } else {
        console.error("Kunne ikke hente profil.");
    }
}

document.addEventListener("DOMContentLoaded", displayUserProfile);