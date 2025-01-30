import { registerUserApi } from "./api.js";

async function registerUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const email1 = document.getElementById("email1").value;
  const password = document.getElementById("password").value;
  const password1 = document.getElementById("password1").value;

  const emailRules = /^[\w\-.]+@stud\.noroff\.no$/;
  if (!emailRules.test(email)) {
    alert("You need to enter a Noroff email address");
    return;
  }

  if (!email || !password || !email1 || !password1) {
    alert("Please fill in all fields.");
    return;
  }
  if (email !== email1) {
    alert("Email addresses do not match.");
    return;
  }
  if (password !== password1) {
    alert("Passwords do not match.");
    return;
  }
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  try {
    await registerUserApi(email, password);
    alert("Registration successful! You can now log in.");
    location.reload();
  } catch (error) {
    alert("An error occurred during registration. Please try again.");
  }
}

const form = document.querySelector("form");
form.addEventListener("submit", registerUser);

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