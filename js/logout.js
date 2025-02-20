/** 
 * @description logout the user from the application and redirect to login.html by using window.location.href 
 * attaches a event listener to the logout button, when the button is clicked, the user will be logged out and redirected to login.html
 * @event click 
*/

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        /** removes token, email and name from localstorage */
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("name");
/** will be redirect to login.html when you logout of the app */
            window.location.href = "../account/login.html"; 
        });
    }
