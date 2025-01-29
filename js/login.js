import { loginUserApi } from "./api.js";

async function handelLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const data = await loginUserApi(email, password);
    console.log("API response data:", data);

    const token = data.data.accessToken;
    const userEmail = data.data.email;

    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", userEmail);
    console.log("Token and email saved in localStorage.");
    window.location.href = "../post/feedpage.html";
  } catch (error) {
    alert("Innlogging feilet. Sjekk om e-post og passord er riktig.");
  }
}

function checkIfLoggedIn() {
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  if (token && userEmail) {
    console.log("User is logged in");
    return true;
  } else {
    console.log("User is not logged in");
    return false;
  }
}

function logout() {
  const logoutButton = document.getElementById("logout");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.clear();
      window.location.reload();
    });
  } else {
    console.error("Logout button not found!");
  }
}

logout();

const form = document.querySelector("form");
form.addEventListener("submit", handelLogin);

checkIfLoggedIn();
