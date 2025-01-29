export async function getAllPosts() {
    const response = await fetch('https://v2.api.noroff.dev/social/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    return data.data;
}