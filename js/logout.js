document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("name");

            window.location.href = "../account/login.html"; 
        });
    }
});