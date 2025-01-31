document.getElementById("registerForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const userData = { name, email, password };

  try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (response.ok) {
          document.getElementById("message").textContent = "Registration successful! Redirecting to login...";
          
          setTimeout(() => {
              window.location.href = "login.html"; 
          }, 2000); 
      } else {
          document.getElementById("message").textContent = "Error: " + result.errors[0].message;
      }
  } catch (error) {
      document.getElementById("message").textContent = "Something went wrong. Please try again.";
  }
});

