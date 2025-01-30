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


export async function registerUserApi(email, password) {
  try {
    const response = await fetch('https://v2.api.noroff.dev/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: email.split('@')[0], email, password }),
    });

    if (!response.ok) {
      throw new Error('Failed to register user');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function loginUserApi(email, password) {
  try {
    const response = await fetch('https://v2.api.noroff.dev/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(
        'Innlogging feilet. Sjekk om e-post og passord er riktig.',
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Innlogging feilet:', error);
    throw error;
  }
}


export async function getUserProfile(username) {
  const API_BASE_URL = "https://v2.api.noroff.dev/social/profiles";
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Ingen tilgang, Brukeren er ikke logget inn.");
    return null;
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "X-Noroff-API-Key": X_NOROFF_API_KEY
  };

  try {
    console.log(`Henter profil for ${username}`);
    const response = await fetch(`${API_BASE_URL}/${username}`, { headers });

    if (!response.ok) {
      console.error(`Feil ved henting av profil: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error("Feil ved henting av brukerprofil:", error);
    return null;
  }
}