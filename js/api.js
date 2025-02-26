export const X_NOROFF_API_KEY = "580b33a9-04f3-4da3-bb38-de9adcf9d9f8";
export const API_BASE_URL = "https://v2.api.noroff.dev/social";
export const API_AUTH_URL = "https://v2.api.noroff.dev";

const token = localStorage.getItem("token");

export async function getAllPosts() {
  const accessToken = localStorage.getItem("token");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const customOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": X_NOROFF_API_KEY,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}/posts`, customOptions);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts`);
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new Error("Failed to parse JSON response");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    throw error;
  }
}

export async function getUserProfile(username) {
  const API_BASE_URL = "https://v2.api.noroff.dev/social/profiles";

  if (!token) {
    console.error("No access the user is not logged in.");
    return null;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": X_NOROFF_API_KEY,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${username}`, { headers });

    if (!response.ok) {
      console.error(`Something went wrong while fetching your profile: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Something went wrong while fetching your profile:", error);
    return null;
  }
}

export async function fetchPostById(postId, accessToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
      },
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
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
      },
      body: JSON.stringify({ body: commentText }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("API-feil:", errorResponse);
      throw new Error("Could not send comment");
    }

    return await response.json();
  } catch (error) {
    console.error("Something went wrong with the API call.", error.message);
    throw error;
  }
}

export async function sendReactToPost(postId, symbol, accessToken) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/${postId}/react/${symbol}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": X_NOROFF_API_KEY,
        },
        body: JSON.stringify({ symbol: symbol }),
      }
    );

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
export async function fetchComments(postId, accessToken) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/posts/${postId}?_comments=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": X_NOROFF_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!response.ok)
      throw new Error(data.message || "Could not get the comments");

    return data.data || { comments: [] };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { comments: [] };
  }
}

export async function login(userData) {
  try {
    const response = await fetch(`${API_AUTH_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.errors ? result.errors[0].message : "Login failed"
      );
    }

    return result.data;
  } catch (error) {
    console.error("Login API Error:", error.message);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_AUTH_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

export async function updateUserProfile(username, bio, avatar, banner) {
  if (!token) return null;

  const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": X_NOROFF_API_KEY,
    },
    body: JSON.stringify({
      bio,
      avatar: { url: avatar },
      banner: { url: banner },
    }),
  });

  if (!response.ok) {
    console.error("Failed to update profile.");
    return null;
  }

  return await response.json();
}

export async function getUserPosts(username) {
  if (!token) return [];

  const response = await fetch(`${API_BASE_URL}/profiles/${username}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": X_NOROFF_API_KEY,
    },
  });

  if (!response.ok) return [];
  const data = await response.json();
  return data.data || [];
}

export async function createPost(title, body, imageUrl) {
  if (!token) return null;

  const postData = {
    title,
    body,
    media: imageUrl ? { url: imageUrl, alt: "Post image" } : null,
  };

  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": X_NOROFF_API_KEY,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) return null;
  return await response.json();
}

export async function deleteUserPost(postId) {
  if (!token) return null;

  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": X_NOROFF_API_KEY,
    },
  });

  if (!response.ok) {
    alert("Failed to delete post. Please try again.");
    return null;
  }

  window.location.reload();
}

export async function saveEditedPost(postId, newTitle, newBody, newImageUrl) {
  if (!token) return;

  const updatedPost = {
    title: newTitle,
    body: newBody,
    media: newImageUrl ? { url: newImageUrl } : null,
  };

  const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": X_NOROFF_API_KEY,
    },
    body: JSON.stringify(updatedPost),
  });

  if (!response.ok) {
    console.error("Failed to update post.");
    return;
  }

  return await response.json();
}

export async function fetchProfile(username) {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
      },
    });

    if (!response.ok) throw new Error("Could not fetch profile.");

    return await response.json();
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    throw error;
  }
}

export async function fetchUserPosts(username) {
  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${username}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Could not fetch user posts.");

    return await response.json();
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    throw error;
  }
}

export async function fetchProfiles() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/profiles?sort=updated&sortOrder=desc&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": X_NOROFF_API_KEY,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch profiles.");
    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

export async function toggleFollow(profileName) {
  const followingList = JSON.parse(localStorage.getItem("followingList")) || [];
  const isFollowing = followingList.includes(profileName);
  let url;

  try {
    if (isFollowing) {
      url = `${API_BASE_URL}/profiles/${profileName}/unfollow`;
    } else {
      url = `${API_BASE_URL}/profiles/${profileName}/follow`;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": X_NOROFF_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw new Error(
        isFollowing ? "Failed to unfollow user." : "Failed to follow user."
      );

    const responseData = await response.json();

    return { isFollowing, response };
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}
