async function seeOnePost() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const postId = urlParams.get("id");

    console.log("Post ID from URL:", postId);

    if (!postId) {
        console.error("Did not find Post ID.");
        return;
    }
//**denne skal ikke stå her */
    const accessToken = localStorage.getItem('token');
    console.log("Access token from localStorage:", accessToken);

    if (!accessToken) {
        throw new Error('No access token found');
    }
//** Denne skal ikke stå her */
//** skal flyttes til api.js */
    try {
        const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "X-Noroff-API-Key": '580b33a9-04f3-4da3-bb38-de9adcf9d9f8'
            }
        });
//** skal flyttes til api.js */
        console.log("API Response:", response);

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("API error response:", errorResponse);
            throw new Error("Failed to fetch post");
        }

        
        const post = await response.json();
        console.log("Post data:", post);

        const postContainer = document.getElementById("OnePost");

        if (!postContainer) {
            console.error("Element with id 'OnePost' not found in the DOM");
            return;
        }

        // Create elements manually
        const titleElement = document.createElement("h2");
        titleElement.textContent = post.data.title;  

        const bodyElement = document.createElement("p");
        bodyElement.textContent = post.data.body;  

        const imgElement = document.createElement("img");
        imgElement.src = post.data.media.url;  
        imgElement.alt = "Post image";  

        
        postContainer.appendChild(titleElement);
        postContainer.appendChild(bodyElement);
        postContainer.appendChild(imgElement);

    } catch (error) {
        console.error("Error:", error.message);
    }
}

seeOnePost();