export const X_NOROFF_API_KEY = '580b33a9-04f3-4da3-bb38-de9adcf9d9f8';

export async function getAllPosts() {
  const accessToken = localStorage.getItem('token');

  if (!accessToken) {
    throw new Error('No access token found');
  }

  const customOptions = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Noroff-API-Key': X_NOROFF_API_KEY,
    },
  };

  try {
    const response = await fetch('https://v2.api.noroff.dev/social/posts', customOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts`);
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('Failed to parse JSON response');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    throw error;
  }
}



export async function getUserProfile(username) {
  const API_BASE_URL = "https://v2.api.noroff.dev/social/profiles";
  const token = localStorage.getItem("token");

  if (!token) {
      console.error("Ingen tilgang, brukeren er ikke logget inn.");
      return null;
  }

  const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      "X-Noroff-API-Key": X_NOROFF_API_KEY
  };

  try {
      console.log(`Henter profil for: ${username}`);
      const response = await fetch(`${API_BASE_URL}/${username}`, { headers });

      if (!response.ok) {
          console.error(`Feil ved henting av profil: ${response.status}`);
          return null;
      }

      const data = await response.json();
      console.log("Brukerprofil:", data.data);
      return data.data;
  } catch (error) {
      console.error("Feil ved henting av brukerprofil:", error);
      return null;
  }
}

export async function fetchPostById(postId, accessToken) {
  try {
      const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
              "X-Noroff-API-Key": X_NOROFF_API_KEY,
          }
      });

      if (!response.ok) {
          const errorResponse = await response.json();
          console.error("API error response:", errorResponse);
          throw new Error("Failed to fetch post");
      }

      return await response.json();
  } catch (error) {
      console.error("Error:", error.message);
      throw error;
  }
}

export async function sendComment(postId, commentText, accessToken) {
  try {
      const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/comment`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
              "X-Noroff-API-Key": '580b33a9-04f3-4da3-bb38-de9adcf9d9f8'
          },
          body: JSON.stringify({ body: commentText })
      });

      if (!response.ok) {
          const errorResponse = await response.json();
          console.error("API-feil:", errorResponse);
          throw new Error("Kunne ikke sende kommentar");
      }

      return await response.json();
  } catch (error) {
      console.error("Feil ved API-kall:", error.message);
      throw error; 
  }
}

export async function getComment( commentText,) {
  try {
      const response = await fetch(`https://v2.api.noroff.dev/social/posts/${poatId}_comments=true`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
              "X-Noroff-API-Key": '580b33a9-04f3-4da3-bb38-de9adcf9d9f8'
          },
          body: JSON.stringify({ body: commentText })
      });

      if (!response.ok) {
          const errorResponse = await response.json();
          console.error("API-feil:", errorResponse);
          throw new Error("Kunne ikke sende kommentar");
      }

      return await response.json();
  } catch (error) {
      console.error("Feil ved API-kall:", error.message);
      throw error; 
  }
}

export async function sendReactToPost(postId, symbol, accessToken) {
  try {
      const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}/react/`, {
          method: "PUT",  
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
              "X-Noroff-API-Key": "580b33a9-04f3-4da3-bb38-de9adcf9d9f8"
          },
          body: JSON.stringify({ symbol: symbol }) 
      });

      const data = await response.json(); 

      if (!response.ok) {
          throw new Error(data.message || "Failed to send reaction");
      }

      return data; 
  } catch (error) {
      console.error("Error:", error.message);  
      throw error; 
  }
}