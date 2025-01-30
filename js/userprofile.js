import { getUserProfile } from './api.js';

export async function displayUserProfile(username) {
    const profile = await getUserProfile(username);

    const profileContainer = document.getElementById("profileContainer");

    if (profile && profileContainer) {
       
        const profileDiv = document.createElement("div");
        profileDiv.classList.add("profile-details");

      
        const profileHeader = document.createElement("div");
        profileHeader.classList.add("profile-header");

        const avatarImg = document.createElement("img");
        avatarImg.src = "https://images.unsplash.com/photo-1635107510862-53886e926b74?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; 
        avatarImg.alt = "Min avatar";
        avatarImg.classList.add("profile-avatar");

        const profileInfo = document.createElement("div");
        profileInfo.classList.add("profile-info");

        const nameElement = document.createElement("h2");
        nameElement.textContent = profile.name || "Lynk2025"; 
        profileInfo.appendChild(nameElement);

        const bioElement = document.createElement("p");
        bioElement.textContent = "Just loving these social medias"; 
        profileInfo.appendChild(bioElement);

        profileHeader.appendChild(avatarImg);
        profileHeader.appendChild(profileInfo);

      
        const statsContainer = document.createElement("div");
        statsContainer.classList.add("profile-stats");

        const postsInfo = document.createElement("div");
        postsInfo.classList.add("info-item");
        postsInfo.innerHTML = `<span>10</span> Posts`; 
        statsContainer.appendChild(postsInfo);

        const followersInfo = document.createElement("div");
        followersInfo.classList.add("info-item");
        followersInfo.innerHTML = `<span>500</span> Followers`; 
        statsContainer.appendChild(followersInfo);

        const followingInfo = document.createElement("div");
        followingInfo.classList.add("info-item");
        followingInfo.innerHTML = `<span>150</span> Following`; 
        statsContainer.appendChild(followingInfo);

        profileDiv.appendChild(profileHeader);
        profileDiv.appendChild(statsContainer);

       
        const bannerImg = document.createElement("img");
        bannerImg.src = "https://images.unsplash.com/photo-1519414442781-fbd745c5b497?q=80&w=2964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; 
        bannerImg.alt = "Min banner";
        bannerImg.classList.add("profile-banner");

        profileContainer.appendChild(bannerImg);
        profileContainer.appendChild(profileDiv);
    } else {
        console.error("Kunne ikke hente profil.");
    }
}


const token = localStorage.getItem("token");
displayUserProfile("lynk2025");