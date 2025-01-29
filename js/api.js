export async function getAllPosts() {
  const response = await fetch("https://v2.api.noroff.dev/social/posts");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const data = await response.json();
  return data.data;
}

export async function registerUserApi(email, password) {
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: email.split("@")[0], email, password }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function loginUserApi(email, password) {
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(
        "Innlogging feilet. Sjekk om e-post og passord er riktig."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Innlogging feilet:", error);
    throw error;
  }
}
